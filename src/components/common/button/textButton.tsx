import type { ButtonHTMLAttributes } from 'react';

type TextButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * 텍스트 형태의 버튼 컴포넌트
 */
export const TextButton = ({
  children,
  disabled,
  className = '',
  ...props
}: TextButtonProps) => {
  /** 텍스트 버튼은 disabled 상태일 때 텍스트 색상만 변경됨 */
  return (
    <button
      disabled={disabled}
      className={`p-2 text-body-lg ${
        disabled ? 'text-grey-400' : 'text-point'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
