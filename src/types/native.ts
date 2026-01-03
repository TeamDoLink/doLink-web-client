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
