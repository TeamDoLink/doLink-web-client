import type { ButtonHTMLAttributes } from 'react';
import moreBlueIcon from '@/assets/icons/common/more-blue.svg';

// 버튼의 시각적 상태를 정의하는 타입
type IconButtonState = 'enabled' | 'pressed' | 'disabled';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼의 시각적 상태를 외부에서 제어하고 싶을 때 사용하는 prop
   * 미지정시 disabled prop에 따라 자동으로 결정됨
   */
  visualState?: IconButtonState;
  label: string;
}

/**
 * 버튼의 시각적 상태 (enabled, pressed, disabled)를 props로 제어할 수 있음
 * #394CFF26 : point 색상의 약 15% 불투명도
 * #394CFF4C : point 색상의 약 30% 불투명도
 * #394CFF80 : point 색상의 약 50% 불투명도
 */
const stateStyles: Record<IconButtonState, { bg: string; text: string }> = {
  enabled: {
    bg: 'bg-[#394CFF26]',
    text: 'text-point',
  },
  pressed: {
    bg: 'bg-[#394CFF4C]',
    text: 'text-point',
  },
  disabled: {
    bg: 'bg-[#394CFF26]',
    text: 'text-[#394CFF80]',
  },
};

/**
 * 파란색 테마의 아이콘 버튼 컴포넌트
 */
export const IconButton = ({
  label,
  visualState,
  disabled,
  className = '',
  ...props
}: IconButtonProps) => {
  /**
   * disabled prop이 true면 'disabled' 상태로 고정
   * 그렇지 않으면 visualState prop 값을 사용
   * 둘 다 없으면 기본값 'enabled' 사용
   */
  const resolvedState: IconButtonState = disabled
    ? 'disabled'
    : (visualState ?? 'enabled');

  // 상태에 따른 스타일 가져오기
  const styles = stateStyles[resolvedState];

  // disabled 상태 여부
  const isDisabled = resolvedState === 'disabled';

  // 활성 상태일 때만 active 스타일 적용
  const activeClass =
    resolvedState === 'enabled' ? 'active:bg-[#394CFF4C]' : '';

  return (
    <button
      type='button'
      disabled={isDisabled}
      className={`inline-flex w-fit items-center rounded-[20px] py-[7px] pl-3 pr-2 text-body-sm transition ${
        styles.bg
      } ${styles.text} ${activeClass} ${className}`}
      {...props}
    >
      <span className='mr-[2px]'>{label}</span>
      <img src={moreBlueIcon} alt='더보기' className='h-4 w-4' />
    </button>
  );
};
