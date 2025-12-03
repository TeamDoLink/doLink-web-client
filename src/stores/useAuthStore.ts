import { create } from 'zustand';

export type AuthState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  setLoading: (next: boolean) => void;
  setAuthenticated: (next: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: false,
  isAuthenticated: false,
  setLoading: (next) => set({ isLoading: next }),
  setAuthenticated: (next) => set({ isAuthenticated: next }),
}));
