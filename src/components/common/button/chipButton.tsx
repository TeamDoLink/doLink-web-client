import type { ButtonHTMLAttributes } from 'react';

type ChipButtonProps = {
  selected?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * 칩 형태의 버튼 컴포넌트
 * - 상태(selected)는 외부에서 제어 (controlled)
 */
export const ChipButton = ({
  selected = false,
  className = '',
  onClick,
  disabled,
  children,
  ...props
}: ChipButtonProps) => {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`rounded-[6px] px-3 py-2 text-body-lg transition ${
        selected
          ? 'border border-point bg-white text-point'
          : 'bg-transparent text-grey-600'
      } ${disabled ? 'cursor-not-allowed opacity-40' : ''} ${className} `}
      {...props}
    >
      {children}
    </button>
  );
};
