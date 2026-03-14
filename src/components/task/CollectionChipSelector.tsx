import { useState } from 'react';

export type CollectionChip = {
  id: string;
  label: string;
  disabled?: boolean;
};

export type CollectionChipSelectorProps = {
  items: CollectionChip[];
  selectedId: string;
  onSelect: (id: string) => void;
  expandedItemCount: number;
  label?: string;
};

/**
 * 담을 모음 선택 칩 셀렉터 컴포넌트
 * 특징:
 * - 칩 형태로 컬렉션 선택 가능
 * - 초기 상태: 제한된 수의 칩 표시 + "더보기" 버튼
 * - "더보기" 클릭: 모든 칩 표시 + "접기" 버튼으로 변경
 * - 선택된 칩: 파란색 테두리, 흰 배경
 * - 미선택 칩: 회색 배경
 */
export const CollectionChipSelector = ({
  items,
  selectedId = '',
  onSelect,
  expandedItemCount = 8,
  label = '담을 모음 선택',
}: CollectionChipSelectorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayedItems = isExpanded ? items : items.slice(0, expandedItemCount);
  const hasMore = items.length > expandedItemCount;

  return (
    <div className='flex flex-col gap-3'>
      {label && <p className='text-body-lg text-black'>{label}</p>}

      <div className='flex flex-wrap gap-2'>
        {displayedItems.map((item) => (
          <button
            key={item.id}
            onClick={() => !item.disabled && onSelect(item.id)}
            disabled={item.disabled}
            className={`rounded-[6px] border px-[12px] py-[8px] text-body-md ${
              item.disabled
                ? 'border-transparent bg-[#f3f4f7] text-grey-300'
                : selectedId === item.id
                  ? 'border-point bg-white text-point'
                  : 'border-transparent bg-[#f3f4f7] text-grey-600'
            }`}
          >
            {item.label}
          </button>
        ))}

        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`rounded-[6px] px-2 py-2 text-body-xs text-grey-500`}
          >
            {isExpanded ? '접기' : '더보기'}
          </button>
        )}
      </div>
    </div>
  );
};
