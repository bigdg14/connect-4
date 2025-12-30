"use client";

import { GameState, Player } from "@/types/game";
import { motion } from "framer-motion";

interface GameHeaderProps {
  gameState: GameState;
  currentPlayer: Player;
  winner: Player;
}

export default function GameHeader({
  gameState,
  currentPlayer,
  winner,
}: GameHeaderProps) {
  const getStatusText = () => {
    switch (gameState) {
      case GameState.PLAYING:
        return (
          <span className="flex items-center gap-3">
            <span
              className={`w-6 h-6 rounded-full ${
                currentPlayer === Player.PLAYER_1
                  ? "bg-red-500 shadow-lg shadow-red-500/50"
                  : "bg-yellow-500 shadow-lg shadow-yellow-500/50"
              }`}
            />
            <span>
              Player {currentPlayer === Player.PLAYER_1 ? "1" : "2"}'s Turn
            </span>
          </span>
        );
      case GameState.WIN:
        return (
          <span className="flex items-center gap-3">
            <span
              className={`w-6 h-6 rounded-full ${
                winner === Player.PLAYER_1
                  ? "bg-red-500 shadow-lg shadow-red-500/50"
                  : "bg-yellow-500 shadow-lg shadow-yellow-500/50"
              }`}
            />
            <span>Player {winner === Player.PLAYER_1 ? "1" : "2"} Wins!</span>
          </span>
        );
      case GameState.DRAW:
        return "It's a Draw!";
      default:
        return "Ready to Play";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-4 sm:mb-6 md:mb-8 px-4"
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Connect 4
      </h1>
      <div className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
        {getStatusText()}
      </div>
    </motion.div>
  );
}
