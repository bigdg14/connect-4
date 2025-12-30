"use client";

import { GameState, GameMode } from "@/types/game";
import { motion } from "framer-motion";

interface GameControlsProps {
  gameState: GameState;
  gameMode: GameMode;
  onNewGame: () => void;
  onBackToMenu: () => void;
  onHint?: () => void;
  onViewHistory?: () => void;
}

export default function GameControls({
  gameState,
  gameMode,
  onNewGame,
  onBackToMenu,
  onHint,
  onViewHistory,
}: GameControlsProps) {
  const showHint = gameMode !== GameMode.LOCAL && gameState === GameState.PLAYING;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center mt-4 sm:mt-6 md:mt-8 px-4"
    >
      <button
        onClick={onNewGame}
        className="px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 active:from-green-700 active:to-green-800 text-white text-sm sm:text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
      >
        {gameState === GameState.PLAYING ? "Restart" : "New Game"}
      </button>

      {showHint && onHint && (
        <button
          onClick={onHint}
          className="px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 active:from-purple-700 active:to-purple-800 text-white text-sm sm:text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          Hint
        </button>
      )}

      {onViewHistory && (
        <button
          onClick={onViewHistory}
          className="px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 text-white text-sm sm:text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          History
        </button>
      )}

      <button
        onClick={onBackToMenu}
        className="px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 active:from-gray-700 active:to-gray-800 text-white text-sm sm:text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
      >
        Menu
      </button>
    </motion.div>
  );
}
