import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { LivePlayerList } from '@/components/spectate/LivePlayerList';
import { SpectateView } from '@/components/spectate/SpectateView';

const SpectatePage = () => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {!selectedPlayerId ? (
            <>
              {/* Title */}
              <div className="text-center mb-8">
                <h1 className="font-arcade text-3xl md:text-4xl text-neon-cyan neon-text-cyan mb-2">
                  SPECTATE
                </h1>
                <p className="font-mono text-muted-foreground text-sm">
                  Watch live games in progress
                </p>
              </div>

              {/* Live player list */}
              <LivePlayerList
                onSelectPlayer={setSelectedPlayerId}
                selectedPlayerId={selectedPlayerId || undefined}
              />
            </>
          ) : (
            <SpectateView
              playerId={selectedPlayerId}
              onBack={() => setSelectedPlayerId(null)}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default SpectatePage;
