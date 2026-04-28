"use client";

import { useState } from "react";
import { Wallet, Lock } from "lucide-react";
import { openRegister, closeRegister } from "@/lib/dashboard.store";
import { formatPrice } from "@/lib/format";
import type { DailySummary } from "@/lib/dashboard.types";

interface RegisterControlsProps {
  date: string;
  registerOpen: boolean;
  registerClosed: boolean;
  summary: DailySummary | null;
  onRefresh: () => void;
}

export function RegisterControls({
  date,
  registerOpen,
  registerClosed,
  summary,
  onRefresh,
}: RegisterControlsProps) {
  const [openingInput, setOpeningInput] = useState("");
  const [closingInput, setClosingInput] = useState("");

  function handleOpen(e: React.FormEvent) {
    e.preventDefault();
    const bal = parseFloat(openingInput);
    if (isNaN(bal) || bal < 0) return;
    openRegister(bal, date);
    setOpeningInput("");
    onRefresh();
  }

  function handleClose(e: React.FormEvent) {
    e.preventDefault();
    const bal = parseFloat(closingInput);
    if (isNaN(bal) || bal < 0) return;
    closeRegister(bal, date);
    setClosingInput("");
    onRefresh();
  }

  if (!registerOpen) {
    return (
      <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <Wallet className="h-5 w-5 text-primary" />
          Open Register
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Enter the starting cash balance to begin the day.
        </p>
        <form onSubmit={handleOpen} className="flex flex-wrap gap-3">
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
    );
  }

  if (registerClosed) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        Register closed for this day. Variance:{" "}
        <strong>
          {summary?.variance !== null && summary?.variance !== undefined
            ? `${summary.variance >= 0 ? "+" : ""}${formatPrice(summary.variance)}`
            : "N/A"}
        </strong>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-border bg-white/60 p-6" data-no-print>
      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
        <Lock className="h-5 w-5 text-muted-foreground" />
        Close Register
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Count the cash drawer and enter the actual closing balance to calculate
        variance.
      </p>
      <form onSubmit={handleClose} className="flex flex-wrap gap-3">
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
  );
}
