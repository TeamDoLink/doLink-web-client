import type { ArchiveCategory } from '@/utils/archiveCategory';

const createTodayISO = () => new Date().toISOString();

export type BeforeLoginTodo = {
  id: string;
  title: string;
  platform: string;
  checked: boolean;
  createdAt: string;
};

export type BeforeLoginArchive = {
  id: string;
  title: string;
  category: ArchiveCategory;
  itemCount: number;
  images: string[];
};

const BASE_TODO: Array<Omit<BeforeLoginTodo, 'createdAt'>> = [
  {
    id: 'todo_tutorial',
    title: '두링크(DoLink) 안내서 📚',
    platform: '노션 (Notion)',
    checked: false,
  },
];

const BASE_ARCHIVE: BeforeLoginArchive[] = [
  {
    id: 'archive_tutorial',
    title: '두링크(DoLink) 튜토리얼',
    category: 'etc',
    itemCount: 1,
    images: [],
  },
];

export const BEFORE_LOGIN_TODO = (): BeforeLoginTodo[] =>
  BASE_TODO.map((item) => ({ ...item, createdAt: createTodayISO() }));

export const BEFORE_LOGIN_ARCHIVE = (): BeforeLoginArchive[] =>
  BASE_ARCHIVE.map((item) => ({ ...item }));
