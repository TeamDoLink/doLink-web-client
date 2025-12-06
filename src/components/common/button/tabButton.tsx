import type { ButtonHTMLAttributes } from 'react';

interface TabButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

/**
 * 텍스트 형태의 버튼 컴포넌트
 */
export const TabButton = ({
  children,
  selected,
  className = '',
  ...props
}: TabButtonProps) => {
  /** 탭 버튼은 선택 상태에 따라 텍스트 색만 변경됨 */
  return (
    <button
      className={`p-2 text-body-lg ${
        selected ? 'text-black' : 'text-grey-500'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
