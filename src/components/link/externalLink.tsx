import { useEffect, useState } from 'react';
import PlusIcon from '@/assets/icons/common/plus.svg';
import ArchiveSocialMediaListItem from './ArchiveSocialMediaListItem';
import { SearchInputField } from './searchInputField';
import AddCollectionView from './AddCollectionView';
import { type ArchiveCategory } from '../../utils/archiveCategory';

export interface ShareIntentData {
  value: string;
  type: 'text' | 'weburl';
}

interface CollectionItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  itemCount: number;
}

interface CollectionBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onClickAddCollection?: () => void;
  onSelect?: (collectionId: string) => void;
  selectedItems?: string[];
  shareIntent?: ShareIntentData | null;
  isShareMode?: boolean;
}

const DUMMY_COLLECTIONS: CollectionItem[] = [
  {
    id: '1',
    title: '읽을 사항을 숨겨진 구성원이 사용을 옷찰락',
    description: '디자인 · 나중에 읽음',
    thumbnail: 'https://picsum.photos/seed/1/150',
    itemCount: 12,
  },
  {
    id: '2',
    title: '성장하는 개발자를 위한 기술 스택 모음',
    description: '개발 · 기술 블로그',
    thumbnail: 'https://picsum.photos/seed/2/150',
    itemCount: 8,
  },
  {
    id: '3',
    title: '주말에 가기 좋은 감성 카페 리스트',
    description: '여행 · 카페',
    thumbnail: 'https://picsum.photos/seed/3/150',
    itemCount: 15,
  },
  {
    id: '4',
    title: '미니멀리즘 인테리어 영감 모음집',
    description: '인테리어 · 리빙',
    thumbnail: 'https://picsum.photos/seed/4/150',
    itemCount: 5,
  },
  {
    id: '5',
    title: '효율적인 업무를 위한 생산성 도구',
    description: '업무 · 생산성',
    thumbnail: 'https://picsum.photos/seed/5/150',
    itemCount: 20,
  },
  {
    id: '6',
    title: '2024년 꼭 들어야 할 플레이리스트',
    description: '음악 · 취미',
    thumbnail: 'https://picsum.photos/seed/6/150',
    itemCount: 32,
  },
  {
    id: '7',
    title: 'React Native 성능 최적화 가이드',
    description: '개발 · 모바일',
    thumbnail: 'https://picsum.photos/seed/7/150',
    itemCount: 11,
  },
  {
    id: '8',
    title: '심플하고 정갈한 자취 요리 레시피',
    description: '요리 · 레시피',
    thumbnail: 'https://picsum.photos/seed/8/150',
    itemCount: 45,
  },
  {
    id: '9',
    title: '매일 아침 10분 스트레칭 루틴',
    description: '건강 · 운동',
    thumbnail: 'https://picsum.photos/seed/9/150',
    itemCount: 7,
  },
  {
    id: '10',
    title: '글로벌 비즈니스 영어 핵심 패턴',
    description: '교육 · 외국어',
    thumbnail: 'https://picsum.photos/seed/10/150',
    itemCount: 18,
  },
  {
    id: '11',
    title: '데이터 분석 입문자를 위한 추천 도서',
    description: '데이터 · 도서',
    thumbnail: 'https://picsum.photos/seed/11/150',
    itemCount: 9,
  },
  {
    id: '12',
    title: '가을 겨울 시즌 데일리 룩북',
    description: '패션 · 스타일',
    thumbnail: 'https://picsum.photos/seed/12/150',
    itemCount: 24,
  },
  {
    id: '13',
    title: '마음의 평화를 위한 명상 가이드',
    description: '심리 · 명상',
    thumbnail: 'https://picsum.photos/seed/13/150',
    itemCount: 13,
  },
  {
    id: '14',
    title: '세계 곳곳의 숨겨진 트래킹 코스',
    description: '여행 · 액티비티',
    thumbnail: 'https://picsum.photos/seed/14/150',
    itemCount: 21,
  },
  {
    id: '15',
    title: '경제적 자유를 위한 투자 기초 지식',
    description: '경제 · 투자',
    thumbnail: 'https://picsum.photos/seed/15/150',
    itemCount: 30,
  },
];

