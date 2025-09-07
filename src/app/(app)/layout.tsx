// src/app/(app)/layout.tsx
"use client";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { useAuth } from "@/components/auth/auth-provider";
import { SidebarInset } from "@/components/ui/sidebar";
import { Progress } from "@/components/ui/progress";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="w-1/3">
           <img src="https://placehold.co/300x100.png" alt="InsightFlow Logo" data-ai-hint="logo abstract" className="mb-8" />
           <Progress value={66} className="w-full animate-pulse" />
           <p className="mt-4 text-center text-foreground">Loading Your Workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // This should ideally be handled by AuthProvider's redirect,
    // but this is a fallback to prevent rendering app layout without user.
    return null; 
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <AppSidebar />
      <div className="flex flex-col flex-1">
        <AppHeader />
        <SidebarInset>
          <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </div>
  );
}
