export type TodoItem = {
  id: string;
  title: string;
  date: string;
  sns: string;
  checked: boolean;
};

export type ArchiveItem = {
  id: string;
  title: string;
  category: string;
  itemCount: number;
  images?: string[];
};
