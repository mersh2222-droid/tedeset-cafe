import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { sendDailyReportEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    await requireSession();
    const { sessionId } = await request.json();
    const id = parseInt(sessionId);

    const session = await db.daySession.findUnique({
      where: { id },
      include: {
        cashier: true,
        notices: true,
        expenses: true,
        cashCount: true,
        report: true
      }
    });

    if (!session?.report) return NextResponse.json({ error: "Report not generated yet" }, { status: 400 });

    const result = await sendDailyReportEmail({
      session,
      report: session.report,
      notices: session.notices,
      expenses: session.expenses,
      cashier: { name: session.cashier.name }
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    await db.dailyReport.update({
      where: { daySessionId: id },
      data: { emailSentAt: new Date(), emailSentTo: process.env.OWNER_EMAIL ?? "" }
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Send report error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
