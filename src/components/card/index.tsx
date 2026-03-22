import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('shadow-card', className)} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
