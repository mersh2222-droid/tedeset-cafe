"use client";

import { cn } from "@/lib/utils";

interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accent: string;
}

export function SummaryCard({ icon, label, value, sub, accent }: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-soft">
      <div className={cn("mb-2 flex items-center gap-2 text-sm", accent)}>
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}
