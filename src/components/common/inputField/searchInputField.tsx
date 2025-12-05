import { useState } from 'react';
import searchIcon from '@/assets/icons/common/search-36.svg';

/**
 * SearchInputField 컴포넌트의 Props 타입
 * 검색 입력 필드의 동작과 스타일을 제어합니다.
 */
export type SearchInputFieldProps = {
  /** 입력 필드의 현재 값 */
  value?: string;
  /** 입력값이 변경될 때 호출되는 콜백 함수 */
  onChange?: (value: string) => void;
  /** 입력 필드가 focus되었을 때 호출되는 콜백 함수 */
  onFocus?: () => void;
  /** 입력 필드가 blur되었을 때 호출되는 콜백 함수 */
  onBlur?: () => void;
  /** 입력 필드의 placeholder 텍스트 */
  placeholder?: string;
  /** 입력 필드의 너비 (Tailwind CSS 클래스, 예: 'w-full', 'w-96') */
  width?: string;
};

export default function SearchInputField({
  value = '',
  onChange,
  onFocus,
  onBlur,
  placeholder,
  width = 'w-full',
}: SearchInputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div
      className={`flex items-center gap-1 rounded-[10px] border bg-white p-2 transition-colors ${width} ${
        isFocused ? 'border-[1.2px] border-point' : 'border-grey-700'
      }`}
    >
      <img alt='search' className='h-9 w-9 flex-shrink-0' src={searchIcon} />
      <input
        type='text'
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className='flex-1 border-none bg-transparent text-body-md text-grey-900 outline-none placeholder:text-grey-400'
      />
    </div>
  );
}
