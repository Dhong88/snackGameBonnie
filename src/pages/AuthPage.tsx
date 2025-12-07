import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { AuthForms } from '@/components/auth/AuthForms';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

const AuthPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSuccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-md">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="font-arcade text-2xl md:text-3xl text-primary neon-text mb-2">
              PLAYER LOGIN
            </h1>
            <p className="font-mono text-muted-foreground text-sm">
              Enter the arcade
            </p>
          </div>

          {/* Auth forms */}
          <AuthForms onSuccess={handleSuccess} />
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
