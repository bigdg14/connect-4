"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GameMode } from "@/types/game";

interface GameRecord {
  id: string;
  mode: string;
  winner: number;
  duration: number;
  createdAt: string;
  moves: Array<{
    column: number;
    player: number;
    moveNumber: number;
  }>;
}

export default function GameHistory() {
  const [games, setGames] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchGames();
  }, [filter]);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("limit", "20");
      if (filter !== "all") {
        params.append("mode", filter);
      }

      const response = await fetch(`/api/games?${params}`);
      const data = await response.json();
      if (data.success) {
        setGames(data.games);
      }
    } catch (error) {
      console.error("Failed to fetch games:", error);
    } finally {
      setLoading(false);
    }
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case GameMode.LOCAL:
        return "Local 2P";
      case GameMode.AI_EASY:
        return "vs AI Easy";
      case GameMode.AI_HARD:
        return "vs AI Hard";
      case GameMode.ONLINE:
        return "Online";
      default:
        return mode;
    }
  };

  const getWinnerLabel = (winner: number) => {
    if (winner === 0) return "Draw";
    if (winner === 1) return "Player 1";
    return "Player 2";
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Game History
      </h2>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {["all", "local", "ai_easy", "ai_hard"].map((mode) => (
          <button
            key={mode}
            onClick={() => setFilter(mode)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === mode
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {mode === "all" ? "All Games" : getModeLabel(mode)}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center text-gray-400 py-8">Loading games...</div>
      )}

      {/* Empty state */}
      {!loading && games.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          No games found. Play some games to see your history!
        </div>
      )}

      {/* Games list */}
      {!loading && games.length > 0 && (
        <div className="space-y-3">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-block px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded">
                      {getModeLabel(game.mode)}
                    </span>
                    <span
                      className={`inline-block px-3 py-1 text-sm font-semibold rounded ${
                        game.winner === 0
                          ? "bg-gray-600 text-white"
                          : game.winner === 1
                          ? "bg-yellow-500 text-gray-900"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {getWinnerLabel(game.winner)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {formatDate(game.createdAt)}
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="text-gray-300">
                    <span className="text-gray-500">Moves:</span>{" "}
                    <span className="font-semibold">{game.moves.length}</span>
                  </div>
                  <div className="text-gray-300">
                    <span className="text-gray-500">Duration:</span>{" "}
                    <span className="font-semibold">
                      {formatDuration(game.duration)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
