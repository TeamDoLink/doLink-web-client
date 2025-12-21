import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackDetailBar } from '@/components/common/appBar';
import { EmptyNotice } from '@/components/common/feedBack';
import { TabButton } from '@/components/common/button/tabButton';
import { FloatingButton } from '@/components/common/button/floatingButton';
import { TabBar } from '@/components/common';
import SortDropdown from '@/components/common/filter/sortDropdown';
import type { TabKey } from '@/components/common/tabBar/bottomTabBar';
import { ROUTES } from '@/constants/routes';

// 카테고리 아이콘 임포트
// TODO 임시 - 카테고리에 맞게 수정 예정
import restaurantIcon from '@/assets/icons/category/detail/restaurant.svg';
import todoIcon from '@/assets/icons/category/detail/todo.svg';

type TabType = 'all' | 'incomplete' | 'complete';
type SortOption = 'newest' | 'oldest';

// 링크 데이터 타입 정의
type LinkData = {
  id: number;
  title: string;
  url: string;
  completed: boolean;
  createdAt: Date;
};

const TAB_ROUTE_MAP: Record<TabKey, string> = {
  home: ROUTES.home,
  archive: ROUTES.archives,
  setting: ROUTES.settings,
};

const SORT_OPTIONS = [
  { value: 'newest', label: '최신 순' },
  { value: 'oldest', label: '오래된 순' },
];

// TODO 임시 데이터 - 실제 API 데이터로 교체 예정
const MOCK_LINKS: LinkData[] = [
  {
    id: 1,
    title: '서울 맛집 1',
    url: 'https://example.com/1',
    completed: false,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 2,
    title: '서울 맛집 2',
    url: 'https://example.com/2',
    completed: true,
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 3,
    title: '서울 맛집 3',
    url: 'https://example.com/3',
    completed: false,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 4,
    title: '서울 맛집 4',
    url: 'https://example.com/4',
    completed: true,
    createdAt: new Date('2024-01-25'),
  },
  {
    id: 5,
    title: '서울 맛집 5',
    url: 'https://example.com/5',
    completed: false,
    createdAt: new Date('2024-01-18'),
  },
];

const ArchiveDetailPage = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<TabType>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  // TODO 임시 데이터 (나중에 실제 데이터로 교체)
  const archiveData = {
    title: '최대 19글자 오육칠팔구십일이삼사오육칠',
    category: '맛집',
    categoryIcon: restaurantIcon,
    todoCount: MOCK_LINKS.filter((link) => !link.completed).length,
  };

  // 실제 링크 데이터
  const [links] = useState<LinkData[]>(MOCK_LINKS);

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
    // 옵션 메뉴 구현
    console.log('옵션');
  };

  const handleFloatingButtonClick = () => {
    // 링크 추가 기능 구현
    console.log('링크 추가');
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortOption(newSort);
  };

  // 탭에 따른 링크 필터링 및 정렬
  const getFilteredAndSortedLinks = () => {
    // 1. 탭에 따른 필터링
    let filtered: LinkData[];
    switch (selectedTab) {
      case 'all':
        filtered = links;
        break;
      case 'incomplete':
        filtered = links.filter((link) => !link.completed);
        break;
      case 'complete':
        filtered = links.filter((link) => link.completed);
        break;
      default:
        filtered = links;
    }

    // 2. 정렬 옵션에 따른 정렬
    const sorted = [...filtered].sort((a, b) => {
      if (sortOption === 'newest') {
        // 최신 순: 날짜가 최근인 것이 앞으로
        return b.createdAt.getTime() - a.createdAt.getTime();
      } else {
        // 오래된 순: 날짜가 오래된 것이 앞으로
        return a.createdAt.getTime() - b.createdAt.getTime();
      }
    });

    return sorted;
  };

  const filteredLinks = getFilteredAndSortedLinks();
  const hasData = filteredLinks.length > 0;

  return (
    <div className='relative flex min-h-screen flex-col bg-grey-50'>
      {/* 상단 앱바 - 고정 */}
      {/* TODO  BackDetailBar 고정 수정*/}
      <div className='sticky left-0 right-0 top-0 z-10 w-full'>
        <BackDetailBar
          title='모음 상세'
          rightIcons={['search', 'option']}
          onClickBack={handleBack}
          onClickSearch={handleSearch}
          onClickOption={handleOption}
        />
      </div>

      {/* 제목 및 정보 영역 */}
      <div className='bg-white pb-0'>
        {/* 제목 */}
        <div className='px-5 pb-4'>
          <h1 className='text-heading-lg text-grey-900'>{archiveData.title}</h1>
        </div>

        {/* 카테고리 및 할일 정보 */}
        <div className='flex items-center gap-2 px-5 pb-4'>
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

        {/* 탭 및 정렬 */}
        <div className='flex items-center justify-between border-b border-grey-200 px-5 pb-2'>
          <div className='flex items-center gap-5'>
            <TabButton
              selected={selectedTab === 'all'}
              onClick={() => setSelectedTab('all')}
            >
              전체
            </TabButton>
            <TabButton
              selected={selectedTab === 'incomplete'}
              onClick={() => setSelectedTab('incomplete')}
            >
              미완료
            </TabButton>
            <TabButton
              selected={selectedTab === 'complete'}
              onClick={() => setSelectedTab('complete')}
            >
              완료
            </TabButton>
          </div>
          <SortDropdown
            value={sortOption}
            onChange={handleSortChange}
            options={SORT_OPTIONS}
          />
        </div>
      </div>

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
            {filteredLinks.map((link) => (
              <div key={link.id} className='rounded-lg bg-white p-4 shadow-sm'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <h3 className='text-body-md font-semibold text-grey-900'>
                      {link.title}
                    </h3>
                    <p className='mt-1 text-caption-sm text-grey-500'>
                      {link.url}
                    </p>
                    <p className='mt-2 text-caption-sm text-grey-400'>
                      {link.createdAt.toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <div className='ml-4'>
                    <span
                      className={`rounded-full px-3 py-1 text-caption-sm ${
                        link.completed
                          ? 'bg-point/10 text-point'
                          : 'bg-grey-100 text-grey-600'
                      }`}
                    >
                      {link.completed ? '완료' : '미완료'}
                    </span>
                  </div>
                </div>
              </div>
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
