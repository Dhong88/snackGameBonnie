import { useState, useEffect, useRef } from 'react';
import {
  createInitialState,
  moveSnake,
  changeDirection,
  calculateAIMove,
  type GameState,
  type GameMode,
} from '@/lib/gameLogic';
import { livePlayersAPI } from '@/lib/api';

export const useSpectateGame = (
  playerId: string,
  gridSize: number = 20,
  mode: GameMode = 'walls'
) => {
  const [gameState, setGameState] = useState<GameState>(() => ({
    ...createInitialState(gridSize, mode),
    status: 'playing',
  }));
  const gameLoopRef = useRef<number | null>(null);
  const aiMoveRef = useRef<number | null>(null);

  useEffect(() => {
    // Start the game loop for AI
    gameLoopRef.current = window.setInterval(() => {
      setGameState(prev => {
        if (prev.status !== 'playing') {
          // Restart game after game over
          return {
            ...createInitialState(gridSize, mode),
            status: 'playing',
          };
        }
        return moveSnake(prev);
      });
    }, 150);

    // AI decision loop
    aiMoveRef.current = window.setInterval(() => {
      setGameState(prev => {
        if (prev.status === 'playing') {
          const aiDirection = calculateAIMove(prev);
          return changeDirection(prev, aiDirection);
        }
        return prev;
      });
    }, 100);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (aiMoveRef.current) clearInterval(aiMoveRef.current);
    };
  }, [playerId, gridSize, mode]);

  // Update live player score in mock API
  useEffect(() => {
    livePlayersAPI.updatePlayerScore(playerId, gameState.score);
  }, [playerId, gameState.score]);

  return { gameState };
};
