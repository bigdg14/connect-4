"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Board,
  Player,
  GameState,
  GameMode,
  Position,
  WinningLine,
  GameInfo,
} from "@/types/game";
import {
  createEmptyBoard,
  makeMove,
  checkWinner,
  getNextPlayer,
  isBoardFull,
  getRandomMove,
} from "@/lib/gameLogic";
import { getAIMove } from "@/lib/ai";
import { SoundType } from "./useSound";

export function useGameState(
  mode: GameMode = GameMode.LOCAL,
  playSound?: (sound: SoundType) => void
) {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>(Player.PLAYER_1);
  const [gameState, setGameState] = useState<GameState>(GameState.PLAYING);
  const [winner, setWinner] = useState<Player>(Player.NONE);
  const [winningLine, setWinningLine] = useState<WinningLine | null>(null);
  const [moveHistory, setMoveHistory] = useState<Position[]>([]);
  const [gameMode] = useState<GameMode>(mode);
  const [gameStartTime] = useState<number>(Date.now());

  const saveGame = useCallback(
    async (finalWinner: Player, finalMoveHistory: Position[]) => {
      try {
        const duration = Math.floor((Date.now() - gameStartTime) / 1000);
        const moves = finalMoveHistory.map((position, index) => ({
          column: position.col,
          player: index % 2 === 0 ? Player.PLAYER_1 : Player.PLAYER_2,
        }));

        await fetch("/api/games", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: gameMode,
            winner: finalWinner,
            moves,
            duration,
          }),
        });
      } catch (error) {
        console.error("Failed to save game:", error);
      }
    },
    [gameMode, gameStartTime]
  );

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPlayer(Player.PLAYER_1);
    setGameState(GameState.PLAYING);
    setWinner(Player.NONE);
    setWinningLine(null);
    setMoveHistory([]);
  }, []);

  const handleMove = useCallback(
    (col: number) => {
      if (gameState !== GameState.PLAYING) return false;

      const result = makeMove(board, col, currentPlayer);
      if (!result) return false;

      const { board: newBoard, position } = result;
      const newMoveHistory = [...moveHistory, position];

      // Play drop sound
      playSound?.("drop");

      // Check for winner
      const winLine = checkWinner(newBoard, position);
      if (winLine) {
        setBoard(newBoard);
        setGameState(GameState.WIN);
        setWinner(currentPlayer);
        setWinningLine(winLine);
        setMoveHistory(newMoveHistory);
        saveGame(currentPlayer, newMoveHistory);
        // Play win sound after a short delay
        setTimeout(() => playSound?.("win"), 300);
        return true;
      }

      // Check for draw
      if (isBoardFull(newBoard)) {
        setBoard(newBoard);
        setGameState(GameState.DRAW);
        setMoveHistory(newMoveHistory);
        saveGame(Player.NONE, newMoveHistory);
        // Play draw sound after a short delay
        setTimeout(() => playSound?.("draw"), 300);
        return true;
      }

      // Continue game
      setBoard(newBoard);
      setCurrentPlayer(getNextPlayer(currentPlayer));
      setMoveHistory(newMoveHistory);
      return true;
    },
    [board, currentPlayer, gameState, moveHistory, saveGame, playSound]
  );

  const getHint = useCallback((): number => {
    // Use hard AI for hints
    return getAIMove(board, currentPlayer, "hard");
  }, [board, currentPlayer]);

  // AI move effect
  useEffect(() => {
    if (
      gameState !== GameState.PLAYING ||
      currentPlayer !== Player.PLAYER_2 ||
      (gameMode !== GameMode.AI_EASY && gameMode !== GameMode.AI_HARD)
    ) {
      return;
    }

    // Delay AI move slightly for better UX
    const timeout = setTimeout(() => {
      const difficulty = gameMode === GameMode.AI_EASY ? "easy" : "hard";
      const aiCol = getAIMove(board, Player.PLAYER_2, difficulty);
      if (aiCol !== -1) {
        handleMove(aiCol);
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [currentPlayer, gameState, board, gameMode, handleMove]);

  const gameInfo: GameInfo = {
    board,
    currentPlayer,
    gameState,
    winner,
    winningLine,
    moveHistory,
    mode: gameMode,
  };

  return {
    gameInfo,
    handleMove,
    resetGame,
    getHint,
  };
}
