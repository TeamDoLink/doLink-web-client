import { useState } from 'react';
import homeSelected from '@/assets/icons/tabs/home-selected.svg';
import homeUnselected from '@/assets/icons/tabs/home-unselected.svg';
import folderSelected from '@/assets/icons/tabs/folder-selected.svg';
import folderUnselected from '@/assets/icons/tabs/folder-unselected.svg';
import settingSelected from '@/assets/icons/tabs/setting-selected.svg';
import settingUnselected from '@/assets/icons/tabs/setting-unselected.svg';

export type TabKey = 'home' | 'folder' | 'setting';

interface TabItem {
  key: TabKey;
  label: string;
  iconSelected: string;
  iconUnselected: string;
}

const DEFAULT_TABS: TabItem[] = [
  {
    key: 'home',
    label: '홈',
    iconSelected: homeSelected,
    iconUnselected: homeUnselected,
  },
  {
    key: 'folder',
    label: '모음',
    iconSelected: folderSelected,
    iconUnselected: folderUnselected,
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
  showGrabber?: boolean;
}

export const BottomTabBar = ({
  value,
  onChange,
  items = DEFAULT_TABS,
}: BottomTabBarProps) => {
  const [internalValue, setInternalValue] = useState<TabKey>(
    value ?? items[0].key
  );
  const activeKey = value ?? internalValue;

  const handleSelect = (key: TabKey) => {
    setInternalValue(key);
    onChange?.(key);
  };

  return (
    <nav className="w-full bg-white px-8 pb-6 pt-4 shadow-[0_-5px_10px_rgba(0,0,0,0.04)]">
      <ul className="flex items-center justify-center gap-20">
        {items.map(({ key, label, iconSelected, iconUnselected }) => {
          const active = activeKey === key;
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => handleSelect(key)}
                className="flex flex-col items-center gap-1"
              >
                <img
                  src={active ? iconSelected : iconUnselected}
                  alt=""
                  className="h-6 w-6"
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
      {/* {showGrabber && (
        <div className="mt-4 flex justify-center">
          <span className="h-1 w-16 rounded-full bg-black" />
        </div>
      )} */}
    </nav>
  );
};
