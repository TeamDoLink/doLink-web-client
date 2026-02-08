import { create } from 'zustand';

type AuthStoreState = {
  accessToken: string | null;
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
  setAuthInitialized: () => void;
};

export const useAuthStore = create<AuthStoreState>((set) => ({
  accessToken: null,
  isAuthenticated: false,
  isAuthInitialized: false,
  setAccessToken: (token: string) => {
    console.log('[AuthStore] Setting accessToken in memory:', token);
    set({ accessToken: token, isAuthenticated: true });
  },
  clearAuth: () => {
    console.log('[AuthStore] Clearing accessToken from memory');
    set({ accessToken: null, isAuthenticated: false });
  },
  setAuthInitialized: () => set({ isAuthInitialized: true }),
}));

export default useAuthStore;
