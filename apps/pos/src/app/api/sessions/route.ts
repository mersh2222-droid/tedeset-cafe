import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { todayDate } from "@/lib/utils";

export async function GET() {
  try {
    await requireSession();
    const sessions = await db.daySession.findMany({
      orderBy: { date: "desc" },
      take: 30,
      include: { cashier: { select: { name: true } } }
    });
    return NextResponse.json(sessions);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireSession();
    const { openingBalance, date } = await request.json();

    if (typeof openingBalance !== "number" || openingBalance < 0) {
      return NextResponse.json({ error: "Invalid opening balance" }, { status: 400 });
    }

    const sessionDate = date ?? todayDate();

    const existing = await db.daySession.findFirst({ where: { date: sessionDate, status: "OPEN" } });
    if (existing) {
      return NextResponse.json({ error: "A session is already open for this date" }, { status: 409 });
    }

    const daySession = await db.daySession.create({
      data: {
        date: sessionDate,
        openingBalance,
        cashierId: user.userId,
        status: "OPEN"
      },
      include: { cashier: { select: { name: true } } }
    });

    return NextResponse.json(daySession, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create session error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
