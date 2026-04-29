import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { todayDate, formatCurrency } from "@/lib/utils";
import SalesImportForm from "./sales-import-form";

export const dynamic = "force-dynamic";

export default async function ImportPage() {
  const session = await db.daySession.findFirst({
    where: { date: todayDate(), status: "OPEN" }
  });
  if (!session) redirect("/open");

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step 1 of 4</p>
        <h1 className="mt-1 text-2xl font-bold">Import POS Sales</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter today&apos;s total sales from your POS system. You can enter manually or upload a CSV.
        </p>
      </div>

      {session.totalSales != null && (
        <div className="rounded-lg border border-success/30 bg-success/5 px-4 py-3 text-sm text-success">
          Current import: Total {formatCurrency(session.totalSales)}
          {session.cashSales != null ? ` / Cash ${formatCurrency(session.cashSales)}` : ""} — {session.salesNotes}
        </div>
      )}

      <div className="rounded-xl border border-border bg-white p-6 shadow-soft">
        <SalesImportForm sessionId={session.id} />
      </div>
    </div>
  );
}
