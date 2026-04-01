import { cn } from '@/lib/cn';

type BackgroundProps = React.HTMLAttributes<HTMLDivElement>;

export const GradientBackground = ({
  className,
  ...props
}: BackgroundProps) => {
  const { style, ...restProps } = props;

  return (
    <div
      className={cn('relative flex min-h-screen flex-col', className)}
      style={{
        backgroundColor: '#F2F3F7',
        backgroundImage:
          'linear-gradient(180deg, rgba(255, 255, 255, 0.36) 0%, rgba(255, 255, 255, 0) 100%)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 275px',
        ...style,
      }}
      {...restProps}
    />
  );
};
