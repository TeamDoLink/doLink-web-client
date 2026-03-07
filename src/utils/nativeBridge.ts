/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * React Native WebView와 통신하기 위한 브릿지 유틸리티
 */

import type {
  LinkPayload,
  LinkResponse,
  LinkError,
  LinkCanOpenPayload,
  OsSharePayload,
  AuthTokenPayload,
  AuthErrorPayload,
} from '@/types/native';

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
 * // Link 열기 요청을 RN으로 전송
 * sendMessageToRN({
 *   type: 'link:open',
 *   payload: { url: 'https://example.com' }
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
 * RN에서 오는 메시지를 수신하는 리스너 등록 (document.addEventListener('message') 대신 사용)
 * @param callback 메시지 이벤트 핸들러
 * @returns cleanup 함수 (리스너 제거용)
 * @example
 * const cleanup = addReceiveReactNativeMessageListener((event) => {
 *   console.log('Received from Native:', event.data);
 * });
 * return cleanup;
 */
export const addReceiveReactNativeMessageListener = (
  callback: (message: MessageEvent) => void
) => {
  const documentListener = (event: any) => {
    callback(event as MessageEvent);
  };
  const windowListener = (event: MessageEvent) => {
    callback(event);
  };
  document.addEventListener('message', documentListener);
  window.addEventListener('message', windowListener);
  return () => {
    document.removeEventListener('message', documentListener);
    window.removeEventListener('message', windowListener);
  };
};

/**
 * RN에서 오는 메시지를 수신하는 리스너 등록
 * @param handler 메시지 이벤트 핸들러
 * @returns cleanup 함수 (리스너 제거용)
 * @example
 * // Native에서 오는 응답 수신
 * useEffect(() => {
 *   const cleanup = addMessageListener((event) => {
 *     const data = JSON.parse(event.data);
 *     if (data.type === 'link:response') {
 *       console.log('Link 열기 성공:', data.url);
 *     }
 *   });
 *   return cleanup; // 컴포넌트 언마운트 시 리스너 제거
 * }, []);
 */
export const addMessageListener = (
  handler: (event: MessageEvent<any>) => void
): (() => void) => {
  if (typeof window !== 'undefined') {
    return addReceiveReactNativeMessageListener(handler);
  }
  return () => {};
};

/**
 * 특정 타입의 메시지만 수신하는 타입 안전한 리스너 등록
 * @param messageType 수신할 메시지 타입
 * @param handler 페이로드를 처리하는 핸들러
 * @returns cleanup 함수 (리스너 제거용)
 * @example
 * // Link 응답 메시지 수신 (직접 사용 대신 openLink 권장)
 * useEffect(() => {
 *   const cleanup = addTypedMessageListener('link:response', (payload) => {
 *     console.log('Link 응답:', payload.url, payload.success);
 *   });
 *   return cleanup;
 * }, []);
 *
 * @example
 * // 타입 지정하여 사용
 * interface CustomPayload {
 *   data: string;
 * }
 * const cleanup = addTypedMessageListener<CustomPayload>('CUSTOM_MESSAGE', (payload) => {
 *   console.log('커스텀 메시지:', payload.data);
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

// ============================================
// Link-specific utilities
// ============================================

/**
 * Promise 기반 응답 처리를 위한 pending requests 맵
 */
const pendingLinkRequests = new Map<
  string,
  {
    resolve: (value: LinkResponse) => void;
    reject: (error: LinkError) => void;
    timeoutId: number;
  }
>();

/**
 * Native에서 오는 link 응답을 처리하는 리스너
 */
const setupLinkResponseListener = (() => {
  let isSetup = false;

  return () => {
    if (isSetup) return;
    isSetup = true;

    addMessageListener((event: MessageEvent<any>) => {
      try {
        const data =
          typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

        if (data.type === 'link:response' || data.type === 'link:error') {
          // NativeToWebMessage에 NAVIGATE가 추가되어도,
          // 이 블록에서는 link 응답만 처리하므로 타입을 좁혀준다.
          const message = data as LinkResponse | LinkError;
          const url =
            message.type === 'link:response' ? message.url : message.url || '';

          const pending = pendingLinkRequests.get(url);
          if (pending) {
            clearTimeout(pending.timeoutId);
            pendingLinkRequests.delete(url);

            if (message.type === 'link:response') {
              pending.resolve(message);
            } else {
              pending.reject(message);
            }
          } else {
            console.warn(
              `No pending request found for ${message.type}`,
              'URL:',
              url,
              'Available pending URLs:',
              Array.from(pendingLinkRequests.keys())
            );
          }
        }
      } catch (error) {
        console.error('Failed to parse link response from Native:', error);
      }
    });
  };
})();

// ============================================
// Auth-specific utilities
// ============================================

/**
 * 처음 실행 시 Native에 auth:login 요청 (저장된 세션이 있으면 reissue 후 access token을 auth:login으로 응답)
 */
export const sendAuthLoginRequest = (): void => {
  sendMessageToRN({ type: 'auth:login', payload: {} });
};

/**
 * 로그아웃/탈퇴 시 Native에 알림 (auth:logout)
 */
export const sendAuthLogout = (): void => {
  sendMessageToRN({ type: 'auth:logout', payload: {} });
};

/**
 * Native에 URL 열기 요청을 보냄 (Fire-and-Forget)
 * @param url 열 URL
 * @example
 * // 링크 열기 (응답 대기 없음)
 * openLink('https://example.com');
 */
export const openLink = (url: string): void => {
  const payload: LinkPayload = { url };
  sendMessageToRN({
    type: 'link:open',
    payload,
  });
};

/**
 * Native에 URL 열기 가능 여부 확인 요청
 * @param url 확인할 URL
 * @param timeout 응답 대기 시간 (기본값: 3000ms)
 * @returns Promise<LinkResponse>
 * @throws LinkError
 * @example
 * try {
 *   const response = await canOpenLink('https://example.com');
 *   if (response.canOpen) {
 *     console.log('이 URL을 열 수 있습니다');
 *   }
 * } catch (error) {
 *   console.error('확인 실패:', error.error);
 * }
 */
export const canOpenLink = (
  url: string,
  timeout: number = 3000
): Promise<LinkResponse> => {
  setupLinkResponseListener();

  return new Promise<LinkResponse>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      pendingLinkRequests.delete(url);
      reject({
        type: 'link:error',
        error: 'Request timeout',
        url,
      } as LinkError);
    }, timeout);

    pendingLinkRequests.set(url, { resolve, reject, timeoutId });

    const payload: LinkCanOpenPayload = { url };
    sendMessageToRN({
      type: 'link:canOpen',
      payload,
    });
  });
};

