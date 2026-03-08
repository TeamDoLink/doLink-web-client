import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  addTypedMessageListener,
  sendAuthLoginRequest,
} from '@/utils/nativeBridge';
import type { AuthTokenPayload, AuthErrorPayload } from '@/types/native';

type AuthProviderProps = {
  children: React.ReactNode;
};

const AUTH_TIMEOUT = 10000;

const AuthProvider = ({ children }: AuthProviderProps) => {
  const isAuthInitialized = useAuthStore((s) => s.isAuthInitialized);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setAuthInitialized = useAuthStore((s) => s.setAuthInitialized);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    let cleanup: (() => void)[] = [];

    const handleToken = (payload: AuthTokenPayload) => {
      setAccessToken(payload.accessToken);
      setAuthInitialized();
      cleanup.forEach((fn) => fn());
    };

    const handleError = (_payload: AuthErrorPayload) => {
      clearAuth();
      setAuthInitialized();
      cleanup.forEach((fn) => fn());
    };

    const timeoutId = window.setTimeout(() => {
      clearAuth();
      setAuthInitialized();
    }, AUTH_TIMEOUT);

    cleanup = [
      addTypedMessageListener<AuthTokenPayload>('auth:token', handleToken),
      addTypedMessageListener<AuthTokenPayload>('auth:login', handleToken),
      addTypedMessageListener<AuthErrorPayload>('auth:error', handleError),
      () => clearTimeout(timeoutId),
    ];

    sendAuthLoginRequest();

    return () => {
      cleanup.forEach((fn) => fn());
    };
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
