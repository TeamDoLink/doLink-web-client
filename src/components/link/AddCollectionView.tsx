/**
 * AddCollectionView
 * 새로운 모음(컬렉션)을 추가하는 화면 컴포넌트
 * - CollectionBottomSheet 내부에서 슬라이드 전환으로 표시
 * - 모음 이름 입력 및 카테고리 선택 기능
 */
import { useState } from 'react';
import BackIcon from '@/assets/icons/common/back.svg';
import {
  type ArchiveCategory,
  ARCHIVE_CATEGORY_LABEL,
} from '../../utils/archiveCategory';
import { CategoryEditorIconImage } from '../../constants/images';

/** 카테고리 목록 (표시 순서) */
const CATEGORY_ORDER: ArchiveCategory[] = [
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

/** Props 타입 정의 */
interface AddCollectionViewProps {
  onBack: () => void;
  onAdd?: (name: string, category: ArchiveCategory) => void;
  name: string;
  onNameChange: (name: string) => void;
  selectedCategory: ArchiveCategory | null;
  onCategoryChange: (category: ArchiveCategory) => void;
  hideButton?: boolean;
}

/** 최대 이름 길이 */
const MAX_NAME_LENGTH = 20;

export default function AddCollectionView({
  onBack,
  onAdd,
  name,
  onNameChange,
  selectedCategory,
  onCategoryChange,
  hideButton = false,
}: AddCollectionViewProps) {
  /** Input focus 상태 */
  const [isFocused, setIsFocused] = useState(false);

  /** 이름 변경 핸들러 */
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_NAME_LENGTH) {
      onNameChange(text);
    }
  };

  /** 카테고리 선택 핸들러 */
  const handleCategorySelect = (categoryId: ArchiveCategory) => {
    onCategoryChange(categoryId);
  };

  /** 추가하기 버튼 활성화 여부 */
  const isAddEnabled = name.trim().length > 0 && selectedCategory !== null;

  /** 추가하기 핸들러 */
  const handleAdd = () => {
    if (isAddEnabled && selectedCategory) {
      onAdd?.(name.trim(), selectedCategory);
    }
  };

  return (
    <div className='flex min-h-0 flex-1 flex-col overflow-y-auto'>
      {/* Header */}
      <div className='flex flex-shrink-0 flex-row items-center gap-2 px-5 pb-5'>
        <button
          onClick={onBack}
          className='flex items-center justify-center transition-opacity hover:opacity-70 active:opacity-100'
        >
          <img src={BackIcon} alt='back' className='h-9 w-9' />
        </button>
        <span className='text-xl font-bold text-black'>모음 추가</span>
      </div>

      <div className='mx-[20px] pb-10'>
        {/* 모음 이름 섹션 */}
        <div className='mb-6'>
          <div className='mb-2 flex flex-row items-center justify-between'>
            <span className='text-[14px] font-semibold leading-[20px] text-black'>
              모음 이름
            </span>
            <span className='text-xs text-grey-500'>
              {name.length}/{MAX_NAME_LENGTH}
            </span>
          </div>
          <div
            className={`rounded-[10px] border bg-white px-4 py-4 transition-colors ${
              isFocused ? 'border-grey-800' : 'border-grey-200'
            }`}
          >
            <input
              type='text'
              value={name}
              onChange={handleNameChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder='모음명을 입력해주세요.'
              className='w-full bg-transparent p-0 text-base text-grey-900 outline-none placeholder:text-[#9C9FAE]'
              maxLength={MAX_NAME_LENGTH}
            />
          </div>
        </div>

        {/* 카테고리 섹션 */}
        <div>
          <span className='mb-3 block text-[14px] font-semibold leading-[20px] text-black'>
            카테고리
          </span>

          {/* 첫 번째 줄: 맛집, 취미, 여행, 재테크, 쇼핑 */}
          <div className='mb-4 flex flex-row justify-between'>
            {CATEGORY_ORDER.slice(0, 5).map((categoryId) => (
              <CategoryButton
                key={categoryId}
                categoryId={categoryId}
                isSelected={selectedCategory === categoryId}
                onPress={() => handleCategorySelect(categoryId)}
              />
            ))}
          </div>

          {/* 두 번째 줄: 운동, 커리어, 자기계발, 꿀팁, 기타 */}
          <div className='flex flex-row justify-between'>
            {CATEGORY_ORDER.slice(5, 10).map((categoryId) => (
              <CategoryButton
                key={categoryId}
                categoryId={categoryId}
                isSelected={selectedCategory === categoryId}
                onPress={() => handleCategorySelect(categoryId)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 하단 CTA 버튼 */}
      {!hideButton && (
        <div className='bg-white px-5 py-4'>
          <button
            className={`flex w-full items-center justify-center rounded-[12px] py-[14px] transition-colors ${
              isAddEnabled ? 'bg-point' : 'bg-grey-50'
            }`}
            onClick={handleAdd}
            disabled={!isAddEnabled}
          >
            <span
              className={`text-center text-xl font-bold ${
                isAddEnabled ? 'text-white' : 'text-grey-400'
              }`}
            >
              추가하기
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

/** 카테고리 버튼 컴포넌트 */
interface CategoryButtonProps {
  categoryId: ArchiveCategory;
  isSelected: boolean;
  onPress: () => void;
}

function CategoryButton({
  categoryId,
  isSelected,
  onPress,
}: CategoryButtonProps) {
  const icons = CategoryEditorIconImage[categoryId];
  const iconSrc = isSelected ? icons.selected : icons.unselected;
  const label = ARCHIVE_CATEGORY_LABEL[categoryId];

  return (
    <button
      className='flex w-[54px] flex-col items-center transition-opacity hover:opacity-70 active:opacity-100'
      onClick={onPress}
    >
      <div className='mb-1.5 overflow-hidden rounded-full'>
        <img src={iconSrc} alt={label} className='h-10 w-10' />
      </div>
      <span
        className={`text-center text-[13px] font-medium leading-[18px] ${
          isSelected ? 'text-point' : 'text-grey-800'
        }`}
      >
        {label}
      </span>
    </button>
  );
}
