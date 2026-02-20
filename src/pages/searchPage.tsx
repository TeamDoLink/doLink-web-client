import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import backIcon from '@/assets/icons/common/back.svg';
import searchIcon from '@/assets/icons/common/search-24.svg';
import { ClearableSearchInputField } from '@/components/common/inputField';
import { ArchiveSearchItem, TaskSearchItem } from '@/components/common/list';
import { InfiniteScroll } from '@/components/common/infiniteScroll/infiniteScroll';
import EmptyNotice from '@/components/common/feedBack/emptyNotice';
import { formatRelativeDateLabel } from '@/utils/date';
import { customInstance } from '@/api/axios-instance';
import { ROUTES } from '@/constants/routes';
import {
  getSearchTasksUrl,
  getSearchCollectionsUrl,
} from '@/api/generated/endpoints/search/search';
import type {
  ApiResponseSliceTaskResponse,
  ApiResponseSliceCollectionResponse,
  TaskResponse,
  CollectionResponse,
  SearchTasksParams,
  SearchCollectionsParams,
} from '@/api/generated/models';

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
const PAGE_SIZE = 10;

const extractDomain = (url: string | undefined | null): string => {
  if (!url) return '';
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return '';
  }
};

const mapTaskResponseToTask = (task: TaskResponse): Task => {
  const relative = task.createdAt
    ? formatRelativeDateLabel(task.createdAt)
    : '';
  const domain = extractDomain(task.link);
  const subtitleParts = [] as string[];

  if (relative) subtitleParts.push(relative);
  if (domain) subtitleParts.push(domain);

  return {
    id: task.taskId ?? 0,
    title: task.title ?? '',
    subtitle: subtitleParts.join(' · '),
    thumbnail: task.thumbnailUrl ?? '',
    isCompleted: task.status ?? false,
  };
};

const mapCollectionResponseToArchive = (
  collection: CollectionResponse
): Archive => {
  return {
    id: collection.collectionId ?? 0,
    title: collection.name ?? '',
    category: collection.category ?? '',
    itemCount: collection.taskCount ?? 0,
    images: Array.isArray(collection.thumbnails)
      ? collection.thumbnails.slice(0, 4)
      : [],
  };
};

// 할 일 검색 API
const searchTasksFromApi = async (
  query: string,
  page: number,
  pageSize: number = PAGE_SIZE
): Promise<PagedTaskResult> => {
  const params: SearchTasksParams = {
    keyword: query,
    page,
    size: pageSize,
  };

  const response = await customInstance<ApiResponseSliceTaskResponse>(
    getSearchTasksUrl(params),
    { method: 'GET' }
  );

  const slice = response.result;
  const content = slice?.content ?? [];

  return {
    tasks: content.map(mapTaskResponseToTask),
    hasMore: !(slice?.last ?? true),
  };
};

