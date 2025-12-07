import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { type GameStatus, type GameMode, type Direction } from '@/lib/gameLogic';
import { cn } from '@/lib/utils';

interface GameControlsProps {
  status: GameStatus;
  mode: GameMode;
  score: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onModeChange: (mode: GameMode) => void;
  onDirection: (direction: Direction) => void;
  showMobileControls?: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  status,
  mode,
  score,
  onStart,
  onPause,
  onResume,
  onReset,
  onModeChange,
  onDirection,
  showMobileControls = true,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Score display */}
      <div className="text-center">
        <p className="font-mono text-muted-foreground text-sm uppercase tracking-widest mb-1">Score</p>
        <p className="font-arcade text-4xl text-primary neon-text">{score}</p>
      </div>

      {/* Mode selector */}
      <div className="space-y-2">
        <p className="font-mono text-muted-foreground text-xs uppercase tracking-widest text-center">Mode</p>
        <div className="flex gap-2">
          <Button
            variant={mode === 'walls' ? 'danger' : 'outline'}
            size="sm"
            onClick={() => onModeChange('walls')}
            disabled={status === 'playing'}
            className="flex-1 text-xs"
          >
            Walls
          </Button>
          <Button
            variant={mode === 'pass-through' ? 'neon' : 'outline'}
            size="sm"
            onClick={() => onModeChange('pass-through')}
            disabled={status === 'playing'}
            className="flex-1 text-xs"
          >
            Pass-Through
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          {mode === 'walls' ? 'Hit walls = Game Over' : 'Wrap around edges'}
        </p>
      </div>

      {/* Game controls */}
      <div className="flex gap-2 justify-center">
        {status === 'idle' && (
          <Button variant="default" size="lg" onClick={onStart}>
            <Play className="mr-2 h-5 w-5" />
            Start
          </Button>
        )}
        {status === 'playing' && (
          <Button variant="neon" size="lg" onClick={onPause}>
            <Pause className="mr-2 h-5 w-5" />
            Pause
          </Button>
        )}
        {status === 'paused' && (
          <Button variant="default" size="lg" onClick={onResume}>
            <Play className="mr-2 h-5 w-5" />
            Resume
          </Button>
        )}
        {status === 'game-over' && (
          <Button variant="default" size="lg" onClick={onStart}>
            <RotateCcw className="mr-2 h-5 w-5" />
            Restart
          </Button>
        )}
        {status !== 'idle' && (
          <Button variant="outline" size="lg" onClick={onReset}>
            <RotateCcw className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Mobile direction controls */}
      {showMobileControls && (
        <div className="flex flex-col items-center gap-2 mt-4 md:hidden">
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14"
            onClick={() => onDirection('UP')}
          >
            <ArrowUp className="h-6 w-6" />
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-14 w-14"
              onClick={() => onDirection('LEFT')}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-14 w-14"
              onClick={() => onDirection('DOWN')}
            >
              <ArrowDown className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-14 w-14"
              onClick={() => onDirection('RIGHT')}
            >
              <ArrowRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}

      {/* Keyboard instructions */}
      <div className="hidden md:block text-center text-xs text-muted-foreground space-y-1">
        <p>Arrow keys or WASD to move</p>
        <p>SPACE to pause/resume</p>
      </div>
    </div>
  );
};
