import { useState } from 'react';
import type { ButtonHTMLAttributes } from 'react';

type ChipButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * 칩 형태의 버튼 컴포넌트
 * 클릭 시 내부 상태 (selected)를 업데이트하며 이에 따라 스타일이 변경됨
 */
export const ChipButton = ({
  children,
  className = '',
  onClick,
  ...props
}: ChipButtonProps) => {
  // 선택 상태 로컬 관리
  const [selected, setSelected] = useState(false);

  // 클릭 시 선택 상태를 토글하고 부모에서 전달된 onClick 핸들러 호출
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    setSelected((prev) => !prev);
    onClick?.(event);
  };

  return (
    <button
      onClick={handleClick}
      className={`rounded-[6px] px-3 py-2 text-body-lg transition ${
        selected
          ? 'border border-point bg-white text-point'
          : 'bg-transparent text-grey-600'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
