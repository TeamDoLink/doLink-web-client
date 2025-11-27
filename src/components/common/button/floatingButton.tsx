import type { ButtonHTMLAttributes } from 'react';

type CirclePlusVisualState = 'enabled' | 'pressed' | 'disabled';

interface FloatingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  visualState?: CirclePlusVisualState;
}

export const FloatingButton = ({
  disabled,
  className = '',
  visualState,
  ...props
}: FloatingButtonProps) => {
  const resolvedState: CirclePlusVisualState = disabled
    ? 'disabled'
    : (visualState ?? 'enabled');

  const bgClass = (() => {
    switch (resolvedState) {
      case 'pressed':
        return 'bg-grey-600';
      default:
        return 'bg-black';
    }
  })();

  const iconColor =
    resolvedState === 'disabled' ? 'text-grey-600' : 'text-white';
  const isActuallyDisabled = disabled || resolvedState === 'disabled';
  const shadowClass =
    resolvedState === 'disabled'
      ? 'shadow-none'
      : 'shadow-[0_4px_12px_rgba(0,4,37,0.28)]';

  return (
    <button
      disabled={isActuallyDisabled}
      className={`flex h-[52px] w-[52px] items-center justify-center rounded-full transition-colors ${bgClass} ${shadowClass} ${
        resolvedState === 'enabled' ? 'active:bg-grey-600' : ''
      } ${className}`}
      {...props}
    >
      <svg
        width='20'
        height='20'
        viewBox='0 0 20 20'
        className={iconColor}
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M10 4v12'
          stroke='currentColor'
          strokeWidth='1.5'
          strokeLinecap='round'
        />
        <path
          d='M4 10h12'
          stroke='currentColor'
          strokeWidth='1.5'
          strokeLinecap='round'
        />
      </svg>
    </button>
  );
};
