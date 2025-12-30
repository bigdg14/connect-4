import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { GameMode, Player } from "@/types/game";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode, winner, moves, duration, player1Id, player2Id, roomCode } = body;

    // Validate required fields
    if (!mode || winner === undefined || !moves || !Array.isArray(moves)) {
      return NextResponse.json(
        { error: "Missing required fields: mode, winner, moves" },
        { status: 400 }
      );
    }

    // Create game with moves
    const game = await prisma.game.create({
      data: {
        mode,
        winner,
        duration,
        player1Id,
        player2Id,
        roomCode,
        completedAt: new Date(),
        moves: {
          create: moves.map((move: { column: number; player: number }, index: number) => ({
            column: move.column,
            player: move.player,
            moveNumber: index + 1,
          })),
        },
      },
      include: {
        moves: {
          orderBy: {
            moveNumber: "asc",
          },
        },
      },
    });

    return NextResponse.json({ success: true, game });
  } catch (error) {
    console.error("Error saving game:", error);
    return NextResponse.json(
      { error: "Failed to save game" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");
    const mode = searchParams.get("mode");
    const playerId = searchParams.get("playerId");

    const where: any = {};

    if (mode) {
      where.mode = mode;
    }

    if (playerId) {
      where.OR = [
        { player1Id: playerId },
        { player2Id: playerId },
      ];
    }

    const games = await prisma.game.findMany({
      where,
      include: {
        moves: {
          orderBy: {
            moveNumber: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return NextResponse.json({ success: true, games });
  } catch (error) {
    console.error("Error fetching games:", error);
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}
