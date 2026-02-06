import axios from 'axios';

export const AXIOS_INSTANCE = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

// Orval v8 커스텀 인스턴스 (url, requestInit 시그니처)
export const customInstance = <T>(
  url: string,
  config: RequestInit
): Promise<T> => {
  const source = axios.CancelToken.source();

  const promise = AXIOS_INSTANCE({
    url,
    method: config.method as string,
    headers: config.headers as Record<string, string>,
    data: config.body,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-expect-error cancel 속성 추가
  promise.cancel = () => source.cancel('Query cancelled');
  return promise;
};
