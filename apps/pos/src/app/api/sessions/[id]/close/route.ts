import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    await requireSession();
    const id = parseInt(params.id);

    const session = await db.daySession.findUnique({ where: { id } });
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    if (session.status === "CLOSED") return NextResponse.json({ error: "Already closed" }, { status: 409 });

    const updated = await db.daySession.update({
      where: { id },
      data: { status: "CLOSED", closedAt: new Date() }
    });
    return NextResponse.json(updated);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Close session error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
