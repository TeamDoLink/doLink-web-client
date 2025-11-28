import type { ButtonHTMLAttributes } from 'react';

// 버튼의 시각적 상태를 정의하는 타입
type GreyButtonState = 'enabled' | 'pressed' | 'disabled';

interface GreyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼의 시각적 상태를 외부에서 제어하고 싶을 때 사용하는 prop
   * 미지정시 disabled prop에 따라 자동으로 결정됨
   */
  visualState?: GreyButtonState;
}

/**
 * 버튼의 시각적 상태 (enabled, pressed, disabled)를 props로 제어할 수 있음
 */
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

/**
 * 회색 테마의 공통 버튼 컴포넌트
 */
export const GreyButton = ({
  children,
  className = '',
  disabled,
  visualState,
  ...props
}: GreyButtonProps) => {
  /**
   * disabled prop이 true면 'disabled' 상태로 고정
   * 그렇지 않으면 visualState prop 값을 사용
   * 둘 다 없으면 기본값 'enabled' 사용
   */
  const resolvedState: GreyButtonState = disabled
    ? 'disabled'
    : (visualState ?? 'enabled');

  // 상태에 따른 스타일 가져오기
  const styles = stateStyles[resolvedState];

  // disabled 상태 여부
  const isDisabled = resolvedState === 'disabled';

  // 활성 상태일 때만 active 스타일 적용
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
