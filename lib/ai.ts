import {
  Board,
  Player,
  Position,
  ROWS,
  COLS,
  CONNECT_COUNT,
} from "@/types/game";
import {
  getValidMoves,
  makeMove,
  checkWinner,
  isBoardFull,
  getNextPlayer,
  getRandomMove,
} from "@/lib/gameLogic";

// Evaluation constants
const WIN_SCORE = 1000000;
const BLOCK_WIN_SCORE = 500000;
const THREE_IN_A_ROW = 100;
const TWO_IN_A_ROW = 10;
const CENTER_BONUS = 3;

/**
 * Easy AI - Returns a random valid move
 */
export function getEasyAIMove(board: Board): number {
  return getRandomMove(board);
}

/**
 * Evaluates the board position for a given player
 */
function evaluateWindow(
  window: Player[],
  player: Player,
  opponent: Player
): number {
  let score = 0;
  const playerCount = window.filter((p) => p === player).length;
  const opponentCount = window.filter((p) => p === opponent).length;
  const emptyCount = window.filter((p) => p === Player.NONE).length;

  // Player's potential
  if (playerCount === 4) {
    score += WIN_SCORE;
  } else if (playerCount === 3 && emptyCount === 1) {
    score += THREE_IN_A_ROW;
  } else if (playerCount === 2 && emptyCount === 2) {
    score += TWO_IN_A_ROW;
  }

  // Opponent's threats
  if (opponentCount === 3 && emptyCount === 1) {
    score -= BLOCK_WIN_SCORE;
  } else if (opponentCount === 2 && emptyCount === 2) {
    score -= TWO_IN_A_ROW;
  }

  return score;
}

/**
 * Scores the board for a given player
 */
function scorePosition(board: Board, player: Player): number {
  let score = 0;
  const opponent = player === Player.PLAYER_1 ? Player.PLAYER_2 : Player.PLAYER_1;

  // Score center column preference
  const centerCol = Math.floor(COLS / 2);
  const centerArray = board.map((row) => row[centerCol]);
  const centerCount = centerArray.filter((p) => p === player).length;
  score += centerCount * CENTER_BONUS;

  // Score horizontal
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS - 3; col++) {
      const window = [
        board[row][col],
        board[row][col + 1],
        board[row][col + 2],
        board[row][col + 3],
      ];
      score += evaluateWindow(window, player, opponent);
    }
  }

  // Score vertical
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS - 3; row++) {
      const window = [
        board[row][col],
        board[row + 1][col],
        board[row + 2][col],
        board[row + 3][col],
      ];
      score += evaluateWindow(window, player, opponent);
    }
  }

  // Score diagonal /
  for (let row = 0; row < ROWS - 3; row++) {
    for (let col = 0; col < COLS - 3; col++) {
      const window = [
        board[row][col],
        board[row + 1][col + 1],
        board[row + 2][col + 2],
        board[row + 3][col + 3],
      ];
      score += evaluateWindow(window, player, opponent);
    }
  }

  // Score diagonal \
  for (let row = 3; row < ROWS; row++) {
    for (let col = 0; col < COLS - 3; col++) {
      const window = [
        board[row][col],
        board[row - 1][col + 1],
        board[row - 2][col + 2],
        board[row - 3][col + 3],
      ];
      score += evaluateWindow(window, player, opponent);
    }
  }

  return score;
}

/**
 * Checks if the game is terminal (win or draw)
 */
function isTerminalNode(board: Board, lastMove: Position | null): boolean {
  if (lastMove && checkWinner(board, lastMove)) return true;
  if (isBoardFull(board)) return true;
  return false;
}

/**
 * Minimax algorithm with alpha-beta pruning
 */
function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean,
  aiPlayer: Player,
  lastMove: Position | null
): number {
  const validMoves = getValidMoves(board);
  const isTerminal = isTerminalNode(board, lastMove);

  if (depth === 0 || isTerminal) {
    if (isTerminal) {
      if (lastMove && checkWinner(board, lastMove)) {
        const winner = board[lastMove.row][lastMove.col];
        if (winner === aiPlayer) {
          return WIN_SCORE + depth; // Prefer faster wins
        } else {
          return -WIN_SCORE - depth; // Prefer slower losses
        }
      } else {
        return 0; // Draw
      }
    } else {
      return scorePosition(board, aiPlayer);
    }
  }

  if (maximizingPlayer) {
    let value = -Infinity;
    for (const col of validMoves) {
      const result = makeMove(board, col, aiPlayer);
      if (!result) continue;

      const score = minimax(
        result.board,
        depth - 1,
        alpha,
        beta,
        false,
        aiPlayer,
        result.position
      );
      value = Math.max(value, score);
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break; // Beta cutoff
    }
    return value;
  } else {
    let value = Infinity;
    const opponent = getNextPlayer(aiPlayer);
    for (const col of validMoves) {
      const result = makeMove(board, col, opponent);
      if (!result) continue;

      const score = minimax(
        result.board,
        depth - 1,
        alpha,
        beta,
        true,
        aiPlayer,
        result.position
      );
      value = Math.min(value, score);
      beta = Math.min(beta, value);
      if (alpha >= beta) break; // Alpha cutoff
    }
    return value;
  }
}

/**
 * Hard AI - Uses minimax algorithm with alpha-beta pruning
 */
export function getHardAIMove(board: Board, aiPlayer: Player): number {
  const validMoves = getValidMoves(board);
  if (validMoves.length === 0) return -1;

  // If first move, play center column for strategic advantage
  const isEmpty = board.every((row) => row.every((cell) => cell === Player.NONE));
  if (isEmpty) {
    return Math.floor(COLS / 2);
  }

  const depth = 5; // Search depth (can be adjusted)
  let bestScore = -Infinity;
  let bestCol = validMoves[0];

  for (const col of validMoves) {
    const result = makeMove(board, col, aiPlayer);
    if (!result) continue;

    const score = minimax(
      result.board,
      depth - 1,
      -Infinity,
      Infinity,
      false,
      aiPlayer,
      result.position
    );

    if (score > bestScore) {
      bestScore = score;
      bestCol = col;
    }
  }

  return bestCol;
}

/**
 * Get AI move based on difficulty
 */
export function getAIMove(
  board: Board,
  aiPlayer: Player,
  difficulty: "easy" | "hard"
): number {
  if (difficulty === "easy") {
    return getEasyAIMove(board);
  } else {
    return getHardAIMove(board, aiPlayer);
  }
}
