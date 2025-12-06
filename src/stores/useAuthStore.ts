import { create } from 'zustand';

type AuthStoreState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  setIsLoading: (loading: boolean) => void;
  signIn: () => void;
  signOut: () => void;
  reset: () => void;
};

export const useAuthStore = create<AuthStoreState>((set) => ({
  isLoading: false,
  isAuthenticated: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  signIn: () => set({ isAuthenticated: true, isLoading: false }),
  signOut: () => set({ isAuthenticated: false, isLoading: false }),
  reset: () => set({ isAuthenticated: false, isLoading: false }),
}));

export default useAuthStore;
