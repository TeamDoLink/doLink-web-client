import { useState, useRef, type InputHTMLAttributes } from 'react';
import SearchIcon from '@/assets/icons/common/search-24.svg';

interface SearchInputFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onFocus' | 'onBlur' | 'onChange'
  > {
  value?: string;
  onChangeText?: (text: string) => void;
  onSearch?: (text: string) => void;
}

export const SearchInputField = ({
  value,
  onChangeText,
  onSearch,
  placeholder = '검색어를 입력해 주세요',
  className = '',
  ...props
}: SearchInputFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const borderClassName = isFocused ? 'border-grey-800' : 'border-transparent';

  const handleSubmit = () => {
    if (value?.trim()) {
      onSearch?.(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleContainerPress = () => {
    inputRef.current?.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeText?.(e.target.value);
  };

  return (
    <div
      onClick={handleContainerPress}
      className={`flex cursor-text flex-row items-center gap-2.5 rounded-[10px] border bg-grey-50 px-4 py-2.5 transition-colors ${borderClassName} ${className}`}
    >
      <img src={SearchIcon} alt='search' className='h-6 w-6' />

      <input
        ref={inputRef}
        type='text'
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className='flex-1 bg-transparent p-0 text-base text-grey-900 outline-none placeholder:text-[#9C9FAE]'
        {...props}
      />
    </div>
  );
};
