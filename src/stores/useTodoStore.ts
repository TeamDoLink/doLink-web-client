import { create } from 'zustand';

// 홈 화면 전반에서 공유되는 체크리스트와 완료 모달 상태를 관리
export type TodoItem = {
  id: string;
  title: string;
  date: string;
  sns: string;
  checked?: boolean;
};

type TodoState = {
  items: TodoItem[];
  suppressCompleteModal: boolean;
  showCompleteModal: boolean;
  setSuppressCompleteModal: (next: boolean) => void;
  setShowCompleteModal: (next: boolean) => void;
  toggleTodo: (id: string, checked: boolean) => void;
  resetTodos: (next: TodoItem[]) => void;
};

const INITIAL_TODOS: TodoItem[] = [
  {
    id: 'welcome-guide',
    title: '두링크(DoLink) 안내서 📚',
    date: '오늘',
    sns: '노션 (Notion)',
    checked: false,
  },
];

export const useTodoStore = create<TodoState>((set) => ({
  items: INITIAL_TODOS,
  suppressCompleteModal: false,
  showCompleteModal: false,
  setSuppressCompleteModal: (next) => set({ suppressCompleteModal: next }),
  setShowCompleteModal: (next) => set({ showCompleteModal: next }),
  toggleTodo: (id, checked) =>
    set(({ items, suppressCompleteModal }) => ({
      items: items.map((item) =>
        item.id === id ? { ...item, checked } : item
      ),
      showCompleteModal: checked && !suppressCompleteModal,
    })),
  // 초기화 시 모달 플래그를 함께 지워 화면 이동 후 이전 UI 상태가 재사용되지 않도록
  resetTodos: (next) =>
    set(() => ({
      items: next,
      showCompleteModal: false,
      suppressCompleteModal: false,
    })),
}));
