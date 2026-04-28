"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getTransactions,
  getRegister,
  getDailySummary,
  getShifts,
  getActiveShift,
} from "@/lib/dashboard.store";
import type { Transaction, DailySummary, Shift } from "@/lib/dashboard.types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DatePicker } from "./components/DatePicker";
import { SummaryCards } from "./components/SummaryCards";
import { RegisterControls } from "./components/RegisterControls";
import { TransactionForm } from "./components/TransactionForm";
import { TransactionTable } from "./components/TransactionTable";
import { QuickAddPresets } from "./components/QuickAddPresets";
import { ShiftBar } from "./components/ShiftBar";
import { ShiftManager } from "./components/ShiftManager";
import { LedgerSection } from "./components/LedgerSection";
import { ReportsSection } from "./components/ReportsSection";
import { PrintReport } from "./components/PrintReport";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export function DashboardClient() {
  const [date, setDate] = useState(todayStr());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [registerClosed, setRegisterClosed] = useState(false);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [shiftFilter, setShiftFilter] = useState<string | null>(null);
  const [useShifts, setUseShifts] = useState(false);

  const refresh = useCallback(() => {
    const txns = getTransactions(date);
    setTransactions(txns);
    setSummary(getDailySummary(date));
    const reg = getRegister(date);
    setRegisterOpen(!!reg);
    setRegisterClosed(!!reg?.isClosed);
    const dayShifts = getShifts(date);
    setShifts(dayShifts);
    if (dayShifts.length > 0) setUseShifts(true);
  }, [date]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const activeShift = getActiveShift(date);
  const isLocked = useShifts
    ? shifts.length > 0 && shifts.every((s) => s.isClosed)
    : registerClosed;

  const filteredTxns =
    shiftFilter !== null
      ? transactions.filter((t) => t.shiftId === shiftFilter)
      : transactions;

  return (
    <Tabs defaultValue="register" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <DatePicker date={date} onChange={setDate} />
        <div className="flex items-center gap-3">
          <TabsList data-no-print>
            <TabsTrigger value="register">Register</TabsTrigger>
            <TabsTrigger value="ledger">Ledger</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <PrintReport date={date} />
        </div>
      </div>

      {/* Print-only header */}
      <div className="hidden print-only">
        <h2 className="text-xl font-bold">Tedeset Cafe — Daily Report</h2>
        <p className="text-sm text-muted-foreground">{date}</p>
      </div>

      <TabsContent value="register" className="space-y-6">
        {/* Shift mode toggle */}
        {!registerOpen && shifts.length === 0 && (
          <div className="flex items-center gap-4" data-no-print>
            <label className="text-sm font-medium">Mode</label>
            <div className="flex gap-1 rounded-lg border border-border p-1 text-xs">
              <button
                onClick={() => setUseShifts(false)}
                className={`rounded-md px-3 py-1 transition ${!useShifts ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
              >
                Single Register
              </button>
              <button
                onClick={() => setUseShifts(true)}
                className={`rounded-md px-3 py-1 transition ${useShifts ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
              >
                Shifts
              </button>
            </div>
          </div>
        )}

        {useShifts ? (
          <>
            <ShiftBar
              shifts={shifts}
              activeShiftFilter={shiftFilter}
              onSelectShift={setShiftFilter}
            />
            {summary && <SummaryCards summary={summary} />}
            <ShiftManager date={date} shifts={shifts} onRefresh={refresh} />
            {activeShift && !isLocked && (
              <>
                <QuickAddPresets shiftId={activeShift.id} onAdded={refresh} />
                <TransactionForm shiftId={activeShift.id} onAdded={refresh} />
              </>
            )}
            <TransactionTable
              transactions={filteredTxns}
              readOnly={isLocked}
              onRefresh={refresh}
            />
          </>
        ) : (
          <>
            {summary && registerOpen && <SummaryCards summary={summary} />}
            <RegisterControls
              date={date}
              registerOpen={registerOpen}
              registerClosed={registerClosed}
              summary={summary}
              onRefresh={refresh}
            />
            {registerOpen && !registerClosed && (
              <>
                <QuickAddPresets onAdded={refresh} />
                <TransactionForm onAdded={refresh} />
              </>
            )}
            {registerOpen && (
              <TransactionTable
                transactions={filteredTxns}
                readOnly={registerClosed}
                onRefresh={refresh}
              />
            )}
          </>
        )}
      </TabsContent>

      <TabsContent value="ledger">
        <LedgerSection date={date} />
      </TabsContent>

      <TabsContent value="reports">
        <ReportsSection />
      </TabsContent>
    </Tabs>
  );
}
