import axios from 'axios';

// ==============================
// Axios 기본 인스턴스 생성
// ==============================
export const AXIOS_INSTANCE = axios.create({
  baseURL: 'http://localhost:8080', // 기본 URL 설정
  withCredentials: true, // 쿠키 등 인증 정보 포함
});

// ==============================
// Orval v8용 커스텀 요청 함수
// Fetch API 스타일 config를 Axios 요청으로 변환
// ==============================
export const customInstance = <T>(
  url: string, // 요청 경로
  config: RequestInit // Fetch API 스타일 요청 옵션
): Promise<T> => {
  // ==============================
  // 요청 취소 토큰 생성
  // ==============================
  const source = axios.CancelToken.source();

  // ==============================
  // Axios 요청 실행
  // ==============================
  const promise = AXIOS_INSTANCE({
    url, // 요청 URL
    method: config.method as string, // HTTP 메서드 변환
    headers: config.headers as Record<string, string>, // 헤더 변환
    data: config.body, // 요청 바디 변환
    cancelToken: source.token, // 취소 토큰 연결
  }).then(({ data }) => data); // 응답에서 data만 반환

  // ==============================
  // promise에 cancel 메서드 추가
  // (원래 Promise에는 없어서 TS 에러 방지)
  // ==============================
  // @ts-expect-error cancel 속성 추가
  promise.cancel = () => source.cancel('Query cancelled');

  return promise; // 최종 Promise 반환
};
