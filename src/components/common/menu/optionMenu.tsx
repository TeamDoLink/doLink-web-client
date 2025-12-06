import { useState } from 'react';
import type { MouseEvent } from 'react';
import editIcon from '@/assets/icons/common/edit-16.svg';
import deleteIcon from '@/assets/icons/common/delete-16.svg';

interface OptionMenuItem {
  key: string;
  label: string;
  iconSrc: string;
}

interface OptionMenuProps {
  items?: OptionMenuItem[];
  onSelect?: (key: string) => void;
}

const DEFAULT_ITEMS: OptionMenuItem[] = [
  { key: 'edit', label: '수정', iconSrc: editIcon },
  { key: 'delete', label: '삭제', iconSrc: deleteIcon },
];

const ITEM_CLASS =
  'flex h-12 w-full items-center gap-2 px-4 text-center text-body-sm font-medium text-grey-500 transition-colors';
const SELECTED_CLASS = 'bg-grey-100';
const IDLE_CLASS = 'bg-transparent hover:bg-grey-50';

/**
 * 옵션 메뉴 컴포넌트
 * 수정/삭제 작업을 할 수 있는 메뉴
 * 클릭한 아이템은 선택 상태가 됨
 */
export const OptionMenu = ({
  items = DEFAULT_ITEMS,
  onSelect,
}: OptionMenuProps) => {
  // 현재 선택된 아이템의 key 상태
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // 아이템 선택 핸들러
  const handleSelect =
    (key: string) => (event: MouseEvent<HTMLButtonElement>) => {
      // 이벤트 버블링 방지
      event.stopPropagation();
      // 선택된 상태 업데이트
      setSelectedKey(key);
      // 부모 컴포넌트에 선택된 key 전달
      onSelect?.(key);
    };

  return (
    <div className='flex w-[96px] flex-col overflow-hidden rounded-2xl bg-white py-2 shadow-[0_12px_24px_rgba(18,30,64,0.08)]'>
      {items.map(({ key, label, iconSrc }) => {
        const isSelected = selectedKey === key;
        return (
          <button
            key={key}
            type='button'
            onClick={handleSelect(key)}
            className={`${ITEM_CLASS} ${isSelected ? SELECTED_CLASS : IDLE_CLASS}`}
          >
            <img src={iconSrc} alt='' className='h-4 w-4' aria-hidden />
            <span className='mx-auto'>{label}</span>
          </button>
        );
      })}
    </div>
  );
};
