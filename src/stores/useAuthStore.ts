import { create } from 'zustand';

type AuthStoreState = {
  accessToken: string | null;
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
  isServerOffline: boolean;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
  setAuthInitialized: () => void;
  setServerOffline: (isOffline: boolean) => void;
};

export const useAuthStore = create<AuthStoreState>((set) => ({
  accessToken: null,
  isAuthenticated: false,
  isAuthInitialized: false,
  isServerOffline: false,
  setAccessToken: (token: string) =>
    set({ accessToken: token, isAuthenticated: true }),
  clearAuth: () => set({ accessToken: null, isAuthenticated: false }),
  setAuthInitialized: () => set({ isAuthInitialized: true }),
  setServerOffline: (isOffline: boolean) => set({ isServerOffline: isOffline }),
}));

export default useAuthStore;
