/**
 * React Native WebView와의 Draft 통신 관련 타입 정의
 */

/**
 * 할일 임시저장 데이터 구조
 * RN과 공통 구조
 */
export interface TaskDraft {
  archive: string; // 모음
  title: string; // 제목
  link: string; // 선택 입력
  memo: string; // 선택 입력
}

/**
 * Draft 메시지 타입
 * RN과 공통 구조
 */
export type DraftMessageType = 'SAVE_DRAFT' | 'LOAD_DRAFT' | 'DELETE_DRAFT';

/**
 * WebView에서 App으로 전송하는 메시지 payload
 */
export interface DraftPayload<T = unknown> {
  key: string;
  data?: T;
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
 * 메시지가 유효한 AppResponse인지 확인
 */
export const isDraftResponse = (data: unknown): data is AppResponse => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;
  return (
    (obj.type === 'SAVE_DRAFT' ||
      obj.type === 'LOAD_DRAFT' ||
      obj.type === 'DELETE_DRAFT') &&
    typeof obj.success === 'boolean'
  );
};

/**
 * 응답이 성공 응답인지 확인
 */
export const isDraftSuccessResponse = <T = unknown>(
  response: AppResponse<T>
): response is AppResponse<T> & { success: true } => {
  return response.success === true;
};

/**
 * 응답이 에러 응답인지 확인
 */
export const isDraftErrorResponse = <T = unknown>(
  response: AppResponse<T>
): response is AppResponse<T> & { success: false; error: string } => {
  return response.success === false && typeof response.error === 'string';
};
