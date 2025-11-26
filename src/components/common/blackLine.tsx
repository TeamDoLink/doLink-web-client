interface BlackLineProps {
  className?: string;
}

export const BlackLine = ({ className = '' }: BlackLineProps) => {
  return (
    <div
      className={`h-5 w-0.5 bg-[#0D0F20] ${className}`}
      role="presentation"
      aria-hidden="true"
    />
  );
};
