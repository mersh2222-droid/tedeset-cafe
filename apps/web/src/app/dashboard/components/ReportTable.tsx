"use client";

import type { DailyReportRow } from "@/lib/dashboard.types";
import { formatPrice } from "@/lib/format";

type ViewMode = "daily" | "weekly" | "monthly";

interface ReportTableProps {
  rows: DailyReportRow[];
  totals: DailyReportRow;
  viewMode: ViewMode;
}

function getWeekKey(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const start = new Date(d);
  start.setDate(d.getDate() - d.getDay());
  return start.toISOString().split("T")[0];
}

function getMonthKey(dateStr: string): string {
  return dateStr.slice(0, 7);
}

function groupRows(
  rows: DailyReportRow[],
  keyFn: (date: string) => string
): DailyReportRow[] {
  const map = new Map<string, DailyReportRow>();
  for (const r of rows) {
    const key = keyFn(r.date);
    const existing = map.get(key);
    if (existing) {
      existing.totalCash += r.totalCash;
      existing.totalCard += r.totalCard;
      existing.grandTotal += r.grandTotal;
      existing.transactionCount += r.transactionCount;
      existing.ledgerExpenses += r.ledgerExpenses;
      existing.ledgerIncome += r.ledgerIncome;
      existing.netRevenue += r.netRevenue;
    } else {
      map.set(key, { ...r, date: key });
    }
  }
  return Array.from(map.values());
}

export function ReportTable({ rows, totals, viewMode }: ReportTableProps) {
  const displayRows =
    viewMode === "weekly"
      ? groupRows(rows, getWeekKey)
      : viewMode === "monthly"
        ? groupRows(rows, getMonthKey)
        : rows;

  const dateLabel =
    viewMode === "weekly"
      ? "Week Starting"
      : viewMode === "monthly"
        ? "Month"
        : "Date";

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-soft">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
            <th className="px-4 py-3">{dateLabel}</th>
            <th className="px-4 py-3 text-right">Cash</th>
            <th className="px-4 py-3 text-right">Card</th>
            <th className="px-4 py-3 text-right">Total Sales</th>
            <th className="px-4 py-3 text-right">Txns</th>
            <th className="px-4 py-3 text-right">Expenses</th>
            <th className="px-4 py-3 text-right">Income</th>
            <th className="px-4 py-3 text-right">Net</th>
          </tr>
        </thead>
        <tbody>
          {displayRows.map((r) => (
            <tr
              key={r.date}
              className="border-b border-border/50 last:border-0"
            >
              <td className="px-4 py-3 tabular-nums">{r.date}</td>
              <td className="px-4 py-3 text-right tabular-nums">
                {formatPrice(r.totalCash)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {formatPrice(r.totalCard)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums font-medium">
                {formatPrice(r.grandTotal)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {r.transactionCount}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-red-600">
                {r.ledgerExpenses > 0 ? `-${formatPrice(r.ledgerExpenses)}` : formatPrice(0)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-green-600">
                {formatPrice(r.ledgerIncome)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums font-medium">
                {formatPrice(r.netRevenue)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-border bg-muted/30 font-semibold">
            <td className="px-4 py-3">Total</td>
            <td className="px-4 py-3 text-right tabular-nums">
              {formatPrice(totals.totalCash)}
            </td>
            <td className="px-4 py-3 text-right tabular-nums">
              {formatPrice(totals.totalCard)}
            </td>
            <td className="px-4 py-3 text-right tabular-nums">
              {formatPrice(totals.grandTotal)}
            </td>
            <td className="px-4 py-3 text-right tabular-nums">
              {totals.transactionCount}
            </td>
            <td className="px-4 py-3 text-right tabular-nums text-red-600">
              {totals.ledgerExpenses > 0 ? `-${formatPrice(totals.ledgerExpenses)}` : formatPrice(0)}
            </td>
            <td className="px-4 py-3 text-right tabular-nums text-green-600">
              {formatPrice(totals.ledgerIncome)}
            </td>
            <td className="px-4 py-3 text-right tabular-nums">
              {formatPrice(totals.netRevenue)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
