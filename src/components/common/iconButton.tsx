import type { ButtonHTMLAttributes } from 'react';
import moreIcon from '@/assets/icons/common/more.svg';

type IconButtonState = 'enabled' | 'pressed' | 'disabled';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  visualState?: IconButtonState;
  label: string;
}

const stateStyles: Record<IconButtonState, { bg: string; text: string }> = {
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

export const IconButton = ({
  label,
  visualState,
  disabled,
  className = '',
  ...props
}: IconButtonProps) => {
  const resolvedState: IconButtonState = disabled
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
      className={`inline-flex w-fit items-center rounded-[20px] py-[7px] pl-3 pr-2 text-body-sm transition ${
        styles.bg
      } ${styles.text} ${activeClass} ${className}`}
      {...props}
    >
      <span className="mr-[2px]">{label}</span>
      <img src={moreIcon} alt="더보기" className="h-4 w-4" />
    </button>
  );
};
