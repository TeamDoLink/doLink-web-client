import { useState } from 'react';
import type { ButtonHTMLAttributes } from 'react';

type ChipButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const ChipButton = ({
  children,
  className = '',
  onClick,
  ...props
}: ChipButtonProps) => {
  const [selected, setSelected] = useState(false);

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
