import { create } from 'zustand';
import { MOCK_ARCHIVES, type MockArchive } from '@/mocks/archiveData';
export type { MockArchive } from '@/mocks/archiveData';

type ArchiveMockStore = {
  archives: MockArchive[];
  addArchive: (archive: Omit<MockArchive, 'id' | 'createdAt'>) => void;
  updateArchive: (
    id: string,
    updates: Partial<Omit<MockArchive, 'id' | 'createdAt'>>
  ) => void;
  deleteArchive: (id: string) => void;
  reset: () => void;
};

const createInitialArchives = () =>
  MOCK_ARCHIVES.map((archive) => ({ ...archive }));

export const useArchiveMockStore = create<ArchiveMockStore>((set) => ({
  archives: createInitialArchives(),

  addArchive: (archive) =>
    set((state) => {
      const newArchive: MockArchive = {
        ...archive,
        id: `archive-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      return {
        archives: [newArchive, ...state.archives],
      };
    }),

  updateArchive: (id, updates) =>
    set((state) => ({
      archives: state.archives.map((archive) =>
        archive.id === id ? { ...archive, ...updates } : archive
      ),
    })),

  deleteArchive: (id) =>
    set((state) => ({
      archives: state.archives.filter((archive) => archive.id !== id),
    })),

  reset: () => set({ archives: createInitialArchives() }),
}));
