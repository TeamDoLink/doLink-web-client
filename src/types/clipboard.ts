/**
 * React Native WebView와의 클립보드 통신 관련 타입 정의
 */

/**
 * Native에서 WebView로 전송하는 클립보드 데이터 메시지
 */
export interface ClipboardDataMessage {
  type: 'clipboard:data';
  payload: string;
}

/**
 * Native에서 WebView로 전송하는 클립보드 에러 메시지
 */
export interface ClipboardErrorMessage {
  type: 'clipboard:error';
  error: string;
}

/**
 * WebView에서 Native로 전송하는 클립보드 읽기 요청 메시지
 */
export interface ClipboardReadMessage {
  type: 'clipboard:read';
}

/**
 * 모든 가능한 클립보드 관련 메시지 타입
 */
export type ClipboardMessage =
  | ClipboardDataMessage
  | ClipboardErrorMessage
  | ClipboardReadMessage;

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
 * 메시지가 유효한 ClipboardMessage인지 확인
 */
export const isClipboardMessage = (data: unknown): data is ClipboardMessage => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;
  return (
    obj.type === 'clipboard:data' ||
    obj.type === 'clipboard:error' ||
    obj.type === 'clipboard:read'
  );
};

/**
 * 메시지가 성공 응답인지 확인
 */
export const isClipboardDataMessage = (
  message: ClipboardMessage
): message is ClipboardDataMessage => {
  return message.type === 'clipboard:data';
};

/**
 * 메시지가 에러 응답인지 확인
 */
export const isClipboardErrorMessage = (
  message: ClipboardMessage
): message is ClipboardErrorMessage => {
  return message.type === 'clipboard:error';
};
