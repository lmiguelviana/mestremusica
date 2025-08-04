import Link from 'next/link';
import { clsx } from 'clsx';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export function Logo({ size = 'md', showTagline = false }: LogoProps) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <Link href="/" className="flex flex-col items-center group">
      <div className={clsx(
        'font-bold transition-all duration-300 group-hover:scale-105',
        sizes[size]
      )}>
        <span className="text-white group-hover:text-gray-100 transition-colors">Mestres</span>
        <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent group-hover:from-orange-400 group-hover:to-orange-300 transition-all">Music</span>
      </div>
      
      {showTagline && (
        <p className="text-sm text-gray-400 mt-1 group-hover:text-gray-300 transition-colors">
          Conectando você aos mestres da música
        </p>
      )}
    </Link>
  );
}