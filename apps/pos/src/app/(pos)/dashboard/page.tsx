import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { todayDate, formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  FileText, Receipt, ClipboardList, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle2, ArrowUpRight, ArrowDownRight,
  DollarSign, ShoppingBag, Wallet, Clock
} from "lucide-react";
import { computeExpectedCash } from "@/lib/calculations";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireSession();
  const today = todayDate();

  const session = await db.daySession.findFirst({
    where: { date: today },
    include: {
      cashier: { select: { name: true } },
      notices: { orderBy: { createdAt: "desc" } },
      expenses: { orderBy: { createdAt: "desc" }, include: { submittedBy: { select: { name: true } } } },
      cashCount: true
    },
    orderBy: { createdAt: "desc" }
  });

  if (!session || session.status === "CLOSED") redirect("/open");

  const pendingExpenses = session.expenses.filter((e) => e.status === "PENDING");
  const approvedExpenses = session.expenses.filter((e) => e.status === "APPROVED");
  const unverifiedNotices = session.notices.filter((n) => !n.verified);
  const noticeIn = session.notices.filter((n) => n.direction === "IN").reduce((s, n) => s + n.amount, 0);
  const noticeOut = session.notices.filter((n) => n.direction === "OUT").reduce((s, n) => s + n.amount, 0);
  const cashExpenses = approvedExpenses.filter((e) => e.paymentMethod === "CASH").reduce((s, e) => s + e.amount, 0);
  const expectedCash = computeExpectedCash(session, session.notices, session.expenses);

  const totalIn = session.openingBalance + (session.cashSales ?? 0) + noticeIn;
  const totalOut = noticeOut + cashExpenses;

  // Combined activity feed: last 6 items
  const activity = [
    ...session.notices.map((n) => ({
      id: `n-${n.id}`,
      type: "notice" as const,
      direction: n.direction,
      amount: n.amount,
      label: n.description,
      sub: n.category,
      at: n.createdAt,
      status: n.verified ? "verified" : "unverified"
    })),
    ...session.expenses.map((e) => ({
      id: `e-${e.id}`,
      type: "expense" as const,
      direction: "OUT" as const,
      amount: e.amount,
      label: e.description,
      sub: `${e.category} · ${e.paymentMethod} · by ${e.submittedBy.name}`,
      at: e.createdAt,
      status: e.status.toLowerCase()
    }))
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 6);

  const alerts = [
    pendingExpenses.length > 0 && {
      id: "pending-exp",
      icon: <AlertTriangle className="h-4 w-4 text-warning" />,
      msg: `${pendingExpenses.length} expense${pendingExpenses.length !== 1 ? "s" : ""} pending approval`,
      href: "/expenses",
      color: "warning" as const
    },
    unverifiedNotices.length > 0 && {
      id: "unverified",
      icon: <AlertTriangle className="h-4 w-4 text-warning" />,
      msg: `${unverifiedNotices.length} cash notice${unverifiedNotices.length !== 1 ? "s" : ""} not yet verified`,
      href: "/notices",
      color: "warning" as const
    },
    session.totalSales == null && {
      id: "no-sales",
      icon: <AlertTriangle className="h-4 w-4 text-muted-foreground" />,
      msg: "POS sales not yet imported for today",
      href: "/end-of-day/import",
      color: "muted" as const
    }
  ].filter(Boolean) as { id: string; icon: React.ReactNode; msg: string; href: string; color: "warning" | "muted" }[];

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-5 max-w-4xl">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{formatDate(session.date)}</h1>
          <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Opened by {session.cashier.name} &bull; as of {timeStr}
          </p>
        </div>
        <Badge variant="success" className="text-sm px-3 py-1">● OPEN</Badge>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((a) => (
            <Link
              key={a.id}
              href={a.href}
              className={`flex items-center justify-between rounded-lg border px-4 py-3 transition hover:shadow-sm ${
                a.color === "warning"
                  ? "border-warning/30 bg-warning/5 text-warning"
                  : "border-border bg-white text-muted-foreground"
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                {a.icon}
                {a.msg}
              </span>
              <ArrowUpRight className="h-4 w-4 opacity-60" />
            </Link>
          ))}
        </div>
      )}

      {/* Cash position cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={<Wallet className="h-4 w-4" />}
          label="Opening"
          value={formatCurrency(session.openingBalance)}
          color="neutral"
        />
        <StatCard
          icon={<ShoppingBag className="h-4 w-4" />}
          label="Cash Sales"
          value={session.cashSales != null ? formatCurrency(session.cashSales) : "—"}
          color="neutral"
          dim={session.cashSales == null}
        />
        <StatCard
          icon={<DollarSign className="h-4 w-4" />}
          label="Expected Cash"
          value={formatCurrency(expectedCash)}
          color="primary"
        />
        <StatCard
          icon={session.cashCount ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
          label="Last Count"
          value={session.cashCount ? formatCurrency(session.cashCount.totalCounted) : "—"}
          color={session.cashCount ? (session.cashCount.variance === 0 ? "success" : Math.abs(session.cashCount.variance) <= 5 ? "warning" : "danger") : "neutral"}
          dim={!session.cashCount}
        />
      </div>

      {/* Cash flow breakdown */}
      <div className="rounded-xl border border-border bg-white p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cash Flow Today</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">IN</p>
            <FlowRow label="Opening balance" amount={session.openingBalance} positive />
            <FlowRow label="Cash sales" amount={session.cashSales ?? 0} positive dim={session.cashSales == null} />
            {noticeIn > 0 && <FlowRow label={`Cash notices (${session.notices.filter(n=>n.direction==="IN").length})`} amount={noticeIn} positive />}
            <div className="border-t border-border pt-2">
              <FlowRow label="Total In" amount={totalIn} positive bold />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">OUT</p>
            {cashExpenses > 0 && <FlowRow label={`Cash expenses (${approvedExpenses.filter(e=>e.paymentMethod==="CASH").length})`} amount={cashExpenses} />}
            {noticeOut > 0 && <FlowRow label={`Cash notices (${session.notices.filter(n=>n.direction==="OUT").length})`} amount={noticeOut} />}
            {totalOut === 0 && <p className="text-sm text-muted-foreground py-1">No cash outflows yet</p>}
            <div className="border-t border-border pt-2">
              <FlowRow label="Total Out" amount={totalOut} bold />
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">Expected in drawer</span>
          <span className="text-xl font-bold text-primary">{formatCurrency(expectedCash)}</span>
        </div>
        {session.cashCount && (
          <div className={`mt-2 flex items-center justify-between text-sm font-medium ${
            session.cashCount.variance === 0 ? "text-success" : Math.abs(session.cashCount.variance) <= 5 ? "text-warning" : "text-destructive"
          }`}>
            <span>Last count variance</span>
            <span>{session.cashCount.variance > 0 ? "+" : ""}{formatCurrency(session.cashCount.variance)}</span>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick Actions</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ActionButton href="/notices/new" icon={<TrendingUp className="h-5 w-5" />} label="New Cash Notice" sub="Record cash in or out" />
          <ActionButton href="/expenses/new" icon={<Receipt className="h-5 w-5" />} label="Submit Expense" sub="Add for approval" />
          <ActionButton href="/end-of-day" icon={<ClipboardList className="h-5 w-5" />} label="End of Day" sub="Close today's session" primary />
        </div>
      </div>

      {/* Activity feed + counts side by side */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Activity feed */}
        <div className="sm:col-span-2 rounded-xl border border-border bg-white overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold">Today&apos;s Activity</p>
            <span className="text-xs text-muted-foreground">{session.notices.length + session.expenses.length} total</span>
          </div>
          {activity.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">No activity yet today.</p>
          ) : (
            <div className="divide-y divide-border">
              {activity.map((item) => (
                <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    item.direction === "IN" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                  }`}>
                    {item.direction === "IN"
                      ? <TrendingUp className="h-4 w-4" />
                      : <TrendingDown className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.label}</p>
                    <p className="truncate text-xs text-muted-foreground capitalize">{item.sub}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-semibold ${item.direction === "IN" ? "text-success" : "text-destructive"}`}>
                      {item.direction === "IN" ? "+" : "-"}{formatCurrency(item.amount)}
                    </p>
                    <p className="text-[10px] text-muted-foreground capitalize">{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activity.length > 0 && (
            <div className="grid grid-cols-2 divide-x divide-border border-t border-border">
              <Link href="/notices" className="py-2.5 text-center text-xs font-medium text-muted-foreground hover:bg-muted transition">
                View Notices →
              </Link>
              <Link href="/expenses" className="py-2.5 text-center text-xs font-medium text-muted-foreground hover:bg-muted transition">
                View Expenses →
              </Link>
            </div>
          )}
        </div>

        {/* Right column: counts */}
        <div className="space-y-3">
          <CountCard
            href="/notices"
            label="Cash Notices"
            count={session.notices.length}
            sub={unverifiedNotices.length > 0 ? `${unverifiedNotices.length} unverified` : "All verified"}
            subColor={unverifiedNotices.length > 0 ? "warning" : "success"}
            icon={<FileText className="h-5 w-5 text-primary" />}
          />
          <CountCard
            href="/expenses"
            label="Expenses"
            count={session.expenses.length}
            sub={pendingExpenses.length > 0 ? `${pendingExpenses.length} pending` : approvedExpenses.length > 0 ? `${approvedExpenses.length} approved` : "None yet"}
            subColor={pendingExpenses.length > 0 ? "warning" : "success"}
            icon={<Receipt className="h-5 w-5 text-primary" />}
          />

          {/* EOD progress */}
          <div className="rounded-xl border border-border bg-white p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">EOD Checklist</p>
            <div className="space-y-2">
              <EODStep done={session.totalSales != null} label="Sales imported" />
              <EODStep done={session.cashCount != null} label="Cash counted" />
              <EODStep done={session.varianceSignedBy != null} label="Reconciled" />
              <EODStep done={false} label="Day closed" />
            </div>
            <Button asChild size="sm" className="mt-3 w-full">
              <Link href="/end-of-day">Continue EOD →</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon, label, value, color, dim
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "neutral" | "primary" | "success" | "warning" | "danger";
  dim?: boolean;
}) {
  const bg = {
    neutral: "bg-white",
    primary: "bg-primary text-white",
    success: "bg-success/10",
    warning: "bg-warning/10",
    danger: "bg-destructive/10"
  }[color];
  const text = {
    neutral: "text-foreground",
    primary: "text-white",
    success: "text-success",
    warning: "text-warning",
    danger: "text-destructive"
  }[color];
  const sub = color === "primary" ? "text-white/70" : "text-muted-foreground";

  return (
    <div className={`rounded-xl border border-border p-4 ${bg}`}>
      <div className={`mb-1 ${color === "primary" ? "text-white/70" : "text-muted-foreground"}`}>{icon}</div>
      <p className={`text-xs ${sub}`}>{label}</p>
      <p className={`mt-0.5 text-lg font-bold ${text} ${dim ? "opacity-40" : ""}`}>{value}</p>
    </div>
  );
}

function FlowRow({ label, amount, positive, bold, dim }: { label: string; amount: number; positive?: boolean; bold?: boolean; dim?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${bold ? "font-semibold" : "text-sm"} ${dim ? "opacity-40" : ""}`}>
      <span className={bold ? "" : "text-muted-foreground"}>{label}</span>
      <span className={positive ? "text-success" : ""}>
        {positive ? "+" : "-"}{formatCurrency(amount)}
      </span>
    </div>
  );
}

