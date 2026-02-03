import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TabBar, List, FeedBack } from '@/components/common';
import { SearchAppBar } from '@/components/common/appBar/searchAppBar';
import {
  CategoryFilterButton,
  ArchiveSummaryBar,
  type ArchiveCategoryKey,
} from '@/components/archive';
import { useBottomTabNavigation } from '@/hooks/useBottomTabNavigation';
import { ROUTES } from '@/constants/routes';
import { archiveMockApi, useMockArchives } from '@/api/archive.mock';
import { useArchiveUIStore } from '@/stores/useArchiveUIStore';
import {
  ARCHIVE_CATEGORY_LABEL,
  type ArchiveCategory,
} from '@/utils/archiveCategory';

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

const ArchivePage = () => {
  const { handleTabChange } = useBottomTabNavigation();
  const navigate = useNavigate();
  const archives = useMockArchives();
  const setSelectedArchiveId = useArchiveUIStore(
    (state) => state.setSelectedArchiveId
  );
  const selectedCategory = useArchiveUIStore((state) => state.selectedCategory);
  const setSelectedCategory = useArchiveUIStore(
    (state) => state.setSelectedCategory
  );
  const [pendingDeleteArchiveId, setPendingDeleteArchiveId] = useState<
    string | null
  >(null);

  const filteredArchives = useMemo(() => {
    if (selectedCategory === 'all') {
      return archives;
    }
    return archives.filter((archive) => archive.category === selectedCategory);
  }, [archives, selectedCategory]);

  const handleRequestDelete = (id: string) => {
    setPendingDeleteArchiveId(id);
  };

  const handleConfirmDelete = () => {
    if (!pendingDeleteArchiveId) return;
    archiveMockApi.delete(pendingDeleteArchiveId);
    setSelectedArchiveId(null);
    setPendingDeleteArchiveId(null);
  };

  const handleCancelDelete = () => {
    setPendingDeleteArchiveId(null);
  };
  const handleClickAdd = () => {
    navigate(ROUTES.archiveAdd);
  };

  const handleEdit = (id: string, title: string, category: ArchiveCategory) => {
    setSelectedArchiveId(id);
    navigate(ROUTES.archiveEdit, {
      state: {
        archive: {
          id,
          title,
          category,
        },
        origin: ROUTES.archives,
      },
    });
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
            totalCount={filteredArchives.length}
            className='bg-white'
            onClickAdd={handleClickAdd}
          />
        </section>
        <section className='space-y-3 bg-grey-50 px-5 pb-24 pt-6'>
          {filteredArchives.map((archive) => {
            const previewImages = Array.isArray(archive.images)
              ? archive.images.slice(0, 4)
              : [];

            return (
              <List.ArchiveCard
                key={archive.id}
                title={archive.title}
                category={ARCHIVE_CATEGORY_LABEL[archive.category]}
                itemCount={archive.itemCount}
                images={previewImages}
                width='w-full'
                onEditClick={() =>
                  handleEdit(archive.id, archive.title, archive.category)
                }
                onDeleteClick={() => handleRequestDelete(archive.id)}
              />
            );
          })}
        </section>
      </main>
      <footer className='sticky bottom-0 bg-white shadow-[0_-5px_10px_rgba(0,0,0,0.05)]'>
        <TabBar.BottomTabBar value='archive' onChange={handleTabChange} />
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

export default ArchivePage;
