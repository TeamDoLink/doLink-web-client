import { create } from 'zustand';

export type FolderItem = {
  id: string;
  title: string;
  category: string;
  itemCount: number;
  images?: string[];
};

type FolderStoreState = {
  items: FolderItem[];
  pendingDeleteFolderId: string | null;
  setPendingDeleteFolderId: (id: string | null) => void;
  removeFolder: (id: string) => void;
  resetFolders: (folders: FolderItem[]) => void;
};

export const useFolderStore = create<FolderStoreState>((set) => ({
  items: [],
  pendingDeleteFolderId: null,
  setPendingDeleteFolderId: (id) => set({ pendingDeleteFolderId: id }),
  removeFolder: (id) =>
    set((state) => ({
      items: state.items.filter((folder) => folder.id !== id),
      pendingDeleteFolderId:
        state.pendingDeleteFolderId === id ? null : state.pendingDeleteFolderId,
    })),
  resetFolders: (folders) =>
    set({
      items: folders.map((folder) => ({ ...folder })),
      pendingDeleteFolderId: null,
    }),
}));

export default useFolderStore;
