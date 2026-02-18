import { create } from 'zustand';

import type { ArchiveCategoryKey } from '@/utils/archiveCategory';

export type ArchiveUIState = {
  selectedCategory: ArchiveCategoryKey;
  setSelectedCategory: (category: ArchiveCategoryKey) => void;
};

export const useArchiveUIStore = create<ArchiveUIState>((set) => ({
  selectedCategory: 'all',
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
