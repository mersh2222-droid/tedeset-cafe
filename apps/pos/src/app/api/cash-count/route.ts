import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { computeExpectedCash, computeDenominationTotal } from "@/lib/calculations";

export async function POST(request: Request) {
  try {
    await requireSession();
    const body = await request.json();
    const {
      sessionId,
      bills100 = 0, bills50 = 0, bills20 = 0, bills10 = 0, bills5 = 0, bills2 = 0, bills1 = 0,
      coins50 = 0, coins25 = 0, coins10 = 0, coins5 = 0, coins1 = 0,
      countedByName,
      varianceExplanation
    } = body;

    if (!sessionId || !countedByName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const session = await db.daySession.findUnique({
      where: { id: parseInt(sessionId) },
      include: { notices: true, expenses: true }
    });
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

    const denomInput = { bills100, bills50, bills20, bills10, bills5, bills2, bills1, coins50, coins25, coins10, coins5, coins1 };
    const totalCounted = Math.round(computeDenominationTotal(denomInput) * 100) / 100;
    const expectedCash = Math.round(computeExpectedCash(session, session.notices, session.expenses) * 100) / 100;
    const variance = Math.round((totalCounted - expectedCash) * 100) / 100;

    const cashCount = await db.cashCount.upsert({
      where: { daySessionId: parseInt(sessionId) },
      update: {
        ...denomInput,
        totalCounted,
        expectedCash,
        variance,
        varianceExplanation: varianceExplanation ?? null,
        countedByName,
        createdAt: new Date()
      },
      create: {
        daySessionId: parseInt(sessionId),
        ...denomInput,
        totalCounted,
        expectedCash,
        variance,
        varianceExplanation: varianceExplanation ?? null,
        countedByName
      }
    });

    return NextResponse.json({ cashCount, totalCounted, expectedCash, variance });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Cash count error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
