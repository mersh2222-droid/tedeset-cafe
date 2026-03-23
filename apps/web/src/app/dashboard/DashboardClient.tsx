"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  getRegister,
  openRegister,
  closeRegister,
  getDailySummary,
} from "@/lib/dashboard.store";
import type { Transaction, DailySummary } from "@/lib/dashboard.types";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  Plus,
  Trash2,
  Wallet,
  Lock,
  ArrowUpDown,
} from "lucide-react";

const CATEGORIES = [
  "Food & Beverage",
  "Marketplace Product",
  "Catering",
  "Delivery",
  "Tip",
  "Refund",
  "Other",
];

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export function DashboardClient() {
  const [date, setDate] = useState(todayStr());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [registerClosed, setRegisterClosed] = useState(false);

  // Form state
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"cash" | "card">("cash");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);

  // Register form
  const [openingInput, setOpeningInput] = useState("");
  const [closingInput, setClosingInput] = useState("");

  // Filter
  const [filter, setFilter] = useState<"all" | "cash" | "card">("all");

  const refresh = useCallback(() => {
    const txns = getTransactions(date);
    setTransactions(txns);
    setSummary(getDailySummary(date));
    const reg = getRegister(date);
    setRegisterOpen(!!reg);
    setRegisterClosed(!!reg?.isClosed);
  }, [date]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function handleAddTransaction(e: React.FormEvent) {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return;
    addTransaction({
      amount: amt,
      paymentMethod: method,
      description: description || category,
      category,
    });
    setAmount("");
    setDescription("");
    refresh();
  }

  function handleDelete(id: string) {
    deleteTransaction(id);
    refresh();
  }

  function handleOpenRegister(e: React.FormEvent) {
    e.preventDefault();
    const bal = parseFloat(openingInput);
    if (isNaN(bal) || bal < 0) return;
    openRegister(bal, date);
    setOpeningInput("");
    refresh();
  }

  function handleCloseRegister(e: React.FormEvent) {
    e.preventDefault();
    const bal = parseFloat(closingInput);
    if (isNaN(bal) || bal < 0) return;
    closeRegister(bal, date);
    setClosingInput("");
    refresh();
  }

  const filteredTxns =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.paymentMethod === filter);

  return (
    <div className="space-y-8">
      {/* Date picker */}
      <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm font-medium">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-sm"
        />
        <button
          onClick={() => setDate(todayStr())}
          className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
        >
          Today
        </button>
      </div>

      {/* Register controls */}
      {!registerOpen ? (
        <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <Wallet className="h-5 w-5 text-primary" />
            Open Register
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Enter the starting cash balance to begin the day.
          </p>
          <form onSubmit={handleOpenRegister} className="flex flex-wrap gap-3">
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Opening balance ($)"
              value={openingInput}
              onChange={(e) => setOpeningInput(e.target.value)}
              className="w-48 rounded-lg border border-border px-3 py-2 text-sm"
              required
            />
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Open Register
            </button>
          </form>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          {summary && (
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
          )}

          {/* Add transaction form */}
          {!registerClosed && (
            <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Plus className="h-5 w-5 text-primary" />
                Add Transaction
              </h2>
              <form
                onSubmit={handleAddTransaction}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
              >
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Amount ($)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="rounded-lg border border-border px-3 py-2 text-sm"
                  required
                />
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as "cash" | "card")}
                  className="rounded-lg border border-border bg-white px-3 py-2 text-sm"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                </select>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-lg border border-border bg-white px-3 py-2 text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-lg border border-border px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  Add
                </button>
              </form>
            </div>
          )}

          {/* Close register */}
          {!registerClosed && (
            <div className="rounded-2xl border border-dashed border-border bg-white/60 p-6">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                <Lock className="h-5 w-5 text-muted-foreground" />
                Close Register
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Count the cash drawer and enter the actual closing balance to
                calculate variance.
              </p>
              <form
                onSubmit={handleCloseRegister}
                className="flex flex-wrap gap-3"
              >
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Actual closing balance ($)"
                  value={closingInput}
                  onChange={(e) => setClosingInput(e.target.value)}
                  className="w-56 rounded-lg border border-border px-3 py-2 text-sm"
                  required
                />
                <button
                  type="submit"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                >
                  Close Register
                </button>
              </form>
            </div>
          )}

          {registerClosed && (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              Register closed for this day. Variance:{" "}
              <strong>
                {summary?.variance !== null
                  ? `${summary!.variance >= 0 ? "+" : ""}${formatPrice(summary!.variance)}`
                  : "N/A"}
              </strong>
            </div>
          )}

          {/* Transactions list */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <ArrowUpDown className="h-5 w-5 text-primary" />
                Transactions
              </h2>
              <div className="flex gap-1 rounded-lg border border-border p-1 text-xs">
                {(["all", "cash", "card"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "rounded-md px-3 py-1 capitalize transition",
                      filter === f
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {filteredTxns.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No transactions yet for this date.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="pb-2 pr-4">Time</th>
                      <th className="pb-2 pr-4">Description</th>
                      <th className="pb-2 pr-4">Category</th>
                      <th className="pb-2 pr-4">Method</th>
                      <th className="pb-2 pr-4 text-right">Amount</th>
                      <th className="pb-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTxns
                      .sort(
                        (a, b) =>
                          new Date(b.timestamp).getTime() -
                          new Date(a.timestamp).getTime()
                      )
                      .map((txn) => (
                        <tr
                          key={txn.id}
                          className="border-b border-border/50 last:border-0"
                        >
                          <td className="py-3 pr-4 tabular-nums text-muted-foreground">
                            {new Date(txn.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="py-3 pr-4">{txn.description}</td>
                          <td className="py-3 pr-4 text-muted-foreground">
                            {txn.category}
                          </td>
                          <td className="py-3 pr-4">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                                txn.paymentMethod === "cash"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-700"
                              )}
                            >
                              {txn.paymentMethod === "cash" ? (
                                <DollarSign className="h-3 w-3" />
                              ) : (
                                <CreditCard className="h-3 w-3" />
                              )}
                              {txn.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-right tabular-nums font-medium">
                            {formatPrice(txn.amount)}
                          </td>
                          <td className="py-3 text-right">
                            {!registerClosed && (
                              <button
                                onClick={() => handleDelete(txn.id)}
                                className="rounded p-1 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-soft">
      <div className={cn("mb-2 flex items-center gap-2 text-sm", accent)}>
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}
