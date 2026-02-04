import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useArchiveUIStore } from '@/stores/useArchiveUIStore';
import {
  ARCHIVE_CATEGORY_LABEL,
  type ArchiveCategory,
} from '@/utils/archiveCategory';
import { formatRelativeDateLabel } from '@/utils/date';

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

type BeforeLoginArchive = {
  id: string;
  title: string;
  category: ArchiveCategory;
  itemCount: number;
  createdAt: string;
  images: string[];
};

const ArchiveBeforeLogin = () => {
  const { handleTabChange } = useBottomTabNavigation();
  const navigate = useNavigate();
  const selectedCategory = useArchiveUIStore((state) => state.selectedCategory);
  const setSelectedCategory = useArchiveUIStore(
    (state) => state.setSelectedCategory
  );
  const [showToast, setShowToast] = useState(false);
  const [toastToken, setToastToken] = useState(0);

  useEffect(() => {
    setSelectedCategory('all');
  }, [setSelectedCategory]);

  useEffect(() => {
    if (!showToast) {
      return;
    }

    const timer = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(timer);
  }, [showToast, toastToken]);

  const archives = useMemo<BeforeLoginArchive[]>(() => {
    const todayISO = new Date().toISOString();
    return [
      {
        id: 'archive-tutorial',
        title: '두링크 튜토리얼',
        category: 'etc',
        itemCount: 1,
        createdAt: todayISO,
        images: [],
      },
    ];
  }, []);

  const filteredArchives = useMemo(() => {
    if (selectedCategory === 'all') {
      return archives;
    }

    return archives.filter((archive) => archive.category === selectedCategory);
  }, [archives, selectedCategory]);

  const triggerLoginToast = () => {
    setShowToast(true);
    setToastToken((prev) => prev + 1);
  };

  const handleLoginAction = () => {
    navigate(ROUTES.login);
  };

  const handleAddArchive = () => {
    triggerLoginToast();
  };

  const handleFloatingButtonClick = () => {
    triggerLoginToast();
  };

  const handleArchiveMoreClick = () => {
    triggerLoginToast();
  };

  const handleArchiveActionClick = () => {
    triggerLoginToast();
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
            onClickAdd={handleAddArchive}
          />
        </section>
        <section className='space-y-3 bg-grey-50 px-5 pb-24 pt-6'>
          {filteredArchives.map((archive) => {
            const previewImages = Array.isArray(archive.images)
              ? archive.images.slice(0, 4)
              : [];
            const categoryLabel = `${ARCHIVE_CATEGORY_LABEL[archive.category]} · ${formatRelativeDateLabel(archive.createdAt)}`;

            return (
              <List.ArchiveCard
                key={archive.id}
                title={archive.title}
                category={categoryLabel}
                itemCount={archive.itemCount}
                images={previewImages}
                width='w-full'
                onMoreClick={handleArchiveMoreClick}
                onEditClick={handleArchiveActionClick}
                onDeleteClick={handleArchiveActionClick}
              />
            );
          })}

          {filteredArchives.length === 0 && (
            <p className='text-center text-body-md text-grey-500'>
              선택한 카테고리에 표시할 모음이 없어요.
            </p>
          )}
        </section>
      </main>
      <footer className='sticky bottom-0 bg-white shadow-[0_-5px_10px_rgba(0,0,0,0.05)]'>
        <div className='relative w-full'>
          <div className='pointer-events-none absolute -top-[76px] right-6 z-10 flex h-[52px] w-[52px] items-center justify-center'>
            <FloatingButton
              aria-label='새 할 일 추가'
              className='pointer-events-auto'
              onClick={handleFloatingButtonClick}
            />
          </div>
          <TabBar.BottomTabBar value='archive' onChange={handleTabChange} />
        </div>
      </footer>

      {showToast && (
        <div className='fixed bottom-[100px] left-1/2 z-50 -translate-x-1/2'>
          <FeedBack.Toast
            message='로그인 후 간편하게 DoLink를 이용해보세요.'
            actionLabel='로그인'
            onAction={handleLoginAction}
          />
        </div>
      )}
    </div>
  );
};

export default ArchiveBeforeLogin;
