import type { ButtonHTMLAttributes } from 'react';

import AllSelectedIcon from '@/assets/icons/category/home/all-selected.svg';
import AllUnselectedIcon from '@/assets/icons/category/home/all-unselected.svg';
import RestaurantSelectedIcon from '@/assets/icons/category/home/restaurant-selected.svg';
import RestaurantUnselectedIcon from '@/assets/icons/category/home/restaurant-unselected.svg';
import TravelSelectedIcon from '@/assets/icons/category/home/travel-selected.svg';
import TravelUnselectedIcon from '@/assets/icons/category/home/travel-unselected.svg';
import ShoppingSelectedIcon from '@/assets/icons/category/home/shopping-selected.svg';
import ShoppingUnselectedIcon from '@/assets/icons/category/home/shopping-unselected.svg';
import MoneySelectedIcon from '@/assets/icons/category/home/money-selected.svg';
import MoneyUnselectedIcon from '@/assets/icons/category/home/money-unselected.svg';
import HobbySelectedIcon from '@/assets/icons/category/home/hobby-selected.svg';
import HobbyUnselectedIcon from '@/assets/icons/category/home/hobby-unselected.svg';
import StudySelectedIcon from '@/assets/icons/category/home/study-selected.svg';
import StudyUnselectedIcon from '@/assets/icons/category/home/study-unselected.svg';
import EtcSelectedIcon from '@/assets/icons/category/home/etc-selected.svg';
import EtcUnselectedIcon from '@/assets/icons/category/home/etc-unselected.svg';
import TipSelectedIcon from '@/assets/icons/category/home/tips-selected.svg';
import TipUnselectedIcon from '@/assets/icons/category/home/tips-unselected.svg';

const CATEGORY_LABEL_MAP = {
  all: '전체',
  restaurant: '맛집',
  travel: '여행',
  shopping: '쇼핑',
  money: '재테크',
  hobby: '취미',
  study: '자기계발',
  etc: '기타',
  tip: '꿀팁',
} as const;

const CATEGORY_ICON_MAP = {
  all: {
    selected: AllSelectedIcon,
    unselected: AllUnselectedIcon,
  },
  restaurant: {
    selected: RestaurantSelectedIcon,
    unselected: RestaurantUnselectedIcon,
  },
  travel: {
    selected: TravelSelectedIcon,
    unselected: TravelUnselectedIcon,
  },
  shopping: {
    selected: ShoppingSelectedIcon,
    unselected: ShoppingUnselectedIcon,
  },
  money: {
    selected: MoneySelectedIcon,
    unselected: MoneyUnselectedIcon,
  },
  hobby: {
    selected: HobbySelectedIcon,
    unselected: HobbyUnselectedIcon,
  },
  study: {
    selected: StudySelectedIcon,
    unselected: StudyUnselectedIcon,
  },
  etc: {
    selected: EtcSelectedIcon,
    unselected: EtcUnselectedIcon,
  },
  tip: {
    selected: TipSelectedIcon,
    unselected: TipUnselectedIcon,
  },
} as const;

export type ArchiveCategoryKey = keyof typeof CATEGORY_LABEL_MAP;

type CategoryFilterButtonProps = {
  category: ArchiveCategoryKey;
  selected?: boolean;
  label?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const CategoryFilterButton = ({
  category,
  selected = false,
  label,
  className,
  ...buttonProps
}: CategoryFilterButtonProps) => {
  const iconSrc = selected
    ? CATEGORY_ICON_MAP[category].selected
    : CATEGORY_ICON_MAP[category].unselected;

  return (
    <button
      type='button'
      className={`flex h-[74px] w-14 flex-col items-center justify-between bg-transparent p-0${
        className ? ` ${className}` : ''
      }`}
      {...buttonProps}
    >
      <img
        src={iconSrc}
        alt={label ?? CATEGORY_LABEL_MAP[category]}
        className='h-14 w-14'
      />
      <span
        className={`text-caption-md ${
          selected ? 'text-grey-900' : 'text-grey-500'
        }`}
      >
        {label ?? CATEGORY_LABEL_MAP[category]}
      </span>
    </button>
  );
};
