import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireOwner } from "@/lib/auth";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  try {
    await requireOwner();
  } catch {
    redirect("/dashboard");
  }

  const sessions = await db.daySession.findMany({
    orderBy: { date: "desc" },
    take: 60,
    include: {
      cashier: { select: { name: true } },
      report: true,
      cashCount: true,
      _count: { select: { notices: true, expenses: true } }
    }
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Session History</h1>
        <p className="mt-1 text-sm text-muted-foreground">Last 60 days</p>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white p-10 text-center text-muted-foreground">
          No sessions yet.
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-white divide-y divide-border overflow-hidden">
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center gap-4 p-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{formatDate(s.date)}</p>
                  <Badge variant={s.status === "CLOSED" ? "muted" : "success"} className="text-[10px]">
                    {s.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {s.cashier.name} &bull; {s._count.notices} notices &bull; {s._count.expenses} expenses
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{formatCurrency(s.openingBalance)}</p>
                {s.report && (
                  <p
                    className={`text-xs font-medium ${
                      s.report.variance === 0
                        ? "text-success"
                        : Math.abs(s.report.variance) <= 5
                        ? "text-warning"
                        : "text-destructive"
                    }`}
                  >
                    {s.report.variance > 0 ? "+" : ""}{formatCurrency(s.report.variance)} variance
                  </p>
                )}
                {s.report?.emailSentAt && (
                  <p className="text-[10px] text-muted-foreground">Email sent ✓</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
