import { useEffect, useState } from 'react';
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
import { BEFORE_LOGIN_ARCHIVE } from '@/constants/beforeLoginData';
import { useArchiveUIStore } from '@/stores/useArchiveUIStore';
import { ARCHIVE_CATEGORY_LABEL } from '@/utils/archiveCategory';

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

const ArchiveBeforeLogin = () => {
  const { handleTabChange } = useBottomTabNavigation();
  const navigate = useNavigate();
  const handleClickSearch = () => {
    navigate(ROUTES.search);
  };

  // 전역 상태: 선택된 카테고리 (페이지 간 상태 유지용)
  const selectedCategory = useArchiveUIStore((state) => state.selectedCategory);
  const setSelectedCategory = useArchiveUIStore(
    (state) => state.setSelectedCategory
  );

  const [showToast, setShowToast] = useState(false);
  const [toastToken, setToastToken] = useState(0);

  useEffect(() => {
    if (!showToast) {
      return;
    }

    const timer = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(timer);
  }, [showToast, toastToken]);

  const archives = BEFORE_LOGIN_ARCHIVE();

  const filteredArchives =
    selectedCategory === 'all'
      ? archives
      : archives.filter((archive) => archive.category === selectedCategory);

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

  const handleOpenTutorialArchive = () => {
    navigate(ROUTES.archiveTutorial);
  };

  return (
    <div className='flex min-h-screen flex-col bg-grey-50'>
      <SearchAppBar title='모음' onClickSearch={handleClickSearch} />

      {/* 메인 컨텐츠 - 바텀탭바 높이만큼만 패딩 */}
      <main className='flex-1 pb-[86px]'>
        <section className='bg-white pt-14'>
          <div className='relative'>
            <div
              className='overflow-x-auto px-5'
              style={{
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <div className='flex gap-3 pt-[10px]'>
                {ARCHIVE_CATEGORIES.map(({ key, label }) => (
                  <CategoryFilterButton
                    key={key}
                    category={key}
                    label={label}
                    selected={selectedCategory === key}
                    onClick={() => setSelectedCategory(key)}
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
            const categoryLabel = ARCHIVE_CATEGORY_LABEL[archive.category];

            return (
              <List.ArchiveCard
                key={archive.id}
                title={archive.title}
                category={categoryLabel}
                itemCount={archive.itemCount}
                images={previewImages}
                width='w-full'
                disableActionMenu
                onClick={handleOpenTutorialArchive}
                onMoreClick={handleArchiveMoreClick}
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

      {/* 하단 고정 버튼 */}
      <FloatingButton
        aria-label='새 할 일 추가'
        className='fixed bottom-[104px] right-6 z-40'
        onClick={handleFloatingButtonClick}
      />

      {/* 바탭탭바 */}
      <TabBar.BottomTabBar value='archive' onChange={handleTabChange} />

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
