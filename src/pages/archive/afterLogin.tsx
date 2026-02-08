import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { TabBar, List, FeedBack } from '@/components/common';
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
  useListAll1 as useListAll,
  useListByCategory,
  useDeleteCollect,
  getListAll1QueryKey as getListAllQueryKey,
  getListByCategoryQueryKey,
} from '@/api/generated/endpoints/collection/collection';
import type {
  ApiResponseSliceCollectionResponse,
  ListByCategoryCategory,
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

  // 전체 모음 조회
  // TODO: 무한 스크롤 적용
  const { data: allData } = useListAll(
    { page: 0, size: 10 },
    { query: { enabled: isAll } }
  );

  // 카테고리별 모음 조회
  // TODO: 무한 스크롤 적용
  const { data: categoryData } = useListByCategory(
    {
      category: ARCHIVE_CATEGORY_LABEL[
        isAll ? 'etc' : selectedCategory
      ] as ListByCategoryCategory,
      page: 0,
      size: 10,
    },
    { query: { enabled: !isAll } }
  );

  const responseData = isAll ? allData : categoryData;
  const sliceResponse = (
    responseData as unknown as ApiResponseSliceCollectionResponse
  )?.result;
  const archives = sliceResponse?.content ?? [];

  // 모음 삭제
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
          queryClient.invalidateQueries({ queryKey: getListAllQueryKey() });
          queryClient.invalidateQueries({
            queryKey: getListByCategoryQueryKey(),
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
                  onClick={() => setSelectedCategory(key)}
                />
              ))}
            </div>
          </div>
          <ArchiveSummaryBar
            totalCount={archives.length}
            className='bg-white'
            onClickAdd={handleClickAdd}
          />
        </section>
        <section className='space-y-3 bg-grey-50 px-5 pb-24 pt-6'>
          {archives.map((archive) => {
            const previewImages = Array.isArray(archive.thumbnails)
              ? archive.thumbnails.slice(0, 4)
              : [];

            return (
              <List.ArchiveCard
                key={archive.collectionId}
                title={archive.name}
                category={archive.category}
                images={previewImages}
                width='w-full'
                onClick={() =>
                  navigate(`${ROUTES.archiveDetail}/${archive.collectionId}`)
                }
                onEditClick={() => handleEdit(archive.collectionId!)}
                onDeleteClick={() => handleRequestDelete(archive.collectionId!)}
              />
            );
          })}
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
