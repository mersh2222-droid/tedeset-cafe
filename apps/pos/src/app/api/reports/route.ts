import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await requireSession();
    const { sessionId } = await request.json();
    const id = parseInt(sessionId);

    const session = await db.daySession.findUnique({
      where: { id },
      include: { notices: true, expenses: true, cashCount: true }
    });

    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    if (!session.cashCount) return NextResponse.json({ error: "Cash count not complete" }, { status: 400 });

    const totalNoticeIn = session.notices.filter((n) => n.direction === "IN").reduce((s, n) => s + n.amount, 0);
    const totalNoticeOut = session.notices.filter((n) => n.direction === "OUT").reduce((s, n) => s + n.amount, 0);
    const totalExpenses = session.expenses
      .filter((e) => e.status === "APPROVED" && e.paymentMethod === "CASH")
      .reduce((s, e) => s + e.amount, 0);

    const report = await db.dailyReport.upsert({
      where: { daySessionId: id },
      update: {
        openingBalance: session.openingBalance,
        totalSales: session.totalSales ?? 0,
        totalNoticeIn,
        totalNoticeOut,
        totalExpenses,
        expectedCash: session.cashCount.expectedCash,
        actualCash: session.cashCount.totalCounted,
        variance: session.cashCount.variance
      },
      create: {
        daySessionId: id,
        openingBalance: session.openingBalance,
        totalSales: session.totalSales ?? 0,
        totalNoticeIn,
        totalNoticeOut,
        totalExpenses,
        expectedCash: session.cashCount.expectedCash,
        actualCash: session.cashCount.totalCounted,
        variance: session.cashCount.variance
      }
    });

    return NextResponse.json(report, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create report error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
