import { useState, useRef, useEffect } from 'react';
import DropDownMenu from './dropDownMenu'; // 경로만 맞추면 됨

export type SortDropdownProps = {
  value?: 'all' | 'latest';
  onChange?: (value: 'all' | 'latest') => void;
};

const options = [
  { value: 'all' as const, label: '전체' },
  { value: 'latest' as const, label: '최신 순' },
];

export default function SortDropdown({
  value = 'all',
  onChange,
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: 'all' | 'latest') => {
    setSelected(optionValue);
    onChange?.(optionValue);
    setIsOpen(false);
  };

  const selectedLabel = options.find((opt) => opt.value === selected)?.label;

  return (
    <div ref={dropdownRef} className='relative inline-block'>
      {/* 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex cursor-pointer items-center gap-1 whitespace-nowrap bg-white px-3 py-1'
      >
        <p className='text-caption-sm text-grey-600'>{selectedLabel}</p>

        <svg
          className={`h-4 w-2 shrink-0 text-grey-600 ${isOpen ? 'rotate-180' : ''}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 8 4'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.5}
            d='M1 1l3 2 3-2'
          />
        </svg>
      </button>

      {/* 메뉴 */}
      {isOpen && (
        <div className='absolute left-0 top-full z-50 mt-2'>
          <DropDownMenu
            options={options}
            selectedValue={selected}
            onSelect={(value) => handleSelect(value as 'all' | 'latest')}
          />
        </div>
      )}
    </div>
  );
}
