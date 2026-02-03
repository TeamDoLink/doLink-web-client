import type { ButtonHTMLAttributes } from 'react';
import rightIcon from '@/assets/icons/common/direction-right.svg';

interface SettingMenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // 왼쪽 텍스트
  leftText?: string;
  // 오른쪽 텍스트
  rightText?: string;
  // 화살표 아이콘 표시 여부 (기본값: true)
  showArrow?: boolean;
}

/**
 * 설정 헤더 컴포넌트
 * - 좌측 : 텍스트
 * - 우측 : 텍스트 + 화살표 아이콘
 */

export const SettingMenuItem = ({
  leftText,
  rightText,
  showArrow = true,
  className = '',
  ...props
}: SettingMenuItemProps) => {
  const renderRight = rightText ? (
    <span className='text-body-md text-grey-500'>{rightText}</span>
  ) : null;

  return (
    <button
      type='button'
      className={`flex h-14 w-full items-center justify-between bg-white px-[20px] py-[10px] text-left ${className}`}
      {...props}
    >
      <span className='text-heading-md text-grey-900'>{leftText ?? ''}</span>
      <div className='flex items-center gap-1'>
        {renderRight}
        {showArrow && <img src={rightIcon} alt='다음' className='h-4 w-4' />}
      </div>
    </button>
  );
};
