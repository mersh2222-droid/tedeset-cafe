"use client";

interface DatePickerProps {
  date: string;
  onChange: (date: string) => void;
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export function DatePicker({ date, onChange }: DatePickerProps) {
  return (
    <div className="flex flex-wrap items-center gap-4" data-no-print>
      <label className="text-sm font-medium">Date</label>
      <input
        type="date"
        value={date}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-sm"
      />
      <button
        onClick={() => onChange(todayStr())}
        className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
      >
        Today
      </button>
    </div>
  );
}
