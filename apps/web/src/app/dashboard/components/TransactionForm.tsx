"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { addTransaction } from "@/lib/dashboard.store";

const CATEGORIES = [
  "Food & Beverage",
  "Marketplace Product",
  "Catering",
  "Delivery",
  "Tip",
  "Refund",
  "Other",
];

interface TransactionFormProps {
  shiftId?: string;
  onAdded: () => void;
}

export function TransactionForm({ shiftId, onAdded }: TransactionFormProps) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"cash" | "card">("cash");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return;
    addTransaction({
      amount: amt,
      paymentMethod: method,
      description: description || category,
      category,
      shiftId,
    });
    setAmount("");
    setDescription("");
    onAdded();
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-soft" data-no-print>
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <Plus className="h-5 w-5 text-primary" />
        Add Transaction
      </h2>
      <form
        onSubmit={handleSubmit}
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
  );
}

export { CATEGORIES };
