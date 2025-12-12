/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * React Native WebView와 통신하기 위한 브릿지 유틸리티
 */

// WebView 메시지 타입 정의
export interface WebViewMessage {
  type: string;
  payload?: any;
}

/**
 * React Native WebView 환경인지 확인
 * @returns RN WebView 환경이면 true, 아니면 false
 * @example
 * if (isReactNativeWebView()) {
 *   console.log('RN WebView 환경입니다');
 * }
 */
export const isReactNativeWebView = (): boolean => {
  return typeof window !== 'undefined' && !!window.ReactNativeWebView;
};

/**
 * Web에서 RN으로 메시지 전송
 * @param message 전송할 메시지 객체 (type, payload)
 * @example
 * // 버튼 클릭 이벤트를 RN으로 전송
 * sendMessageToRN({
 *   type: 'BUTTON_CLICKED',
 *   payload: { buttonId: 'submit', timestamp: Date.now() }
 * });
 */
export const sendMessageToRN = (message: WebViewMessage): void => {
  if (isReactNativeWebView() && window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  } else {
    console.warn('ReactNativeWebView is not available');
  }
};

/**
 * RN에서 오는 메시지를 수신하는 리스너 등록
 * @param handler 메시지 이벤트 핸들러
 * @returns cleanup 함수 (리스너 제거용)
 * @example
 * // 컴포넌트에서 사용
 * useEffect(() => {
 *   const cleanup = addMessageListener((event) => {
 *     console.log('메시지 수신:', event.data);
 *   });
 *   return cleanup; // 컴포넌트 언마운트 시 리스너 제거
 * }, []);
 */
export const addMessageListener = (
  handler: (event: MessageEvent<any>) => void
): (() => void) => {
  if (typeof window !== 'undefined') {
    window.addEventListener('message', handler);
    // 리스너 제거를 위한 cleanup 함수 반환
    return () => {
      window.removeEventListener('message', handler);
    };
  }
  return () => {};
};

/**
 * 특정 타입의 메시지만 수신하는 타입 안전한 리스너 등록
 * @param messageType 수신할 메시지 타입
 * @param handler 페이로드를 처리하는 핸들러
 * @returns cleanup 함수 (리스너 제거용)
 * @example
 * // 타입 안전하게 특정 메시지만 수신
 * useEffect(() => {
 *   const cleanup = addTypedMessageListener('USER_INFO', (payload) => {
 *     console.log('사용자 정보:', payload.name, payload.email);
 *   });
 *   return cleanup;
 * }, []);
 *
 * @example
 * // 타입 지정하여 사용
 * interface UserPayload {
 *   userId: string;
 *   name: string;
 * }
 * const cleanup = addTypedMessageListener<UserPayload>('USER_LOGIN', (payload) => {
 *   console.log(`${payload.name}님 환영합니다!`);
 * });
 */
export const addTypedMessageListener = <T = any>(
  messageType: string,
  handler: (payload: T) => void
): (() => void) => {
  const messageHandler = (event: MessageEvent<any>) => {
    try {
      const data =
        typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

      if (data.type === messageType) {
        handler(data.payload);
      }
    } catch (error) {
      console.error('Failed to parse message from RN:', error);
    }
  };

  return addMessageListener(messageHandler);
};

// Window 타입 확장
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}
