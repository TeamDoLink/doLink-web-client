import { useState, useEffect, useCallback } from 'react';
import backIcon from '@/assets/icons/common/back.svg';
import searchIcon from '@/assets/icons/common/search-24.svg';
import { ClearableSearchInputField } from '@/components/common/inputField';
import { ArchiveSearchItem, TaskSearchItem } from '@/components/common/list';
import { InfiniteScroll } from '@/components/common/infiniteScroll/infiniteScroll';
import EmptyNotice from '@/components/common/feedBack/emptyNotice';

// Types
interface Task {
  id: number;
  title: string;
  subtitle: string;
  thumbnail?: string;
  isCompleted: boolean;
}

interface Archive {
  id: number;
  title: string;
  category: string;
  itemCount: number;
  images: string[];
}

interface PagedTaskResult {
  tasks: Task[];
  hasMore: boolean;
}

interface PagedArchiveResult {
  archives: Archive[];
  hasMore: boolean;
}

// Mock API
const MOCK_IMG =
  'https://item.kakaocdn.net/do/9d272c87ee51db09570db3d980fc2a124022de826f725e10df604bf1b9725cfd';
const MOCK_IMG_2 =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi_8McCQneFJHdHmzTsFcZSh3MaTqBf2Q9rw&s';

// Mock 데이터 생성 (각각 30개)
const generateMockTasks = (count: number): Task[] => {
  const titles = [
    '도쿄 디즈니랜드 완벽 가이드',
    '도쿄 맛집 추천 리스트',
    '서울 카페 투어',
    '부산 여행 계획',
    '제주도 숨은 명소',
    '일본 여행 준비물',
    '맛집 리스트 정리',
    '주말 나들이 코스',
  ];
  const sources = [
    '인스타그램 (Instagram)',
    '네이버 블로그',
    '카카오톡',
    '유튜브',
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `${titles[i % titles.length]} ${i + 1}`,
    subtitle: `${i + 1}일 전 · ${sources[i % sources.length]}`,
    thumbnail: i % 3 === 0 ? '' : MOCK_IMG,
    isCompleted: i % 2 === 0,
  }));
};

const generateMockArchives = (count: number): Archive[] => {
  const titles = [
    '2025 연말 도쿄 여행',
    '서울 맛집 탐방',
    '제주도 힐링 여행',
    '부산 카페 투어',
    '일본 쇼핑 리스트',
  ];
  const categories = ['여행', '음식점', '취미', '쇼핑', '기타'];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `${titles[i % titles.length]} ${i + 1}`,
    category: categories[i % categories.length],
    itemCount: (i % 10) + 1,
    images:
      i % 2 === 0
        ? [MOCK_IMG, MOCK_IMG_2, MOCK_IMG, MOCK_IMG_2]
        : [MOCK_IMG, MOCK_IMG_2],
  }));
};

const ALL_MOCK_TASKS = generateMockTasks(30);
const ALL_MOCK_ARCHIVES = generateMockArchives(30);

// 할 일 검색 API
const mockSearchTasks = async (
  query: string,
  page: number,
  pageSize: number = 10
): Promise<PagedTaskResult> =>
  new Promise((resolve) => {
    setTimeout(() => {
      const filteredTasks = query.trim()
        ? ALL_MOCK_TASKS.filter((task) => task.title.includes(query))
        : ALL_MOCK_TASKS;

      const start = page * pageSize;
      const end = start + pageSize;
      const tasks = filteredTasks.slice(start, end);

      resolve({
        tasks,
        hasMore: end < filteredTasks.length,
      });
    }, 300);
  });

// 모음 검색 API
const mockSearchArchives = async (
  query: string,
  page: number,
  pageSize: number = 10
): Promise<PagedArchiveResult> =>
  new Promise((resolve) => {
    setTimeout(() => {
      const filteredArchives = query.trim()
        ? ALL_MOCK_ARCHIVES.filter((archive) => archive.title.includes(query))
        : ALL_MOCK_ARCHIVES;

      const start = page * pageSize;
      const end = start + pageSize;
      const archives = filteredArchives.slice(start, end);

      resolve({
        archives,
        hasMore: end < filteredArchives.length,
      });
    }, 300);
  });

