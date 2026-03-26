import React, { useState } from 'react';
import ClearButton from './clearButton';

export type ClearableSearchInputFieldProps = {
  /** 입력 값 (컨트롤드) */
  value?: string;
  /** 값 변경 콜백 */
  onChange?: (v: string) => void;
  /** placeholder 텍스트 */
  placeholder?: string;
  /** 입력 비활성화 */
  disabled?: boolean;
  /** 컴포넌트 클래스 (Tailwind 클래스) 기본: '' */
  className?: string;
  /** 컴포넌트 높이 (Tailwind 클래스) 기본: h-11 (44px) */
  height?: string;
  /** 왼쪽에 표시할 아이콘(예: 검색 아이콘) */
  leadingIcon?: React.ReactNode;
  /** 접근성 레이블(필요 시) */
  ariaLabel?: string;
  /** 키보드 입력 이벤트 (enter 처리) */
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
};

/**
 * ClearableSearchInputField
 * - Figma 디자인을 기준으로 재사용 가능한 검색 입력 컴포넌트
 * - 커서는 CSS로 그리지 않음 (브라우저 기본 사용)
 * - Focused 상태에서 X 버튼(클리어)을 표시하고 클릭 시 `onChange('')`로 초기화
 * - 단일 책임: 입력 렌더링 및 값 변경/클리어 처리
 */
export default function ClearableSearchInputField({
  value = '',
  onChange,
  placeholder = '검색어를 입력해주세요',
  disabled = false,
  className = '',
  height = 'h-11',
  leadingIcon,
  ariaLabel,
  onKeyDown,
}: ClearableSearchInputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const clearInput = () => {
    onChange?.('');
  };

  return (
    <div
      className={`flex items-center gap-3 overflow-hidden rounded-[12px] bg-white px-4 ${height} ${className} ${
        isFocused ? 'border-[1px] border-grey-800' : 'border border-grey-200'
      }`}
    >
      {leadingIcon ? <div className='flex-shrink-0'>{leadingIcon}</div> : null}

      <input
        type='text'
        role='searchbox'
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel}
        className={`min-w-0 flex-1 border-none bg-transparent text-body-md text-grey-900 outline-none placeholder:text-grey-400 ${
          disabled ? 'cursor-not-allowed opacity-60' : ''
        }`}
      />

      {/* 포커스 상태에서만 표시되고 값이 있을 때 동작 (SRP: ClearButton은 클릭만 처리) */}
      {isFocused && value ? (
        <div className='flex-shrink-0'>
          <ClearButton onClick={clearInput} ariaLabel='clear input' />
        </div>
      ) : null}
    </div>
  );
}
