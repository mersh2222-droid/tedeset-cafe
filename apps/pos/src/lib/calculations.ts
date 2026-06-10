import type { CashNotice, Expense, DaySession } from "@prisma/client";

export function computeExpectedCash(
  session: DaySession,
  notices: CashNotice[],
  expenses: Expense[]
): number {
  const opening = session.openingBalance;
  const cashSales = session.cashSales ?? 0;
  const noticeIn = notices
    .filter((n) => n.direction === "IN")
    .reduce((sum, n) => sum + n.amount, 0);
  const noticeOut = notices
    .filter((n) => n.direction === "OUT")
    .reduce((sum, n) => sum + n.amount, 0);
  const cashExpenses = expenses
    .filter((e) => e.status === "APPROVED" && e.paymentMethod === "CASH")
    .reduce((sum, e) => sum + e.amount, 0);

  return opening + cashSales + noticeIn - noticeOut - cashExpenses;
}

export type LedgerEntry = {
  id: string;
  type: "opening" | "sales" | "notice" | "expense";
  direction: "IN" | "OUT";
  label: string;
  sub: string;
  amount: number;
  balance: number;
  at: Date;
  status: string;
};

export function computeCashLedger(
  session: DaySession,
  notices: CashNotice[],
  expenses: Expense[]
): LedgerEntry[] {
  const cashExpenses = expenses.filter(
    (e) => e.status === "APPROVED" && e.paymentMethod === "CASH"
  );

  const events: Omit<LedgerEntry, "balance">[] = [
    {
      id: "opening",
      type: "opening",
      direction: "IN",
      label: "Opening balance",
      sub: "Starting cash drawer",
      amount: session.openingBalance,
      at: session.createdAt,
      status: "posted"
    }
  ];

  if (session.cashSales != null) {
    events.push({
      id: "sales",
      type: "sales",
      direction: "IN",
      label: "Cash sales",
      sub: "POS cash sales (imported/entered)",
      amount: session.cashSales,
      at: session.createdAt,
      status: "posted"
    });
  }

  for (const n of notices) {
    events.push({
      id: `notice-${n.id}`,
      type: "notice",
      direction: n.direction === "IN" ? "IN" : "OUT",
      label: n.description,
      sub: n.category,
      amount: n.amount,
      at: n.createdAt,
      status: n.verified ? "verified" : "unverified"
    });
  }

  for (const e of cashExpenses) {
    events.push({
      id: `expense-${e.id}`,
      type: "expense",
      direction: "OUT",
      label: e.description,
      sub: e.category,
      amount: e.amount,
      at: e.createdAt,
      status: "approved"
    });
  }

  events.sort((a, b) => a.at.getTime() - b.at.getTime());

  let balance = 0;
  return events.map((event) => {
    balance += event.direction === "IN" ? event.amount : -event.amount;
    return { ...event, balance };
  });
}

export function computeDenominationTotal(denom: {
  bills100: number;
  bills50: number;
  bills20: number;
  bills10: number;
  bills5: number;
  bills2: number;
  bills1: number;
  coins50: number;
  coins25: number;
  coins10: number;
  coins5: number;
  coins1: number;
}): number {
  return (
    denom.bills100 * 100 +
    denom.bills50 * 50 +
    denom.bills20 * 20 +
    denom.bills10 * 10 +
    denom.bills5 * 5 +
    denom.bills2 * 2 +
    denom.bills1 * 1 +
    denom.coins50 * 0.5 +
    denom.coins25 * 0.25 +
    denom.coins10 * 0.1 +
    denom.coins5 * 0.05 +
    denom.coins1 * 0.01
  );
}
