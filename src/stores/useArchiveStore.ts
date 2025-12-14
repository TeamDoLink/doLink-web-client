import { create } from 'zustand';

type ArchiveStoreState = {
  pendingDeleteArchiveId: string | null;
  setPendingDeleteArchiveId: (id: string | null) => void;
};

export const useArchiveStore = create<ArchiveStoreState>((set) => ({
  pendingDeleteArchiveId: null,
  setPendingDeleteArchiveId: (id) => set({ pendingDeleteArchiveId: id }),
}));

export default useArchiveStore;
