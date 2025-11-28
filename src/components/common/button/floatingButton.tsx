import type { ButtonHTMLAttributes } from 'react';

type FloatingButtonState = 'enabled' | 'pressed' | 'disabled';

interface FloatingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  visualState?: FloatingButtonState;
}

/**
 * 버튼의 시각적 상태 (enabled, pressed, disabled)를 props로 제어할 수 있음
 * #00042547 : #000425 색상의 약 28% 불투명도
 */
const stateStyles: Record<FloatingButtonState, { bg: string; icon: string }> = {
  enabled: {
    bg: 'bg-black',
    icon: 'text-white',
  },
  pressed: {
    bg: 'bg-grey-600',
    icon: 'text-white',
  },
  disabled: {
    bg: 'bg-black',
    icon: 'text-grey-600',
  },
};

/**
 * 플로팅 버튼 컴포넌트
 */
export const FloatingButton = ({
  disabled,
  className = '',
  visualState,
  ...props
}: FloatingButtonProps) => {
  /**
   * disabled prop이 true면 'disabled' 상태로 고정
   * 그렇지 않으면 visualState prop 값을 사용
   * 둘 다 없으면 기본값 'enabled' 사용
   */
  const resolvedState: FloatingButtonState = disabled
    ? 'disabled'
    : (visualState ?? 'enabled');

  // 상태에 따른 스타일 가져오기
  const styles = stateStyles[resolvedState];

  // disabled 상태 여부
  const isDisabled = resolvedState === 'disabled';

  // 활성 상태일 때만 active 스타일 적용
  const activeClass = resolvedState === 'enabled' ? 'active:bg-grey-600' : '';

  return (
    <button
      disabled={isDisabled}
      className={`flex h-[52px] w-[52px] items-center justify-center rounded-full transition-colors ${styles.bg} shadow-[0_4px_12px_#00042547] ${
        activeClass
      } ${className}`}
      {...props}
    >
      <svg
        width='20'
        height='20'
        viewBox='0 0 20 20'
        className={styles.icon}
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
