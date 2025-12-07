import React from 'react';
import { Header } from '@/components/layout/Header';
import { Leaderboard } from '@/components/leaderboard/Leaderboard';

const LeaderboardPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="font-arcade text-3xl md:text-4xl text-primary neon-text mb-2">
              LEADERBOARD
            </h1>
            <p className="font-mono text-muted-foreground text-sm">
              Top players worldwide
            </p>
          </div>

          {/* Full leaderboard */}
          <Leaderboard />
        </div>
      </main>
    </div>
  );
};

export default LeaderboardPage;
