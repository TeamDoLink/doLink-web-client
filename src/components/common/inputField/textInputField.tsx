import type { ChangeEvent } from 'react';

/**
 * TextInputField 컴포넌트의 Props 타입
 * 다양한 상태의 텍스트 입력 필드를 지원합니다.
 * 피그마의 "Text+Button" 상태는 'Link' 상태로 구현됩니다.
 */
export type TextInputFieldProps = {
  /** 입력 필드의 상태 (Enabled, Focused, Activated, Error, Link) */
  state?: 'Enabled' | 'Focused' | 'Activated' | 'Error' | 'Link';
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
  /** Error 상태일 때 표시되는 에러 메시지 */
  errorMessage?: string;
  /** Link 상태일 때 버튼 클릭 시 호출되는 콜백 함수 */
  onButtonClick?: () => void;
  /** Link 상태일 때 버튼에 표시되는 레이블 */
  buttonLabel?: string;
  /** 입력 필드의 너비 (Tailwind CSS 클래스, 예: 'w-full', 'w-[335px]') */
  width?: string;
  /** 입력 필드의 고유 ID (label 연결 및 접근성) */
  id?: string;
  /** 입력 필드의 name 속성 (폼 제출 및 자동완성) */
  name?: string;

  readOnly?: boolean;
  onBeforeInput?: (e: React.FormEvent<HTMLInputElement>) => void;
};

export default function TextInputField({
  state = 'Enabled',
  value = '',
  onChange,
  onFocus,
  onBlur,
  placeholder,
  errorMessage,
  onButtonClick,
  buttonLabel,
  width = 'w-full',
  id,
  name,
  readOnly = false,
  onBeforeInput,
}: TextInputFieldProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const handleFocus = () => {
    onFocus?.();
  };

  const handleBlur = () => {
    onBlur?.();
  };

  // Text+Button state
  if (state === 'Link') {
    return (
      <div
        className={`flex ${width} items-center justify-between rounded-[10px] border border-grey-200 bg-white px-[16px] py-[10px]`}
      >
        <input
          type='text'
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onBeforeInput={onBeforeInput}
          placeholder={placeholder}
          readOnly={readOnly}
          className='min-w-0 flex-1 border-none bg-transparent text-body-md text-grey-900 outline-none placeholder:text-grey-400'
        />

        <button
          onMouseDown={(e) => {
            e.preventDefault(); // input blur 방지
            onButtonClick?.();
          }}
          className='rounded-[8px] px-[8px] py-[7px] text-body-xs font-medium text-point transition-colors hover:opacity-80'
          style={{ backgroundColor: 'rgba(57, 76, 255, 0.15)' }}
        >
          {buttonLabel}
        </button>
      </div>
    );
  }

  // Error state with error message
  if (state === 'Error') {
    return (
      <div className={`flex ${width} flex-col gap-2`}>
        <div className='flex items-center justify-center rounded-[10px] border border-error bg-white px-4 py-4'>
          <input
            type='text'
            id={id}
            name={name}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled
            className='min-w-0 flex-1 border-none bg-transparent text-body-md text-black outline-none placeholder:text-black disabled:cursor-not-allowed'
          />
        </div>
        <p className='pl-4 text-body-md text-error'>{errorMessage}</p>
      </div>
    );
  }

  // Focused state with cursor animation
  if (state === 'Focused') {
    return (
      <div
        className={`flex ${width} items-center gap-1 rounded-[10px] border border-grey-800 bg-white px-4 py-4`}
      >
        <input
          type='text'
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onBeforeInput={onBeforeInput}
          placeholder={placeholder}
          autoFocus
          className='min-w-0 flex-1 border-none bg-transparent text-body-md text-black outline-none placeholder:text-grey-400'
        />
      </div>
    );
  }

  // Activated state (input complete)
  if (state === 'Activated') {
    return (
      <div
        className={`flex ${width} items-center justify-center rounded-[10px] border border-grey-200 bg-white px-4 py-4`}
      >
        <input
          type='text'
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onBeforeInput={onBeforeInput}
          placeholder={placeholder}
          readOnly={readOnly}
          className='min-w-0 flex-1 border-none bg-transparent text-body-md text-black outline-none placeholder:text-grey-400'
        />
      </div>
    );
  }

  // Enabled state (default)
  return (
    <div
      className={`flex ${width} items-center justify-center rounded-[10px] border border-grey-200 bg-white px-4 py-4`}
    >
      <input
        type='text'
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        readOnly={readOnly}
        className='min-w-0 flex-1 border-none bg-transparent text-body-md text-grey-900 outline-none placeholder:text-grey-400'
      />
    </div>
  );
}
