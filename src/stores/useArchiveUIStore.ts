import { create } from 'zustand';

import type { ArchiveCategoryKey } from '@/utils/archiveCategory';

export type ArchiveUIState = {
  selectedArchiveId: string | null;
  setSelectedArchiveId: (id: string | null) => void;
  selectedCategory: ArchiveCategoryKey;
  setSelectedCategory: (category: ArchiveCategoryKey) => void;
};

export const useArchiveUIStore = create<ArchiveUIState>((set) => ({
  selectedArchiveId: null,
  selectedCategory: 'all',
  setSelectedArchiveId: (id) => set({ selectedArchiveId: id }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
