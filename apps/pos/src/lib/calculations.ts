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
