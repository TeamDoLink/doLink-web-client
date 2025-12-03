import type { ReactNode } from 'react';

type GradientBackgroundVariant = 'container' | 'fixed';

interface GradientBackgroundProps {
  className?: string;
  children?: ReactNode;
  variant?: GradientBackgroundVariant;
}

const GradientLayers = () => (
  <>
    <div
      className='pointer-events-none absolute inset-0'
      style={{
        background: 'linear-gradient(to bottom, #F7F8FB 0%, #F2F3F4 100%)',
      }}
    />
    <div
      className='pointer-events-none absolute inset-0'
      style={{
        background:
          'linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0) 55%)',
      }}
    />
  </>
);

/**
 * 배경 그라데이션 컴포넌트
 * variant='fixed'로 사용하면 뷰포트 전체에 고정 배경을 그립니다.
 */
export const GradientBackground = ({
  className = '',
  children,
  variant = 'container',
}: GradientBackgroundProps) => {
  if (variant === 'fixed') {
    return (
      <div
        className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`}
        aria-hidden='true'
      >
        <GradientLayers />
      </div>
    );
  }

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-[#F2F3F7] ${className}`}
    >
      <GradientLayers />
      <div className='relative h-full w-full'>{children}</div>
    </div>
  );
};
