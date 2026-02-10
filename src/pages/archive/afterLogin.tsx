import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';
import { TabBar, List, FeedBack } from '@/components/common';
import { InfiniteScrollList } from '@/components/common/infiniteScroll';
import { FloatingButton } from '@/components/common/button';
import { SearchAppBar } from '@/components/common/appBar/searchAppBar';
import {
  CategoryFilterButton,
  ArchiveSummaryBar,
  type ArchiveCategoryKey,
} from '@/components/archive';
import { useBottomTabNavigation } from '@/hooks/useBottomTabNavigation';
import { ROUTES } from '@/constants/routes';
import { ARCHIVE_CATEGORY_LABEL } from '@/utils/archiveCategory';
import {
  listAll1,
  listByCategory,
  useDeleteCollect,
} from '@/api/generated/endpoints/collection/collection';
import type {
  ApiResponseSliceCollectionResponse,
  ListByCategoryCategory,
  SliceCollectionResponse,
  CollectionResponse,
} from '@/api/generated/models';

const ARCHIVE_CATEGORY_KEYS: ArchiveCategoryKey[] = [
  'all',
  'restaurant',
  'hobby',
  'travel',
  'money',
  'shopping',
  'exercise',
  'career',
  'study',
  'tips',
  'etc',
];

const ARCHIVE_CATEGORIES = ARCHIVE_CATEGORY_KEYS.map((key) => ({
  key,
  label: ARCHIVE_CATEGORY_LABEL[key],
}));

const PAGE_SIZE = 10;

