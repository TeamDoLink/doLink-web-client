// stores/useTodoPreferenceStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Todo 사용자 설정 Store
 *
 * 사용자의 Todo 관련 선호도를 영구 저장
 * - localStorage에 저장되어 새로고침 후에도 유지
 * - 브라우저를 닫았다 열어도 설정 유지
 */

type TodoPreferenceState = {
  /**
   * 완료 모달 표시 억제 여부
   *
   * - true: "다시 보지 않기" 선택됨 → 모달 표시 안 함
   * - false: 할 일 완료 시마다 모달 표시
   */
  suppressCompleteModal: boolean;

  /**
   * 완료 모달 표시 억제 설정 변경
   */
  setSuppressCompleteModal: (suppress: boolean) => void;
};

export const useTodoPreferenceStore = create<TodoPreferenceState>()(
  persist(
    (set) => ({
      // 초기값: 모달 표시함
      suppressCompleteModal: false,

      // 설정 변경 함수
      setSuppressCompleteModal: (suppress) =>
        set({ suppressCompleteModal: suppress }),
    }),
    {
      name: 'todo-preference', // localStorage 키 이름
      // 저장 위치: localStorage['todo-preference']
    }
  )
);
