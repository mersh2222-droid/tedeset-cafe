"use client";

import { useState } from "react";
import { BookOpen, Trash2 } from "lucide-react";
import type { LedgerEntry, LedgerEntryType } from "@/lib/dashboard.types";
import { deleteLedgerEntry } from "@/lib/dashboard.store";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

interface LedgerTableProps {
  entries: LedgerEntry[];
  onRefresh: () => void;
}

export function LedgerTable({ entries, onRefresh }: LedgerTableProps) {
  const [filter, setFilter] = useState<"all" | LedgerEntryType>("all");
  const [deleteTarget, setDeleteTarget] = useState<LedgerEntry | null>(null);

  const filtered =
    filter === "all" ? entries : entries.filter((e) => e.type === filter);

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  function handleDelete(entry: LedgerEntry) {
    deleteLedgerEntry(entry.id);
    setDeleteTarget(null);
    onRefresh();
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <BookOpen className="h-5 w-5 text-primary" />
          Ledger Entries
        </h2>
        <div className="flex gap-1 rounded-lg border border-border p-1 text-xs" data-no-print>
          {(["all", "expense", "income"] as const).map((f) => (
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

      {sorted.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No ledger entries for this date.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="pb-2 pr-4">Time</th>
                <th className="pb-2 pr-4">Type</th>
                <th className="pb-2 pr-4">Category</th>
                <th className="pb-2 pr-4">Description</th>
                <th className="pb-2 pr-4 text-right">Amount</th>
                <th className="pb-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="py-3 pr-4 tabular-nums text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                        entry.type === "expense"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      )}
                    >
                      {entry.type}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {entry.category}
                  </td>
                  <td className="py-3 pr-4 max-w-[200px] truncate">
                    {entry.description}
                  </td>
                  <td
                    className={cn(
                      "py-3 pr-4 text-right tabular-nums font-medium",
                      entry.type === "expense" ? "text-red-600" : "text-green-600"
                    )}
                  >
                    {entry.type === "expense" ? "-" : "+"}
                    {formatPrice(entry.amount)}
                  </td>
                  <td className="py-3 text-right" data-no-print>
                    <button
                      onClick={() => setDeleteTarget(entry)}
                      className="rounded p-1 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
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
    </div>
  );
}
