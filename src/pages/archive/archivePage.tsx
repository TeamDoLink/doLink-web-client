import { useMemo, useState } from 'react';
import { TabBar, List, FeedBack } from '@/components/common';
import { SearchAppBar } from '@/components/common/appBar/searchAppBar';
import {
  CategoryFilterButton,
  type ArchiveCategoryKey,
  ArchiveSummaryBar,
} from '@/components/archive';
import { useBottomTabNavigation } from '@/hooks/useBottomTabNavigation';

const ARCHIVE_CATEGORIES: Array<{
  key: ArchiveCategoryKey;
  label: string;
}> = [
  { key: 'all', label: '전체' },
  { key: 'restaurant', label: '맛집' },
  { key: 'hobby', label: '취미' },
  { key: 'travel', label: '여행' },
  { key: 'money', label: '재테크' },
  { key: 'shopping', label: '쇼핑' },
  { key: 'exercise', label: '운동' },
  { key: 'career', label: '커리어' },
  { key: 'study', label: '자기개발' },
  { key: 'tip', label: '꿀팁' },
  { key: 'etc', label: '기타' },
];

type ArchiveListItem = {
  id: string;
  title: string;
  category: Exclude<ArchiveCategoryKey, 'all'>;
  itemCount: number;
  images?: string[];
};

const CATEGORY_LABEL_LOOKUP = ARCHIVE_CATEGORIES.reduce(
  (acc, { key, label }) => {
    acc[key] = label;
    return acc;
  },
  {} as Record<ArchiveCategoryKey, string>
);

const INITIAL_ARCHIVE_DATA: ArchiveListItem[] = [
  {
    id: 'archive-restaurant-1',
    title: '강남역 저녁 맛집 리스트',
    category: 'restaurant',
    itemCount: 12,
  },
  {
    id: 'archive-restaurant-2',
    title: '데이트 코스 맛집 모음',
    category: 'restaurant',
    itemCount: 7,
  },
  {
    id: 'archive-travel-1',
    title: '제주도 가을 여행 준비',
    category: 'travel',
    itemCount: 9,
  },
  {
    id: 'archive-hobby-1',
    title: '주말 취미 클래스',
    category: 'hobby',
    itemCount: 5,
  },
  {
    id: 'archive-money-1',
    title: '월급 관리 재테크',
    category: 'money',
    itemCount: 6,
  },
  {
    id: 'archive-shopping-1',
    title: '여름 쇼핑 체크리스트',
    category: 'shopping',
    itemCount: 4,
  },
  {
    id: 'archive-exercise-1',
    title: '홈트 4주 루틴',
    category: 'exercise',
    itemCount: 8,
  },
  {
    id: 'archive-career-1',
    title: '이직 준비 체크리스트',
    category: 'career',
    itemCount: 10,
  },
  {
    id: 'archive-study-1',
    title: '영어 회화 자기개발',
    category: 'study',
    itemCount: 3,
  },
  {
    id: 'archive-tip-1',
    title: '생활 꿀팁 모음집',
    category: 'tip',
    itemCount: 11,
  },
  {
    id: 'archive-etc-1',
    title: '기타 아이디어 스크랩',
    category: 'etc',
    itemCount: 2,
  },
];

const ArchivesPage = () => {
  const { handleTabChange } = useBottomTabNavigation();
  const [archives, setArchives] =
    useState<ArchiveListItem[]>(INITIAL_ARCHIVE_DATA);
  const [selectedCategory, setSelectedCategory] =
    useState<ArchiveCategoryKey>('all');
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
    setArchives((prev) =>
      prev.filter((archive) => archive.id !== pendingDeleteArchiveId)
    );
    setPendingDeleteArchiveId(null);
  };

  const handleCancelDelete = () => {
    setPendingDeleteArchiveId(null);
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
          />
        </section>
        <section className='space-y-3 bg-grey-50 px-5 pb-24 pt-6'>
          {filteredArchives.map(
            ({ id, title, category, itemCount, images }) => (
              <List.ArchiveCard
                key={id}
                title={title}
                category={CATEGORY_LABEL_LOOKUP[category]}
                itemCount={itemCount}
                images={images}
                width='w-full'
                onDeleteClick={() => handleRequestDelete(id)}
              />
            )
          )}
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

export default ArchivesPage;
