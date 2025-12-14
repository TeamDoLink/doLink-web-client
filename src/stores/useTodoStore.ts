import { create } from 'zustand';

type TodoUIStoreState = {
  showCompleteModal: boolean;
  suppressCompleteModal: boolean;
  setShowCompleteModal: (open: boolean) => void;
  setSuppressCompleteModal: (disabled: boolean) => void;
};

export const useTodoStore = create<TodoUIStoreState>((set) => ({
  showCompleteModal: false,
  suppressCompleteModal: false,
  setShowCompleteModal: (open) => set({ showCompleteModal: open }),
  setSuppressCompleteModal: (disabled) =>
    set({ suppressCompleteModal: disabled }),
}));

export default useTodoStore;
