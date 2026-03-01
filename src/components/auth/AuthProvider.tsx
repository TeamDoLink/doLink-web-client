import { useEffect } from 'react';
import { AXIOS_INSTANCE } from '@/api/axios-instance';
import { useAuthStore } from '@/stores/useAuthStore';
import { sendAuthLogin } from '@/utils/nativeBridge';

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const isAuthInitialized = useAuthStore((s) => s.isAuthInitialized);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setAuthInitialized = useAuthStore((s) => s.setAuthInitialized);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await AXIOS_INSTANCE.post('/v1/auth/reissue');
        const token: string | undefined = response.data?.result;

        if (token) {
          setAccessToken(token);
          sendAuthLogin();
        } else {
          clearAuth();
        }
      } catch {
        clearAuth();
      } finally {
        setAuthInitialized();
      }
    };

    initializeAuth();
  }, [setAccessToken, setAuthInitialized, clearAuth]);

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
