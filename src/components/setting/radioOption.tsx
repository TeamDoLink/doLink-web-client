import type { ButtonHTMLAttributes } from 'react';

import radioSelectedIcon from '@/assets/icons/common/radio-selected.svg';
import radioUnselectedIcon from '@/assets/icons/common/radio-unselected.svg';

export interface SettingRadioOptionProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  label: string;
  selected?: boolean;
  onSelect?: () => void;
}

export const SettingRadioOption = ({
  label,
  selected = false,
  onSelect,
  className = '',
  ...buttonProps
}: SettingRadioOptionProps) => {
  return (
    <button
      type='button'
      role='radio'
      aria-checked={selected}
      onClick={() => onSelect?.()}
      className={`flex w-full items-center gap-2 rounded-2xl bg-white py-2.5 text-left transition-colors ${className}`}
      {...buttonProps}
    >
      <img
        src={selected ? radioSelectedIcon : radioUnselectedIcon}
        alt=''
        className='h-6 w-6'
      />
      <span className='text-body-lg text-grey-800'>{label}</span>
    </button>
  );
};
