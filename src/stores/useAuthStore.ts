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

  setAccessToken: (token: string) =>
    set({ accessToken: token, isAuthenticated: true }),

  clearAuth: () => set({ accessToken: null, isAuthenticated: false }),

  setAuthInitialized: () => set({ isAuthInitialized: true }),
}));

export default useAuthStore;
