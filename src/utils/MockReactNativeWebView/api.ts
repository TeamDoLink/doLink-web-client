import { issueAccessToken } from '@/api/generated/endpoints/auth/auth';

type AccessTokenResponse = {
  result: string;
};

export const reissue = async (): Promise<AccessTokenResponse> => {
  // E2E 테스트 환경: VITE_E2E_ACCESS_TOKEN이 설정된 경우 즉시 반환
  const e2eToken = import.meta.env.VITE_E2E_ACCESS_TOKEN as string | undefined;
  if (e2eToken) {
    return { result: e2eToken };
  }

  // orval + customInstance(axios) 기반 호출
  // 실제 런타임에서는 axios가 JSON을 파싱해서 반환하므로 accessToken 필드를 그대로 사용할 수 있음
  const data = (await issueAccessToken()) as unknown as AccessTokenResponse;
  return data;
};
