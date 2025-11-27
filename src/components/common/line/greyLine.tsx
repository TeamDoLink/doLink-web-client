interface GreyLineProps {
  className?: string;
}

export const GreyLine = ({ className = '' }: GreyLineProps) => {
  return <div className={`h-[1px] w-[375px] bg-grey-200 ${className}`} />;
};
