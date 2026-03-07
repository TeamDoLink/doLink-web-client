import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';

// ==============================
// Axios 기본 인스턴스 생성
// ==============================
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AXIOS_INSTANCE = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// ==============================
// Request 인터셉터: access token을 Authorization 헤더에 첨부
// ==============================
AXIOS_INSTANCE.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==============================
// Response 인터셉터: 401 응답 처리
// accessToken 유효기간 6개월 → 현재 reissue 로직 제거
// 추후 auth:reissue 브릿지 방식으로 대체 예정
// ==============================

// TODO: auth:reissue 브릿지 연결 시 아래 큐잉 구조 활용 예정
// let isRefreshing = false;
// let failedQueue: Array<{
//   resolve: (token: string | null) => void;
//   reject: (error: unknown) => void;
// }> = [];
//
// const processQueue = (error: unknown, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
    }
    return Promise.reject(error);
  }
);

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
