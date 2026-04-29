import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await requireSession();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    const notices = await db.cashNotice.findMany({
      where: sessionId ? { daySessionId: parseInt(sessionId) } : undefined,
      include: { signedBy: { select: { name: true } } },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(notices);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireSession();
    const body = await request.json();
    const { daySessionId, direction, amount, description, category, witnessName } = body;

    if (!daySessionId || !direction || typeof amount !== "number" || !description || !witnessName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const notice = await db.cashNotice.create({
      data: {
        daySessionId: parseInt(daySessionId),
        direction,
        amount,
        description,
        category: category ?? "other",
        signedById: user.userId,
        witnessName
      },
      include: { signedBy: { select: { name: true } } }
    });
    return NextResponse.json(notice, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create notice error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
