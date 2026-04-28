"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { updateTransaction } from "@/lib/dashboard.store";
import type { Transaction } from "@/lib/dashboard.types";
import { CATEGORIES } from "./TransactionForm";

interface TransactionEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  onSaved: () => void;
}

export function TransactionEditDialog({
  open,
  onOpenChange,
  transaction,
  onSaved,
}: TransactionEditDialogProps) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"cash" | "card">("cash");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount.toString());
      setMethod(transaction.paymentMethod);
      setDescription(transaction.description);
      setCategory(transaction.category);
    }
  }, [transaction]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!transaction) return;
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return;
    updateTransaction(transaction.id, {
      amount: amt,
      paymentMethod: method,
      description: description || category,
      category,
    });
    onOpenChange(false);
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="grid gap-4">
          <input
            type="number"
            step="0.01"
            min="0.01"
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
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-lg border border-border px-3 py-2 text-sm"
          />
          <DialogFooter>
            <DialogClose asChild>
              <button
                type="button"
                className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Save
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
