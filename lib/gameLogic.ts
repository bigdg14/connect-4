import {
  Board,
  Cell,
  Player,
  Position,
  WinningLine,
  ROWS,
  COLS,
  CONNECT_COUNT,
} from "@/types/game";

/**
 * Creates an empty game board
 */
export function createEmptyBoard(): Board {
  return Array(ROWS)
    .fill(null)
    .map(() => Array(COLS).fill(Player.NONE));
}

/**
 * Checks if a column is valid and not full
 */
export function isValidMove(board: Board, col: number): boolean {
  if (col < 0 || col >= COLS) return false;
  return board[0][col] === Player.NONE;
}

/**
 * Gets the row where a piece would land in a column
 */
export function getDropRow(board: Board, col: number): number {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === Player.NONE) {
      return row;
    }
  }
  return -1;
}

/**
 * Makes a move on the board (immutable - returns new board)
 */
export function makeMove(
  board: Board,
  col: number,
  player: Player
): { board: Board; position: Position } | null {
  if (!isValidMove(board, col)) return null;

  const row = getDropRow(board, col);
  if (row === -1) return null;

  const newBoard = board.map((r) => [...r]);
  newBoard[row][col] = player;

  return { board: newBoard, position: { row, col } };
}

/**
 * Checks if the board is full (draw condition)
 */
export function isBoardFull(board: Board): boolean {
  return board[0].every((cell) => cell !== Player.NONE);
}

/**
 * Gets all valid moves (columns that aren't full)
 */
export function getValidMoves(board: Board): number[] {
  const moves: number[] = [];
  for (let col = 0; col < COLS; col++) {
    if (isValidMove(board, col)) {
      moves.push(col);
    }
  }
  return moves;
}

/**
 * Checks for a winner after a move at the given position
 */
export function checkWinner(
  board: Board,
  lastMove: Position
): WinningLine | null {
  const { row, col } = lastMove;
  const player = board[row][col];

  if (player === Player.NONE) return null;

  // Check all four directions: horizontal, vertical, diagonal /, diagonal \
  const directions = [
    { dr: 0, dc: 1 }, // horizontal
    { dr: 1, dc: 0 }, // vertical
    { dr: 1, dc: 1 }, // diagonal \
    { dr: 1, dc: -1 }, // diagonal /
  ];

  for (const { dr, dc } of directions) {
    const positions: Position[] = [];

    // Check in both directions from the last move
    for (let i = -CONNECT_COUNT + 1; i < CONNECT_COUNT; i++) {
      const r = row + dr * i;
      const c = col + dc * i;

      if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
        positions.push({ row: r, col: c });

        if (positions.length === CONNECT_COUNT) {
          // Check if positions are consecutive
          const isConsecutive = positions.every((pos, idx) => {
            if (idx === 0) return true;
            const prev = positions[idx - 1];
            return pos.row === prev.row + dr && pos.col === prev.col + dc;
          });

          if (isConsecutive) {
            return { positions };
          }
        }
      } else {
        positions.length = 0;
      }
    }
  }

  return null;
}

/**
 * Switches to the next player
 */
export function getNextPlayer(currentPlayer: Player): Player {
  return currentPlayer === Player.PLAYER_1 ? Player.PLAYER_2 : Player.PLAYER_1;
}

/**
 * Gets a random valid move (for easy AI)
 */
export function getRandomMove(board: Board): number {
  const validMoves = getValidMoves(board);
  if (validMoves.length === 0) return -1;
  return validMoves[Math.floor(Math.random() * validMoves.length)];
}
