import type { ButtonHTMLAttributes } from 'react';

type GreyButtonState = 'enabled' | 'pressed' | 'disabled';

interface GreyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  visualState?: GreyButtonState;
}

const stateStyles: Record<GreyButtonState, { bg: string; text: string }> = {
  enabled: {
    bg: 'bg-[#EDEEF1]',
    text: 'text-grey-800',
  },
  pressed: {
    bg: 'bg-[#DCDFE6]',
    text: 'text-grey-800',
  },
  disabled: {
    bg: 'bg-[#EDEEF1]',
    text: 'text-grey-400',
  },
};

export const GreyButton = ({
  children,
  className = '',
  disabled,
  visualState,
  ...props
}: GreyButtonProps) => {
  const resolvedState: GreyButtonState = disabled
    ? 'disabled'
    : (visualState ?? 'enabled');

  const styles = stateStyles[resolvedState];
  const isDisabled = resolvedState === 'disabled';
  const activeClass = resolvedState === 'enabled' ? 'active:bg-[#DCDFE6]' : '';

  return (
    <button
      type='button'
      disabled={isDisabled}
      className={`inline-flex w-fit items-center justify-center rounded-[6px] px-2 py-[7px] text-body-sm transition ${
        styles.bg
      } ${styles.text} ${activeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
