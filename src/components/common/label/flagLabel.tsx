import type { HTMLAttributes, PropsWithChildren } from 'react';

interface FlagLabelProps
  extends HTMLAttributes<HTMLSpanElement>,
    PropsWithChildren {
  completed?: boolean;
}

/**
 * 완료/미완료 상태를 나타내는 태그형 버튼
 */
export const FlagLabel = ({
  completed = false,
  className = '',
  children,
  ...props
}: FlagLabelProps) => {
  const variantClass = completed
    ? 'bg-[#E5E8FF] text-point'
    : 'bg-grey-100 text-grey-600';

  return (
    <span
      className={`inline-flex items-center justify-center rounded-[6px] px-[8px] py-[4px] text-caption-md leading-[15px] transition-colors ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
