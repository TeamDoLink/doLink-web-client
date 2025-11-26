import type { ButtonHTMLAttributes } from 'react';

type BlueButtonState = 'enabled' | 'pressed' | 'disabled';

interface BlueButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  visualState?: BlueButtonState;
}

const stateStyles: Record<BlueButtonState, { bg: string; text: string }> = {
  enabled: {
    bg: 'bg-[rgba(57,76,255,0.15)]',
    text: 'text-point',
  },
  pressed: {
    bg: 'bg-[rgba(57,76,255,0.30)]',
    text: 'text-point',
  },
  disabled: {
    bg: 'bg-[rgba(57,76,255,0.15)]',
    text: 'text-[rgba(57,76,255,0.50)]',
  },
};

export const BlueButton = ({
  children,
  className = '',
  disabled,
  visualState,
  ...props
}: BlueButtonProps) => {
  const resolvedState: BlueButtonState = disabled
    ? 'disabled'
    : (visualState ?? 'enabled');

  const styles = stateStyles[resolvedState];
  const isDisabled = resolvedState === 'disabled';
  const activeClass =
    resolvedState === 'enabled' ? 'active:bg-[rgba(57,76,255,0.30)]' : '';

  return (
    <button
      type="button"
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
