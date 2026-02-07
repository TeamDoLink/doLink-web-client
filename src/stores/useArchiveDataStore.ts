/**
 * UI 테스트용 Todo 상태 스토어
 * - 실제 API 연결 전까지 사용
 */

import { create } from 'zustand';
import { MOCK_ARCHIVES, type MockArchive } from '@/mocks/archiveData';
import type { ArchiveCategory } from '@/utils/archiveCategory';

export type ArchiveRecord = MockArchive;

export type CreateArchivePayload = {
  title: string;
  category: ArchiveCategory;
  itemCount: number;
  images?: string[];
};

export type UpdateArchivePayload = Partial<
  Omit<ArchiveRecord, 'id' | 'createdAt'>
>;

type ArchiveDataState = {
  archives: ArchiveRecord[];
  addArchive: (payload: CreateArchivePayload) => ArchiveRecord;
  updateArchive: (
    id: string,
    updates: UpdateArchivePayload
  ) => ArchiveRecord | undefined;
  deleteArchive: (id: string) => boolean;
  resetArchives: () => void;
};

const cloneArchive = (archive: ArchiveRecord): ArchiveRecord => ({
  ...archive,
  ...(archive.images ? { images: archive.images.slice() } : {}),
});

const createInitialArchives = (): ArchiveRecord[] =>
  MOCK_ARCHIVES.map((archive) => cloneArchive(archive));

export const useArchiveDataStore = create<ArchiveDataState>((set, get) => ({
  archives: createInitialArchives(),
  addArchive: (payload) => {
    const newArchive: ArchiveRecord = {
      ...payload,
      id: `archive-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const normalized = cloneArchive(newArchive);
    set((state) => ({
      archives: [
        normalized,
        ...state.archives.map((archive) => cloneArchive(archive)),
      ],
    }));

    return cloneArchive(normalized);
  },
  updateArchive: (id, updates) => {
    let updatedArchive: ArchiveRecord | undefined;

    set((state) => ({
      archives: state.archives.map((archive) => {
        if (archive.id !== id) {
          return cloneArchive(archive);
        }

        updatedArchive = cloneArchive({
          ...archive,
          ...updates,
        });
        return updatedArchive;
      }),
    }));

    return updatedArchive ? cloneArchive(updatedArchive) : undefined;
  },
  deleteArchive: (id) => {
    let removed = false;

    set((state) => {
      const nextArchives = state.archives.filter(
        (archive) => archive.id !== id
      );
      removed = nextArchives.length !== state.archives.length;
      return {
        archives: nextArchives.map((archive) => cloneArchive(archive)),
      };
    });

    return removed;
  },
  resetArchives: () => {
    set({ archives: createInitialArchives() });
  },
}));
