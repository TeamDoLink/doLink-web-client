interface GreyLineProps {
  className?: string;
  width?: string;
}

/**
 * 가로 full, 세로 1px 회색 선 컴포넌트
 */
export const GreyLine = ({
  className = '',
  width = 'w-full',
}: GreyLineProps) => {
  return (
    <div
      className={`h-[1px] ${width} bg-grey-200 ${className}`}
      role='presentation'
      aria-hidden='true'
    />
  );
};