// Sub Component
const SearchResults = ({
  tasks,
  archives,
  searchQuery,
  onLoadMoreTasks,
  onLoadMoreArchives,
  hasMoreTasks,
  hasMoreArchives,
  isFetchingMoreTasks,
  isFetchingMoreArchives,
}: {
  tasks: Task[];
  archives: Archive[];
  searchQuery: string;
  onLoadMoreTasks: () => void;
  onLoadMoreArchives: () => void;
  hasMoreTasks: boolean;
  hasMoreArchives: boolean;
  isFetchingMoreTasks: boolean;
  isFetchingMoreArchives: boolean;
}) => (
  <div className='flex flex-1 flex-col px-5 py-6'>
    {tasks.length > 0 && (
      <section className='flex flex-col gap-4'>
        <h2 className='text-body-lg text-grey-600'>할 일</h2>
        <InfiniteScroll<Task>
          items={tasks}
          keyExtractor={(task: Task) => task.id.toString()}
          renderItem={(task: Task) => (
            <TaskSearchItem {...task} searchQuery={searchQuery} />
          )}
          onLoadMore={onLoadMoreTasks}
          hasNextPage={hasMoreTasks}
          isFetchingNextPage={isFetchingMoreTasks}
          loadingMessage='할 일을 더 불러오는 중입니다'
          emptyMessage='할 일이 없습니다'
          className='flex flex-col gap-3'
        />
      </section>
    )}

    {archives.length > 0 && (
      <section className='flex flex-col gap-4'>
        <h2 className='text-body-lg text-grey-600'>모음</h2>
        <InfiniteScroll<Archive>
          items={archives}
          keyExtractor={(archive: Archive) => archive.id.toString()}
          renderItem={(archive: Archive) => (
            <ArchiveSearchItem {...archive} searchQuery={searchQuery} />
          )}
          onLoadMore={onLoadMoreArchives}
          hasNextPage={hasMoreArchives}
          isFetchingNextPage={isFetchingMoreArchives}
          loadingMessage='모음을 더 불러오는 중입니다'
          emptyMessage='모음이 없습니다'
          className='flex flex-col gap-3'
        />
      </section>
    )}
  </div>
);

