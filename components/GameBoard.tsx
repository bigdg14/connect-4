"use client";

import { Board as BoardType, Player, Position, WinningLine } from "@/types/game";
import { motion } from "framer-motion";

interface GameBoardProps {
  board: BoardType;
  onColumnClick: (col: number) => void;
  winningLine: WinningLine | null;
  disabled?: boolean;
}

export default function GameBoard({
  board,
  onColumnClick,
  winningLine,
  disabled = false,
}: GameBoardProps) {
  const isWinningPosition = (row: number, col: number): boolean => {
    if (!winningLine) return false;
    return winningLine.positions.some(
      (pos) => pos.row === row && pos.col === col
    );
  };

  const getCellColor = (player: Player, isWinning: boolean): string => {
    if (player === Player.NONE) return "bg-white/10";
    if (isWinning) {
      return player === Player.PLAYER_1
        ? "bg-red-400 ring-4 ring-yellow-400 shadow-lg shadow-yellow-400/50"
        : "bg-yellow-400 ring-4 ring-red-400 shadow-lg shadow-red-400/50";
    }
    return player === Player.PLAYER_1
      ? "bg-red-500 shadow-lg shadow-red-500/50"
      : "bg-yellow-500 shadow-lg shadow-yellow-500/50";
  };

  return (
    <div className="inline-block p-3 sm:p-4 md:p-6 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl md:rounded-2xl shadow-2xl">
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 md:gap-3">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isWinning = isWinningPosition(rowIndex, colIndex);
            const isEmpty = cell === Player.NONE;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full
                  ${
                    !disabled
                      ? "cursor-pointer hover:bg-white/20 transition-colors active:bg-white/30"
                      : "cursor-not-allowed"
                  }
                `}
                onClick={() => {
                  if (!disabled) {
                    onColumnClick(colIndex);
                  }
                }}
              >
                <div className="absolute inset-0 bg-blue-900/50 rounded-full" />
                {!isEmpty && (
                  <motion.div
                    initial={{ scale: 0, y: -100 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: rowIndex * 0.05,
                    }}
                    className={`absolute inset-0.5 sm:inset-1 rounded-full ${getCellColor(
                      cell,
                      isWinning
                    )}`}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
