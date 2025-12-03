import { create } from 'zustand';

type FolderItem = {
  id: string;
  title: string;
  category: string;
  itemCount: number;
  images?: string[];
};

type FolderState = {
  items: FolderItem[];
  pendingDeleteFolderId: string | null;
  setPendingDeleteFolderId: (id: string | null) => void;
  removeFolder: (id: string) => void;
  resetFolders: (next: FolderItem[]) => void;
};

const INITIAL_FOLDERS: FolderItem[] = [
  {
    id: 'tutorial',
    title: '두링크(DoLink) 튜토리얼',
    category: '기타',
    itemCount: 1,
  },
];

export const useFolderStore = create<FolderState>((set) => ({
  items: INITIAL_FOLDERS,
  pendingDeleteFolderId: null,
  setPendingDeleteFolderId: (id) => set({ pendingDeleteFolderId: id }),
  removeFolder: (id) =>
    set(({ items }) => ({
      items: items.filter((item) => item.id !== id),
      pendingDeleteFolderId: null,
    })),
  resetFolders: (next) => set({ items: next }),
}));
