import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireOwner } from "@/lib/auth";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const owner = await requireOwner();
    const id = parseInt(params.id);
    const { verified, verifiedByName } = await request.json();

    const notice = await db.cashNotice.update({
      where: { id },
      data: {
        verified: !!verified,
        verifiedAt: verified ? new Date() : null,
        verifiedByName: verified ? (verifiedByName ?? owner.name) : null
      }
    });
    return NextResponse.json(notice);
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN")) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
