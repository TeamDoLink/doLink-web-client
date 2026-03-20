import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import backIcon from '@/assets/icons/common/back.svg';
import searchIcon from '@/assets/icons/common/search-24.svg';
import { ClearableSearchInputField } from '@/components/common/inputField';
import { ArchiveSearchItem, TaskSearchItem } from '@/components/common/list';
import { InfiniteScroll } from '@/components/common/infiniteScroll/infiniteScroll';
import EmptyNotice from '@/components/common/feedBack/emptyNotice';
import ItemChips from '@/components/common/filter/itemChips';
import { formatRelativeDateLabel } from '@/utils/date';
import { customInstance } from '@/api/axios-instance';
import { ROUTES } from '@/constants/routes';
import {
  BEFORE_LOGIN_ARCHIVE,
  BEFORE_LOGIN_TODO,
} from '@/constants/beforeLoginData';
import { useAuthStore } from '@/stores/useAuthStore';
import { ARCHIVE_CATEGORY_LABEL } from '@/utils/archiveCategory';
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
  id: number | string;
  title: string;
  subtitle: string;
  thumbnail?: string;
  isCompleted: boolean;
}

interface Archive {
  id: number | string;
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

const mapTaskResponseToTask = (task: TaskResponse): Task => {
  const relative = task.createdAt
    ? formatRelativeDateLabel(task.createdAt)
    : '';
  const domain = task.inout ? '직접 추가' : (task.domain ?? '');
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
  selectedTab,
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
  selectedTab: '전체' | '할 일' | '모음';
  onLoadMoreTasks: () => void;
  onLoadMoreArchives: () => void;
  hasMoreTasks: boolean;
  hasMoreArchives: boolean;
  isFetchingMoreTasks: boolean;
  isFetchingMoreArchives: boolean;
  onTaskClick: (taskId: number | string) => void;
  onArchiveClick: (archiveId: number | string) => void;
}) => {
  const showTasks = selectedTab === '전체' || selectedTab === '할 일';
  const showArchives = selectedTab === '전체' || selectedTab === '모음';

  return (
    <div className='flex flex-1 flex-col px-5'>
      {showTasks && tasks.length > 0 && (
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

      {showArchives && archives.length > 0 && (
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
};

// Main Component
const SearchPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'전체' | '할 일' | '모음'>(
    '전체'
  );

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
    enabled: isAuthenticated && !!debouncedQuery.trim(),
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
    enabled: isAuthenticated && !!debouncedQuery.trim(),
    initialPageParam: 0,
    getNextPageParam: (
      lastPage: PagedArchiveResult,
      allPages: PagedArchiveResult[]
    ) => (lastPage.hasMore ? allPages.length : undefined),
  });

  const normalizedQuery = debouncedQuery.trim().toLowerCase();

  const guestTasks = useMemo<Task[]>(() => {
    if (isAuthenticated || !normalizedQuery) return [];

    return BEFORE_LOGIN_TODO()
      .filter(
        (item) =>
          item.title.toLowerCase().includes(normalizedQuery) ||
          item.platform.toLowerCase().includes(normalizedQuery)
      )
      .map((item) => ({
        id: item.id,
        title: item.title,
        subtitle: `${formatRelativeDateLabel(item.createdAt)} · ${item.platform}`,
        thumbnail: '',
        isCompleted: item.checked,
      }));
  }, [isAuthenticated, normalizedQuery]);

  const guestArchives = useMemo<Archive[]>(() => {
    if (isAuthenticated || !normalizedQuery) return [];

    return BEFORE_LOGIN_ARCHIVE()
      .map((item) => {
        const categoryLabel =
          ARCHIVE_CATEGORY_LABEL[item.category] ?? item.category;

        return {
          id: item.id,
          title: item.title,
          category: categoryLabel,
          itemCount: item.itemCount,
          images: item.images,
        };
      })
      .filter(
        (item) =>
          item.title.toLowerCase().includes(normalizedQuery) ||
          item.category.toLowerCase().includes(normalizedQuery)
      );
  }, [isAuthenticated, normalizedQuery]);

  const tasks = isAuthenticated
    ? (taskData?.pages.flatMap((page) => page.tasks) ?? [])
    : guestTasks;
  const archives = isAuthenticated
    ? (archiveData?.pages.flatMap((page) => page.archives) ?? [])
    : guestArchives;
  const isLoading = isAuthenticated && (isLoadingTasks || isLoadingArchives);
  const error = isAuthenticated ? taskError || archiveError : null;

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

  const handleTaskClick = (taskId: number | string) => {
    if (!isAuthenticated) {
      navigate(`${ROUTES.taskDetail}/tutorial`);
      return;
    }

    navigate(`${ROUTES.taskDetail}/${taskId}`);
  };

  const handleArchiveClick = (archiveId: number | string) => {
    if (!isAuthenticated) {
      navigate(ROUTES.archiveTutorial);
      return;
    }

    navigate(`${ROUTES.archiveDetail}/${archiveId}`);
  };

  const hasResults = tasks.length > 0 || archives.length > 0;

  return (
    <div className='flex min-h-screen flex-col'>
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

      {/* Tab Section */}
      <div className='fixed left-0 right-0 top-14 z-40 flex h-[46px] items-center gap-2 border-b border-grey-100 px-5'>
        <ItemChips
          type='solid'
          isSelected={selectedTab === '전체'}
          label='전체'
          onClick={() => setSelectedTab('전체')}
        />
        <ItemChips
          type='solid'
          isSelected={selectedTab === '할 일'}
          label='할 일'
          onClick={() => setSelectedTab('할 일')}
        />
        <ItemChips
          type='solid'
          isSelected={selectedTab === '모음'}
          label='모음'
          onClick={() => setSelectedTab('모음')}
        />
      </div>

      {/* Content - 헤더 + 탭 높이만큼 패딩 추가 */}
      <div className='flex flex-1 flex-col pt-[calc(56px+46px)]'>
        {/* 임시 로딩 화면 */}
        {isLoading && (
          <div className='flex flex-1 items-center justify-center'>
            <p className='text-body-lg text-grey-600'>검색 중...</p>
          </div>
        )}
        {error && (
          <div className='flex flex-1 flex-col items-center pt-[180px]'>
            <EmptyNotice
              title='오류가 발생했습니다.'
              subtitle='검색 결과를 불러오는 중 문제가 발생했습니다.'
            />
          </div>
        )}

        {!isLoading && !error && debouncedQuery.trim() && hasResults && (
          <div className='pt-4'>
            <SearchResults
              tasks={tasks}
              archives={archives}
              searchQuery={searchQuery}
              selectedTab={selectedTab}
              onLoadMoreTasks={handleLoadMoreTasks}
              onLoadMoreArchives={handleLoadMoreArchives}
              hasMoreTasks={hasMoreTasks}
              hasMoreArchives={hasMoreArchives}
              isFetchingMoreTasks={isFetchingMoreTasks}
              isFetchingMoreArchives={isFetchingMoreArchives}
              onTaskClick={handleTaskClick}
              onArchiveClick={handleArchiveClick}
            />
          </div>
        )}

        {!isLoading && !error && (!debouncedQuery.trim() || !hasResults) && (
          <div className='flex flex-1 flex-col items-center pt-[180px]'>
            <EmptyNotice title={'검색 결과가 없어요.'} subtitle='' />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
