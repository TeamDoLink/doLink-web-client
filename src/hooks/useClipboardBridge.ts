import { useCallback, useEffect, useState } from 'react';
import type { ReactNativeWebView } from '@/types/clipboard';
import {
  isClipboardDataMessage,
  isClipboardErrorMessage,
  isClipboardMessage,
} from '@/types/clipboard';

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
  const [shouldPaste, setShouldPaste] = useState<boolean>(false);

  /**
   * URL 유효성 검사
   */
  const isValidUrl = useCallback((text: string): boolean => {
    if (!text) return false;

    try {
      const url = new URL(text);
      // http와 https 프로토콜만 허용
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }, []);

  /**
   * Platform 감지 (iOS vs Android)
   */
  // TODO 공통 utils로 이동
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
  const handleMessage = useCallback(
    (event: MessageEvent<unknown>): void => {
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
          // throw new ClipboardBridgeError(
          //   `Invalid message type: ${typeof (message as Record<string, unknown>)?.type}`,
          //   'INVALID_MESSAGE'
          // );
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
            // 붙여넣기 모드일 때만 값 설정
            if (shouldPaste) {
              setLinkValue(text);
              setShouldPaste(false);
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
    },
    [isValidUrl, shouldPaste]
  );

  /**
   * 메시지 리스너 등록/정리
   */
  useEffect(() => {
    const platform = detectPlatform();
    const receiver =
      platform === 'ios' ? window : (document as unknown as Window);

    receiver.addEventListener('message', handleMessage);

    return () => {
      receiver.removeEventListener('message', handleMessage);
    };
  }, [detectPlatform, handleMessage]);

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
  }, [getWebView]);

  /**
   * 입력 값 직접 설정
   */
  const setValue = useCallback((value: string): void => {
    setLinkValue(value);
    setError(null);
  }, []);

  /**
   * 에러 초기화
   */
  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  /**
   * 클립보드에서 붙여넣기
   */
  const pasteFromClipboard = useCallback((): void => {
    setShouldPaste(true);
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
