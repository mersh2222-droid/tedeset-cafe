"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { addLedgerEntry } from "@/lib/dashboard.store";
import type { LedgerEntryType, ExpenseCategory, IncomeCategory } from "@/lib/dashboard.types";

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "Supplies",
  "Bills/Utilities",
  "Ingredients",
  "Maintenance",
  "Delivery Cost",
  "Loan",
  "Other",
];

const INCOME_CATEGORIES: IncomeCategory[] = [
  "Investment",
  "Loan Received",
  "Refund Received",
  "Other",
];

interface LedgerEntryFormProps {
  onAdded: () => void;
}

export function LedgerEntryForm({ onAdded }: LedgerEntryFormProps) {
  const [type, setType] = useState<LedgerEntryType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [description, setDescription] = useState("");

  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  function handleTypeChange(newType: LedgerEntryType) {
    setType(newType);
    setCategory(
      newType === "expense" ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return;
    addLedgerEntry({
      type,
      amount: amt,
      category: category as ExpenseCategory | IncomeCategory,
      description: description || category,
    });
    setAmount("");
    setDescription("");
    onAdded();
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-soft" data-no-print>
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <Plus className="h-5 w-5 text-primary" />
        Add Entry
      </h2>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="flex gap-1 rounded-lg border border-border p-1">
          {(["expense", "income"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTypeChange(t)}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium capitalize transition ${
                type === t
                  ? t === "expense"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
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
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-border bg-white px-3 py-2 text-sm"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Description / notes"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={1}
          className="rounded-lg border border-border px-3 py-2 text-sm resize-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Add
        </button>
      </form>
    </div>
  );
}
