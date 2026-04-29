import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { todayDate, formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Receipt, ClipboardList, CheckCircle2 } from "lucide-react";
import { computeExpectedCash } from "@/lib/calculations";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireSession();
  const today = todayDate();

  const session = await db.daySession.findFirst({
    where: { date: today },
    include: {
      cashier: { select: { name: true } },
      notices: true,
      expenses: true,
      cashCount: true
    },
    orderBy: { createdAt: "desc" }
  });

  if (!session || session.status === "CLOSED") redirect("/open");

  const pendingExpenses = session.expenses.filter((e) => e.status === "PENDING");
  const approvedExpenses = session.expenses.filter((e) => e.status === "APPROVED");
  const expectedCash = computeExpectedCash(session, session.notices, session.expenses);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{formatDate(session.date)}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Opened by {session.cashier.name} &bull; Balance: {formatCurrency(session.openingBalance)}
          </p>
        </div>
        <Badge variant={session.status === "OPEN" ? "success" : "muted"}>
          {session.status}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Opening Balance" value={formatCurrency(session.openingBalance)} />
        <StatCard label="Total Sales" value={session.totalSales != null ? formatCurrency(session.totalSales) : "—"} />
        <StatCard label="Expected Cash" value={formatCurrency(expectedCash)} />
        <StatCard
          label="Cash Sales"
          value={session.cashSales != null ? formatCurrency(session.cashSales) : "—"}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <QuickActionCard
          href="/notices/new"
          icon={<FileText className="h-5 w-5" />}
          title="New Cash Notice"
          description="Record non-register cash in or out"
        />
        <QuickActionCard
          href="/expenses/new"
          icon={<Receipt className="h-5 w-5" />}
          title="Submit Expense"
          description="Add a business expense for approval"
        />
        <QuickActionCard
          href="/end-of-day"
          icon={<ClipboardList className="h-5 w-5" />}
          title="End of Day"
          description="Close out today's session"
          highlight
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SummaryCard title="Cash Notices" count={session.notices.length} href="/notices" />
        <SummaryCard
          title="Expenses"
          count={session.expenses.length}
          extra={pendingExpenses.length > 0 ? `${pendingExpenses.length} pending` : undefined}
          href="/expenses"
        />
      </div>

      {user.role === "OWNER" && pendingExpenses.length > 0 && (
        <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
          <p className="text-sm font-medium text-warning">
            {pendingExpenses.length} expense{pendingExpenses.length !== 1 ? "s" : ""} awaiting your approval.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-2">
            <Link href="/expenses">Review Expenses</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}

function QuickActionCard({
  href,
  icon,
  title,
  description,
  highlight
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block rounded-xl border p-4 transition hover:-translate-y-0.5 hover:shadow-soft ${
        highlight ? "border-primary bg-primary text-white" : "border-border bg-white hover:border-primary/40"
      }`}
    >
      <div className={`mb-2 ${highlight ? "text-white/80" : "text-primary"}`}>{icon}</div>
      <p className={`font-semibold ${highlight ? "text-white" : ""}`}>{title}</p>
      <p className={`mt-0.5 text-xs ${highlight ? "text-white/70" : "text-muted-foreground"}`}>{description}</p>
    </Link>
  );
}

function SummaryCard({
  title,
  count,
  extra,
  href
}: {
  title: string;
  count: number;
  extra?: string;
  href: string;
}) {
  return (
    <Link href={href} className="block rounded-xl border border-border bg-white p-4 transition hover:shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        {extra && <Badge variant="warning">{extra}</Badge>}
      </div>
      <p className="mt-1 text-3xl font-bold">{count}</p>
    </Link>
  );
}
