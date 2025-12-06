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
    <div className={`relative ${className}`}>
      <div
        className='pointer-events-none absolute inset-0 -z-10'
        aria-hidden
        style={{
          background:
            'linear-gradient(180deg, #FFFFFF 0%, #F8F9FC 35%, #EEF1F8 70%, #E5E9F3 100%)',
        }}
      />
      {children}
    </div>
  );
};
