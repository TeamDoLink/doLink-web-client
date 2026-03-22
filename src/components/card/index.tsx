import type { HTMLAttributes, RefObject } from 'react';

import { cn } from '@/lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  ref: RefObject<HTMLDivElement | null>;
}

const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div className={cn('shadow-card', className)} {...props}>
      {children}
    </div>
  );
};

export default Card;
