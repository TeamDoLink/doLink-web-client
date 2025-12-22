import { create } from 'zustand';

type AuthStoreState = {
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void;
  reset: () => void;
};

export const useAuthStore = create<AuthStoreState>((set) => ({
  isAuthenticated: true,
  signIn: () => set({ isAuthenticated: true }),
  signOut: () => set({ isAuthenticated: false }),
  reset: () => set({ isAuthenticated: false }),
}));

export default useAuthStore;
