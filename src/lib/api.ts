// Centralized mock API layer
// All backend calls are centralized here for easy migration to real backend

export type GameMode = 'pass-through' | 'walls';

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  highScore: number;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  mode: 'pass-through' | 'walls';
  date: Date;
}

export interface LivePlayer {
  id: string;
  username: string;
  score: number;
  mode: 'pass-through' | 'walls';
  isPlaying: boolean;
}

// Simulated delay for API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data storage
let mockUsers: User[] = [
  { id: '1', username: 'NeonMaster', email: 'neon@example.com', createdAt: new Date('2024-01-15'), highScore: 2450 },
  { id: '2', username: 'PixelViper', email: 'pixel@example.com', createdAt: new Date('2024-02-20'), highScore: 1890 },
  { id: '3', username: 'RetroKing', email: 'retro@example.com', createdAt: new Date('2024-03-10'), highScore: 3200 },
];

let mockLeaderboard: LeaderboardEntry[] = [
  { id: '1', username: 'RetroKing', score: 3200, mode: 'walls', date: new Date('2024-12-01') },
  { id: '2', username: 'NeonMaster', score: 2450, mode: 'pass-through', date: new Date('2024-12-03') },
  { id: '3', username: 'CyberSnake', score: 2100, mode: 'walls', date: new Date('2024-12-05') },
  { id: '4', username: 'PixelViper', score: 1890, mode: 'pass-through', date: new Date('2024-12-02') },
  { id: '5', username: 'ArcadeWizard', score: 1750, mode: 'walls', date: new Date('2024-12-04') },
  { id: '6', username: 'GlowRunner', score: 1620, mode: 'pass-through', date: new Date('2024-12-06') },
  { id: '7', username: 'BitMaster', score: 1500, mode: 'walls', date: new Date('2024-12-01') },
  { id: '8', username: 'NightCrawler', score: 1380, mode: 'pass-through', date: new Date('2024-12-03') },
  { id: '9', username: 'VectorPro', score: 1200, mode: 'walls', date: new Date('2024-12-05') },
  { id: '10', username: 'GridWarrior', score: 1050, mode: 'pass-through', date: new Date('2024-12-02') },
];

let mockLivePlayers: LivePlayer[] = [
  { id: '1', username: 'LiveSnake99', score: 450, mode: 'walls', isPlaying: true },
  { id: '2', username: 'ProGamer2024', score: 890, mode: 'pass-through', isPlaying: true },
  { id: '3', username: 'SnakeCharmer', score: 320, mode: 'walls', isPlaying: true },
];

let currentUser: User | null = null;

// Auth API
export const authAPI = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await delay(500);
    
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    currentUser = user;
    localStorage.setItem('authToken', 'mock-jwt-token');
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return { user, token: 'mock-jwt-token' };
  },

  async signup(username: string, email: string, password: string): Promise<{ user: User; token: string }> {
    await delay(500);
    
    if (mockUsers.find(u => u.email === email)) {
      throw new Error('Email already exists');
    }
    
    if (mockUsers.find(u => u.username === username)) {
      throw new Error('Username already taken');
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      createdAt: new Date(),
      highScore: 0,
    };
    
    mockUsers.push(newUser);
    currentUser = newUser;
    localStorage.setItem('authToken', 'mock-jwt-token');
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return { user: newUser, token: 'mock-jwt-token' };
  },

  async logout(): Promise<void> {
    await delay(200);
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(100);
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      currentUser = JSON.parse(stored);
      return currentUser;
    }
    return null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  },
};

// Leaderboard API
export const leaderboardAPI = {
  async getLeaderboard(mode?: 'pass-through' | 'walls'): Promise<LeaderboardEntry[]> {
    await delay(300);
    
    let entries = [...mockLeaderboard];
    if (mode) {
      entries = entries.filter(e => e.mode === mode);
    }
    
    return entries.sort((a, b) => b.score - a.score);
  },

  async submitScore(score: number, mode: 'pass-through' | 'walls'): Promise<LeaderboardEntry> {
    await delay(300);
    
    if (!currentUser) {
      throw new Error('Must be logged in to submit score');
    }
    
    const entry: LeaderboardEntry = {
      id: Date.now().toString(),
      username: currentUser.username,
      score,
      mode,
      date: new Date(),
    };
    
    mockLeaderboard.push(entry);
    
    if (score > currentUser.highScore) {
      currentUser.highScore = score;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    return entry;
  },
};

// Live Players API
export const livePlayersAPI = {
  async getLivePlayers(): Promise<LivePlayer[]> {
    await delay(200);
    return [...mockLivePlayers];
  },

  async getPlayerGame(playerId: string): Promise<LivePlayer | null> {
    await delay(100);
    return mockLivePlayers.find(p => p.id === playerId) || null;
  },

  // Simulate updating a live player's score (for spectate mode)
  updatePlayerScore(playerId: string, score: number): void {
    const player = mockLivePlayers.find(p => p.id === playerId);
    if (player) {
      player.score = score;
    }
  },
};

// Game Stats API
export const gameStatsAPI = {
  async getUserStats(userId: string): Promise<{ gamesPlayed: number; totalScore: number; highScore: number }> {
    await delay(200);
    
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      gamesPlayed: Math.floor(Math.random() * 100) + 10,
      totalScore: Math.floor(Math.random() * 50000) + 5000,
      highScore: user.highScore,
    };
  },
};
