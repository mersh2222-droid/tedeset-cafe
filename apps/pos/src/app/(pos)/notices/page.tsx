import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { todayDate, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown, Printer } from "lucide-react";
import NoticeVerifyButton from "./notice-verify-button";
import { requireSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NoticesPage() {
  const user = await requireSession();
  const today = todayDate();
  const session = await db.daySession.findFirst({
    where: { date: today, status: "OPEN" }
  });
  if (!session) redirect("/open");

  const notices = await db.cashNotice.findMany({
    where: { daySessionId: session.id },
    include: { signedBy: { select: { name: true } } },
    orderBy: { createdAt: "desc" }
  });

  const totalIn = notices.filter((n) => n.direction === "IN").reduce((s, n) => s + n.amount, 0);
  const totalOut = notices.filter((n) => n.direction === "OUT").reduce((s, n) => s + n.amount, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cash Notices</h1>
          <p className="mt-1 text-sm text-muted-foreground">Non-register cash movements</p>
        </div>
        <Button asChild size="sm">
          <Link href="/notices/new">
            <Plus className="h-4 w-4" /> New Notice
          </Link>
        </Button>
      </div>

      <div className="flex gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/5 px-4 py-2">
          <TrendingUp className="h-4 w-4 text-success" />
          <span className="text-sm font-medium text-success">In: {formatCurrency(totalIn)}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2">
          <TrendingDown className="h-4 w-4 text-destructive" />
          <span className="text-sm font-medium text-destructive">Out: {formatCurrency(totalOut)}</span>
        </div>
      </div>

      {notices.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white p-10 text-center text-muted-foreground">
          No notices yet. Add one when you receive or give out cash outside the register.
        </div>
      ) : (
        <div className="space-y-3">
          {notices.map((notice) => (
            <div key={notice.id} className="rounded-xl border border-border bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {notice.direction === "IN" ? (
                    <TrendingUp className="mt-0.5 h-5 w-5 text-success" />
                  ) : (
                    <TrendingDown className="mt-0.5 h-5 w-5 text-destructive" />
                  )}
                  <div>
                    <p className="font-semibold">{notice.description}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {notice.category} &bull; Signed: {notice.signedBy.name} + {notice.witnessName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold ${notice.direction === "IN" ? "text-success" : "text-destructive"}`}
                  >
                    {notice.direction === "IN" ? "+" : "-"}
                    {formatCurrency(notice.amount)}
                  </span>
                  <Badge variant={notice.verified ? "success" : "warning"}>
                    {notice.verified ? "Verified" : "Unverified"}
                  </Badge>
                  <button
                    onClick={() => window.print()}
                    className="rounded p-1 text-muted-foreground hover:text-foreground"
                    aria-label="Print notice"
                  >
                    <Printer className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {user.role === "OWNER" && !notice.verified && (
                <div className="mt-3 border-t border-border pt-3">
                  <NoticeVerifyButton noticeId={notice.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
