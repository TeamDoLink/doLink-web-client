import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackDetailBar } from '@/components/common/appBar';
import { EmptyNotice } from '@/components/common/feedBack';
import { FloatingButton } from '@/components/common/button/floatingButton';
import { TabBar } from '@/components/common';
import { StickyTabSection } from '@/components/archive/stickyTabSection';
import {
  SwipeableDeleteCard,
  type Task,
} from '@/components/archive/swipeableDeleteCard';
import type { TabKey } from '@/components/common/tabBar/bottomTabBar';
import { ROUTES } from '@/constants/routes';
import { OptionMenu } from '@/components/common/menu/optionMenu';

// 카테고리 아이콘 임포트
// TODO 임시 - 카테고리에 맞게 수정 예정
import restaurantIcon from '@/assets/icons/category/detail/restaurant.svg';
import todoIcon from '@/assets/icons/category/detail/todo.svg';

type TabType = 'all' | 'incomplete' | 'complete';
type SortOption = 'newest' | 'oldest';

const TAB_ROUTE_MAP: Record<TabKey, string> = {
  home: ROUTES.home,
  archive: ROUTES.archives,
  setting: ROUTES.settings,
};

const SORT_OPTIONS = [
  { value: 'newest', label: '최신 순' },
  { value: 'oldest', label: '오래된 순' },
];

const TAB_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'incomplete', label: '미완료' },
  { value: 'complete', label: '완료' },
];

// Task 타입은 SwipeableDeleteCard에서 import

