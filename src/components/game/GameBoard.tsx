import React from 'react';
import { cn } from '@/lib/utils';
import { type GameState } from '@/lib/gameLogic';

interface GameBoardProps {
  gameState: GameState;
  cellSize?: number;
  className?: string;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  cellSize = 20,
  className,
}) => {
  const { snake, food, gridSize, status, mode } = gameState;
  const boardSize = gridSize * cellSize;

  return (
    <div className={cn("relative", className)}>
      {/* Game board container */}
      <div
        className={cn(
          "relative game-grid border-2 rounded-lg overflow-hidden",
          mode === 'walls' ? "border-accent" : "border-neon-cyan",
          mode === 'walls' 
            ? "shadow-[0_0_30px_hsl(var(--accent)/0.3),inset_0_0_20px_hsl(var(--accent)/0.1)]" 
            : "shadow-[0_0_30px_hsl(var(--neon-cyan)/0.3),inset_0_0_20px_hsl(var(--neon-cyan)/0.1)]"
        )}
        style={{
          width: boardSize,
          height: boardSize,
          backgroundColor: 'hsl(var(--background))',
        }}
      >
        {/* Snake segments */}
        {snake.map((segment, index) => (
          <div
            key={`${segment.x}-${segment.y}-${index}`}
            className={cn(
              "absolute rounded-sm transition-all duration-75",
              index === 0 
                ? "bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.8)] z-10" 
                : "bg-primary/80",
              index === 0 && "animate-snake-move"
            )}
            style={{
              left: segment.x * cellSize + 1,
              top: segment.y * cellSize + 1,
              width: cellSize - 2,
              height: cellSize - 2,
            }}
          >
            {/* Snake head eyes */}
            {index === 0 && (
              <>
                <div
                  className="absolute bg-background rounded-full"
                  style={{
                    width: 4,
                    height: 4,
                    left: gameState.direction === 'LEFT' ? 2 : gameState.direction === 'RIGHT' ? cellSize - 8 : 3,
                    top: gameState.direction === 'UP' ? 2 : gameState.direction === 'DOWN' ? cellSize - 8 : 3,
                  }}
                />
                <div
                  className="absolute bg-background rounded-full"
                  style={{
                    width: 4,
                    height: 4,
                    left: gameState.direction === 'LEFT' ? 2 : gameState.direction === 'RIGHT' ? cellSize - 8 : cellSize - 9,
                    top: gameState.direction === 'UP' ? 2 : gameState.direction === 'DOWN' ? cellSize - 8 : 3,
                  }}
                />
              </>
            )}
          </div>
        ))}

        {/* Food */}
        <div
          className="absolute bg-accent rounded-full animate-food-pulse"
          style={{
            left: food.x * cellSize + 2,
            top: food.y * cellSize + 2,
            width: cellSize - 4,
            height: cellSize - 4,
          }}
        />

        {/* Overlay for paused/game over states */}
        {(status === 'paused' || status === 'game-over' || status === 'idle') && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="text-center">
              {status === 'idle' && (
                <p className="font-arcade text-primary text-sm neon-text animate-pulse-glow">
                  Press SPACE to start
                </p>
              )}
              {status === 'paused' && (
                <p className="font-arcade text-neon-cyan text-sm neon-text-cyan">
                  PAUSED
                </p>
              )}
              {status === 'game-over' && (
                <div className="space-y-4">
                  <p className="font-arcade text-accent text-lg neon-text-pink">
                    GAME OVER
                  </p>
                  <p className="font-arcade text-primary text-xs">
                    Press SPACE to restart
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
