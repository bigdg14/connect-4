import GameHistory from "@/components/GameHistory";
import Link from "next/link";

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
          >
            ← Back to Game
          </Link>
        </div>
        <GameHistory />
      </div>
    </main>
  );
}
