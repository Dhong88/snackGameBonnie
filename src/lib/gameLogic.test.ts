import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  generateFood,
  getOppositeDirection,
  isValidDirectionChange,
  moveSnake,
  changeDirection,
  startGame,
  pauseGame,
  resumeGame,
  resetGame,
  setGameMode,
  calculateAIMove,
  type GameState,
  type Position,
} from './gameLogic';

describe('createInitialState', () => {
  it('should create initial state with default values', () => {
    const state = createInitialState();
    
    expect(state.gridSize).toBe(20);
    expect(state.mode).toBe('walls');
    expect(state.status).toBe('idle');
    expect(state.score).toBe(0);
    expect(state.snake.length).toBe(3);
    expect(state.direction).toBe('RIGHT');
  });

  it('should create initial state with custom grid size', () => {
    const state = createInitialState(30);
    
    expect(state.gridSize).toBe(30);
    expect(state.snake[0].x).toBe(15);
    expect(state.snake[0].y).toBe(15);
  });

  it('should create initial state with pass-through mode', () => {
    const state = createInitialState(20, 'pass-through');
    
    expect(state.mode).toBe('pass-through');
  });
});

describe('generateFood', () => {
  it('should generate food not on snake', () => {
    const snake: Position[] = [{ x: 5, y: 5 }, { x: 4, y: 5 }];
    const food = generateFood(snake, 20);
    
    expect(snake.some(s => s.x === food.x && s.y === food.y)).toBe(false);
  });

  it('should generate food within grid bounds', () => {
    const snake: Position[] = [{ x: 5, y: 5 }];
    const food = generateFood(snake, 10);
    
    expect(food.x).toBeGreaterThanOrEqual(0);
    expect(food.x).toBeLessThan(10);
    expect(food.y).toBeGreaterThanOrEqual(0);
    expect(food.y).toBeLessThan(10);
  });
});

describe('getOppositeDirection', () => {
  it('should return DOWN for UP', () => {
    expect(getOppositeDirection('UP')).toBe('DOWN');
  });

  it('should return UP for DOWN', () => {
    expect(getOppositeDirection('DOWN')).toBe('UP');
  });

  it('should return RIGHT for LEFT', () => {
    expect(getOppositeDirection('LEFT')).toBe('RIGHT');
  });

  it('should return LEFT for RIGHT', () => {
    expect(getOppositeDirection('RIGHT')).toBe('LEFT');
  });
});

describe('isValidDirectionChange', () => {
  it('should allow perpendicular direction changes', () => {
    expect(isValidDirectionChange('RIGHT', 'UP')).toBe(true);
    expect(isValidDirectionChange('RIGHT', 'DOWN')).toBe(true);
    expect(isValidDirectionChange('UP', 'LEFT')).toBe(true);
    expect(isValidDirectionChange('UP', 'RIGHT')).toBe(true);
  });

  it('should not allow opposite direction changes', () => {
    expect(isValidDirectionChange('RIGHT', 'LEFT')).toBe(false);
    expect(isValidDirectionChange('LEFT', 'RIGHT')).toBe(false);
    expect(isValidDirectionChange('UP', 'DOWN')).toBe(false);
    expect(isValidDirectionChange('DOWN', 'UP')).toBe(false);
  });

  it('should allow same direction', () => {
    expect(isValidDirectionChange('RIGHT', 'RIGHT')).toBe(true);
    expect(isValidDirectionChange('UP', 'UP')).toBe(true);
  });
});

describe('moveSnake', () => {
  it('should not move when game is not playing', () => {
    const state = createInitialState();
    const newState = moveSnake(state);
    
    expect(newState).toEqual(state);
  });

  it('should move snake head in correct direction', () => {
    const state: GameState = {
      ...createInitialState(),
      status: 'playing',
    };
    
    const newState = moveSnake(state);
    
    expect(newState.snake[0].x).toBe(state.snake[0].x + 1);
    expect(newState.snake[0].y).toBe(state.snake[0].y);
  });

  it('should game over on wall collision in walls mode', () => {
    const state: GameState = {
      ...createInitialState(20, 'walls'),
      status: 'playing',
      snake: [{ x: 19, y: 10 }, { x: 18, y: 10 }],
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
    };
    
    const newState = moveSnake(state);
    
    expect(newState.status).toBe('game-over');
  });

  it('should wrap around in pass-through mode', () => {
    const state: GameState = {
      ...createInitialState(20, 'pass-through'),
      status: 'playing',
      snake: [{ x: 19, y: 10 }, { x: 18, y: 10 }],
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
    };
    
    const newState = moveSnake(state);
    
    expect(newState.status).toBe('playing');
    expect(newState.snake[0].x).toBe(0);
    expect(newState.snake[0].y).toBe(10);
  });

  it('should grow snake when eating food', () => {
    const state: GameState = {
      ...createInitialState(),
      status: 'playing',
      snake: [{ x: 5, y: 5 }, { x: 4, y: 5 }],
      food: { x: 6, y: 5 },
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
    };
    
    const newState = moveSnake(state);
    
    expect(newState.snake.length).toBe(3);
    expect(newState.score).toBe(10);
  });

  it('should game over on self collision', () => {
    const state: GameState = {
      ...createInitialState(),
      status: 'playing',
      snake: [
        { x: 5, y: 5 },
        { x: 6, y: 5 },
        { x: 6, y: 6 },
        { x: 5, y: 6 },
        { x: 4, y: 6 },
        { x: 4, y: 5 },
      ],
      direction: 'LEFT',
      nextDirection: 'LEFT',
    };
    
    const newState = moveSnake(state);
    
    expect(newState.status).toBe('game-over');
  });
});