export default function ExternalLink({
  visible,
  onClose,
  onSelect,
  selectedItems: initialSelectedItems = [],
}: CollectionBottomSheetProps) {
  const [searchText, setSearchText] = useState('');
  const [filteredCollections, setFilteredCollections] =
    useState(DUMMY_COLLECTIONS);
  const [selectedItems, setSelectedItems] =
    useState<string[]>(initialSelectedItems);
  const [showAddView, setShowAddView] = useState(false);
  const [addCollectionName, setAddCollectionName] = useState('');
  const [addCollectionCategory, setAddCollectionCategory] =
    useState<ArchiveCategory | null>(null);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredCollections(DUMMY_COLLECTIONS);
    } else {
      setFilteredCollections(
        DUMMY_COLLECTIONS.filter((item) =>
          item.title.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
  }, [searchText]);

  const handleSelectCollection = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? [] : [id]));
    onSelect?.(id);
  };

  const handleOpenAddView = () => setShowAddView(true);
  const handleCloseAddView = () => {
    setShowAddView(false);
    setAddCollectionName('');
    setAddCollectionCategory(null);
  };

  const isAddEnabled =
    addCollectionName.trim().length > 0 && addCollectionCategory !== null;

  const handleAddCollection = () => {
    if (isAddEnabled && addCollectionCategory) {
      console.log('모음 추가:', {
        name: addCollectionName,
        category: addCollectionCategory,
      });
      handleCloseAddView();
    }
  };

  if (!visible) return null;

  return (
    <div className='flex h-full w-full flex-col overflow-hidden bg-white'>
      {showAddView ? (
        <div className='flex min-h-0 flex-1 flex-col'>
          <AddCollectionView
            onBack={handleCloseAddView}
            onAdd={handleAddCollection}
            name={addCollectionName}
            onNameChange={setAddCollectionName}
            selectedCategory={addCollectionCategory}
            onCategoryChange={setAddCollectionCategory}
            hideButton={true}
          />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className='flex flex-shrink-0 items-center justify-between border-b px-5 py-4'>
            <span className='text-xl font-bold text-black'>할 일 담기</span>
            <button
              className='flex items-center gap-1 text-gray-700 transition-opacity hover:opacity-70'
              onClick={handleOpenAddView}
            >
              <img src={PlusIcon} alt='add' className='h-4 w-4' />
              <span className='text-sm'>모음 추가</span>
            </button>
          </div>

          {/* Search */}
          <div className='flex-shrink-0 px-5 py-3'>
            <SearchInputField value={searchText} onChangeText={setSearchText} />
          </div>

          {/* Collection List */}
          <div className='min-h-0 flex-1 overflow-y-auto px-5'>
            {filteredCollections.map((item, index) => {
              const isSelected = selectedItems.includes(item.id);
              return (
                <ArchiveSocialMediaListItem
                  key={item.id}
                  title={item.title}
                  category='카테고리'
                  itemCount={item.itemCount}
                  thumbnail={item.thumbnail}
                  isSelected={isSelected}
                  onPress={() => handleSelectCollection(item.id)}
                  showDivider={index < filteredCollections.length - 1}
                />
              );
            })}
          </div>
        </>
      )}

      {/* Bottom Button */}
      <div className='flex-shrink-0 border-t px-5 py-4'>
        {showAddView ? (
          <button
            className={`w-full rounded-lg py-3 transition-colors ${
              isAddEnabled
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-400'
            }`}
            disabled={!isAddEnabled}
            onClick={handleAddCollection}
          >
            추가하기
          </button>
        ) : (
          <button
            className={`w-full rounded-lg py-3 transition-colors ${
              selectedItems.length > 0
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-400'
            }`}
            onClick={onClose}
          >
            담기
          </button>
        )}
      </div>
    </div>
  );
}
