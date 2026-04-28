"use client";

import { TrendingUp, CalendarCheck, CalendarMinus } from "lucide-react";
import type { RangeSummary } from "@/lib/dashboard.types";
import { formatPrice } from "@/lib/format";
import { SummaryCard } from "./SummaryCard";

interface ReportTrendsProps {
  summary: RangeSummary;
}

export function ReportTrends({ summary }: ReportTrendsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <SummaryCard
        icon={<TrendingUp className="h-5 w-5" />}
        label="Avg Daily Revenue"
        value={formatPrice(summary.averageDailyRevenue)}
        sub={`Across ${summary.rows.filter((r) => r.transactionCount > 0).length} active day(s)`}
        accent="text-primary"
      />
      <SummaryCard
        icon={<CalendarCheck className="h-5 w-5" />}
        label="Busiest Day"
        value={summary.busiestDay ? formatPrice(summary.busiestDay.total) : "N/A"}
        sub={summary.busiestDay?.date ?? "No data"}
        accent="text-green-600"
      />
      <SummaryCard
        icon={<CalendarMinus className="h-5 w-5" />}
        label="Slowest Day"
        value={summary.slowestDay ? formatPrice(summary.slowestDay.total) : "N/A"}
        sub={summary.slowestDay?.date ?? "No data"}
        accent="text-red-600"
      />
    </div>
  );
}
