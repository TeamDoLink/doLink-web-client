import { useState } from 'react';
import homeSelected from '@/assets/icons/tabs/home-selected.svg';
import homeUnselected from '@/assets/icons/tabs/home-unselected.svg';
import archiveSelected from '@/assets/icons/tabs/archive-selected.svg';
import archiveUnselected from '@/assets/icons/tabs/archive-unselected.svg';
import settingSelected from '@/assets/icons/tabs/setting-selected.svg';
import settingUnselected from '@/assets/icons/tabs/setting-unselected.svg';

// 탭 키 타입 정의
export type TabKey = 'home' | 'archive' | 'setting';

interface TabItem {
  key: TabKey;
  label: string;
  iconSelected: string;
  iconUnselected: string;
}

// 기본 탭 아이템 정의
const DEFAULT_TABS: TabItem[] = [
  {
    key: 'home',
    label: '홈',
    iconSelected: homeSelected,
    iconUnselected: homeUnselected,
  },
  {
    key: 'archive',
    label: '모음',
    iconSelected: archiveSelected,
    iconUnselected: archiveUnselected,
  },
  {
    key: 'setting',
    label: '설정',
    iconSelected: settingSelected,
    iconUnselected: settingUnselected,
  },
];

interface BottomTabBarProps {
  value?: TabKey;
  onChange?: (next: TabKey) => void;
  items?: TabItem[];
}

/**
 * 하단 탭 바 컴포넌트
 */
export const BottomTabBar = ({
  value,
  onChange,
  items = DEFAULT_TABS,
}: BottomTabBarProps) => {
  /**
   * 내부 상태로 선택된 탭 키 관리
   * controlled 모드 : 부모가 value prop를 내려주면 탭은 value를 기준으로 결정됨
   * uncontrolled 모드 : value prop이 없으면 internalValue를 사용해 내부 상태로 관리
   * uncontrolled 모드의 초기값은 items 배열의 첫 번째 탭 키
   */
  const [internalValue, setInternalValue] = useState<TabKey>(
    value ?? items[0].key
  );

  // 실제 활성 탭 키 결정
  const activeKey = value ?? internalValue;

  // 탭 선택 핸들러
  const handleSelect = (key: TabKey) => {
    setInternalValue(key);
    onChange?.(key);
  };

  return (
    <nav className='w-full bg-white px-8 pb-6 pt-4 shadow-[0_-5px_10px_rgba(0,0,0,0.04)]'>
      <ul className='flex items-center justify-center gap-20'>
        {items.map(({ key, label, iconSelected, iconUnselected }) => {
          const active = activeKey === key;
          return (
            <li key={key}>
              <button
                type='button'
                onClick={() => handleSelect(key)}
                className='flex flex-col items-center gap-1'
              >
                <img
                  src={active ? iconSelected : iconUnselected}
                  alt=''
                  className='h-6 w-6'
                />
                <span
                  className={`text-caption-sm ${active ? 'text-grey-900' : 'text-grey-400'}`}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
