// src/app/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { Progress } from '@/components/ui/progress';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md text-center">
        <img 
          src="https://placehold.co/300x100.png" 
          alt="InsightFlow Logo" 
          data-ai-hint="logo abstract" 
          className="mx-auto mb-8" 
        />
        <Progress value={isLoading ? 33 : 100} className="w-full animate-pulse mb-4" />
        <p className="text-lg font-semibold text-foreground">
          {isLoading ? "Initializing InsightFlow..." : "Redirecting..."}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Please wait while we prepare your experience.
        </p>
      </div>
    </div>
  );
}