function ActionButton({ href, icon, label, sub, primary }: { href: string; icon: React.ReactNode; label: string; sub: string; primary?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl border p-4 transition hover:-translate-y-0.5 hover:shadow-soft ${
        primary
          ? "border-primary bg-primary text-white"
          : "border-border bg-white hover:border-primary/40"
      }`}
    >
      <div className={`shrink-0 ${primary ? "text-white/80" : "text-primary"}`}>{icon}</div>
      <div>
        <p className={`font-semibold text-sm ${primary ? "text-white" : ""}`}>{label}</p>
        <p className={`text-xs ${primary ? "text-white/70" : "text-muted-foreground"}`}>{sub}</p>
      </div>
      <ArrowUpRight className={`ml-auto h-4 w-4 shrink-0 ${primary ? "text-white/60" : "text-muted-foreground"}`} />
    </Link>
  );
}

function CountCard({ href, label, count, sub, subColor, icon }: {
  href: string; label: string; count: number; sub: string;
  subColor: "warning" | "success"; icon: React.ReactNode;
}) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-xl border border-border bg-white p-4 transition hover:shadow-soft">
      <div className="shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold leading-none mt-0.5">{count}</p>
      </div>
      <span className={`text-xs font-medium shrink-0 ${subColor === "warning" ? "text-warning" : "text-success"}`}>{sub}</span>
    </Link>
  );
}

function EODStep({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {done ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
      ) : (
        <div className="h-4 w-4 shrink-0 rounded-full border-2 border-border" />
      )}
      <span className={done ? "text-success line-through opacity-60" : "text-foreground"}>{label}</span>
    </div>
  );
}
