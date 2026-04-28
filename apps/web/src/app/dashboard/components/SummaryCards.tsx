"use client";

import { DollarSign, CreditCard, TrendingUp, Wallet } from "lucide-react";
import type { DailySummary } from "@/lib/dashboard.types";
import { formatPrice } from "@/lib/format";
import { SummaryCard } from "./SummaryCard";

interface SummaryCardsProps {
  summary: DailySummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        icon={<DollarSign className="h-5 w-5" />}
        label="Cash Sales"
        value={formatPrice(summary.totalCash)}
        sub={`${summary.cashCount} transaction${summary.cashCount !== 1 ? "s" : ""}`}
        accent="text-green-600"
      />
      <SummaryCard
        icon={<CreditCard className="h-5 w-5" />}
        label="Card Sales"
        value={formatPrice(summary.totalCard)}
        sub={`${summary.cardCount} transaction${summary.cardCount !== 1 ? "s" : ""}`}
        accent="text-blue-600"
      />
      <SummaryCard
        icon={<TrendingUp className="h-5 w-5" />}
        label="Grand Total"
        value={formatPrice(summary.grandTotal)}
        sub={`${summary.totalCount} total transactions`}
        accent="text-primary"
      />
      <SummaryCard
        icon={<Wallet className="h-5 w-5" />}
        label="Expected Cash"
        value={formatPrice(summary.expectedCash)}
        sub={
          summary.variance !== null
            ? `Variance: ${summary.variance >= 0 ? "+" : ""}${formatPrice(summary.variance)}`
            : `Opening: ${formatPrice(summary.openingBalance)}`
        }
        accent={
          summary.variance === null
            ? "text-muted-foreground"
            : summary.variance === 0
              ? "text-green-600"
              : summary.variance > 0
                ? "text-blue-600"
                : "text-red-600"
        }
      />
    </div>
  );
}
