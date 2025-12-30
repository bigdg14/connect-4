// Game constants
export const ROWS = 6;
export const COLS = 7;
export const CONNECT_COUNT = 4;

// Player types
export enum Player {
  NONE = 0,
  PLAYER_1 = 1,
  PLAYER_2 = 2,
}

// Game state types
export enum GameState {
  IDLE = "idle",
  PLAYING = "playing",
  WIN = "win",
  DRAW = "draw",
}

// Game mode types
export enum GameMode {
  LOCAL = "local",
  AI_EASY = "ai_easy",
  AI_HARD = "ai_hard",
  ONLINE = "online",
}

// AI difficulty
export enum AIDifficulty {
  EASY = "easy",
  HARD = "hard",
}

// Cell type (single position on the board)
export type Cell = Player;

// Board type (2D array representation)
export type Board = Cell[][];

// Position type
export interface Position {
  row: number;
  col: number;
}

// Winning line
export interface WinningLine {
  positions: Position[];
}

// Game info
export interface GameInfo {
  board: Board;
  currentPlayer: Player;
  gameState: GameState;
  winner: Player;
  winningLine: WinningLine | null;
  moveHistory: Position[];
  mode: GameMode;
}
