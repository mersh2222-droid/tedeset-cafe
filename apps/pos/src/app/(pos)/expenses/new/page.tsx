import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { todayDate } from "@/lib/utils";
import NewExpenseForm from "./new-expense-form";

export default async function NewExpensePage() {
  await requireSession();
  const session = await db.daySession.findFirst({ where: { date: todayDate(), status: "OPEN" } });
  if (!session) redirect("/open");

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Submit Expense</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter expense details. Owner approval required before it affects cash totals.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-white p-6 shadow-soft">
        <NewExpenseForm sessionId={session.id} />
      </div>
    </div>
  );
}
