import { useCallback, useEffect, useState } from 'react';
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
  clipboardLinkValue: string;
  requestClipboard: () => void;
  hasClipboardLink: boolean;
  isLoading: boolean;
  error: ClipboardBridgeError | null;
}

/**
 * useClipboardBridge Hook
 * React Native WebView와 클립보드 통신을 관리합니다.
 *
 * @example
 * const { linkValue, requestClipboard, isLoading, error } = useClipboardBridge();
 */
export const useClipboardBridge = (): UseClipboardBridgeReturn => {
  const [clipboardLinkValue, setClipboardLinkValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ClipboardBridgeError | null>(null);
  const [hasClipboardLink, setHasClipboardLink] = useState<boolean>(false);

  /**
   * 메시지 리스너 등록/정리
   */
  useEffect(() => {
    /**
     * 메시지 핸들러 - Native로부터 수신
     */
    const handleMessage = (event: MessageEvent<unknown>): void => {
      try {
        // 데이터 추출
        const data = event.data;
        if (!data) {
          return;
        }

        // JSON 파싱
        let message: unknown;
        if (typeof data === 'string') {
          try {
            message = JSON.parse(data);
          } catch (parseError) {
            console.log('[useClipboardBridge] JSON parse error:', parseError);
            return;
          }
        } else {
          message = data;
        }

        // 메시지 유효성 검증
        // clipboard 관련 메시지만 처리하게 함
        if (!isClipboardMessage(message)) {
          return;
        }

        // Only clear error for clipboard messages
        setError(null);

        // 메시지 타입별 처리
        if (isClipboardDataMessage(message)) {
          const { payload } = message;
          if (!payload) {
            // 클립보드가 비어있을 시
            setHasClipboardLink(false);
            setIsLoading(false);
            return;
          }

          // Validate payload is a string before trimming
          if (typeof payload !== 'string') {
            setHasClipboardLink(false);
            setClipboardLinkValue('');
            setIsLoading(false);
            return;
          }

          const text = payload.trim();

          // 링크 유효성 검사
          if (isValidUrl(text)) {
            setHasClipboardLink(true);
            setClipboardLinkValue(text);
          } else {
            setHasClipboardLink(false);
            setClipboardLinkValue('');
          }
          setIsLoading(false);
          return;
        }

        if (isClipboardErrorMessage(message)) {
          const clipboardError = new ClipboardBridgeError(
            message.error || 'Unknown clipboard error',
            'MESSAGE_FAILED'
          );
          setError(clipboardError);
          setIsLoading(false);
          return;
        }

        // If we reach here, it's a clipboard message but not a recognized type
        setIsLoading(false);
      } catch (err) {
        const clipboardError =
          err instanceof ClipboardBridgeError
            ? err
            : new ClipboardBridgeError(
                err instanceof Error ? err.message : 'Unknown error',
                'INVALID_MESSAGE'
              );
        setError(clipboardError);
        setIsLoading(false);
        console.error('[useClipboardBridge] Error:', clipboardError);
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

  return {
    clipboardLinkValue,
    requestClipboard,
    hasClipboardLink,
    isLoading,
    error,
  };
};
