export type TodoItem = {
  id: string;
  title: string;
  platform: string;
  checked: boolean;
  createdAt: string;
};

export type ArchiveItem = {
  id: string;
  title: string;
  category: string;
  itemCount: number;
  images?: string[];
  createdAt: string;
};
