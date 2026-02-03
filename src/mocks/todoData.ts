import type { TodoItem } from '@/types';

export const MOCK_TODOS: TodoItem[] = [
  {
    id: 'todo-1',
    title: '올해 여름 휴가 가볼 만한 제주도 숙소 🌊',
    platform: '인스타그램 (Instagram)',
    checked: false,
    createdAt: '2026-02-03T11:20:00',
  },
  {
    id: 'todo-2',
    title: '두링크(DoLink) 프로젝트 기획안 초안 📚',
    platform: '노션 (Notion)',
    checked: false,
    createdAt: '2026-02-02T14:05:00',
  },
  {
    id: 'todo-3',
    title: '홍대 젠틀몬스터 팝업스토어 방문 🕶️',
    platform: 'X (엑스)',
    checked: false,
    createdAt: '2026-02-01T09:30:00',
  },
  {
    id: 'todo-4',
    title: '연남동 근처 분위기 좋은 파스타 맛집 🍝',
    platform: '페이스북 (facebook)',
    checked: false,
    createdAt: '2026-01-30T18:15:00',
  },
  {
    id: 'todo-5',
    title: '일본 교토 3박 4일 여행 코스 추천 ⛩️',
    platform: '인스타그램 (Instagram)',
    checked: false,
    createdAt: '2026-01-01T21:00:00',
  },
];
