import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TutorialTaskState {
  completedTasks: Record<string, boolean>;
  toggleTask: (taskId: string) => void;
  isTaskCompleted: (taskId: string) => boolean;
}

/**
 * 미로그인 사용자의 튜토리얼 할 일 완료 상태를 관리하는 전역 스토어
 * localStorage에 저장되어 페이지 새로고침 후에도 유지됨
 */
export const useTutorialTaskStore = create<TutorialTaskState>()(
  persist(
    (set, get) => ({
      completedTasks: {},

      toggleTask: (taskId: string) => {
        set((state) => ({
          completedTasks: {
            ...state.completedTasks,
            [taskId]: !state.completedTasks[taskId],
          },
        }));
      },

      isTaskCompleted: (taskId: string) => {
        return get().completedTasks[taskId] ?? false;
      },
    }),
    {
      name: 'tutorial-task-storage',
    }
  )
);
