import { useSyncExternalStore } from 'react';

import { MOCK_ARCHIVES, type MockArchive } from '@/mocks/archiveData';
import type { ArchiveCategory } from '@/utils/archiveCategory';

export type Archive = MockArchive;

export type CreateArchivePayload = {
  title: string;
  category: ArchiveCategory;
  itemCount: number;
  images?: string[];
};

export type UpdateArchivePayload = Partial<Omit<Archive, 'id' | 'createdAt'>>;

const cloneArchive = (archive: Archive): Archive => ({
  ...archive,
  ...(archive.images ? { images: archive.images.slice() } : {}),
});

const createInitialArchives = (): Archive[] =>
  MOCK_ARCHIVES.map((archive) => cloneArchive(archive));

let archives: Archive[] = createInitialArchives();

const listeners = new Set<() => void>();

const emit = () => {
  listeners.forEach((listener) => {
    listener();
  });
};

const getSnapshot = (): Archive[] => archives;

export const archiveMockApi = {
  getAll: (): Archive[] => archives.map((archive) => cloneArchive(archive)),

  add: (payload: CreateArchivePayload): Archive => {
    const newArchive: Archive = {
      ...payload,
      id: `archive-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const normalized = cloneArchive(newArchive);
    archives = [normalized, ...archives];
    emit();
    return cloneArchive(normalized);
  },

  update: (id: string, updates: UpdateArchivePayload): Archive | undefined => {
    let updatedArchive: Archive | undefined;

    archives = archives.map((archive) => {
      if (archive.id !== id) {
        return archive;
      }

      updatedArchive = {
        ...archive,
        ...updates,
      };

      const normalized = cloneArchive(updatedArchive);
      updatedArchive = normalized;
      return normalized;
    });

    if (updatedArchive) {
      emit();
      return cloneArchive(updatedArchive);
    }

    return undefined;
  },

  delete: (id: string): boolean => {
    const nextArchives = archives.filter((archive) => archive.id !== id);

    if (nextArchives.length === archives.length) {
      return false;
    }

    archives = nextArchives.map((archive) => cloneArchive(archive));
    emit();
    return true;
  },

  reset: () => {
    archives = createInitialArchives();
    emit();
  },

  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export const selectLatestArchives = (archives: Archive[]): Archive[] =>
  archives
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 8)
    .map((archive) => cloneArchive(archive));

export type ArchivePreview = Archive & {
  previewImages: string[];
};

export const selectLatestArchivePreviews = (
  archives: Archive[]
): ArchivePreview[] =>
  selectLatestArchives(archives).map((archive) => ({
    ...archive,
    previewImages: Array.isArray(archive.images)
      ? archive.images.slice(0, 4)
      : [],
  }));

export const useMockArchives = () =>
  useSyncExternalStore(archiveMockApi.subscribe, getSnapshot, getSnapshot);
