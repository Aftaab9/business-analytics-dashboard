'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuth } from '@/components/auth/auth-provider';
import { Logo } from '../ui/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserRoleType, UserSpecificRole } from '@/types';
import {
  BrainCircuit,
  Briefcase, // CEO
  CalendarDays,
  FileText,
  Landmark, 
  LayoutDashboard,
  LogOut,
  PackageSearch, // Inventory Head
  ScrollText, // Reports (used for general reports nav item)
  ShieldCheck,
  TrendingUp, // Sales Manager
  UserCircle,
  Banknote, // CFO
  Target as CmoIcon, // CMO
  Swords, // Strategic Pricing
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard},
  {href: '/calendar', label: 'Calendar', icon: CalendarDays},
  {href: '/forecasting', label: 'AI Forecast', icon: BrainCircuit},
  {href: '/reports', label: 'Reports', icon: ScrollText},
  {
    href: '/business-analysis',
    label: 'AI Business Analysis',
    icon: FileText,
  },
  {
    href: '/economic-analysis',
    label: 'Economic Analysis',
    icon: Landmark,
  },
  {
    href: '/strategic-pricing',
    label: 'Strategic Pricing',
    icon: Swords,
  },
];

// Role specific icons
const roleIcons: Record<string, React.ElementType> = {
  [UserSpecificRole.CEO]: Briefcase,
  [UserSpecificRole.CFO]: Banknote,
  [UserSpecificRole.INVENTORY_HEAD]: PackageSearch,
  [UserSpecificRole.SALES_MANAGER]: TrendingUp,
  [UserSpecificRole.CMO]: CmoIcon,
  [UserRoleType.ADMINISTRATOR]: ShieldCheck,
  default: UserCircle, // Fallback icon
};

export function AppSidebar() {
  const {user, roleType, specificRole, logout} = useAuth();
  const pathname = usePathname();

  const getRoleDisplayName = () => {
    if (roleType === UserRoleType.ADMINISTRATOR) return 'Administrator';
    return specificRole || 'User'; // Fallback to "User" if specificRole is somehow undefined for a UserRoleType.USER
  };

  let CurrentRoleIcon = roleIcons.default;
  if (roleType === UserRoleType.ADMINISTRATOR) {
    CurrentRoleIcon = roleIcons[UserRoleType.ADMINISTRATOR];
  } else if (specificRole && roleIcons[specificRole]) {
    CurrentRoleIcon = roleIcons[specificRole];
  }

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4 justify-center">
        <Logo iconOnly={true} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map(item => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior={false}>
                <SidebarMenuButton
                  isActive={
                    pathname === item.href ||
                    (item.href === '/dashboard' &&
                      pathname.startsWith('/dashboard'))
                  }
                  tooltip={{children: item.label, className: 'font-headline'}}
                  aria-label={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        {user && (
          <div className="flex flex-col items-center gap-2 p-2 rounded-md bg-sidebar-accent/10 group-data-[collapsible=icon]:p-0">
            <Avatar className="h-10 w-10 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
              <AvatarImage
                src={`https://placehold.co/100x100.png?text=${user.username
                  .charAt(0)
                  .toUpperCase()}`}
                alt={user.username}
                data-ai-hint="avatar person"
              />
              <AvatarFallback>
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center group-data-[collapsible=icon]:hidden">
              <p className="font-semibold text-sm text-sidebar-foreground">
                {user.username}
              </p>
              <p className="text-xs text-sidebar-foreground/80 flex items-center justify-center gap-1">
                <CurrentRoleIcon className="w-3 h-3" />
                {getRoleDisplayName()}
                {roleType === UserRoleType.USER && ' of UrbanCart'}
              </p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
          onClick={logout}
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
          <span className="group-data-[collapsible=icon]:hidden">Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
