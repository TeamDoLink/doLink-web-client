import type { ButtonHTMLAttributes } from 'react';

interface CtaButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

/**
 * 주요 CTA 영역에서 사용하는 공통 버튼 컴포넌트
 */
export const CtaButton = ({
  children,
  disabled,
  className = '',
  ...props
}: CtaButtonProps) => {
  const stateClass = disabled
    ? 'bg-transparent text-grey-400'
    : 'bg-point text-white active:bg-[#2435CB]';

  return (
    <button
      disabled={disabled}
      className={`h-14 w-full rounded-xl text-heading-md ${stateClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
