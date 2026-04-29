import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { parseSalesCSV } from "@/lib/csv-parser";

export async function POST(request: Request) {
  try {
    await requireSession();
    const contentType = request.headers.get("content-type") ?? "";

    let sessionId: number;
    let totalSales: number;
    let cashSales: number | null = null;
    let salesNotes = "Manual entry";

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      sessionId = parseInt(String(form.get("sessionId") ?? "0"));
      const file = form.get("file") as File | null;

      if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

      const text = await file.text();
      const parsed = parseSalesCSV(text);
      totalSales = parsed.netSales;
      cashSales = parsed.cashSales;
      salesNotes = `CSV import (${parsed.rowCount} rows)`;
    } else {
      const body = await request.json();
      sessionId = parseInt(String(body.sessionId ?? "0"));
      totalSales = parseFloat(String(body.totalSales ?? "0"));
      cashSales = body.cashSales != null ? parseFloat(String(body.cashSales)) : null;
    }

    if (!sessionId || isNaN(totalSales) || totalSales < 0) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const updated = await db.daySession.update({
      where: { id: sessionId },
      data: {
        totalSales,
        cashSales: cashSales ?? totalSales,
        salesNotes
      }
    });

    return NextResponse.json(updated);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const msg = err instanceof Error ? err.message : "Server error";
    console.error("Sales import error", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