// 모음 검색 API
const searchArchivesFromApi = async (
  query: string,
  page: number,
  pageSize: number = PAGE_SIZE
): Promise<PagedArchiveResult> => {
  const params: SearchCollectionsParams = {
    keyword: query,
    page,
    size: pageSize,
  };

  const response = await customInstance<ApiResponseSliceCollectionResponse>(
    getSearchCollectionsUrl(params),
    { method: 'GET' }
  );

  const apiResponse = response as ApiResponseSliceCollectionResponse;
  const slice = apiResponse.result;
  const content = slice?.content ?? [];

  return {
    archives: content.map(mapCollectionResponseToArchive),
    hasMore: !(slice?.last ?? true),
  };
};

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
  onTaskClick,
  onArchiveClick,
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
  onTaskClick: (taskId: number) => void;
  onArchiveClick: (archiveId: number) => void;
}) => (
  <div className='flex flex-1 flex-col px-5 py-6'>
    {tasks.length > 0 && (
      <section className='flex flex-col gap-4'>
        <h2 className='text-body-lg text-grey-600'>할 일</h2>
        <InfiniteScroll<Task>
          items={tasks}
          keyExtractor={(task: Task) => task.id.toString()}
          renderItem={(task: Task) => (
            <TaskSearchItem
              {...task}
              searchQuery={searchQuery}
              onClick={() => onTaskClick(task.id)}
            />
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
            <ArchiveSearchItem
              {...archive}
              searchQuery={searchQuery}
              onClick={() => onArchiveClick(archive.id)}
            />
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
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // 디바운싱: 검색어 입력이 300ms 동안 없으면 실제 검색 수행
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);
  // React Query: 할 일 검색 (무한스크롤)
  const {
    data: taskData,
    fetchNextPage: fetchNextTaskPage,
    hasNextPage: hasMoreTasks,
    isFetchingNextPage: isFetchingMoreTasks,
    isLoading: isLoadingTasks,
    error: taskError,
  } = useInfiniteQuery<PagedTaskResult>({
    queryKey: ['searchTasks', debouncedQuery],
    queryFn: ({ pageParam = 0 }) =>
      searchTasksFromApi(debouncedQuery, pageParam as number, PAGE_SIZE),
    enabled: !!debouncedQuery.trim(),
    initialPageParam: 0,
    getNextPageParam: (
      lastPage: PagedTaskResult,
      allPages: PagedTaskResult[]
    ) => (lastPage.hasMore ? allPages.length : undefined),
  });

  // React Query: 모음 검색 (무한스크롤)
  const {
    data: archiveData,
    fetchNextPage: fetchNextArchivePage,
    hasNextPage: hasMoreArchives,
    isFetchingNextPage: isFetchingMoreArchives,
    isLoading: isLoadingArchives,
    error: archiveError,
  } = useInfiniteQuery<PagedArchiveResult>({
    queryKey: ['searchArchives', debouncedQuery],
    queryFn: ({ pageParam = 0 }) =>
      searchArchivesFromApi(debouncedQuery, pageParam as number, PAGE_SIZE),
    enabled: !!debouncedQuery.trim(),
    initialPageParam: 0,
    getNextPageParam: (
      lastPage: PagedArchiveResult,
      allPages: PagedArchiveResult[]
    ) => (lastPage.hasMore ? allPages.length : undefined),
  });

  const tasks = taskData?.pages.flatMap((page) => page.tasks) ?? [];
  const archives = archiveData?.pages.flatMap((page) => page.archives) ?? [];
  const isLoading = isLoadingTasks || isLoadingArchives;
  const error = taskError || archiveError;

  const handleLoadMoreTasks = () => {
    if (hasMoreTasks && !isFetchingMoreTasks) {
      fetchNextTaskPage();
    }
  };

  const handleLoadMoreArchives = () => {
    if (hasMoreArchives && !isFetchingMoreArchives) {
      fetchNextArchivePage();
    }
  };

  const handleTaskClick = (taskId: number) => {
    navigate(`${ROUTES.taskDetail}/${taskId}`);
  };

  const handleArchiveClick = (archiveId: number) => {
    navigate(`${ROUTES.archiveDetail}/${archiveId}`);
  };

  const hasResults = tasks.length > 0 || archives.length > 0;

  return (
    <div className='flex min-h-screen flex-col bg-white'>
      {/* Header */}
      <header className='fixed left-0 right-0 top-0 z-50 flex h-14 w-full items-center gap-2 bg-white py-1.5 pl-3 pr-5'>
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

      {/* Content - 헤더 높이만큼 패딩 추가 */}
      <div className='pt-14'>
        {/* 임시 로딩 화면 */}
        {isLoading && (
          <div className='flex flex-1 items-center justify-center py-20'>
            <p className='text-body-lg text-grey-600'>검색 중...</p>
          </div>
        )}
        {error && (
          <div className='flex flex-1 flex-col items-center justify-center py-20'>
            <EmptyNotice
              title='오류가 발생했습니다.'
              subtitle='검색 결과를 불러오는 중 문제가 발생했습니다.'
            />
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
            onTaskClick={handleTaskClick}
            onArchiveClick={handleArchiveClick}
          />
        )}

        {!isLoading && !error && (!debouncedQuery.trim() || !hasResults) && (
          <div className='flex flex-1 flex-col items-center justify-center py-20'>
            <EmptyNotice title={'검색 결과가 없어요.'} subtitle='' />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
