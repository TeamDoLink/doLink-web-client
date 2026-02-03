import type { ArchiveCategory } from '@/utils/archiveCategory';

export type MockArchive = {
  id: string;
  title: string;
  category: ArchiveCategory;
  itemCount: number;
  images?: string[];
  createdAt: string;
};

export const MOCK_ARCHIVES: MockArchive[] = [
  {
    id: 'tutorial-4',
    title: '맛집 모음 튜토리얼(01/07)',
    category: 'restaurant',
    itemCount: 3,
    createdAt: '2025-01-07T16:45:00',
  },
  {
    id: 'tutorial-5',
    title: '생활 꿀팁 튜토리얼(12/31)',
    category: 'tips',
    itemCount: 1,
    createdAt: '2024-12-31T17:30:28',
  },
  {
    id: 'tutorial-2',
    title: '취미 기록 튜토리얼(01/09)',
    category: 'hobby',
    itemCount: 2,
    createdAt: '2025-01-09T14:20:15',
  },
  {
    id: 'tutorial-3',
    title: '여행 준비 튜토리얼(01/05)',
    category: 'travel',
    itemCount: 4,
    createdAt: '2025-01-05T13:25:10',
  },
  {
    id: 'tutorial',
    title: '취미 루틴 튜토리얼(01/10)',
    category: 'hobby',
    itemCount: 1,
    createdAt: '2025-01-10T12:30:21',
  },
  {
    id: 'tutorial-5-1',
    title: '공부 노트 튜토리얼(01/03)',
    category: 'study',
    itemCount: 1,
    createdAt: '2025-01-03T15:40:33',
  },
  {
    id: 'tutorial-4-1',
    title: '재테크 정리 튜토리얼(01/01)',
    category: 'money',
    itemCount: 3,
    createdAt: '2025-01-01T12:10:55',
  },
  {
    id: 'tutorial-3-1',
    title: '아이디어 튜토리얼(01/08)',
    category: 'etc',
    itemCount: 4,
    createdAt: '2025-01-08T09:15:30',
  },
  {
    id: 'tutorial-5-2',
    title: '쇼핑 목록 튜토리얼(01/06)',
    category: 'shopping',
    itemCount: 1,
    createdAt: '2025-01-06T11:30:22',
  },
  {
    id: 'tutorial-3-2',
    title: '운동 계획 튜토리얼(01/02)',
    category: 'exercise',
    itemCount: 4,
    createdAt: '2025-01-02T08:20:17',
  },
  {
    id: 'tutorial-4-2',
    title: '쇼핑 추천 튜토리얼(01/04)',
    category: 'shopping',
    itemCount: 3,
    createdAt: '2025-01-04T10:15:45',
  },
];