const MOCK_TASK_ITEM: Task[] = [
  {
    taskId: 101,
    title: 'API 명세 작성',
    link: null,
    memo: '우선순위 높음',
    status: false,
    inout: true,
    createdAt: '2025-02-10T13:10:00',
    modifiedAt: '2025-02-10T13:10:00',
  },
  {
    taskId: 102,
    title: 'ERD 설계',
    link: 'https://example.com/erd',
    memo: null,
    status: true,
    inout: false,
    createdAt: '2025-02-10T13:10:00',
    modifiedAt: '2025-02-12T18:40:10',
  },
  {
    taskId: 103,
    title: '회원가입 API 구현',
    link: 'https://example.com/signup',
    memo: 'validation 필요',
    status: false,
    inout: true,
    createdAt: '2025-02-10T13:10:00',
    modifiedAt: '2025-02-12T10:30:00',
  },
  {
    taskId: 104,
    title: '로그인 기능 개발',
    link: null,
    memo: null,
    status: true,
    inout: false,
    createdAt: '2025-02-13T14:20:00',
    modifiedAt: '2025-02-14T11:05:30',
  },
  {
    taskId: 105,
    title: 'JWT 인증 적용',
    link: 'https://example.com/jwt',
    memo: 'refresh token 포함',
    status: false,
    inout: true,
    createdAt: '2025-02-13T14:20:00',
    modifiedAt: '2025-02-14T16:00:00',
  },
  {
    taskId: 106,
    title: '게시글 CRUD API',
    link: null,
    memo: null,
    status: true,
    inout: false,
    createdAt: '2025-02-13T14:20:00',
    modifiedAt: '2025-02-16T13:45:00',
  },
  {
    taskId: 107,
    title: '댓글 기능 구현',
    link: 'https://example.com/comment',
    memo: '대댓글 포함',
    status: false,
    inout: true,
    createdAt: '2025-02-16T11:00:00',
    modifiedAt: '2025-02-16T11:00:00',
  },
  {
    taskId: 108,
    title: '좋아요 기능 추가',
    link: null,
    memo: null,
    status: true,
    inout: false,
    createdAt: '2025-02-17T15:30:00',
    modifiedAt: '2025-02-18T10:20:00',
  },
  {
    taskId: 109,
    title: '검색 API 구현',
    link: 'https://example.com/search',
    memo: 'index 고려',
    status: false,
    inout: true,
    createdAt: '2025-02-18T17:00:00',
    modifiedAt: '2025-02-18T17:00:00',
  },
  {
    taskId: 110,
    title: '페이징 처리',
    link: null,
    memo: null,
    status: true,
    inout: false,
    createdAt: '2025-02-19T09:40:00',
    modifiedAt: '2025-02-19T14:10:00',
  },
  {
    taskId: 111,
    title: '예외 처리 공통화',
    link: 'https://example.com/error',
    memo: 'global handler',
    status: false,
    inout: true,
    createdAt: '2025-12-20T10:00:00',
    modifiedAt: '2025-12-20T10:00:00',
  },
  {
    taskId: 112,
    title: '로그 설정',
    link: null,
    memo: null,
    status: true,
    inout: false,
    createdAt: '2025-12-20T10:00:00',
    modifiedAt: '2025-12-20T10:00:00',
  },
  {
    taskId: 113,
    title: '환경변수 분리',
    link: null,
    memo: '.env 사용',
    status: false,
    inout: true,
    createdAt: '2025-12-20T10:00:00',
    modifiedAt: '2025-12-20T10:00:00',
  },
  {
    taskId: 114,
    title: 'Swagger 문서화',
    link: 'https://example.com/swagger',
    memo: null,
    status: true,
    inout: false,
    createdAt: '2025-02-23T14:00:00',
    modifiedAt: '2025-02-24T10:30:00',
  },
  {
    taskId: 115,
    title: '단위 테스트 작성',
    link: null,
    memo: 'service 중심',
    status: false,
    inout: true,
    createdAt: '2025-02-24T15:40:00',
    modifiedAt: '2025-02-24T15:40:00',
  },
  {
    taskId: 116,
    title: '통합 테스트',
    link: 'https://example.com/test',
    memo: null,
    status: true,
    inout: false,
    createdAt: '2025-02-25T11:10:00',
    modifiedAt: '2025-02-26T09:55:00',
  },
  {
    taskId: 117,
    title: 'CI 파이프라인 구성',
    link: null,
    memo: 'GitHub Actions',
    status: false,
    inout: true,
    createdAt: '2025-02-26T16:30:00',
    modifiedAt: '2025-02-26T16:30:00',
  },
  {
    taskId: 118,
    title: 'CD 설정',
    link: 'https://example.com/cd',
    memo: null,
    status: true,
    inout: false,
    createdAt: '2025-02-27T10:00:00',
    modifiedAt: '2025-02-28T13:20:00',
  },
  {
    taskId: 119,
    title: '배포 스크립트 작성',
    link: null,
    memo: 'rollback 고려',
    status: false,
    inout: true,
    createdAt: '2025-02-28T15:00:00',
    modifiedAt: '2025-02-28T15:00:00',
  },
  {
    taskId: 120,
    title: '운영 서버 모니터링',
    link: 'https://example.com/monitoring',
    memo: null,
    status: true,
    inout: false,
    createdAt: '2025-03-01T09:30:00',
    modifiedAt: '2025-03-02T11:45:00',
  },
];

// TODO 임시 데이터 (나중에 실제 데이터로 교체)
const archiveData = {
  title: '최대 19글자 오육칠팔구십일이삼사오육칠팔구십십일ㄴㅇㄹㄴㅇㄹ',
  category: '맛집',
  categoryIcon: restaurantIcon,
  todoCount: MOCK_TASK_ITEM.filter((link) => !link.status).length,
};

