interface GreyLineProps {
  className?: string;
}

/**
 * 가로 full, 세로 1px 회색 선 컴포넌트
 */
export const GreyLine = ({ className = '' }: GreyLineProps) => {
  return (
    <div
      className={`h-[1px] w-full bg-grey-200 ${className}`}
      role='presentation'
      aria-hidden='true'
    />
  );
};
