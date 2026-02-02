import { create } from 'zustand';

export type ArchiveUIState = {
  selectedArchiveId: string | null;
  setSelectedArchiveId: (id: string | null) => void;
};

export const useArchiveUIStore = create<ArchiveUIState>((set) => ({
  selectedArchiveId: null,
  setSelectedArchiveId: (id) => set({ selectedArchiveId: id }),
}));
