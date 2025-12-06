import { create } from 'zustand';

export type TodoItem = {
  id: string;
  title: string;
  date: string;
  sns: string;
  checked: boolean;
};

type TodoStoreState = {
  items: TodoItem[];
  showCompleteModal: boolean;
  suppressCompleteModal: boolean;
  toggleTodo: (id: string, nextChecked?: boolean) => void;
  setShowCompleteModal: (open: boolean) => void;
  setSuppressCompleteModal: (disabled: boolean) => void;
  resetTodos: (todos: TodoItem[]) => void;
};

export const useTodoStore = create<TodoStoreState>((set, get) => ({
  items: [],
  showCompleteModal: false,
  suppressCompleteModal: false,
  toggleTodo: (id, nextChecked) => {
    let shouldShowModal = false;

    set((state) => {
      const items = state.items.map((item) => {
        if (item.id !== id) return item;

        const checked = nextChecked ?? !item.checked;
        if (checked && !state.suppressCompleteModal) {
          shouldShowModal = true;
        }

        return { ...item, checked };
      });

      return {
        items,
        showCompleteModal: shouldShowModal || state.showCompleteModal,
      };
    });
  },
  setShowCompleteModal: (open) => set({ showCompleteModal: open }),
  setSuppressCompleteModal: (disabled) =>
    set({ suppressCompleteModal: disabled }),
  resetTodos: (todos) => {
    const nextItems = todos.map((todo) => ({ ...todo }));
    const { suppressCompleteModal } = get();

    set({
      items: nextItems,
      showCompleteModal: false,
      suppressCompleteModal,
    });
  },
}));

export default useTodoStore;
