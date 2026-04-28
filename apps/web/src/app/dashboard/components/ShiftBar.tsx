"use client";

import type { Shift } from "@/lib/dashboard.types";
import { cn } from "@/lib/utils";

interface ShiftBarProps {
  shifts: Shift[];
  activeShiftFilter: string | null;
  onSelectShift: (shiftId: string | null) => void;
}

export function ShiftBar({
  shifts,
  activeShiftFilter,
  onSelectShift,
}: ShiftBarProps) {
  if (shifts.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" data-no-print>
      <span className="text-xs font-medium text-muted-foreground">Shifts</span>
      <button
        onClick={() => onSelectShift(null)}
        className={cn(
          "rounded-full px-3 py-1 text-xs font-medium transition",
          activeShiftFilter === null
            ? "bg-primary text-primary-foreground"
            : "border border-border bg-white text-muted-foreground hover:bg-muted"
        )}
      >
        All
      </button>
      {shifts.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelectShift(s.id)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition",
            activeShiftFilter === s.id
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-white text-muted-foreground hover:bg-muted"
          )}
        >
          <span
            className={cn(
              "inline-block h-2 w-2 rounded-full",
              s.isClosed
                ? "bg-gray-400"
                : "bg-green-500"
            )}
          />
          {s.name}
        </button>
      ))}
    </div>
  );
}
