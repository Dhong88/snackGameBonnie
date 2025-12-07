import { useState, useCallback, useEffect, useRef } from 'react';
import {
  createInitialState,
  moveSnake,
  changeDirection,
  startGame,
  pauseGame,
  resumeGame,
  resetGame,
  setGameMode,
  type GameState,
  type Direction,
  type GameMode,
} from '@/lib/gameLogic';

export const useSnakeGame = (gridSize: number = 20, initialMode: GameMode = 'walls') => {
  const [gameState, setGameState] = useState<GameState>(() => 
    createInitialState(gridSize, initialMode)
  );
  const gameLoopRef = useRef<number | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const keyDirectionMap: Record<string, Direction> = {
      ArrowUp: 'UP',
      ArrowDown: 'DOWN',
      ArrowLeft: 'LEFT',
      ArrowRight: 'RIGHT',
      w: 'UP',
      W: 'UP',
      s: 'DOWN',
      S: 'DOWN',
      a: 'LEFT',
      A: 'LEFT',
      d: 'RIGHT',
      D: 'RIGHT',
    };

    const direction = keyDirectionMap[e.key];
    if (direction) {
      e.preventDefault();
      setGameState(prev => changeDirection(prev, direction));
    }

    if (e.key === ' ') {
      e.preventDefault();
      setGameState(prev => {
        if (prev.status === 'playing') {
          return pauseGame(prev);
        } else if (prev.status === 'paused') {
          return resumeGame(prev);
        } else {
          return startGame(prev);
        }
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameState.status === 'playing') {
      gameLoopRef.current = window.setInterval(() => {
        setGameState(prev => moveSnake(prev));
      }, gameState.speed);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.status, gameState.speed]);

  const start = useCallback(() => {
    setGameState(prev => startGame(prev));
  }, []);

  const pause = useCallback(() => {
    setGameState(prev => pauseGame(prev));
  }, []);

  const resume = useCallback(() => {
    setGameState(prev => resumeGame(prev));
  }, []);

  const reset = useCallback(() => {
    setGameState(prev => resetGame(prev));
  }, []);

  const changeMode = useCallback((mode: GameMode) => {
    setGameState(prev => setGameMode(prev, mode));
  }, []);

  const setDirection = useCallback((direction: Direction) => {
    setGameState(prev => changeDirection(prev, direction));
  }, []);

  return {
    gameState,
    start,
    pause,
    resume,
    reset,
    changeMode,
    setDirection,
  };
};
