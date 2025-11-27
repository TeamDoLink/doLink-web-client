import type { ButtonHTMLAttributes } from 'react';
import rightIcon from '@/assets/icons/common/direction-right.svg';

interface SettingProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  leftText: string;
  rightText?: string;
  showArrow?: boolean;
}

export const Setting = ({
  leftText,
  rightText,
  showArrow = true,
  className = '',
  ...props
}: SettingProps) => {
  return (
    <button
      type='button'
      className={`flex h-14 w-full items-center justify-between bg-white px-3 py-3 text-left ${className}`}
      {...props}
    >
      <span className='text-heading-md text-grey-900'>{leftText}</span>
      <div className='flex items-center gap-1'>
        {rightText && (
          <span className='text-body-md text-grey-500'>{rightText}</span>
        )}
        {showArrow && <img src={rightIcon} alt='다음' className='h-4 w-4' />}
      </div>
    </button>
  );
};
