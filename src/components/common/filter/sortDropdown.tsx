import { useState, useRef, useEffect } from 'react';
import DropDownMenu, { type DropDownMenuOption } from './dropDownMenu';

export type SortDropdownProps<T extends string = string> = {
  value?: T;
  onChange?: (value: T) => void;
  options: DropDownMenuOption[];
};

export default function SortDropdown<T extends string = string>({
  value,
  onChange,
  options,
}: SortDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(value ?? (options[0]?.value as T));
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setSelected(value);
    }
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

  const handleSelect = (optionValue: string) => {
    setSelected(optionValue as T);
    onChange?.(optionValue as T);
    setIsOpen(false);
  };

  const selectedLabel = options.find((opt) => opt.value === selected)?.label;

  return (
    <div ref={dropdownRef} className='relative inline-block'>
      {/* 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex cursor-pointer items-center gap-[2px] whitespace-nowrap rounded-[4px] bg-white px-0 py-0'
      >
        <p className='text-caption-sm text-grey-600'>{selectedLabel}</p>

        <svg
          className={`h-4 w-4 shrink-0 text-grey-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 16 16'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.5}
            d='M4 6l4 4 4-4'
          />
        </svg>
      </button>

      {/* 메뉴 */}
      {isOpen && (
        <div className='absolute right-0 top-full z-50 mt-2'>
          <DropDownMenu
            options={options}
            selectedValue={selected}
            onSelect={handleSelect}
          />
        </div>
      )}
    </div>
  );
}
