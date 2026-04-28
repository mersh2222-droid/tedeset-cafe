"use client";

import { useState, useEffect, useCallback } from "react";
import { Download } from "lucide-react";
import { getRangeSummary, exportRangeToCSV } from "@/lib/dashboard.store";
import type { RangeSummary } from "@/lib/dashboard.types";
import { cn } from "@/lib/utils";
import { DateRangePicker } from "./DateRangePicker";
import { ReportTable } from "./ReportTable";
import { ReportTrends } from "./ReportTrends";

type ViewMode = "daily" | "weekly" | "monthly";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function offsetDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export function ReportsSection() {
  const [from, setFrom] = useState(offsetDate(-29));
  const [to, setTo] = useState(todayStr());
  const [viewMode, setViewMode] = useState<ViewMode>("daily");
  const [summary, setSummary] = useState<RangeSummary | null>(null);

  const refresh = useCallback(() => {
    if (from && to && from <= to) {
      setSummary(getRangeSummary(from, to));
    }
  }, [from, to]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function handleExport() {
    const csv = exportRangeToCSV(from, to);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tedeset-report-${from}-to-${to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <DateRangePicker
          from={from}
          to={to}
          onFromChange={setFrom}
          onToChange={setTo}
        />
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-accent"
          data-no-print
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="flex gap-1 rounded-lg border border-border p-1 text-xs w-fit" data-no-print>
        {(["daily", "weekly", "monthly"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setViewMode(m)}
            className={cn(
              "rounded-md px-3 py-1 capitalize transition",
              viewMode === m
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            {m}
          </button>
        ))}
      </div>

      {summary && (
        <>
          <ReportTrends summary={summary} />
          <ReportTable
            rows={summary.rows}
            totals={summary.totals}
            viewMode={viewMode}
          />
        </>
      )}
    </div>
  );
}
