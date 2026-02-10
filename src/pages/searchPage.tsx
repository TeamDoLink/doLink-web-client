import { useState, useEffect } from 'react';
import backIcon from '@/assets/icons/common/back.svg';
import searchIcon from '@/assets/icons/common/search-24.svg';
import { ClearableSearchInputField } from '@/components/common/inputField';
import { ArchiveSearchItem, TaskSearchItem } from '@/components/common/list';
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

interface SearchResult {
  tasks: Task[];
  archives: Archive[];
}

// Mock API
const MOCK_IMG =
  'https://item.kakaocdn.net/do/9d272c87ee51db09570db3d980fc2a124022de826f725e10df604bf1b9725cfd';
const MOCK_IMG_2 =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi_8McCQneFJHdHmzTsFcZSh3MaTqBf2Q9rw&s';

//   TODO 실제 API 연동 시 대체 필요
const mockSearchAPI = async (query: string): Promise<SearchResult> =>
  new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          tasks: [
            {
              id: 1,
              title: '도쿄 디즈니랜드 완벽 가이드',
              subtitle: '1일 전 · 인스타그램 (Instagram)',
              thumbnail: MOCK_IMG,
              isCompleted: true,
            },
            {
              id: 2,
              title: '도쿄 맛집 추천 리스트',
              subtitle: '2일 전 · 네이버 블로그',
              thumbnail: MOCK_IMG,
              isCompleted: false,
            },
            {
              id: 3,
              title: '서울 카페 투어',
              subtitle: '3일 전 · 카카오톡',
              thumbnail: '',
              isCompleted: true,
            },
          ],
          archives: [
            {
              id: 1,
              title: '2025 연말 도쿄 여행',
              category: '여행',
              itemCount: 4,
              images: [MOCK_IMG, MOCK_IMG_2, MOCK_IMG, MOCK_IMG_2],
            },
            {
              id: 2,
              title: '서울 맛집 탐방',
              category: '음식점',
              itemCount: 8,
              images: [MOCK_IMG, MOCK_IMG_2],
            },
          ],
        }),
      300
    );
  });

// Sub Component
const SearchResults = ({
  tasks,
  archives,
  searchQuery,
}: {
  tasks: Task[];
  archives: Archive[];
  searchQuery: string;
}) => (
  <div className='flex flex-1 flex-col gap-6 px-5 py-6'>
    {tasks.length > 0 && (
      <section className='flex flex-col gap-4'>
        <h2 className='text-body-lg text-grey-600'>할 일</h2>
        <div className='flex flex-col gap-3'>
          {tasks.map((task) => (
            <TaskSearchItem key={task.id} {...task} searchQuery={searchQuery} />
          ))}
        </div>
      </section>
    )}

    {archives.length > 0 && (
      <section className='flex flex-col gap-4'>
        <h2 className='text-body-lg text-grey-600'>모음</h2>
        <div className='flex flex-col gap-3'>
          {archives.map((archive) => (
            <ArchiveSearchItem
              key={archive.id}
              {...archive}
              searchQuery={searchQuery}
            />
          ))}
        </div>
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 디바운싱: 검색어 입력이 300ms 동안 없으면 실제 검색 수행
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 디바운싱된 쿼리로 API 요청
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setTasks([]);
        setArchives([]);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await mockSearchAPI(debouncedQuery);
        setTasks(result.tasks);
        setArchives(result.archives);
      } catch {
        setError('검색 결과를 불러오는 중 오류가 발생했습니다.');
        setTasks([]);
        setArchives([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

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

      {!isLoading && !error && hasResults && (
        // TODO UI  test위해 임시로 필터링 해놓음 백엔드와 연동 시 제거 필요
        <SearchResults
          tasks={tasks.filter((task) => task.title.includes(searchQuery))}
          archives={archives.filter((archive) =>
            archive.title.includes(searchQuery)
          )}
          searchQuery={searchQuery}
        />
      )}

      {!isLoading && !error && !hasResults && (
        <div className='flex flex-1 flex-col items-center justify-center'>
          <EmptyNotice title={'검색 결과가 없어요.'} subtitle='' />
        </div>
      )}
    </div>
  );
};

export default SearchPage;
