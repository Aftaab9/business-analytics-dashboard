// src/components/auth/auth-provider.tsx
"use client";

import type { User, UserRoleType, UserSpecificRole } from '@/types';
import { useRouter, usePathname } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Progress } from '@/components/ui/progress';

interface AuthContextType {
  user: User | null;
  roleType: UserRoleType | null;
  specificRole: UserSpecificRole | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [roleType, setRoleType] = useState<UserRoleType | null>(null);
  const [specificRole, setSpecificRole] = useState<UserSpecificRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('insightFlowUser');
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setRoleType(parsedUser.roleType);
        setSpecificRole(parsedUser.specificRole);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('insightFlowUser');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!user && pathname !== '/login') {
        router.push('/login');
      } else if (user && pathname === '/login') {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = useCallback((userData: User) => {
    localStorage.setItem('insightFlowUser', JSON.stringify(userData));
    setUser(userData);
    setRoleType(userData.roleType);
    setSpecificRole(userData.specificRole);
    router.push('/dashboard');
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('insightFlowUser');
    setUser(null);
    setRoleType(null);
    setSpecificRole(null);
    router.push('/login');
  }, [router]);

  if (isLoading && pathname !== '/login') {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="w-1/3">
           <img src="https://placehold.co/300x100.png" alt="InsightFlow Logo" data-ai-hint="logo abstract" className="mb-8" />
           <Progress value={50} className="w-full animate-pulse" />
           <p className="mt-4 text-center text-foreground">Loading InsightFlow...</p>
        </div>
      </div>
    );
  }
  
  if (!isLoading && !user && pathname !== '/login') {
    // This case should ideally be handled by the redirect effect,
    // but as a fallback, show loading or null to prevent flashing content.
    return (
       <div className="flex flex-col items-center justify-center min-h-screen bg-background">
         <div className="w-1/3">
            <img src="https://placehold.co/300x100.png" alt="InsightFlow Logo" data-ai-hint="logo abstract" className="mb-8" />
            <p className="mt-4 text-center text-foreground">Redirecting to login...</p>
         </div>
       </div>
     );
  }


  return (
    <AuthContext.Provider value={{ user, roleType, specificRole, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
