"use client";

import { useState } from "react";
import { Clock, Lock } from "lucide-react";
import { openShift, closeShift, getShifts } from "@/lib/dashboard.store";
import type { Shift } from "@/lib/dashboard.types";

const SHIFT_NAMES = ["Morning", "Afternoon", "Evening"];

interface ShiftManagerProps {
  date: string;
  shifts: Shift[];
  onRefresh: () => void;
}

export function ShiftManager({ date, shifts, onRefresh }: ShiftManagerProps) {
  const [openingInput, setOpeningInput] = useState("");
  const [closingInput, setClosingInput] = useState("");
  const [shiftName, setShiftName] = useState("");

  const activeShift = shifts.find((s) => !s.isClosed);
  const allClosed = shifts.length > 0 && shifts.every((s) => s.isClosed);
  const lastClosed = shifts.filter((s) => s.isClosed).slice(-1)[0];

  const usedNames = new Set(shifts.map((s) => s.name));
  const availableNames = SHIFT_NAMES.filter((n) => !usedNames.has(n));
  const nextName = availableNames[0] || `Shift ${shifts.length + 1}`;

  function handleOpenShift(e: React.FormEvent) {
    e.preventDefault();
    const bal = parseFloat(openingInput);
    if (isNaN(bal) || bal < 0) return;
    const name = shiftName || nextName;
    openShift({
      date,
      name,
      openingBalance: bal,
      order: shifts.length,
    });
    setOpeningInput("");
    setShiftName("");
    onRefresh();
  }

  function handleCloseShift(e: React.FormEvent) {
    e.preventDefault();
    if (!activeShift) return;
    const bal = parseFloat(closingInput);
    if (isNaN(bal) || bal < 0) return;
    closeShift(activeShift.id, bal);
    setClosingInput("");
    onRefresh();
  }

  if (!activeShift && !allClosed && shifts.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <Clock className="h-5 w-5 text-primary" />
          Start First Shift
        </h2>
        <form onSubmit={handleOpenShift} className="flex flex-wrap gap-3">
          <select
            value={shiftName}
            onChange={(e) => setShiftName(e.target.value)}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm"
          >
            <option value="">{nextName}</option>
            {SHIFT_NAMES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
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
            Open Shift
          </button>
        </form>
      </div>
    );
  }

  if (activeShift) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white/60 p-6" data-no-print>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <Lock className="h-5 w-5 text-muted-foreground" />
          Close &ldquo;{activeShift.name}&rdquo; Shift
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Count the cash drawer and enter the actual balance.
        </p>
        <form onSubmit={handleCloseShift} className="flex flex-wrap gap-3">
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Closing balance ($)"
            value={closingInput}
            onChange={(e) => setClosingInput(e.target.value)}
            className="w-56 rounded-lg border border-border px-3 py-2 text-sm"
            required
          />
          <button
            type="submit"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
          >
            Close Shift
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {allClosed && availableNames.length > 0 && (
        <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <Clock className="h-5 w-5 text-primary" />
            Start Next Shift
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            {lastClosed
              ? `"${lastClosed.name}" closed. Open the next shift to continue.`
              : "Open a new shift."}
          </p>
          <form onSubmit={handleOpenShift} className="flex flex-wrap gap-3">
            <select
              value={shiftName}
              onChange={(e) => setShiftName(e.target.value)}
              className="rounded-lg border border-border bg-white px-3 py-2 text-sm"
            >
              <option value="">{nextName}</option>
              {availableNames.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder={
                lastClosed?.closingBalance !== null
                  ? `Suggested: $${lastClosed?.closingBalance?.toFixed(2)}`
                  : "Opening balance ($)"
              }
              value={openingInput}
              onChange={(e) => setOpeningInput(e.target.value)}
              className="w-56 rounded-lg border border-border px-3 py-2 text-sm"
              required
            />
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Open Shift
            </button>
          </form>
        </div>
      )}
      {allClosed && availableNames.length === 0 && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          All shifts completed for this day.
        </div>
      )}
    </div>
  );
}
