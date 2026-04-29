import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { todayDate, formatCurrency } from "@/lib/utils";
import ReconcileForm from "./reconcile-form";

export const dynamic = "force-dynamic";

export default async function ReconcilePage() {
  const session = await db.daySession.findFirst({
    where: { date: todayDate(), status: "OPEN" },
    include: { cashCount: true, notices: true, expenses: true }
  });
  if (!session) redirect("/open");
  if (!session.cashCount) redirect("/end-of-day/cash-count");

  const { cashCount } = session;
  const variance = cashCount.variance;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step 3 of 4</p>
        <h1 className="mt-1 text-2xl font-bold">Reconcile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review the cash variance and provide an explanation if needed.</p>
      </div>

      <div className="rounded-xl border border-border bg-white p-6 space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Expected Cash</span>
          <span className="font-semibold">{formatCurrency(cashCount.expectedCash)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Actual Count</span>
          <span className="font-semibold">{formatCurrency(cashCount.totalCounted)}</span>
        </div>
        <div
          className={`flex justify-between border-t border-border pt-4 font-bold text-lg ${
            variance === 0 ? "text-success" : Math.abs(variance) <= 5 ? "text-warning" : "text-destructive"
          }`}
        >
          <span>Variance</span>
          <span>
            {variance > 0 ? "+" : ""}
            {formatCurrency(variance)}{" "}
            {variance === 0 ? "✓ Balanced" : variance > 0 ? "(Over)" : "(Short)"}
          </span>
        </div>
      </div>

      <ReconcileForm
        sessionId={session.id}
        variance={variance}
        existingNote={session.varianceNote}
        existingSignature={session.varianceSignedBy}
      />
    </div>
  );
}
