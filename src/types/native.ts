/**
 * React Native WebView의 postMessage 인터페이스
 */
export interface ReactNativeWebView {
  postMessage: (message: string) => void;
  addEventListener?: (event: string, handler: (event: Event) => void) => void;
  removeEventListener?: (
    event: string,
    handler: (event: Event) => void
  ) => void;
}

/**
 * WebView에서 App으로 전송하는 메시지
 */
export interface WebViewMessage<T = unknown> {
  type: DraftMessageType;
  payload: DraftPayload<T>;
}

/**
 * App에서 WebView로 전송하는 응답
 */
export interface AppResponse<T = unknown> {
  type: DraftMessageType;
  success: boolean;
  data?: T;
  error?: string;
}
