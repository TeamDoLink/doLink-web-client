import type { ChangeEventHandler } from 'react';

interface ArchiveInputProps {
  label: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  maxLength?: number;
}

/**
 * 모음 이름 입력 필드 컴포넌트
 * 레이블과 길이 카운터를 함께 표시
 */
export const ArchiveInput = ({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
}: ArchiveInputProps) => {
  const counter = maxLength ? `${value.length}/${maxLength}` : undefined;
  const isOverLimit = maxLength ? value.length >= maxLength : false;

  return (
    <div className='flex flex-col'>
      <div className='flex items-center justify-between'>
        <span className='text-body-xl text-black'>{label}</span>
        {counter && (
          <span
            className={`text-caption-sm ${
              isOverLimit ? 'text-error' : 'text-grey-500'
            }`}
          >
            {counter}
          </span>
        )}
      </div>

      <input
        type='text'
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className='mt-2 h-[52px] w-full rounded-[12px] border border-grey-200 px-4 text-body-md text-black placeholder:text-grey-400 focus:border-grey-800 focus:outline-none'
      />
    </div>
  );
};
