import React, { useEffect, useState } from 'react';
import { GameBoard } from '@/components/game/GameBoard';
import { useSpectateGame } from '@/hooks/useSpectateGame';
import { livePlayersAPI, type LivePlayer } from '@/lib/api';
import { type GameMode } from '@/lib/gameLogic';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Radio, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpectateViewProps {
  playerId: string;
  onBack: () => void;
}

export const SpectateView: React.FC<SpectateViewProps> = ({ playerId, onBack }) => {
  const [player, setPlayer] = useState<LivePlayer | null>(null);
  const { gameState } = useSpectateGame(
    playerId,
    20,
    (player?.mode as GameMode) || 'walls'
  );

  useEffect(() => {
    const fetchPlayer = async () => {
      const data = await livePlayersAPI.getPlayerGame(playerId);
      setPlayer(data);
    };
    fetchPlayer();
  }, [playerId]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Header */}
      <div className="flex items-center gap-4 w-full max-w-lg">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Button>
        
        <div className="flex-1 flex items-center justify-center gap-2">
          <Radio className="h-4 w-4 text-accent animate-pulse" />
          <span className="font-mono text-sm text-muted-foreground uppercase tracking-wider">
            Live Spectating
          </span>
        </div>
      </div>

      {/* Player info */}
      {player && (
        <Card className="border-neon-cyan/50 w-full max-w-lg">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="relative">
              <User className="h-10 w-10 text-neon-cyan" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
            </div>
            
            <div className="flex-1">
              <p className="font-orbitron text-xl text-neon-cyan neon-text-cyan">
                {player.username}
              </p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  {player.mode}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-mono text-xs text-muted-foreground uppercase">Score</p>
              <p className="font-arcade text-2xl text-primary neon-text">
                {gameState.score}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Game board */}
      <div className="relative">
        <GameBoard gameState={gameState} cellSize={18} />
        
        {/* Spectate overlay indicator */}
        <div className="absolute top-2 left-2 flex items-center gap-2 bg-background/80 px-3 py-1 rounded-full border border-neon-cyan/50">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="font-mono text-xs text-neon-cyan">SPECTATING</span>
        </div>
      </div>
    </div>
  );
};
