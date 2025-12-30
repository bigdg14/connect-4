"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGameState } from "@/hooks/useGameState";
import { useSound } from "@/hooks/useSound";
import { GameMode } from "@/types/game";
import GameBoard from "@/components/GameBoard";
import GameHeader from "@/components/GameHeader";
import GameControls from "@/components/GameControls";
import SoundToggle from "@/components/SoundToggle";

function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = (searchParams.get("mode") as GameMode) || GameMode.LOCAL;

  const { playSound, isMuted, toggleMute } = useSound();
  const { gameInfo, handleMove, resetGame, getHint } = useGameState(mode, playSound);

  const handleBackToMenu = () => {
    router.push("/");
  };

  const handleViewHistory = () => {
    router.push("/history");
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
      <SoundToggle isMuted={isMuted} onToggle={toggleMute} />

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
        onViewHistory={handleViewHistory}
        onButtonClick={() => playSound("click")}
      />

      <div className="mt-4 sm:mt-5 md:mt-6 text-xs sm:text-sm text-gray-400">
        Mode: {mode.replace("_", " ").toUpperCase()}
      </div>
    </main>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-xl">Loading game...</div>
      </div>
    }>
      <GameContent />
    </Suspense>
  );
}
