import { useCallback, useEffect, useState } from 'react';
import {
  isClipboardDataMessage,
  isClipboardErrorMessage,
  isClipboardMessage,
} from '@/types/clipboard';
import { detectPlatform, getWebView } from '@/utils/webview';
import { isValidUrl } from '@/utils/validation';

/**
 * useClipboardBridge Hook의 반환 타입
 */
interface UseClipboardBridgeReturn {
  clipboardLinkValue: string;
  requestClipboard: () => void;
  hasClipboardLink: boolean;
  isLoading: boolean;
}

/**
 * useClipboardBridge Hook
 * React Native WebView와 클립보드 통신을 관리합니다.
 *
 * @example
 * const { clipboardLinkValue, requestClipboard, hasClipboardLink, isLoading } = useClipboardBridge();
 */
export const useClipboardBridge = (): UseClipboardBridgeReturn => {
  const [clipboardLinkValue, setClipboardLinkValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasClipboardLink, setHasClipboardLink] = useState<boolean>(false);

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
            console.log('[useClipboardBridge] JSON 파싱 에러:', parseError);
            return;
          }
        } else {
          message = data;
        }

        // 메시지 유효성 검증 - clipboard 관련 메시지만 처리
        if (!isClipboardMessage(message)) {
          return;
        }

        // 메시지 타입별 처리
        if (isClipboardDataMessage(message)) {
          const { payload } = message;
          if (!payload) {
            // 클립보드가 비어있을 경우
            setHasClipboardLink(false);
            setIsLoading(false);
            return;
          }

          // payload가 문자열인지 검증
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
          // 클립보드 에러는 조용히 처리 (개발자 콘솔에만 기록)
          console.error(
            '[useClipboardBridge] 클립보드 에러:',
            message.error || 'Unknown clipboard error'
          );
          setIsLoading(false);
          setHasClipboardLink(false);
          return;
        }

        // 인식되지 않은 클립보드 메시지 타입
        setIsLoading(false);
      } catch (err) {
        // 메시지 처리 중 에러 발생 시 조용히 처리 (개발자 콘솔에만 기록)
        console.error('[useClipboardBridge] 메시지 처리 에러:', err);
        setIsLoading(false);
        setHasClipboardLink(false);
      }
    };

    // 플랫폼별 이벤트 타겟 설정 (iOS: window, Android: document)
    const platform = detectPlatform();
    const receiver: EventTarget = platform === 'ios' ? window : document;

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

      const webView = getWebView();
      if (!webView) {
        // WebView가 없을 경우 조용히 처리 (개발자 콘솔에만 기록)
        console.error(
          '[useClipboardBridge] React Native WebView를 사용할 수 없습니다'
        );
        setIsLoading(false);
        setHasClipboardLink(false);
        return;
      }

      webView.postMessage(
        JSON.stringify({
          type: 'clipboard:read',
        })
      );
    } catch (err) {
      // 클립보드 요청 실패 시 조용히 처리 (개발자 콘솔에만 기록)
      console.error('[useClipboardBridge] 클립보드 요청 실패:', err);
      setIsLoading(false);
      setHasClipboardLink(false);
    }
  }, []);

  return {
    clipboardLinkValue,
    requestClipboard,
    hasClipboardLink,
    isLoading,
  };
};
