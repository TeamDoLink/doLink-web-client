import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  DraftMessageType,
  ReactNativeWebView,
  WebViewMessage,
} from '@/types/draft';
import { isDraftMessageType, isDraftSuccess } from '@/types/draft';

/**
 * Draft Bridge 에러 타입
 */
export class DraftBridgeError extends Error {
  code:
    | 'WEBVIEW_NOT_AVAILABLE'
    | 'INVALID_MESSAGE'
    | 'MESSAGE_FAILED'
    | 'TIMEOUT';

  constructor(
    message: string,
    code:
      | 'WEBVIEW_NOT_AVAILABLE'
      | 'INVALID_MESSAGE'
      | 'MESSAGE_FAILED'
      | 'TIMEOUT'
  ) {
    super(message);
    this.name = 'DraftBridgeError';
    this.code = code;
  }
}

/**
 * useDraftBridge Hook의 반환 타입
 */
interface UseDraftBridgeReturn<T> {
  saveDraft: (key: string, data: T) => Promise<void>;
  loadDraft: (key: string) => Promise<T | null>;
  deleteDraft: (key: string) => Promise<void>;
  isLoading: boolean;
  error: DraftBridgeError | null;
  clearError: () => void;
}

/**
 * Promise resolver 타입
 */
interface PendingPromise<T = unknown> {
  resolve: (value: T) => void;
  reject: (error: Error) => void;
  timeout: number;
}

/**
 * useDraftBridge Hook
 * React Native WebView와 Draft 통신을 관리합니다.
 *
 * @example
 * const { saveDraft, loadDraft, deleteDraft, isLoading, error } =
 *   useDraftBridge<TaskDraft>();
 *
 * // 임시저장
 * await saveDraft('task-create-draft', formData);
 *
 * // 불러오기
 * const data = await loadDraft('task-create-draft');
 *
 * // 삭제
 * await deleteDraft('task-create-draft');
 */
