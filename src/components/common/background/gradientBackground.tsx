interface GradientBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * 배경 그라데이션 컴포넌트
 */
export const GradientBackground = ({
  className = '',
  children,
}: GradientBackgroundProps) => {
  return (
    <div className={`relative h-[812px] w-[375px] bg-grey-50 ${className}`}>
      <div className='pointer-events-none absolute left-0 top-0 h-[272px] w-full bg-gradient-to-b from-white/70 to-white/0' />
      <div className='relative h-full w-full'>{children}</div>
    </div>
  );
};