const ArchiveDetailPage = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<TabType>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [isTitleVisible, setIsTitleVisible] = useState(true);
  const [isOptionMenuOpen, setIsOptionMenuOpen] = useState(false);
  const titleSectionRef = useRef<HTMLDivElement>(null);

  // 나중에 API로 데이터 받을 예정이면
  const [taskList, setTaskList] = useState<Task[]>([]);

  // TODO API 호출 값 받아오기
  useEffect(() => {
    // API 호출 시 그대로 사용
    setTaskList(MOCK_TASK_ITEM);
  }, []);

  const [linkStates, setLinkStates] = useState<Record<number, boolean>>(
    MOCK_TASK_ITEM.reduce(
      (acc, link) => ({ ...acc, [link.taskId]: link.status }),
      {}
    )
  );
  const [linkEditModes, setLinkEditModes] = useState<Record<number, boolean>>(
    MOCK_TASK_ITEM.reduce((acc, link) => ({ ...acc, [link.taskId]: false }), {})
  );

  const handleLinkCheck = (id: number, checked: boolean) => {
    setLinkStates((prev) => ({ ...prev, [id]: checked }));
  };

  const handleEditModeChange = (id: number, isEditMode: boolean) => {
    setLinkEditModes((prev) => ({ ...prev, [id]: isEditMode }));
  };

  const handleTabChange = (next: TabKey) => {
    navigate(TAB_ROUTE_MAP[next]);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSearch = () => {
    // 검색 기능 구현
    console.log('검색');
  };

  const handleOption = () => {
    setIsOptionMenuOpen((prev) => !prev);
  };

  const handleOptionSelect = (key: string) => {
    if (key === 'edit') {
      console.log('모음 수정');
      // TODO: 모음 수정 로직 구현
    } else if (key === 'delete') {
      console.log('모음 삭제');
      // TODO: 모음 삭제 로직 구현
    }
    setIsOptionMenuOpen(false);
  };

  const handleFloatingButtonClick = () => {
    // 할일 추가로 이동 route
    console.log('할일 추가로 이동 route');
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortOption(newSort);
  };

  const handleContentTabChange = (tab: string) => {
    setSelectedTab(tab as TabType);
  };

  const handleSortChangeString = (value: string) => {
    handleSortChange(value as SortOption);
  };

  // 큰 제목 섹션의 표시 여부를 감지
  useEffect(() => {
    const titleElement = titleSectionRef.current;

    if (!titleElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsTitleVisible(entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '0px 0px 0px 0px',
      }
    );

    observer.observe(titleElement);

    return () => {
      if (titleElement) {
        observer.unobserve(titleElement);
      }
    };
  }, []);

  // createdAt별로 링크를 필터링, 정렬, 그룹화
  const groupedLinks = useMemo(() => {
    // 1. 필터링
    let filtered: Task[];
    switch (selectedTab) {
      case 'all':
        filtered = taskList;
        break;
      case 'incomplete':
        filtered = taskList.filter((task) => !task.status);
        break;
      case 'complete':
        filtered = taskList.filter((task) => task.status);
        break;
      default:
        filtered = taskList;
    }

    const grouped = new Map<string, Task[]>();

    filtered.forEach((link) => {
      const key = link.createdAt;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(link);
    });

    const result = Array.from(grouped.entries()).sort(([aKey], [bKey]) => {
      return sortOption === 'newest'
        ? Number(bKey) - Number(aKey)
        : Number(aKey) - Number(bKey);
    });

    return result;
  }, [taskList, selectedTab, sortOption]);

  const hasData = groupedLinks.length > 0;

  return (
    <div className='relative flex min-h-screen flex-col bg-grey-50'>
      {/* 상단 앱바 - 고정 */}
      {/* TODO  BackDetailBar 고정 수정*/}
      <div className='sticky left-0 right-0 top-0 z-10 w-full'>
        <BackDetailBar
          title={isTitleVisible ? '모음 상세' : archiveData.title}
          rightIcons={['search', 'option']}
          onClickBack={handleBack}
          onClickSearch={handleSearch}
          onClickOption={handleOption}
        />
      </div>

      {/* 옵션 메뉴 */}
      {isOptionMenuOpen && (
        <>
          <div
            className='fixed inset-0 z-modal-overlay'
            onClick={() => setIsOptionMenuOpen(false)}
          />
          <div className='fixed right-5 top-14 z-modal-content'>
            <OptionMenu onSelect={handleOptionSelect} />
          </div>
        </>
      )}

      {/* 제목 및 정보 영역 */}
      <div ref={titleSectionRef} className='bg-white pb-4 pt-6'>
        {/* 제목 */}
        <div className='px-5'>
          <h1 className='truncate text-heading-lg text-grey-900'>
            {archiveData.title}
          </h1>
        </div>

        {/* 카테고리 및 할일 정보 */}
        <div className='flex items-center gap-2 px-5'>
          <div className='flex items-center gap-1'>
            <img
              src={archiveData.categoryIcon}
              alt=''
              className='size-4 shrink-0'
            />
            <span className='text-body-lg text-grey-700'>
              {archiveData.category}
            </span>
          </div>
          <div className='flex items-center gap-1'>
            <img src={todoIcon} alt='' className='size-4 shrink-0' />
            <span className='text-body-lg text-grey-700'>
              {archiveData.todoCount}개
            </span>
          </div>
        </div>
      </div>

      {/* 탭 및 정렬 */}
      <StickyTabSection
        tabs={TAB_OPTIONS}
        selectedTab={selectedTab}
        onTabChange={handleContentTabChange}
        sortOptions={SORT_OPTIONS}
        sortValue={sortOption}
        onSortChange={handleSortChangeString}
      />

      {/* 메인 콘텐츠 */}
      <main className='grow px-5 py-8'>
        {!hasData ? (
          <div className='flex min-h-[400px] items-center justify-center'>
            <EmptyNotice
              title='저장할 링크를 추가해주세요'
              subtitle='우측 하단 검정색 + 버튼으로 추가할 수 있어요'
            />
          </div>
        ) : (
          <div className='space-y-3'>
            {groupedLinks.map(([dateKey, tasks], index) => (
              <SwipeableDeleteCard
                key={`${dateKey}-${index}`}
                tasks={tasks}
                createdAt={new Date(tasks[0].createdAt)}
                linkStates={linkStates}
                linkEditModes={linkEditModes}
                onCheck={handleLinkCheck}
                onEditModeChange={(isEditMode) => {
                  tasks.forEach((task) => {
                    handleEditModeChange(task.taskId, isEditMode);
                  });
                }}
                onOriginalClick={(taskId) => {
                  const task = tasks.find((t) => t.taskId === taskId);
                  if (task && task.link) {
                    console.log('원본 클릭:', task.title);
                    window.open(task.link, '_blank');
                  }
                }}
                onShareClick={(taskId) => {
                  const task = tasks.find((t) => t.taskId === taskId);
                  if (task) {
                    console.log('공유 클릭:', task.title);
                    alert(`${task.title} 공유하기`);
                  }
                }}
                onEditClick={(taskId) => {
                  const task = tasks.find((t) => t.taskId === taskId);
                  if (task) {
                    console.log('편집 클릭:', task.title);
                    alert(`${task.title} 편집하기`);
                  }
                }}
                onDeleteClick={(taskId) => {
                  const task = tasks.find((t) => t.taskId === taskId);
                  if (task) {
                    console.log('삭제 클릭:', task.title);
                    if (confirm(`${task.title}을(를) 삭제하시겠습니까?`)) {
                      alert('삭제됨');
                    }
                  }
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* TODO  플로팅 전역으로 수정*/}
      {/* 플로팅 버튼 */}
      <FloatingButton
        onClick={handleFloatingButtonClick}
        className='fixed bottom-[120px] right-5'
      />

      {/* 하단 탭바 */}
      {/* TODO  탭바 Approuter로 분리 */}
      <footer className='sticky bottom-0 bg-white shadow-[0_-5px_10px_rgba(0,0,0,0.05)]'>
        <TabBar.BottomTabBar value='archive' onChange={handleTabChange} />
      </footer>
    </div>
  );
};

export default ArchiveDetailPage;
