interface BlackLineProps {
  className?: string;
}

/**
 * 가로 2px, 세로 20px 검은색 선 컴포넌트
 */
export const BlackLine = ({ className = '' }: BlackLineProps) => {
  return (
    <div
      className={`h-5 w-0.5 bg-[#0D0F20] ${className}`}
      role='presentation'
      aria-hidden='true'
    />
  );
};
