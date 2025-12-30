"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useGameState } from "@/hooks/useGameState";
import { GameMode } from "@/types/game";
import GameBoard from "@/components/GameBoard";
import GameHeader from "@/components/GameHeader";
import GameControls from "@/components/GameControls";

export default function GamePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = (searchParams.get("mode") as GameMode) || GameMode.LOCAL;

  const { gameInfo, handleMove, resetGame, getHint } = useGameState(mode);

  const handleBackToMenu = () => {
    router.push("/");
  };

  const handleHint = () => {
    const hintCol = getHint();
    if (hintCol !== -1) {
      // Visual feedback for hint (we'll enhance this later)
      alert(`Try column ${hintCol + 1}!`);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GameHeader
        gameState={gameInfo.gameState}
        currentPlayer={gameInfo.currentPlayer}
        winner={gameInfo.winner}
      />

      <GameBoard
        board={gameInfo.board}
        onColumnClick={handleMove}
        winningLine={gameInfo.winningLine}
        disabled={gameInfo.gameState !== "playing"}
      />

      <GameControls
        gameState={gameInfo.gameState}
        gameMode={gameInfo.mode}
        onNewGame={resetGame}
        onBackToMenu={handleBackToMenu}
        onHint={handleHint}
      />

      <div className="mt-4 sm:mt-5 md:mt-6 text-xs sm:text-sm text-gray-400">
        Mode: {mode.replace("_", " ").toUpperCase()}
      </div>
    </main>
  );
}
