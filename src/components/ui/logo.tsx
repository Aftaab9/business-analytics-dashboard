import Link from 'next/link';
import { BarChart3 } from 'lucide-react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <Link href="/dashboard" className={className ? className : "flex items-center gap-2 text-primary hover:text-primary/90 transition-colors"}>
      <BarChart3 className={`h-8 w-8 ${iconOnly ? '' : 'md:h-6 md:w-6'}`} strokeWidth={2.5} />
      {!iconOnly && <span className="text-2xl font-headline font-bold">InsightFlow</span>}
    </Link>
  );
}
