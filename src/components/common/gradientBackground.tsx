interface GradientBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export const GradientBackground = ({
  className = '',
  children,
}: GradientBackgroundProps) => {
  return (
    <div className={`relative h-[812px] w-[375px] bg-[#f2f3f7] ${className}`}>
      <div className="pointer-events-none absolute left-0 top-0 h-[272px] w-full bg-gradient-to-b from-white/70 to-white/0" />
      <div className="relative h-full w-full">{children}</div>
    </div>
  );
};