describe('changeDirection', () => {
  it('should change direction when valid', () => {
    const state: GameState = {
      ...createInitialState(),
      status: 'playing',
    };
    
    const newState = changeDirection(state, 'UP');
    
    expect(newState.nextDirection).toBe('UP');
  });

  it('should not change to opposite direction', () => {
    const state: GameState = {
      ...createInitialState(),
      status: 'playing',
      direction: 'RIGHT',
    };
    
    const newState = changeDirection(state, 'LEFT');
    
    expect(newState.nextDirection).toBe('RIGHT');
  });

  it('should not change direction when not playing', () => {
    const state = createInitialState();
    
    const newState = changeDirection(state, 'UP');
    
    expect(newState.nextDirection).toBe('RIGHT');
  });
});

describe('game state transitions', () => {
  it('should start game from idle', () => {
    const state = createInitialState();
    const newState = startGame(state);
    
    expect(newState.status).toBe('playing');
  });

  it('should restart game from game-over', () => {
    const state: GameState = {
      ...createInitialState(),
      status: 'game-over',
      score: 100,
    };
    
    const newState = startGame(state);
    
    expect(newState.status).toBe('playing');
    expect(newState.score).toBe(0);
  });

  it('should pause playing game', () => {
    const state: GameState = {
      ...createInitialState(),
      status: 'playing',
    };
    
    const newState = pauseGame(state);
    
    expect(newState.status).toBe('paused');
  });

  it('should resume paused game', () => {
    const state: GameState = {
      ...createInitialState(),
      status: 'paused',
    };
    
    const newState = resumeGame(state);
    
    expect(newState.status).toBe('playing');
  });

  it('should reset game', () => {
    const state: GameState = {
      ...createInitialState(),
      status: 'playing',
      score: 500,
    };
    
    const newState = resetGame(state);
    
    expect(newState.status).toBe('idle');
    expect(newState.score).toBe(0);
    expect(newState.snake.length).toBe(3);
  });
});

describe('setGameMode', () => {
  it('should change game mode when not playing', () => {
    const state = createInitialState(20, 'walls');
    const newState = setGameMode(state, 'pass-through');
    
    expect(newState.mode).toBe('pass-through');
  });

  it('should not change mode while playing', () => {
    const state: GameState = {
      ...createInitialState(20, 'walls'),
      status: 'playing',
    };
    
    const newState = setGameMode(state, 'pass-through');
    
    expect(newState.mode).toBe('walls');
  });
});

describe('calculateAIMove', () => {
  it('should return a valid direction', () => {
    const state: GameState = {
      ...createInitialState(),
      status: 'playing',
    };
    
    const move = calculateAIMove(state);
    
    expect(['UP', 'DOWN', 'LEFT', 'RIGHT']).toContain(move);
  });

  it('should not return opposite direction', () => {
    const state: GameState = {
      ...createInitialState(),
      status: 'playing',
      direction: 'RIGHT',
    };
    
    // Run multiple times to account for randomness
    for (let i = 0; i < 10; i++) {
      const move = calculateAIMove(state);
      expect(move).not.toBe('LEFT');
    }
  });

  it('should avoid immediate wall collision in walls mode', () => {
    const state: GameState = {
      ...createInitialState(20, 'walls'),
      status: 'playing',
      snake: [{ x: 0, y: 10 }, { x: 1, y: 10 }],
      direction: 'LEFT',
      food: { x: 15, y: 15 },
    };
    
    // Since going LEFT would hit wall and RIGHT is opposite, should pick UP or DOWN
    for (let i = 0; i < 10; i++) {
      const move = calculateAIMove(state);
      expect(['UP', 'DOWN']).toContain(move);
    }
  });
});
