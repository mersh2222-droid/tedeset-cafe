"use client";

import { useState } from "react";
import {
  ArrowUpDown,
  DollarSign,
  CreditCard,
  Trash2,
  Pencil,
  Search,
} from "lucide-react";
import type { Transaction, TransactionSortField, SortDirection } from "@/lib/dashboard.types";
import { deleteTransaction } from "@/lib/dashboard.store";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { TransactionEditDialog } from "./TransactionEditDialog";

interface TransactionTableProps {
  transactions: Transaction[];
  readOnly: boolean;
  onRefresh: () => void;
}

export function TransactionTable({
  transactions,
  readOnly,
  onRefresh,
}: TransactionTableProps) {
  const [filter, setFilter] = useState<"all" | "cash" | "card">("all");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<TransactionSortField>("timestamp");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);

  function toggleSort(field: TransactionSortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  const q = search.toLowerCase();
  const filtered = transactions
    .filter((t) => filter === "all" || t.paymentMethod === filter)
    .filter(
      (t) =>
        !q ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    )
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === "timestamp") {
        cmp = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      } else if (sortField === "amount") {
        cmp = a.amount - b.amount;
      } else {
        cmp = a.paymentMethod.localeCompare(b.paymentMethod);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

  function handleDelete(txn: Transaction) {
    deleteTransaction(txn.id);
    setDeleteTarget(null);
    onRefresh();
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <ArrowUpDown className="h-5 w-5 text-primary" />
          Transactions
        </h2>
        <div className="flex flex-wrap items-center gap-3" data-no-print>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-40 rounded-lg border border-border bg-white py-1.5 pl-8 pr-3 text-xs"
            />
          </div>
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
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No transactions found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th
                  className="cursor-pointer pb-2 pr-4"
                  onClick={() => toggleSort("timestamp")}
                >
                  Time {sortField === "timestamp" && (sortDir === "asc" ? "↑" : "↓")}
                </th>
                <th className="pb-2 pr-4">Description</th>
                <th className="pb-2 pr-4">Category</th>
                <th
                  className="cursor-pointer pb-2 pr-4"
                  onClick={() => toggleSort("paymentMethod")}
                >
                  Method{" "}
                  {sortField === "paymentMethod" && (sortDir === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="cursor-pointer pb-2 pr-4 text-right"
                  onClick={() => toggleSort("amount")}
                >
                  Amount {sortField === "amount" && (sortDir === "asc" ? "↑" : "↓")}
                </th>
                {!readOnly && <th className="pb-2 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((txn) => (
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
                  {!readOnly && (
                    <td className="py-3 text-right" data-no-print>
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => setEditTarget(txn)}
                          className="rounded p-1 text-muted-foreground hover:bg-blue-50 hover:text-blue-600"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(txn)}
                          className="rounded p-1 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        amount={deleteTarget?.amount ?? 0}
        description={deleteTarget?.description ?? ""}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
      />

      <TransactionEditDialog
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
        transaction={editTarget}
        onSaved={onRefresh}
      />
    </div>
  );
}
