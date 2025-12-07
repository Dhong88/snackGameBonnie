// Snake Game Logic - Pure functions for testability

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type GameMode = 'pass-through' | 'walls';
export type GameStatus = 'idle' | 'playing' | 'paused' | 'game-over';

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  status: GameStatus;
  mode: GameMode;
  gridSize: number;
  speed: number;
}

export const INITIAL_SPEED = 150;
export const SPEED_INCREMENT = 5;
export const MIN_SPEED = 50;

export const createInitialState = (gridSize: number = 20, mode: GameMode = 'walls'): GameState => {
  const center = Math.floor(gridSize / 2);
  return {
    snake: [
      { x: center, y: center },
      { x: center - 1, y: center },
      { x: center - 2, y: center },
    ],
    food: generateFood([{ x: center, y: center }, { x: center - 1, y: center }, { x: center - 2, y: center }], gridSize),
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    score: 0,
    status: 'idle',
    mode,
    gridSize,
    speed: INITIAL_SPEED,
  };
};

export const generateFood = (snake: Position[], gridSize: number): Position => {
  const availablePositions: Position[] = [];
  
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (!snake.some(segment => segment.x === x && segment.y === y)) {
        availablePositions.push({ x, y });
      }
    }
  }
  
  if (availablePositions.length === 0) {
    return { x: 0, y: 0 };
  }
  
  return availablePositions[Math.floor(Math.random() * availablePositions.length)];
};

export const getOppositeDirection = (direction: Direction): Direction => {
  switch (direction) {
    case 'UP': return 'DOWN';
    case 'DOWN': return 'UP';
    case 'LEFT': return 'RIGHT';
    case 'RIGHT': return 'LEFT';
  }
};

export const isValidDirectionChange = (current: Direction, next: Direction): boolean => {
  return next !== getOppositeDirection(current);
};

export const moveSnake = (state: GameState): GameState => {
  if (state.status !== 'playing') {
    return state;
  }

  const head = state.snake[0];
  const direction = state.nextDirection;
  
  let newHead: Position;
  
  switch (direction) {
    case 'UP':
      newHead = { x: head.x, y: head.y - 1 };
      break;
    case 'DOWN':
      newHead = { x: head.x, y: head.y + 1 };
      break;
    case 'LEFT':
      newHead = { x: head.x - 1, y: head.y };
      break;
    case 'RIGHT':
      newHead = { x: head.x + 1, y: head.y };
      break;
  }

  // Handle wall collision based on mode
  if (state.mode === 'walls') {
    if (newHead.x < 0 || newHead.x >= state.gridSize || 
        newHead.y < 0 || newHead.y >= state.gridSize) {
      return { ...state, status: 'game-over' };
    }
  } else {
    // Pass-through mode: wrap around
    newHead = {
      x: (newHead.x + state.gridSize) % state.gridSize,
      y: (newHead.y + state.gridSize) % state.gridSize,
    };
  }

  // Check self collision (exclude tail as it will move)
  const bodyWithoutTail = state.snake.slice(0, -1);
  if (bodyWithoutTail.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
    return { ...state, status: 'game-over' };
  }

  // Check if eating food
  const isEating = newHead.x === state.food.x && newHead.y === state.food.y;
  
  let newSnake: Position[];
  let newFood = state.food;
  let newScore = state.score;
  let newSpeed = state.speed;

  if (isEating) {
    newSnake = [newHead, ...state.snake];
    newFood = generateFood(newSnake, state.gridSize);
    newScore = state.score + 10;
    newSpeed = Math.max(MIN_SPEED, state.speed - SPEED_INCREMENT);
  } else {
    newSnake = [newHead, ...state.snake.slice(0, -1)];
  }

  return {
    ...state,
    snake: newSnake,
    food: newFood,
    direction: direction,
    score: newScore,
    speed: newSpeed,
  };
};

