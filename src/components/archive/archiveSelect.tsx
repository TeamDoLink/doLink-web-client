import type { MouseEventHandler } from 'react';

import restaurantSelected from '@/assets/icons/category/editor/restaurant-selected.svg';
import restaurantUnselected from '@/assets/icons/category/editor/restaurant-unselected.svg';
import hobbySelected from '@/assets/icons/category/editor/hobby-selected.svg';
import hobbyUnselected from '@/assets/icons/category/editor/hobby-unselected.svg';
import travelSelected from '@/assets/icons/category/editor/travel-selected.svg';
import travelUnselected from '@/assets/icons/category/editor/travel-unselected.svg';
import moneySelected from '@/assets/icons/category/editor/money-selected.svg';
import moneyUnselected from '@/assets/icons/category/editor/money-unselected.svg';
import shoppingSelected from '@/assets/icons/category/editor/shopping-selected.svg';
import shoppingUnselected from '@/assets/icons/category/editor/shopping-unselected.svg';
import exerciseSelected from '@/assets/icons/category/editor/exercise-selected.svg';
import exerciseUnselected from '@/assets/icons/category/editor/exercise-unselected.svg';
import careerSelected from '@/assets/icons/category/editor/career-selected.svg';
import careerUnselected from '@/assets/icons/category/editor/career-unselected.svg';
import studySelected from '@/assets/icons/category/editor/study-selected.svg';
import studyUnselected from '@/assets/icons/category/editor/study-unselected.svg';
import tipsSelected from '@/assets/icons/category/editor/tips-selected.svg';
import tipsUnselected from '@/assets/icons/category/editor/tips-unselected.svg';
import etcSelected from '@/assets/icons/category/editor/etc-selected.svg';
import etcUnselected from '@/assets/icons/category/editor/etc-unselected.svg';

export type ArchiveCategoryKey =
  | 'restaurant'
  | 'hobby'
  | 'travel'
  | 'money'
  | 'shopping'
  | 'exercise'
  | 'career'
  | 'study'
  | 'tips'
  | 'etc';

interface ArchiveSelectProps {
  selected?: ArchiveCategoryKey | null;
  onSelect?: (category: ArchiveCategoryKey) => void;
}

const CATEGORY_ITEMS: Array<{
  key: ArchiveCategoryKey;
  label: string;
  selectedIcon: string;
  unselectedIcon: string;
}> = [
  {
    key: 'restaurant',
    label: '맛집',
    selectedIcon: restaurantSelected,
    unselectedIcon: restaurantUnselected,
  },
  {
    key: 'hobby',
    label: '취미',
    selectedIcon: hobbySelected,
    unselectedIcon: hobbyUnselected,
  },
  {
    key: 'travel',
    label: '여행',
    selectedIcon: travelSelected,
    unselectedIcon: travelUnselected,
  },
  {
    key: 'money',
    label: '재테크',
    selectedIcon: moneySelected,
    unselectedIcon: moneyUnselected,
  },
  {
    key: 'shopping',
    label: '쇼핑',
    selectedIcon: shoppingSelected,
    unselectedIcon: shoppingUnselected,
  },
  {
    key: 'exercise',
    label: '운동',
    selectedIcon: exerciseSelected,
    unselectedIcon: exerciseUnselected,
  },
  {
    key: 'career',
    label: '커리어',
    selectedIcon: careerSelected,
    unselectedIcon: careerUnselected,
  },
  {
    key: 'study',
    label: '자기개발',
    selectedIcon: studySelected,
    unselectedIcon: studyUnselected,
  },
  {
    key: 'tips',
    label: '꿀팁',
    selectedIcon: tipsSelected,
    unselectedIcon: tipsUnselected,
  },
  {
    key: 'etc',
    label: '기타',
    selectedIcon: etcSelected,
    unselectedIcon: etcUnselected,
  },
];

/**
 * 카테고리 선택 컴포넌트
 * - 미선택/선택 상태에 맞춰 대응 아이콘을 렌더링
 */
export const ArchiveSelect = ({ selected, onSelect }: ArchiveSelectProps) => {
  const handleClick =
    (key: ArchiveCategoryKey): MouseEventHandler<HTMLButtonElement> =>
    (event) => {
      event.preventDefault();
      onSelect?.(key);
    };

  return (
    <div className='flex flex-col'>
      <span className='text-body-xl text-black'>카테고리</span>
      <div className='mt-3 grid grid-cols-5 gap-x-4 gap-y-6'>
        {CATEGORY_ITEMS.map(({ key, label, selectedIcon, unselectedIcon }) => {
          const isSelected = selected === key;

          return (
            <button
              key={key}
              type='button'
              onClick={handleClick(key)}
              aria-pressed={isSelected}
              className='flex flex-col items-center gap-2'
            >
              <img
                src={isSelected ? selectedIcon : unselectedIcon}
                alt={label}
                className={`h-10 w-10${isSelected ? 'drop-shadow-[0_4px_12px_rgba(57,76,255,0.25)]' : ''}`}
              />
              <span className='text-body-sm text-grey-800'>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
