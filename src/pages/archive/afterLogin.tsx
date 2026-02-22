import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { TabBar, List, FeedBack } from '@/components/common';
import { InfiniteScroll } from '@/components/common/infiniteScroll';
import { FloatingButton } from '@/components/common/button';
import { SearchAppBar } from '@/components/common/appBar/searchAppBar';
import {
  CategoryFilterButton,
  ArchiveSummaryBar,
  type ArchiveCategoryKey,
} from '@/components/archive';
import { useBottomTabNavigation } from '@/hooks/useBottomTabNavigation';
import { useArchiveUIStore } from '@/stores/useArchiveUIStore';
import { ROUTES } from '@/constants/routes';
import { ARCHIVE_CATEGORY_LABEL } from '@/utils/archiveCategory';
import {
  listAll1,
  listByCategory,
  useDeleteCollect,
  useGetTotalCollectionCount,
  useGetCategoryCounts,
} from '@/api/generated/endpoints/collection/collection';
import type {
  ApiResponseSliceCollectionResponse,
  ListByCategoryCategory,
  SliceCollectionResponse,
  CollectionResponse,
  ApiResponseCollectionCountResponse,
  ApiResponseListCollectionCategoryCountResponse,
  CollectionCategoryCountResponse,
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

  const handleClickSearch = () => {
    navigate(ROUTES.search);
  };

  // 전역 상태: 선택된 카테고리 (페이지 간 상태 유지용)
  const { selectedCategory, setSelectedCategory } = useArchiveUIStore();
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
    refetchOnWindowFocus: true,
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

  // 전체 모음 개수 조회
  const { data: totalCountData } = useGetTotalCollectionCount({
    query: {
      enabled: isAll,
      refetchOnWindowFocus: true,
    },
  }) as { data?: ApiResponseCollectionCountResponse };

  // 카테고리별 모음 개수 조회
  const { data: categoryCountsData } = useGetCategoryCounts({
    query: {
      enabled: !isAll,
      refetchOnWindowFocus: true,
    },
  }) as { data?: ApiResponseListCollectionCategoryCountResponse };

  // 선택된 카테고리에 맞는 총 개수 계산
  const totalCount = useMemo(() => {
    if (isAll) {
      return totalCountData?.result?.count ?? 0;
    }

    const categoryLabel = ARCHIVE_CATEGORY_LABEL[selectedCategory];
    const list = categoryCountsData?.result ?? [];

    const matched = (list as CollectionCategoryCountResponse[]).find(
      (item) => item.categoryKorean === categoryLabel
    );

    return matched?.count ?? 0;
  }, [isAll, totalCountData, categoryCountsData, selectedCategory]);

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
          queryClient.invalidateQueries({
            queryKey: ['collections'],
          });
          queryClient.invalidateQueries({
            queryKey: ['/api/v1/collect/count'],
          });
          queryClient.invalidateQueries({
            queryKey: ['/api/v1/collect/category-counts'],
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
      <SearchAppBar title='모음' onClickSearch={handleClickSearch} />

      {/* 메인 컨텐츠 - 바텀탭바 높이만큼만 패딩 */}
      <main className='flex-1 pb-20'>
        <section className='bg-white pt-14'>
          {/* 스크롤바 없애기 */}
          <div className='relative'>
            <div
              className='overflow-x-auto px-5'
              style={{
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <div className='flex gap-3 pt-2'>
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
                {/* 마지막 여백 */}
                <div className='w-2 shrink-0' />
              </div>
            </div>
            {/* White gradient overlay on right */}
            <div className='pointer-events-none absolute right-0 top-0 h-[74px] w-[40px] bg-gradient-to-l from-white to-transparent' />
          </div>
          <ArchiveSummaryBar
            totalCount={totalCount}
            className='bg-white'
            onClickAdd={handleClickAdd}
          />
        </section>
        <section className='bg-grey-50 px-5 pb-[26px] pt-6'>
          <InfiniteScroll<CollectionResponse>
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

      {/* 하단 고정 버튼 */}
      <FloatingButton
        onClick={() => navigate(ROUTES.taskCreate)}
        className='fixed bottom-[104px] right-6 z-40'
      />

      {/* 바탭탭바 */}
      <TabBar.BottomTabBar value='archive' onChange={handleTabChange} />

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
