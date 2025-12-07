import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { leaderboardAPI, type LeaderboardEntry, type GameMode } from '@/lib/api';
import type { GameMode as GameModeType } from '@/lib/gameLogic';
import { Trophy, Medal, Award, Clock, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaderboardProps {
  className?: string;
  compact?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ className, compact = false }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [filter, setFilter] = useState<GameMode | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const data = await leaderboardAPI.getLeaderboard(
          filter === 'all' ? undefined : filter
        );
        setEntries(data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [filter]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-neon-yellow" />;
      case 2:
        return <Medal className="h-5 w-5 text-muted-foreground" />;
      case 3:
        return <Award className="h-5 w-5 text-accent" />;
      default:
        return <span className="w-5 text-center font-mono text-muted-foreground">{rank}</span>;
    }
  };

  const displayEntries = compact ? entries.slice(0, 5) : entries;

  return (
    <Card className={cn("border-neon-purple/50", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            Leaderboard
          </CardTitle>
          {!compact && (
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'walls' ? 'danger' : 'ghost'}
                size="sm"
                onClick={() => setFilter('walls')}
              >
                Walls
              </Button>
              <Button
                variant={filter === 'pass-through' ? 'neon' : 'ghost'}
                size="sm"
                onClick={() => setFilter('pass-through')}
              >
                Pass-Through
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-2">
            {displayEntries.map((entry, index) => (
              <div
                key={entry.id}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-lg transition-colors",
                  index === 0 && "bg-neon-yellow/10 border border-neon-yellow/30",
                  index === 1 && "bg-muted/50 border border-muted",
                  index === 2 && "bg-accent/10 border border-accent/30",
                  index > 2 && "hover:bg-muted/30"
                )}
              >
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(index + 1)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-orbitron font-semibold truncate",
                    index === 0 && "text-neon-yellow",
                    index === 1 && "text-foreground",
                    index === 2 && "text-accent"
                  )}>
                    {entry.username}
                  </p>
                  {!compact && (
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {entry.mode}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="font-arcade text-lg text-primary neon-text">
                  {entry.score}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
