import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { todayDate, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ExpenseApprovalButtons from "./expense-approval-buttons";

export const dynamic = "force-dynamic";

const STATUS_VARIANT = {
  PENDING: "warning" as const,
  APPROVED: "success" as const,
  REJECTED: "destructive" as const
};

export default async function ExpensesPage() {
  const user = await requireSession();
  const session = await db.daySession.findFirst({ where: { date: todayDate(), status: "OPEN" } });
  if (!session) redirect("/open");

  const expenses = await db.expense.findMany({
    where: { daySessionId: session.id },
    include: {
      submittedBy: { select: { name: true } },
      approvedBy: { select: { name: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  const totalApproved = expenses
    .filter((e) => e.status === "APPROVED")
    .reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Expenses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Approved total: <span className="font-medium">{formatCurrency(totalApproved)}</span>
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/expenses/new">
            <Plus className="h-4 w-4" /> Add Expense
          </Link>
        </Button>
      </div>

      {expenses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white p-10 text-center text-muted-foreground">
          No expenses recorded today.
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div key={expense.id} className="rounded-xl border border-border bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{expense.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {expense.category} &bull; {expense.paymentMethod} &bull; by {expense.submittedBy.name}
                  </p>
                  {expense.rejectionNote && (
                    <p className="mt-1 text-xs text-destructive">Rejected: {expense.rejectionNote}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{formatCurrency(expense.amount)}</span>
                  <Badge variant={STATUS_VARIANT[expense.status as keyof typeof STATUS_VARIANT]}>
                    {expense.status}
                  </Badge>
                </div>
              </div>
              {user.role === "OWNER" && expense.status === "PENDING" && (
                <div className="mt-3 border-t border-border pt-3">
                  <ExpenseApprovalButtons expenseId={expense.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
