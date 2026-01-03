interface GreyVerticalLineProps {
  className?: string;
}

/**
 * 세로 48px, 두께 2px 회색 선 컴포넌트
 */
export const GreyVerticalLine = ({ className = '' }: GreyVerticalLineProps) => {
  return <div className={`h-12 w-0.5 bg-grey-300 ${className}`} />;
};
