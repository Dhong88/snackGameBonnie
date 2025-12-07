import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { livePlayersAPI, type LivePlayer } from '@/lib/api';
import { Eye, Radio, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LivePlayerListProps {
  onSelectPlayer: (playerId: string) => void;
  selectedPlayerId?: string;
  className?: string;
}

export const LivePlayerList: React.FC<LivePlayerListProps> = ({
  onSelectPlayer,
  selectedPlayerId,
  className,
}) => {
  const [players, setPlayers] = useState<LivePlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      setIsLoading(true);
      try {
        const data = await livePlayersAPI.getLivePlayers();
        setPlayers(data);
      } catch (error) {
        console.error('Failed to fetch live players:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayers();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchPlayers, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={cn("border-neon-cyan/50", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Radio className="h-6 w-6 text-accent animate-pulse" />
          Live Players
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-neon-cyan border-t-transparent" />
          </div>
        ) : players.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No players online right now
          </p>
        ) : (
          <div className="space-y-2">
            {players.map((player) => (
              <div
                key={player.id}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-lg border transition-all cursor-pointer",
                  selectedPlayerId === player.id
                    ? "border-neon-cyan bg-neon-cyan/10 shadow-[0_0_15px_hsl(var(--neon-cyan)/0.3)]"
                    : "border-border hover:border-neon-cyan/50 hover:bg-muted/30"
                )}
                onClick={() => onSelectPlayer(player.id)}
              >
                <div className="relative">
                  <User className="h-8 w-8 text-muted-foreground" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-orbitron font-semibold truncate text-neon-cyan">
                    {player.username}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-xs",
                      player.mode === 'walls' 
                        ? "bg-accent/20 text-accent" 
                        : "bg-neon-cyan/20 text-neon-cyan"
                    )}>
                      {player.mode}
                    </span>
                    <span>Score: {player.score}</span>
                  </div>
                </div>
                
                <Button
                  variant="neon"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPlayer(player.id);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Watch
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
