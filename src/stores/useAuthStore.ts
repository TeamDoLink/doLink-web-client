import { create } from 'zustand';

// 홈 화면 분기를 위한 로그인 진행 및 완료 상태를 관리
export type AuthState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  setLoading: (next: boolean) => void;
  setAuthenticated: (next: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: false,
  isAuthenticated: true,
  setLoading: (next) => set({ isLoading: next }),
  setAuthenticated: (next) => set({ isAuthenticated: next }),
}));