export const useDraftBridge = <T = unknown>(): UseDraftBridgeReturn<T> => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<DraftBridgeError | null>(null);

  // 대기 중인 Promise들을 메시지 타입별로 관리
  const pendingPromisesRef = useRef<
    Map<DraftMessageType, PendingPromise<unknown>>
  >(new Map());

  /**
   * Platform 감지 (iOS vs Android)
   */
  const detectPlatform = useCallback((): 'ios' | 'android' => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS =
      /ipad|iphone|ipod/.test(userAgent) ||
      (/macintosh/.test(userAgent) && 'ontouchend' in document);
    return isIOS ? 'ios' : 'android';
  }, []);

  /**
   * WebView 객체 가져오기
   */
  const getWebView = useCallback((): ReactNativeWebView | null => {
    return (
      (window as Window & { ReactNativeWebView?: ReactNativeWebView })
        .ReactNativeWebView ?? null
    );
  }, []);

  /**
   * 메시지 핸들러 - Native로부터 수신
   */
  const handleMessage = useCallback((event: MessageEvent<unknown>): void => {
    try {
      // 데이터 추출
      const data = event.data;
      if (!data) {
        console.error('[useDraftBridge] Empty message received');
        return;
      }

      // JSON 파싱
      let response: unknown;
      if (typeof data === 'string') {
        try {
          response = JSON.parse(data);
        } catch (parseError) {
          console.error(
            '[useDraftBridge] Failed to parse message:',
            parseError
          );
          return;
        }
      } else {
        response = data;
      }

      // Draft 메시지 타입 확인
      if (!isDraftMessageType(response)) {
        return;
      }

      // 메시지 유효성 검증
      if (!isDraftSuccess(response)) {
        console.error('[useDraftBridge] Invalid response type:', response);
        return;
      }

      // 메시지 타입으로 해당 요청의 Promise resolver 가져오기
      const messageType = response.type;
      const pending = pendingPromisesRef.current.get(messageType);
      if (!pending) {
        console.error('[useDraftBridge] No pending promise for:', messageType);
        return;
      }

      // Timeout 해제
      clearTimeout(pending.timeout);
      pendingPromisesRef.current.delete(messageType);

      // 로딩 상태 업데이트
      setIsLoading(pendingPromisesRef.current.size > 0);

      // 응답 처리
      if (response.success) {
        setError(null);
        pending.resolve(response.data ?? null);
        // TODO 테스트 위해 임시로 alert 사용
        alert(`임시저장 완료: ${event.data}`);
      } else {
        const error = new DraftBridgeError(
          response.error || 'Unknown error',
          'MESSAGE_FAILED'
        );
        setError(error);
        pending.reject(error);
      }
    } catch (err) {
      console.error('[useDraftBridge] Error handling message:', err);
    }
  }, []);

  /**
   * 메시지 리스너 등록/정리
   */
  useEffect(() => {
    const platform = detectPlatform();
    const receiver =
      platform === 'ios' ? window : (document as unknown as Window);

    receiver.addEventListener('message', handleMessage);

    // Cleanup 함수에서 사용할 ref 복사
    const pendingPromises = pendingPromisesRef.current;

    return () => {
      receiver.removeEventListener('message', handleMessage);

      // 컴포넌트 언마운트 시 모든 대기 중인 Promise 정리
      pendingPromises.forEach((pending) => {
        clearTimeout(pending.timeout);
        pending.reject(
          new DraftBridgeError('Component unmounted', 'MESSAGE_FAILED')
        );
      });
      pendingPromises.clear();
    };
  }, [detectPlatform, handleMessage]);

  /**
   * WebView에 메시지 전송 (Promise 기반)
   */
  const sendMessage = useCallback(
    <R = unknown>(
      type: DraftMessageType,
      key: string,
      data?: T
    ): Promise<R | null> => {
      return new Promise<R | null>((resolve, reject) => {
        try {
          setIsLoading(true);
          setError(null);

          const webView = getWebView();
          if (!webView) {
            const err = new DraftBridgeError(
              'React Native WebView is not available',
              'WEBVIEW_NOT_AVAILABLE'
            );
            setError(err);
            setIsLoading(false);
            reject(err);
            return;
          }

          // 동일한 타입의 요청이 이미 대기 중이면 거부
          if (pendingPromisesRef.current.has(type)) {
            const err = new DraftBridgeError(
              `A ${type} request is already in progress`,
              'MESSAGE_FAILED'
            );
            setError(err);
            setIsLoading(false);
            reject(err);
            return;
          }

          // Timeout 설정 (10초)
          const timeout = setTimeout(() => {
            pendingPromisesRef.current.delete(type);
            setIsLoading(pendingPromisesRef.current.size > 0);
            const err = new DraftBridgeError('Request timeout', 'TIMEOUT');
            setError(err);
            reject(err);
          }, 10000);

          // Promise resolver 저장 (메시지 타입을 키로 사용)
          pendingPromisesRef.current.set(type, {
            resolve: resolve as (value: unknown) => void,
            reject,
            timeout,
          });

          // 메시지 전송
          const message: WebViewMessage = {
            type,
            payload: {
              key,
              data,
            },
          };

          webView.postMessage(JSON.stringify(message));
        } catch (err) {
          const draftError =
            err instanceof DraftBridgeError
              ? err
              : new DraftBridgeError(
                  err instanceof Error ? err.message : 'Unknown error',
                  'MESSAGE_FAILED'
                );
          setError(draftError);
          setIsLoading(false);
          reject(draftError);
        }
      });
    },
    [getWebView]
  );

  /**
   * 임시저장하기
   */
  const saveDraft = useCallback(
    async (key: string, data: T): Promise<void> => {
      await sendMessage('SAVE_DRAFT', key, data);
    },
    [sendMessage]
  );

  /**
   * 임시저장 불러오기
   */
  const loadDraft = useCallback(
    async (key: string): Promise<T | null> => {
      const result = await sendMessage<T>('LOAD_DRAFT', key);
      return result;
    },
    [sendMessage]
  );

  /**
   * 임시저장 삭제하기
   */
  const deleteDraft = useCallback(
    async (key: string): Promise<void> => {
      await sendMessage('DELETE_DRAFT', key);
    },
    [sendMessage]
  );

  /**
   * 에러 초기화
   */
  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  return {
    saveDraft,
    loadDraft,
    deleteDraft,
    isLoading,
    error,
    clearError,
  };
};