export const changeDirection = (state: GameState, newDirection: Direction): GameState => {
  if (state.status !== 'playing') {
    return state;
  }

  if (!isValidDirectionChange(state.direction, newDirection)) {
    return state;
  }

  return {
    ...state,
    nextDirection: newDirection,
  };
};

export const startGame = (state: GameState): GameState => {
  if (state.status === 'playing') {
    return state;
  }

  if (state.status === 'game-over') {
    return {
      ...createInitialState(state.gridSize, state.mode),
      status: 'playing',
    };
  }

  return {
    ...state,
    status: 'playing',
  };
};

export const pauseGame = (state: GameState): GameState => {
  if (state.status !== 'playing') {
    return state;
  }

  return {
    ...state,
    status: 'paused',
  };
};

export const resumeGame = (state: GameState): GameState => {
  if (state.status !== 'paused') {
    return state;
  }

  return {
    ...state,
    status: 'playing',
  };
};

export const resetGame = (state: GameState): GameState => {
  return createInitialState(state.gridSize, state.mode);
};

export const setGameMode = (state: GameState, mode: GameMode): GameState => {
  if (state.status === 'playing') {
    return state;
  }

  return {
    ...createInitialState(state.gridSize, mode),
    mode,
  };
};

// AI Logic for spectate mode
export const calculateAIMove = (state: GameState): Direction => {
  const head = state.snake[0];
  const food = state.food;
  
  // Simple AI: move towards food while avoiding immediate death
  const possibleMoves: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
  
  // Filter out opposite direction
  const validMoves = possibleMoves.filter(dir => isValidDirectionChange(state.direction, dir));
  
  // Filter out moves that would cause immediate death
  const safeMoves = validMoves.filter(dir => {
    let newHead: Position;
    switch (dir) {
      case 'UP':
        newHead = { x: head.x, y: head.y - 1 };
        break;
      case 'DOWN':
        newHead = { x: head.x, y: head.y + 1 };
        break;
      case 'LEFT':
        newHead = { x: head.x - 1, y: head.y };
        break;
      case 'RIGHT':
        newHead = { x: head.x + 1, y: head.y };
        break;
    }
    
    // Check wall collision in walls mode
    if (state.mode === 'walls') {
      if (newHead.x < 0 || newHead.x >= state.gridSize || 
          newHead.y < 0 || newHead.y >= state.gridSize) {
        return false;
      }
    } else {
      newHead = {
        x: (newHead.x + state.gridSize) % state.gridSize,
        y: (newHead.y + state.gridSize) % state.gridSize,
      };
    }
    
    // Check self collision
    return !state.snake.slice(0, -1).some(segment => 
      segment.x === newHead.x && segment.y === newHead.y
    );
  });
  
  if (safeMoves.length === 0) {
    return state.direction;
  }
  
  // Prefer moves that get closer to food
  const movesWithDistance = safeMoves.map(dir => {
    let newHead: Position;
    switch (dir) {
      case 'UP':
        newHead = { x: head.x, y: head.y - 1 };
        break;
      case 'DOWN':
        newHead = { x: head.x, y: head.y + 1 };
        break;
      case 'LEFT':
        newHead = { x: head.x - 1, y: head.y };
        break;
      case 'RIGHT':
        newHead = { x: head.x + 1, y: head.y };
        break;
    }
    
    if (state.mode === 'pass-through') {
      newHead = {
        x: (newHead.x + state.gridSize) % state.gridSize,
        y: (newHead.y + state.gridSize) % state.gridSize,
      };
    }
    
    const distance = Math.abs(newHead.x - food.x) + Math.abs(newHead.y - food.y);
    return { dir, distance };
  });
  
  // Sort by distance and pick the best (or add some randomness)
  movesWithDistance.sort((a, b) => a.distance - b.distance);
  
  // 80% chance to pick optimal move, 20% random for unpredictability
  if (Math.random() < 0.8) {
    return movesWithDistance[0].dir;
  }
  
  return safeMoves[Math.floor(Math.random() * safeMoves.length)];
};
