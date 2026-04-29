import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireOwner } from "@/lib/auth";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const owner = await requireOwner();
    const id = parseInt(params.id);
    const { status, rejectionNote } = await request.json();

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const expense = await db.expense.update({
      where: { id },
      data: {
        status,
        approvedById: owner.userId,
        approvedAt: new Date(),
        rejectionNote: status === "REJECTED" ? (rejectionNote ?? null) : null
      }
    });
    return NextResponse.json(expense);
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN")) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
