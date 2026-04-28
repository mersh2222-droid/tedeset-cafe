"use client";

import { useState, useEffect, useCallback } from "react";
import { getLedgerEntries, getLedgerSummary } from "@/lib/dashboard.store";
import type { LedgerEntry, LedgerSummary } from "@/lib/dashboard.types";
import { LedgerSummaryCards } from "./LedgerSummaryCards";
import { LedgerEntryForm } from "./LedgerEntryForm";
import { LedgerTable } from "./LedgerTable";

interface LedgerSectionProps {
  date: string;
}

export function LedgerSection({ date }: LedgerSectionProps) {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [summary, setSummary] = useState<LedgerSummary>({
    totalExpenses: 0,
    totalIncome: 0,
    netCashFlow: 0,
    expenseCount: 0,
    incomeCount: 0,
  });

  const refresh = useCallback(() => {
    setEntries(getLedgerEntries(date));
    setSummary(getLedgerSummary(date));
  }, [date]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="space-y-6">
      <LedgerSummaryCards summary={summary} />
      <LedgerEntryForm onAdded={refresh} />
      <LedgerTable entries={entries} onRefresh={refresh} />
    </div>
  );
}