/**
 * TODO : 임시로 작성, 추후 리팩터링 시 설계 논의 필요
 *
 *
 * 401 발생 시 앱에 auth:reissue 브릿지 전송 → 앱이 갱신 후 auth:token으로 응답
 * @param timeout 응답 대기 시간 (기본값: 10000ms)
 * @returns Promise<string> - 새 accessToken
 */
export const requestTokenReissue = (
  timeout: number = 10000
): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    let removeTokenListener: (() => void) | null = null;
    let removeErrorListener: (() => void) | null = null;

    const cleanup = () => {
      removeTokenListener?.();
      removeErrorListener?.();
    };

    const timeoutId = window.setTimeout(() => {
      cleanup();
      reject(new Error('auth:reissue timeout'));
    }, timeout);

    removeTokenListener = addTypedMessageListener<AuthTokenPayload>(
      'auth:token',
      (payload) => {
        clearTimeout(timeoutId);
        cleanup();
        resolve(payload.accessToken);
      }
    );

    removeErrorListener = addTypedMessageListener<AuthErrorPayload>(
      'auth:error',
      (payload) => {
        clearTimeout(timeoutId);
        cleanup();
        reject(new Error(payload.message));
      }
    );

    sendMessageToRN({ type: 'auth:reissue' });
  });
};

// ============================================
// OS Share utilities
// ============================================

/**
 * OS 네이티브 Share Sheet를 통해 dolink:// 딥링크 공유
 * @param taskId 공유할 태스크 ID
 */
export const osShareTask = (taskId: number): void => {
  const url = `dolink://task/detail/${taskId}`;
  const payload: OsSharePayload = { url };
  sendMessageToRN({
    type: 'os:share',
    payload,
  });
};
