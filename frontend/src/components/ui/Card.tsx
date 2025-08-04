import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({ children, className, variant = 'default' }: CardProps) {
  const variants = {
    default: 'bg-gray-900 border border-gray-800',
    elevated: 'bg-gray-900 border border-gray-800 shadow-xl',
    outlined: 'bg-transparent border-2 border-gray-700',
  };

  return (
    <div className={clsx(
      'rounded-xl p-6',
      variants[variant],
      className
    )}>
      {children}
    </div>
  );
}