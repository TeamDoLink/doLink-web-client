import type { ButtonHTMLAttributes } from 'react';

interface CtaSecondButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

/**
 * 주요 CTA 영역에서 사용하는 공통 버튼 컴포넌트
 */
export const CtaSecondButton = ({
  children,
  disabled,
  className = '',
  ...props
}: CtaSecondButtonProps) => {
  const stateClass = disabled
    ? 'bg-transparent text-grey-400'
    : 'bg-[#394CFF33] text-point active:bg-[#394CFF66] active:text-point';

  return (
    <button
      disabled={disabled}
      className={`h-14 w-80 rounded-xl text-heading-md ${stateClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
