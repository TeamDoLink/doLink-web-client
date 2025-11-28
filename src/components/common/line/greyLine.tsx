interface GreyLineProps {
  className?: string;
}

/**
 * 가로 375px, 세로 1px 회색 선 컴포넌트
 */
export const GreyLine = ({ className = '' }: GreyLineProps) => {
  return <div className={`h-[1px] w-[375px] bg-grey-200 ${className}`} />;
};