const ArchiveAfterLogin = () => {
  const { handleTabChange } = useBottomTabNavigation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedCategory, setSelectedCategory] =
    useState<ArchiveCategoryKey>('all');
  const [pendingDeleteArchiveId, setPendingDeleteArchiveId] = useState<
    number | null
  >(null);

  const isAll = selectedCategory === 'all';

  // 무한스크롤 쿼리
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery<SliceCollectionResponse, Error>({
    queryKey: ['collections', selectedCategory, PAGE_SIZE] as const,
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0, signal }) => {
      const page = typeof pageParam === 'number' ? pageParam : 0;
      const params = { page, size: PAGE_SIZE };

      try {
        let response: ApiResponseSliceCollectionResponse;

        if (isAll) {
          response = (await listAll1(params, {
            signal,
          })) as ApiResponseSliceCollectionResponse;
        } else {
          const apiCategory = ARCHIVE_CATEGORY_LABEL[
            selectedCategory
          ] as ListByCategoryCategory;
          response = (await listByCategory(
            { category: apiCategory, ...params },
            { signal }
          )) as ApiResponseSliceCollectionResponse;
        }

        const result = response?.result;

        if (!result) {
          throw new Error('Invalid API response');
        }

        return {
          first: result.first ?? page === 0,
          last: result.last ?? true,
          size: result.size ?? PAGE_SIZE,
          content: result.content ?? [],
          number: result.number ?? page,
          numberOfElements: result.numberOfElements ?? 0,
          empty: result.empty ?? true,
        } as SliceCollectionResponse;
      } catch (error) {
        console.error('Failed to fetch collections:', error);
        throw error;
      }
    },
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : (lastPage.number ?? 0) + 1,
    staleTime: 1000 * 60 * 5,
  });

  const archives = useMemo(
    () => data?.pages.flatMap((page) => page.content ?? []) ?? [],
    [data]
  );

  const totalCount = archives.length;

  const { mutate: deleteCollect } = useDeleteCollect();

  const handleRequestDelete = (id: number) => {
    setPendingDeleteArchiveId(id);
  };

  const handleConfirmDelete = () => {
    if (pendingDeleteArchiveId === null) return;

    deleteCollect(
      { collectId: pendingDeleteArchiveId },
      {
        onSuccess: () => {
          const currentQueryKey = [
            'collections',
            selectedCategory,
            PAGE_SIZE,
          ] as const;

          queryClient.setQueryData<InfiniteData<SliceCollectionResponse>>(
            currentQueryKey,
            (current) => {
              if (!current) return current;

              const nextPages = current.pages.map((page) => {
                if (!page.content?.length) return page;

                const filtered = page.content.filter(
                  (archive) => archive.collectionId !== pendingDeleteArchiveId
                );

                if (filtered.length === page.content.length) return page;

                return {
                  ...page,
                  content: filtered,
                  numberOfElements: filtered.length,
                  empty: filtered.length === 0,
                };
              });

              return {
                ...current,
                pages: nextPages,
              };
            }
          );

          queryClient.invalidateQueries({
            queryKey: ['collections'],
            exact: false,
          });

          setPendingDeleteArchiveId(null);
        },
      }
    );
  };

  const handleCancelDelete = () => {
    setPendingDeleteArchiveId(null);
  };

  const handleClickAdd = () => {
    navigate(ROUTES.archiveAdd);
  };

  const handleEdit = (id: number) => {
    navigate(`${ROUTES.archiveEdit}/${id}`);
  };

  const handleLoadMore = () => {
    if (!hasNextPage || isFetchingNextPage) return;
    void fetchNextPage();
  };

  return (
    <div className='flex min-h-screen flex-col bg-grey-50'>
      <SearchAppBar
        title={
          ARCHIVE_CATEGORIES.find(({ key }) => key === selectedCategory)
            ?.label ?? '전체'
        }
      />
      <main className='flex-1'>
        <section className='bg-white'>
          <div className='overflow-x-auto px-5'>
            <div className='flex gap-3 pb-4 pt-2'>
              {ARCHIVE_CATEGORIES.map(({ key, label }) => (
                <CategoryFilterButton
                  key={key}
                  category={key}
                  label={label}
                  selected={selectedCategory === key}
                  onClick={() => {
                    setSelectedCategory(key);
                    setPendingDeleteArchiveId(null);
                  }}
                />
              ))}
            </div>
          </div>
          <ArchiveSummaryBar
            totalCount={totalCount}
            className='bg-white'
            onClickAdd={handleClickAdd}
          />
        </section>
        <section className='bg-grey-50 px-5 pb-24 pt-6'>
          <InfiniteScrollList<CollectionResponse>
            items={archives}
            keyExtractor={(archive: CollectionResponse) =>
              archive.collectionId?.toString() ?? `collection-${archive.name}`
            }
            renderItem={(archive: CollectionResponse) => {
              const previewImages = Array.isArray(archive.thumbnails)
                ? archive.thumbnails.slice(0, 4)
                : [];

              return (
                <List.ArchiveCard
                  title={archive.name}
                  category={archive.category}
                  images={previewImages}
                  width='w-full'
                  onClick={() =>
                    navigate(`${ROUTES.archiveDetail}/${archive.collectionId}`)
                  }
                  onEditClick={() => handleEdit(archive.collectionId!)}
                  onDeleteClick={() =>
                    handleRequestDelete(archive.collectionId!)
                  }
                />
              );
            }}
            onLoadMore={handleLoadMore}
            hasNextPage={Boolean(hasNextPage)}
            isFetchingNextPage={isFetchingNextPage}
            isLoading={isLoading}
            isError={isError}
            emptyMessage='아직 모음이 없어요'
            loadingMessage='모음을 불러오는 중입니다'
            errorMessage='모음을 불러오는 데 실패했습니다'
            className='space-y-3'
          />
        </section>
      </main>
      <footer className='sticky bottom-0 bg-white shadow-[0_-5px_10px_rgba(0,0,0,0.05)]'>
        <div className='relative w-full'>
          <div className='pointer-events-none absolute -top-[76px] right-6 z-10 flex h-[52px] w-[52px] items-center justify-center'>
            <FloatingButton
              aria-label='새 할 일 추가'
              className='pointer-events-auto'
              onClick={() => navigate(ROUTES.taskCreate)}
            />
          </div>
          <TabBar.BottomTabBar value='archive' onChange={handleTabChange} />
        </div>
      </footer>

      <FeedBack.ModalLayout
        open={pendingDeleteArchiveId !== null}
        onClose={handleCancelDelete}
      >
        <FeedBack.ConfirmDialog
          title='모음을 삭제할까요?'
          subtitle='모음 내 할 일도 함께 삭제돼요.'
          positiveLabel='삭제하기'
          negativeLabel='취소'
          onPositive={handleConfirmDelete}
          onNegative={handleCancelDelete}
        />
      </FeedBack.ModalLayout>
    </div>
  );
};

export default ArchiveAfterLogin;
