import React from 'react';
import { useSnakeGame } from '@/hooks/useSnakeGame';
import { GameBoard } from '@/components/game/GameBoard';
import { GameControls } from '@/components/game/GameControls';
import { Leaderboard } from '@/components/leaderboard/Leaderboard';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { leaderboardAPI } from '@/lib/api';
import { toast } from 'sonner';
import { useEffect } from 'react';

const Index = () => {
  const { gameState, start, pause, resume, reset, changeMode, setDirection } = useSnakeGame(20, 'walls');
  const { isAuthenticated } = useAuth();

  // Submit score when game ends
  useEffect(() => {
    if (gameState.status === 'game-over' && gameState.score > 0 && isAuthenticated) {
      leaderboardAPI.submitScore(gameState.score, gameState.mode)
        .then(() => {
          toast.success(`Score of ${gameState.score} submitted!`);
        })
        .catch((error) => {
          console.error('Failed to submit score:', error);
        });
    }
  }, [gameState.status, gameState.score, gameState.mode, isAuthenticated]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Main content */}
      <main className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="font-arcade text-3xl md:text-4xl text-primary neon-text mb-2">
              SNAKE
            </h1>
            <p className="font-mono text-muted-foreground text-sm">
              Classic arcade game reimagined
            </p>
          </div>

          {/* Game area */}
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
            {/* Game board */}
            <div className="flex flex-col items-center gap-6">
              <GameBoard gameState={gameState} cellSize={18} />
              
              {/* Controls below game on mobile */}
              <div className="lg:hidden">
                <GameControls
                  status={gameState.status}
                  mode={gameState.mode}
                  score={gameState.score}
                  onStart={start}
                  onPause={pause}
                  onResume={resume}
                  onReset={reset}
                  onModeChange={changeMode}
                  onDirection={setDirection}
                />
              </div>
            </div>

            {/* Sidebar with controls and leaderboard */}
            <div className="flex flex-col gap-6 w-full lg:w-80">
              {/* Controls on desktop */}
              <div className="hidden lg:block">
                <GameControls
                  status={gameState.status}
                  mode={gameState.mode}
                  score={gameState.score}
                  onStart={start}
                  onPause={pause}
                  onResume={resume}
                  onReset={reset}
                  onModeChange={changeMode}
                  onDirection={setDirection}
                  showMobileControls={false}
                />
              </div>

              {/* Compact leaderboard */}
              <Leaderboard compact />
            </div>
          </div>

          {/* Score submission hint */}
          {!isAuthenticated && gameState.status === 'idle' && (
            <p className="text-center mt-6 text-muted-foreground text-sm">
              Sign in to save your scores to the leaderboard!
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
