import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { todayDate, formatCurrency, formatDate } from "@/lib/utils";
import ReportActions from "./report-actions";

export const dynamic = "force-dynamic";

export default async function ReportPage() {
  const user = await requireSession();
  const session = await db.daySession.findFirst({
    where: { date: todayDate() },
    include: {
      cashier: { select: { name: true } },
      notices: true,
      expenses: true,
      cashCount: true,
      report: true
    },
    orderBy: { createdAt: "desc" }
  });

  if (!session) redirect("/open");
  if (!session.cashCount) redirect("/end-of-day/cash-count");

  const totalNoticeIn = session.notices.filter((n) => n.direction === "IN").reduce((s, n) => s + n.amount, 0);
  const totalNoticeOut = session.notices.filter((n) => n.direction === "OUT").reduce((s, n) => s + n.amount, 0);
  const approvedExpenses = session.expenses.filter((e) => e.status === "APPROVED");
  const pendingExpenses = session.expenses.filter((e) => e.status === "PENDING");
  const totalCashExpenses = approvedExpenses
    .filter((e) => e.paymentMethod === "CASH")
    .reduce((s, e) => s + e.amount, 0);

  const variance = session.cashCount.variance;
  const varianceColor =
    variance === 0 ? "text-success" : Math.abs(variance) <= 5 ? "text-warning" : "text-destructive";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="no-print">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step 4 of 4</p>
        <h1 className="mt-1 text-2xl font-bold">Daily Report</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and then close the day. An email will be sent to the owner.
        </p>
      </div>

      {pendingExpenses.length > 0 && (
        <div className="no-print rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm text-warning">
          ⚠ {pendingExpenses.length} expense(s) still pending approval — they are not included in totals.
        </div>
      )}

      {/* Print-optimized report */}
      <div id="daily-report" className="rounded-xl border border-border bg-white overflow-hidden">
        <div className="bg-primary px-6 py-4 text-white">
          <h2 className="text-xl font-bold">Tedeset Cafe — Daily Report</h2>
          <p className="text-sm opacity-80">
            {formatDate(session.date)} &bull; {session.cashier.name}
          </p>
        </div>

        <div className="p-6 space-y-5">
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cash Summary</h3>
            <div className="space-y-2">
              <ReportRow label="Opening Balance" value={formatCurrency(session.openingBalance)} />
              <ReportRow label="Total Sales" value={session.totalSales != null ? formatCurrency(session.totalSales) : "—"} />
              <ReportRow label="Cash Sales" value={session.cashSales != null ? formatCurrency(session.cashSales) : "—"} />
              <ReportRow label="Non-Register Cash In" value={`+${formatCurrency(totalNoticeIn)}`} />
              <ReportRow label="Non-Register Cash Out" value={`-${formatCurrency(totalNoticeOut)}`} />
              <ReportRow label="Approved Cash Expenses" value={`-${formatCurrency(totalCashExpenses)}`} />
              <div className="border-t border-border pt-2">
                <ReportRow label="Expected Cash" value={formatCurrency(session.cashCount.expectedCash)} bold />
                <ReportRow label="Actual Cash Count" value={formatCurrency(session.cashCount.totalCounted)} bold />
                <div className={`flex justify-between ${varianceColor} font-bold`}>
                  <span>Variance</span>
                  <span>{variance > 0 ? "+" : ""}{formatCurrency(variance)}{variance === 0 ? " ✓" : ""}</span>
                </div>
              </div>
            </div>
          </section>

          {session.varianceNote && (
            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Variance Explanation</h3>
              <p className="text-sm">{session.varianceNote}</p>
              {session.varianceSignedBy && (
                <p className="mt-1 text-xs text-muted-foreground">Signed by: {session.varianceSignedBy}</p>
              )}
            </section>
          )}

          {approvedExpenses.length > 0 && (
            <section>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Expenses ({approvedExpenses.length})</h3>
              <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
                {approvedExpenses.map((e) => (
                  <div key={e.id} className="flex items-center justify-between px-3 py-2 text-sm">
                    <div>
                      <p className="font-medium">{e.description}</p>
                      <p className="text-xs text-muted-foreground">{e.category} · {e.paymentMethod}</p>
                    </div>
                    <span className="font-medium">{formatCurrency(e.amount)}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {session.notices.length > 0 && (
            <section>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cash Notices ({session.notices.length})</h3>
              <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
                {session.notices.map((n) => (
                  <div key={n.id} className="flex items-center justify-between px-3 py-2 text-sm">
                    <div>
                      <p className="font-medium">{n.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {n.direction} · {n.category} · {n.verified ? "Verified" : "Unverified"}
                      </p>
                    </div>
                    <span className={`font-medium ${n.direction === "IN" ? "text-success" : "text-destructive"}`}>
                      {n.direction === "IN" ? "+" : "-"}{formatCurrency(n.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <ReportActions
        sessionId={session.id}
        isClosed={session.status === "CLOSED"}
        reportExists={session.report != null}
        emailSentAt={session.report?.emailSentAt?.toISOString() ?? null}
        role={user.role}
      />
    </div>
  );
}

function ReportRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-bold" : "text-sm"}`}>
      <span className={bold ? "" : "text-muted-foreground"}>{label}</span>
      <span>{value}</span>
    </div>
  );
}
