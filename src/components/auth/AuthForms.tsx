import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2, LogIn, UserPlus } from 'lucide-react';

interface AuthFormsProps {
  onSuccess?: () => void;
}

export const AuthForms: React.FC<AuthFormsProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Welcome back!');
      } else {
        if (!username.trim()) {
          toast.error('Username is required');
          setIsLoading(false);
          return;
        }
        await signup(username, email, password);
        toast.success('Account created successfully!');
      }
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-primary/50">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">
          {isLogin ? 'Welcome Back' : 'Join the Game'}
        </CardTitle>
        <p className="text-muted-foreground text-sm mt-2">
          {isLogin 
            ? 'Enter your credentials to continue' 
            : 'Create an account to save your scores'
          }
        </p>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
                Username
              </label>
              <Input
                type="text"
                placeholder="SnakeMaster99"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
              Email
            </label>
            <Input
              type="email"
              placeholder="player@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isLogin && (
            <p className="text-xs text-muted-foreground text-center">
              Demo: Use any email from mock users (e.g., neon@example.com)
            </p>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            variant="default"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : isLogin ? (
              <LogIn className="mr-2 h-5 w-5" />
            ) : (
              <UserPlus className="mr-2 h-5 w-5" />
            )}
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm"
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : 'Already have an account? Sign in'
            }
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
