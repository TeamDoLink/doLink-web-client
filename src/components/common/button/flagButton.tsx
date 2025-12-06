import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

interface FlagButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    PropsWithChildren {
  completed?: boolean;
}

/**
 * 완료/미완료 상태를 나타내는 태그형 버튼
 */
export const FlagButton = ({
  completed = false,
  className = '',
  children,
  ...props
}: FlagButtonProps) => {
  const variantClass = completed
    ? 'bg-[#E5E8FF] text-point'
    : 'bg-grey-100 text-grey-600';

  return (
    <button
      type='button'
      className={`inline-flex items-center justify-center rounded-[5px] p-[6px] text-caption-md transition-colors ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
