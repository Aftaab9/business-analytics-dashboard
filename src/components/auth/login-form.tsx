
// src/components/auth/login-form.tsx
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { useAuth } from './auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRoleType, UserSpecificRole, type User } from '@/types';
import { AlertCircle, LogIn } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Logo } from '../ui/logo';

export function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [roleType, setRoleType] = useState<UserRoleType>(UserRoleType.USER);
  const [specificRole, setSpecificRole] = useState<UserSpecificRole | undefined>(UserSpecificRole.CEO); // Default to CEO or first in list
  const [error, setError] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState('');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    const userData: User = {
      username,
      roleType,
      specificRole: roleType === UserRoleType.USER ? specificRole : undefined,
    };
    login(userData);
  };

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-6">
         <Logo className="flex items-center justify-center gap-2 text-primary" />
        </div>
        <CardTitle className="font-headline text-3xl">Welcome to InsightFlow</CardTitle>
        <CardDescription>Sign in to access your dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Login Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., johndoe"
              required
              aria-required="true"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              aria-required="true"
            />
          </div>
          <div className="space-y-2">
            <Label>Account Type</Label>
            <RadioGroup
              value={roleType}
              onValueChange={(value) => {
                const newRoleType = value as UserRoleType;
                setRoleType(newRoleType);
                if (newRoleType === UserRoleType.USER && !specificRole) {
                  setSpecificRole(UserSpecificRole.CEO); // Default if switching to User
                } else if (newRoleType === UserRoleType.ADMINISTRATOR) {
                  setSpecificRole(undefined);
                }
              }}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={UserRoleType.USER} id="user" />
                <Label htmlFor="user">User</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={UserRoleType.ADMINISTRATOR} id="administrator" />
                <Label htmlFor="administrator">Administrator</Label>
              </div>
            </RadioGroup>
          </div>
          {roleType === UserRoleType.USER && (
            <div className="space-y-2">
              <Label htmlFor="specificRole">Your Role</Label>
              <Select
                value={specificRole || UserSpecificRole.CEO} // Ensure a value is always provided if USER type
                onValueChange={(value) => setSpecificRole(value as UserSpecificRole)}
                required={roleType === UserRoleType.USER}
              >
                <SelectTrigger id="specificRole">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(UserSpecificRole).map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <Button type="submit" className="w-full">
            <LogIn className="mr-2 h-4 w-4" /> Sign In
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} InsightFlow. All rights reserved.</p>
      </CardFooter>
    </Card>
  );
}
