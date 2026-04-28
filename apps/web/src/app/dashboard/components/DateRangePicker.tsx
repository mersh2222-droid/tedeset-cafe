"use client";

interface DateRangePickerProps {
  from: string;
  to: string;
  onFromChange: (date: string) => void;
  onToChange: (date: string) => void;
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function offsetDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function startOfWeek(): string {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().split("T")[0];
}

function startOfLastWeek(): string {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay() - 7);
  return d.toISOString().split("T")[0];
}

function endOfLastWeek(): string {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay() - 1);
  return d.toISOString().split("T")[0];
}

function startOfMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

function startOfLastMonth(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

function endOfLastMonth(): string {
  const d = new Date();
  d.setDate(0);
  return d.toISOString().split("T")[0];
}

const PRESETS: { label: string; from: () => string; to: () => string }[] = [
  { label: "This Week", from: startOfWeek, to: todayStr },
  { label: "Last Week", from: startOfLastWeek, to: endOfLastWeek },
  { label: "This Month", from: startOfMonth, to: todayStr },
  { label: "Last Month", from: startOfLastMonth, to: endOfLastMonth },
  { label: "Last 30 Days", from: () => offsetDate(-29), to: todayStr },
];

export function DateRangePicker({
  from,
  to,
  onFromChange,
  onToChange,
}: DateRangePickerProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="text-sm font-medium">From</label>
      <input
        type="date"
        value={from}
        onChange={(e) => onFromChange(e.target.value)}
        className="rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-sm"
      />
      <label className="text-sm font-medium">To</label>
      <input
        type="date"
        value={to}
        onChange={(e) => onToChange(e.target.value)}
        className="rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-sm"
      />
      <div className="flex flex-wrap gap-1">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              onFromChange(p.from());
              onToChange(p.to());
            }}
            className="rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm transition hover:bg-accent"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
