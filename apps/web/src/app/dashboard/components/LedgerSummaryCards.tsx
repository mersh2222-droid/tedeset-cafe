"use client";

import { ArrowDownCircle, ArrowUpCircle, TrendingUp } from "lucide-react";
import type { LedgerSummary } from "@/lib/dashboard.types";
import { formatPrice } from "@/lib/format";
import { SummaryCard } from "./SummaryCard";

interface LedgerSummaryCardsProps {
  summary: LedgerSummary;
}

export function LedgerSummaryCards({ summary }: LedgerSummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <SummaryCard
        icon={<ArrowDownCircle className="h-5 w-5" />}
        label="Total Expenses"
        value={formatPrice(summary.totalExpenses)}
        sub={`${summary.expenseCount} expense${summary.expenseCount !== 1 ? "s" : ""}`}
        accent="text-red-600"
      />
      <SummaryCard
        icon={<ArrowUpCircle className="h-5 w-5" />}
        label="Total Income"
        value={formatPrice(summary.totalIncome)}
        sub={`${summary.incomeCount} entr${summary.incomeCount !== 1 ? "ies" : "y"}`}
        accent="text-green-600"
      />
      <SummaryCard
        icon={<TrendingUp className="h-5 w-5" />}
        label="Net Cash Flow"
        value={formatPrice(Math.abs(summary.netCashFlow))}
        sub={summary.netCashFlow >= 0 ? "Positive flow" : "Negative flow"}
        accent={summary.netCashFlow >= 0 ? "text-green-600" : "text-red-600"}
      />
    </div>
  );
}
