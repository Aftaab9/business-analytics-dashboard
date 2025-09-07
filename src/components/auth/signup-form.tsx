// src/components/auth/signup-form.tsx
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { useAuth } from './auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRoleType, UserSpecificRole } from '@/types';
import { AlertCircle, UserPlus, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Logo } from '../ui/logo';
import { AuthService } from '@/lib/auth';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [roleType, setRoleType] = useState<UserRoleType>(UserRoleType.USER);
  const [specificRole, setSpecificRole] = useState<UserSpecificRole | undefined>(UserSpecificRole.CEO);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentYear, setCurrentYear] = useState('');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  const validateForm = () => {
    if (!email || !password || !confirmPassword || !username) {
      setError("All fields are required.");
      return false;
    }

    if (!email.includes('@')) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters long.");
      return false;
    }

    if (roleType === UserRoleType.USER && !specificRole) {
      setError("Please select your specific role.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const userData = await AuthService.signUp(
        email,
        password,
        username,
        roleType,
        roleType === UserRoleType.USER ? specificRole : undefined
      );

      // Automatically log in the user after successful signup
      login(userData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-6">
          <Logo className="flex items-center justify-center gap-2 text-primary" />
        </div>
        <CardTitle className="font-headline text-3xl">Join InsightFlow</CardTitle>
        <CardDescription>Create your account to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Signup Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
              aria-required="true"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe"
              required
              aria-required="true"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                aria-required="true"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                aria-required="true"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Account Type</Label>
            <RadioGroup
              value={roleType}
              onValueChange={(value) => {
                const newRoleType = value as UserRoleType;
                setRoleType(newRoleType);
                if (newRoleType === UserRoleType.USER && !specificRole) {
                  setSpecificRole(UserSpecificRole.CEO);
                } else if (newRoleType === UserRoleType.ADMINISTRATOR) {
                  setSpecificRole(undefined);
                }
              }}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={UserRoleType.USER} id="user-signup" />
                <Label htmlFor="user-signup">User</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={UserRoleType.ADMINISTRATOR} id="administrator-signup" />
                <Label htmlFor="administrator-signup">Administrator</Label>
              </div>
            </RadioGroup>
          </div>

          {roleType === UserRoleType.USER && (
            <div className="space-y-2">
              <Label htmlFor="specificRole">Your Role</Label>
              <Select
                value={specificRole || UserSpecificRole.CEO}
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            <UserPlus className="mr-2 h-4 w-4" />
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Button
            variant="link"
            className="p-0 h-auto font-semibold"
            onClick={onSwitchToLogin}
          >
            Sign in here
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          &copy; {currentYear} InsightFlow. All rights reserved.
        </p>
      </CardFooter>
    </Card>
  );
}
