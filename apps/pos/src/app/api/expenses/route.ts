import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await requireSession();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    const expenses = await db.expense.findMany({
      where: sessionId ? { daySessionId: parseInt(sessionId) } : undefined,
      include: {
        submittedBy: { select: { name: true } },
        approvedBy: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(expenses);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireSession();
    const body = await request.json();
    const { daySessionId, amount, description, category, paymentMethod, receiptNote } = body;

    if (!daySessionId || typeof amount !== "number" || !description || !category || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const expense = await db.expense.create({
      data: {
        daySessionId: parseInt(daySessionId),
        amount,
        description,
        category,
        paymentMethod,
        receiptNote: receiptNote ?? null,
        submittedById: user.userId
      },
      include: { submittedBy: { select: { name: true } } }
    });
    return NextResponse.json(expense, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create expense error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
