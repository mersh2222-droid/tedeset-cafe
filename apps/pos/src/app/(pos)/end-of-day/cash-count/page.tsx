import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { todayDate } from "@/lib/utils";
import { computeExpectedCash } from "@/lib/calculations";
import DenominationForm from "./denomination-form";

export const dynamic = "force-dynamic";

export default async function CashCountPage() {
  const user = await requireSession();
  const session = await db.daySession.findFirst({
    where: { date: todayDate(), status: "OPEN" },
    include: { notices: true, expenses: true, cashCount: true }
  });
  if (!session) redirect("/open");

  const expectedCash = computeExpectedCash(session, session.notices, session.expenses);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step 2 of 4</p>
        <h1 className="mt-1 text-2xl font-bold">Count Cash</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Count each denomination in the drawer and enter the quantities.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-white p-6 shadow-soft">
        <DenominationForm
          sessionId={session.id}
          expectedCash={expectedCash}
          countedByName={user.name}
          existing={session.cashCount}
        />
      </div>
    </div>
  );
}
