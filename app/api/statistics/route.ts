import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const playerId = searchParams.get("playerId");

    if (!playerId) {
      return NextResponse.json(
        { error: "playerId is required" },
        { status: 400 }
      );
    }

    let statistics = await prisma.statistics.findUnique({
      where: { playerId },
    });

    // Create statistics record if it doesn't exist
    if (!statistics) {
      statistics = await prisma.statistics.create({
        data: { playerId },
      });
    }

    return NextResponse.json({ success: true, statistics });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerId, gameResult, mode } = body;

    if (!playerId || !gameResult) {
      return NextResponse.json(
        { error: "playerId and gameResult are required" },
        { status: 400 }
      );
    }

    // Get or create statistics
    let statistics = await prisma.statistics.findUnique({
      where: { playerId },
    });

    if (!statistics) {
      statistics = await prisma.statistics.create({
        data: { playerId },
      });
    }

    // Calculate updates based on game result
    const updates: any = {
      gamesPlayed: { increment: 1 },
    };

    if (gameResult === "win") {
      updates.gamesWon = { increment: 1 };
      updates.currentWinStreak = { increment: 1 };

      // Check if we need to update longest win streak
      const newStreak = statistics.currentWinStreak + 1;
      if (newStreak > statistics.longestWinStreak) {
        updates.longestWinStreak = newStreak;
      }

      // Track AI wins
      if (mode === "ai_easy") {
        updates.aiEasyWins = { increment: 1 };
      } else if (mode === "ai_hard") {
        updates.aiHardWins = { increment: 1 };
      }
    } else if (gameResult === "loss") {
      updates.gamesLost = { increment: 1 };
      updates.currentWinStreak = 0;
    } else if (gameResult === "draw") {
      updates.gamesDraw = { increment: 1 };
      updates.currentWinStreak = 0;
    }

    const updatedStatistics = await prisma.statistics.update({
      where: { playerId },
      data: updates,
    });

    return NextResponse.json({ success: true, statistics: updatedStatistics });
  } catch (error) {
    console.error("Error updating statistics:", error);
    return NextResponse.json(
      { error: "Failed to update statistics" },
      { status: 500 }
    );
  }
}
