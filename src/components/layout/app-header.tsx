'use client';

import { usePathname } from 'next/navigation';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Bell, Settings } from 'lucide-react';

function getPageTitle(pathname: string): string {
  if (pathname.startsWith('/dashboard')) return 'Dashboard';
  if (pathname.startsWith('/calendar')) return 'Appointment Calendar';
  if (pathname.startsWith('/forecasting')) return 'AI Financial Forecasting';
  if (pathname.startsWith('/reports')) return 'Custom Reports';
  if (pathname.startsWith('/business-analysis'))
    return 'AI Business Analysis Report';
  if (pathname.startsWith('/economic-analysis')) return 'Economic Analysis';
  if (pathname.startsWith('/strategic-pricing')) return 'Strategic Pricing Simulator';
  return 'InsightFlow';
}

export function AppHeader() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />{' '}
        {/* Hidden on md and up as sidebar is visible */}
        <h1 className="text-xl font-headline font-semibold text-foreground">
          {title}
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Settings">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
