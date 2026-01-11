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
 * 클립보드 요청 타임아웃 (ms)
 */
const CLIPBOARD_TIMEOUT = 5000;
/**
 * 클립보드 에러 타입
 */
export class ClipboardBridgeError extends Error {
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
  const timeoutRef = useRef<number | null>(null);

  /**
   * 메시지 리스너 등록/정리
   */
  useEffect(() => {
    /**
     * 메시지 핸들러 - Native로부터 수신
     */
    const handleMessage = (event: Event): void => {
      if (!(event instanceof MessageEvent)) return;
      const messageEvent = event as MessageEvent<unknown>;
      try {
        // 데이터 추출
        const data = messageEvent.data;
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

        // 클립보드 메시지 수신 시 타임아웃 정리
        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
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

    // 플랫폼별 이벤트 타겟 설정 (iOS: window, Android: document)
    const platform = detectPlatform();
    const receiver: EventTarget = platform === 'ios' ? window : document;

    receiver.addEventListener('message', handleMessage);

    return () => {
      receiver.removeEventListener('message', handleMessage);
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  /**
   * 클립보드 읽기 요청
   */
  const requestClipboard = useCallback((): void => {
    try {
      setIsLoading(true);
      setError(null);

      // 기존 타임아웃 정리
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      // 타임아웃 시작
      timeoutRef.current = window.setTimeout(() => {
        setIsLoading(false);
        setError(new ClipboardBridgeError('Request timed out', 'TIMEOUT'));
        timeoutRef.current = null;
      }, CLIPBOARD_TIMEOUT);

      const webView = getWebView();
      if (!webView) {
        const err = new ClipboardBridgeError(
          'React Native WebView is not available',
          'WEBVIEW_NOT_AVAILABLE'
        );
        setError(err);
        setIsLoading(false);
        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
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
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
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
