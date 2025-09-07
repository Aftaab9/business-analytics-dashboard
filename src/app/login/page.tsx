// src/app/login/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { SignupForm } from '@/components/auth/signup-form';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoginPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Render a skeleton loader on the server and initial client render to avoid hydration mismatch
  if (!isMounted) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center space-y-6 pt-8">
            <Skeleton className="h-10 w-48 mx-auto" />
            <Skeleton className="h-5 w-64 mx-auto" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full !mt-8" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Skeleton className="h-4 w-3/4" />
          </CardFooter>
        </Card>
      </main>
    );
  }

  // Render the actual login form only on the client after mounting
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      {isSignup ? (
        <SignupForm onSwitchToLogin={() => setIsSignup(false)} />
      ) : (
        <LoginForm onSwitchToSignup={() => setIsSignup(true)} />
      )}
    </main>
  );
}
