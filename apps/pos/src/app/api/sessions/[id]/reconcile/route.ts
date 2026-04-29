import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireSession();
    const id = parseInt(params.id);
    const { varianceNote, varianceSignedBy } = await request.json();

    if (!varianceSignedBy?.trim()) {
      return NextResponse.json({ error: "Signature required" }, { status: 400 });
    }

    const updated = await db.daySession.update({
      where: { id },
      data: {
        varianceNote: varianceNote ?? null,
        varianceSignedBy: varianceSignedBy.trim(),
        varianceSignedAt: new Date()
      }
    });
    return NextResponse.json(updated);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Reconcile error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
