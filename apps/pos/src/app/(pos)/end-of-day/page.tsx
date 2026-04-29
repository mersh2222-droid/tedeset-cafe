import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { todayDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EndOfDayPage() {
  const session = await db.daySession.findFirst({
    where: { date: todayDate(), status: "OPEN" },
    include: { cashCount: true }
  });
  if (!session) redirect("/open");

  const steps = [
    {
      id: 1,
      label: "Import POS Sales",
      description: "Enter total sales from your POS system",
      href: "/end-of-day/import",
      done: session.totalSales != null
    },
    {
      id: 2,
      label: "Count Cash",
      description: "Enter denomination breakdown",
      href: "/end-of-day/cash-count",
      done: session.cashCount != null
    },
    {
      id: 3,
      label: "Reconcile",
      description: "Review variance and add explanation if needed",
      href: "/end-of-day/reconcile",
      done: session.cashCount != null && (session.cashCount.variance === 0 || !!session.varianceNote)
    },
    {
      id: 4,
      label: "Daily Report",
      description: "Review, close day, and email report to owner",
      href: "/end-of-day/report",
      done: false
    }
  ];

  const allDone = steps.slice(0, 3).every((s) => s.done);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold">End of Day</h1>
        <p className="mt-1 text-sm text-muted-foreground">Complete all steps to close today&apos;s session.</p>
      </div>

      <div className="rounded-xl border border-border bg-white divide-y divide-border overflow-hidden">
        {steps.map((step) => (
          <Link
            key={step.id}
            href={step.href}
            className="flex items-center gap-4 p-4 hover:bg-muted/30 transition"
          >
            {step.done ? (
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success" />
            ) : (
              <Circle className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
            )}
            <div className="flex-1">
              <p className={`font-medium ${step.done ? "text-success" : ""}`}>{step.label}</p>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </div>

      {allDone && (
        <Button asChild className="w-full" size="lg">
          <Link href="/end-of-day/report">Review &amp; Close Day</Link>
        </Button>
      )}
    </div>
  );
}
