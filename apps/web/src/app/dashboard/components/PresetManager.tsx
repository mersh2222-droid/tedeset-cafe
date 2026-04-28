"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  getQuickPresets,
  saveQuickPreset,
  deleteQuickPreset,
} from "@/lib/dashboard.store";
import type { QuickAddPreset } from "@/lib/dashboard.types";
import { formatPrice } from "@/lib/format";
import { CATEGORIES } from "./TransactionForm";

interface PresetManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPresetsChanged: () => void;
}

export function PresetManager({
  open,
  onOpenChange,
  onPresetsChanged,
}: PresetManagerProps) {
  const [presets, setPresets] = useState<QuickAddPreset[]>([]);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"cash" | "card">("cash");
  const [category, setCategory] = useState(CATEGORIES[0]);

  useEffect(() => {
    if (open) setPresets(getQuickPresets());
  }, [open]);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!label.trim() || isNaN(amt) || amt <= 0) return;
    saveQuickPreset({
      label: label.trim(),
      amount: amt,
      paymentMethod: method,
      category,
      description: label.trim(),
    });
    setLabel("");
    setAmount("");
    setPresets(getQuickPresets());
    onPresetsChanged();
  }

  function handleDelete(id: string) {
    deleteQuickPreset(id);
    setPresets(getQuickPresets());
    onPresetsChanged();
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Settings
            </p>
            <p className="text-lg font-semibold">Quick-Add Presets</p>
          </div>

          <form onSubmit={handleAdd} className="grid gap-3">
            <input
              type="text"
              placeholder="Label (e.g. Latte)"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="rounded-lg border border-border px-3 py-2 text-sm"
              required
            />
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
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Add Preset
            </button>
          </form>

          {presets.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Existing Presets
              </p>
              {presets.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-white/80 p-3 text-sm"
                >
                  <div>
                    <span className="font-medium">{p.label}</span>
                    <span className="ml-2 text-muted-foreground">
                      {formatPrice(p.amount)} · {p.paymentMethod}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="rounded p-1 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
