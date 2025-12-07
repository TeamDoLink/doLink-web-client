import { create } from 'zustand';

export type ArchiveItem = {
  id: string;
  title: string;
  category: string;
  itemCount: number;
  images?: string[];
};

type ArchiveStoreState = {
  items: ArchiveItem[];
  pendingDeleteArchiveId: string | null;
  setPendingDeleteArchiveId: (id: string | null) => void;
  removeArchive: (id: string) => void;
  resetArchives: (archives: ArchiveItem[]) => void;
};

export const useArchiveStore = create<ArchiveStoreState>((set) => ({
  items: [],
  pendingDeleteArchiveId: null,
  setPendingDeleteArchiveId: (id) => set({ pendingDeleteArchiveId: id }),
  removeArchive: (id) =>
    set((state) => ({
      items: state.items.filter((archive) => archive.id !== id),
      pendingDeleteArchiveId:
        state.pendingDeleteArchiveId === id
          ? null
          : state.pendingDeleteArchiveId,
    })),
  resetArchives: (archives) =>
    set({
      items: archives.map((archive) => ({ ...archive })),
      pendingDeleteArchiveId: null,
    }),
}));

export default useArchiveStore;
