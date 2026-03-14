import { issueAccessToken } from '@/api/generated/endpoints/auth/auth';

type AccessTokenResponse = {
  result: string;
};

export const reissue = async (): Promise<AccessTokenResponse> => {
  // orval + customInstance(axios) 기반 호출
  // 실제 런타임에서는 axios가 JSON을 파싱해서 반환하므로 accessToken 필드를 그대로 사용할 수 있음
  const data = (await issueAccessToken()) as unknown as AccessTokenResponse;
  return data;
};
