
// src/app/(app)/dashboard/page.tsx
"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { CeoDashboard } from "@/components/role-dashboards/ceo-dashboard";
import { CfoDashboard } from "@/components/role-dashboards/cfo-dashboard";
import { InventoryDashboard } from "@/components/role-dashboards/inventory-dashboard";
import { SalesManagerDashboard } from "@/components/role-dashboards/sales-manager-dashboard";
import { CmoDashboard } from "@/components/role-dashboards/cmo-dashboard";
import { AdminDashboard } from "@/components/role-dashboards/admin-dashboard";
import { GeneralUserDashboard } from "@/components/role-dashboards/general-user-dashboard"; // Fallback
import { UserRoleType, UserSpecificRole } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { roleType, specificRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-8 w-2/3" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  const renderDashboard = () => {
    if (roleType === UserRoleType.ADMINISTRATOR) {
      return <AdminDashboard />;
    }

    if (roleType === UserRoleType.USER) {
      switch (specificRole) {
        case UserSpecificRole.CEO:
          return <CeoDashboard />;
        case UserSpecificRole.CFO:
          return <CfoDashboard />;
        case UserSpecificRole.INVENTORY_HEAD:
          return <InventoryDashboard />;
        case UserSpecificRole.SALES_MANAGER:
          return <SalesManagerDashboard />;
        case UserSpecificRole.CMO:
          return <CmoDashboard />;
        default:
          // This case should ideally not be reached if roles are managed correctly
          // but good to have a fallback.
          return <GeneralUserDashboard />; 
      }
    }
    // Fallback if roleType is neither ADMIN nor USER (should not happen with current logic)
    return <GeneralUserDashboard />; 
  };

  return <div className="container mx-auto py-2">{renderDashboard()}</div>;
}
