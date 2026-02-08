import { useEffect } from 'react';
import axios from 'axios';
import { AXIOS_INSTANCE } from '@/api/axios-instance';
import { useAuthStore } from '@/stores/useAuthStore';
import ServerOfflinePage from '@/pages/error/ServerOfflinePage';

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const isAuthInitialized = useAuthStore((s) => s.isAuthInitialized);
  const isServerOffline = useAuthStore((s) => s.isServerOffline);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setAuthInitialized = useAuthStore((s) => s.setAuthInitialized);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setServerOffline = useAuthStore((s) => s.setServerOffline);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await AXIOS_INSTANCE.post('/v1/auth/reissue');
        const token: string | undefined = response.data?.result;

        if (token) {
          setAccessToken(token);
        } else {
          clearAuth();
        }
        setServerOffline(false);
      } catch (error) {
        // 서버 연결 실패 또는 프록시 에러 (500, 502, 503, 504) 감지
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          if (
            !error.response ||
            (status && [500, 502, 503, 504].includes(status))
          ) {
            setServerOffline(true);
          }
        }
        clearAuth();
      } finally {
        setAuthInitialized();
      }
    };

    initializeAuth();
  }, [setAccessToken, setAuthInitialized, clearAuth, setServerOffline]);

  if (isServerOffline) {
    return <ServerOfflinePage />;
  }

  if (!isAuthInitialized) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-grey-50 text-body-md text-grey-500'>
        잠시만 기다려주세요
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