// Main Component
const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [archives, setArchives] = useState<Archive[]>([]);
  const [taskPage, setTaskPage] = useState(0);
  const [archivePage, setArchivePage] = useState(0);
  const [hasMoreTasks, setHasMoreTasks] = useState(false);
  const [hasMoreArchives, setHasMoreArchives] = useState(false);
  const [isFetchingMoreTasks, setIsFetchingMoreTasks] = useState(false);
  const [isFetchingMoreArchives, setIsFetchingMoreArchives] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 디바운싱: 검색어 입력이 300ms 동안 없으면 실제 검색 수행
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 디바운싱된 쿼리로 API 요청 (초기 검색)
  useEffect(() => {
    let alive = true;

    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setTasks([]);
        setArchives([]);
        setTaskPage(0);
        setArchivePage(0);
        setHasMoreTasks(false);
        setHasMoreArchives(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      setTaskPage(0);
      setArchivePage(0);

      try {
        // 병렬 호출
        const [taskResult, archiveResult] = await Promise.all([
          mockSearchTasks(debouncedQuery, 0, 10),
          mockSearchArchives(debouncedQuery, 0, 10),
        ]);

        if (!alive) return;

        setTasks(taskResult.tasks);
        setArchives(archiveResult.archives);
        setHasMoreTasks(taskResult.hasMore);
        setHasMoreArchives(archiveResult.hasMore);
      } catch {
        if (!alive) return;
        setError('검색 결과를 불러오는 중 오류가 발생했습니다.');
        setTasks([]);
        setArchives([]);
        setHasMoreTasks(false);
        setHasMoreArchives(false);
      } finally {
        if (alive) {
          setIsLoading(false);
        }
      }
    };

    fetchResults();

    return () => {
      alive = false;
    };
  }, [debouncedQuery]);

  // 할 일 더 불러오기
  const handleLoadMoreTasks = useCallback(async () => {
    if (!debouncedQuery.trim()) return;
    if (isFetchingMoreTasks || !hasMoreTasks) return;

    const querySnapshot = debouncedQuery; // 스냅샷

    setIsFetchingMoreTasks(true);
    try {
      const nextPage = taskPage + 1;
      const res = await mockSearchTasks(querySnapshot, nextPage, 10);

      // 검색어가 바뀌었으면 append 금지
      if (querySnapshot !== debouncedQuery) return;

      setTasks((prev) => [...prev, ...res.tasks]);
      setTaskPage(nextPage);
      setHasMoreTasks(res.hasMore);
    } catch {
      setError('할 일을 더 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsFetchingMoreTasks(false);
    }
  }, [debouncedQuery, isFetchingMoreTasks, hasMoreTasks, taskPage]);

  // 모음 더 불러오기
  const handleLoadMoreArchives = useCallback(async () => {
    if (!debouncedQuery.trim()) return;
    if (isFetchingMoreArchives || !hasMoreArchives) return;

    const querySnapshot = debouncedQuery; // 스냅샷

    setIsFetchingMoreArchives(true);
    try {
      const nextPage = archivePage + 1;
      const res = await mockSearchArchives(querySnapshot, nextPage, 10);

      // 검색어가 바뀌었으면 append 금지
      if (querySnapshot !== debouncedQuery) return;

      setArchives((prev) => [...prev, ...res.archives]);
      setArchivePage(nextPage);
      setHasMoreArchives(res.hasMore);
    } catch {
      setError('모음을 더 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsFetchingMoreArchives(false);
    }
  }, [debouncedQuery, isFetchingMoreArchives, hasMoreArchives, archivePage]);

  const hasResults = tasks.length > 0 || archives.length > 0;

  return (
    <div className='flex min-h-screen flex-col bg-white'>
      {/* Header */}
      <header className='flex h-14 w-full items-center gap-2 bg-white px-3'>
        <button
          type='button'
          onClick={() => window.history.back()}
          className='flex h-9 w-9 shrink-0 items-center justify-center'
          aria-label='뒤로가기'
        >
          <img src={backIcon} alt='' className='h-6 w-6' />
        </button>
        <ClearableSearchInputField
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder='모음, 할 일을 검색해 주세요'
          leadingIcon={<img src={searchIcon} alt='' className='h-5 w-5' />}
          width='w-full'
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.blur(); // 키보드 enter 처리
            }
          }}
        />
      </header>

      {/* Content */}
      {/* 임시 로딩 화면 */}
      {isLoading && (
        <div className='flex flex-1 items-center justify-center'>
          <p className='text-body-lg text-grey-600'>검색 중...</p>
        </div>
      )}
      {error && (
        <div className='flex flex-1 flex-col items-center justify-center'>
          <EmptyNotice title='오류가 발생했습니다.' subtitle={error} />
        </div>
      )}

      {!isLoading && !error && debouncedQuery.trim() && hasResults && (
        <SearchResults
          tasks={tasks}
          archives={archives}
          searchQuery={searchQuery}
          onLoadMoreTasks={handleLoadMoreTasks}
          onLoadMoreArchives={handleLoadMoreArchives}
          hasMoreTasks={hasMoreTasks}
          hasMoreArchives={hasMoreArchives}
          isFetchingMoreTasks={isFetchingMoreTasks}
          isFetchingMoreArchives={isFetchingMoreArchives}
        />
      )}

      {!isLoading && !error && (!debouncedQuery.trim() || !hasResults) && (
        <div className='flex flex-1 flex-col items-center justify-center'>
          <EmptyNotice title={'검색 결과가 없어요.'} subtitle='' />
        </div>
      )}
    </div>
  );
};

export default SearchPage;
