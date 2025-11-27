import type { ButtonHTMLAttributes } from 'react';

type TextButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const TextButton = ({
  children,
  disabled,
  className = '',
  ...props
}: TextButtonProps) => {
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
