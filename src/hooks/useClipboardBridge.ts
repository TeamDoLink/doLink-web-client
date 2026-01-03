import { useCallback, useEffect, useRef, useState } from 'react';
import {
  isClipboardDataMessage,
  isClipboardErrorMessage,
  isClipboardMessage,
} from '@/types/clipboard';
import { detectPlatform, getWebView } from '@/utils/webview';
import { isValidUrl } from '@/utils/validation';

// TODO RN과 타입 연동 필요
/**
 * 클립보드 에러 타입
 */
export class ClipboardBridgeError extends Error {
  code: 'WEBVIEW_NOT_AVAILABLE' | 'INVALID_MESSAGE' | 'MESSAGE_FAILED';

  constructor(
    message: string,
    code: 'WEBVIEW_NOT_AVAILABLE' | 'INVALID_MESSAGE' | 'MESSAGE_FAILED'
  ) {
    super(message);
    this.name = 'ClipboardBridgeError';
    this.code = code;
  }
}

/**
 * useClipboardBridge Hook의 반환 타입
 */
interface UseClipboardBridgeReturn {
  linkValue: string;
  setLinkValue: (value: string) => void;
  requestClipboard: () => void;
  pasteFromClipboard: () => void;
  hasClipboardLink: boolean;
  isLoading: boolean;
  error: ClipboardBridgeError | null;
  clearError: () => void;
}

/**
 * useClipboardBridge Hook
 * React Native WebView와 클립보드 통신을 관리합니다.
 *
 * @example
 * const { linkValue, requestClipboard, isLoading, error } = useClipboardBridge();
 */
export const useClipboardBridge = (): UseClipboardBridgeReturn => {
  const [linkValue, setLinkValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ClipboardBridgeError | null>(null);
  const [hasClipboardLink, setHasClipboardLink] = useState<boolean>(false);

  // ✅ useState → useRef로 변경 (리렌더링 불필요, 최신 값 참조)
  const shouldPasteRef = useRef<boolean>(false);

  /**
   * 메시지 리스너 등록/정리
   */
  useEffect(() => {
    /**
     * 메시지 핸들러 - Native로부터 수신
     */
    const handleMessage = (event: MessageEvent<unknown>): void => {
      try {
        setError(null);

        // 데이터 추출
        const data = event.data;
        if (!data) {
          throw new ClipboardBridgeError(
            'Empty message received',
            'INVALID_MESSAGE'
          );
        }

        // JSON 파싱
        let message: unknown;
        if (typeof data === 'string') {
          try {
            message = JSON.parse(data);
          } catch (parseError) {
            throw new ClipboardBridgeError(
              `Failed to parse message: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
              'INVALID_MESSAGE'
            );
          }
        } else {
          message = data;
        }

        // 메시지 유효성 검증
        // clipboard 관련 메시지만 처리하게 함
        if (!isClipboardMessage(message)) {
          return;
        }

        // 메시지 타입별 처리
        if (isClipboardDataMessage(message)) {
          const { payload } = message;
          if (!payload) {
            // 클립보드가 비어있을 시
            setHasClipboardLink(false);
            return;
          }

          const text = message.payload?.trim();

          // 링크 유효성 검사
          if (isValidUrl(text)) {
            setHasClipboardLink(true);
            // ✅ useRef 사용으로 최신 값 참조
            if (shouldPasteRef.current) {
              setLinkValue(text);
              shouldPasteRef.current = false;
            }
          } else {
            setHasClipboardLink(false);
          }
          return;
        }

        if (isClipboardErrorMessage(message)) {
          const clipboardError = new ClipboardBridgeError(
            message.error || 'Unknown clipboard error',
            'MESSAGE_FAILED'
          );
          setError(clipboardError);
        }
      } catch (err) {
        const clipboardError =
          err instanceof ClipboardBridgeError
            ? err
            : new ClipboardBridgeError(
                err instanceof Error ? err.message : 'Unknown error',
                'INVALID_MESSAGE'
              );
        setError(clipboardError);

        console.error('[useClipboardBridge] Error:', clipboardError);
      } finally {
        setIsLoading(false);
      }
    };

    const platform = detectPlatform();
    const receiver =
      platform === 'ios' ? window : (document as unknown as Window);

    receiver.addEventListener('message', handleMessage);

    return () => {
      receiver.removeEventListener('message', handleMessage);
    };
  }, []);

  /**
   * 클립보드 읽기 요청
   */
  const requestClipboard = useCallback((): void => {
    try {
      setIsLoading(true);
      setError(null);

      const webView = getWebView();
      if (!webView) {
        const err = new ClipboardBridgeError(
          'React Native WebView is not available',
          'WEBVIEW_NOT_AVAILABLE'
        );
        setError(err);
        setIsLoading(false);
        throw err;
      }

      webView.postMessage(
        JSON.stringify({
          type: 'clipboard:read',
        })
      );
    } catch (err) {
      const clipboardError =
        err instanceof ClipboardBridgeError
          ? err
          : new ClipboardBridgeError(
              err instanceof Error ? err.message : 'Unknown error',
              'WEBVIEW_NOT_AVAILABLE'
            );
      setError(clipboardError);
      setIsLoading(false);
      console.error('[useClipboardBridge] Request failed:', clipboardError);
    }
  }, []);

  /**
   * 입력 값 직접 설정
   */
  const setValue = (value: string): void => {
    setLinkValue(value);
    setError(null);
  };

  /**
   * 에러 초기화
   */
  const clearError = (): void => {
    setError(null);
  };

  /**
   * 클립보드에서 붙여넣기
   */
  const pasteFromClipboard = useCallback((): void => {
    shouldPasteRef.current = true;
    requestClipboard();
  }, [requestClipboard]);

  return {
    linkValue,
    setLinkValue: setValue,
    requestClipboard,
    pasteFromClipboard,
    hasClipboardLink,
    isLoading,
    error,
    clearError,
  };
};
