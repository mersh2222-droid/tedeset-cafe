"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CashCount } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

const BILLS = [
  { key: "bills100", label: "$100", value: 100 },
  { key: "bills50", label: "$50", value: 50 },
  { key: "bills20", label: "$20", value: 20 },
  { key: "bills10", label: "$10", value: 10 },
  { key: "bills5", label: "$5", value: 5 },
  { key: "bills2", label: "$2", value: 2 },
  { key: "bills1", label: "$1", value: 1 }
];

const COINS = [
  { key: "coins50", label: "50¢", value: 0.5 },
  { key: "coins25", label: "25¢", value: 0.25 },
  { key: "coins10", label: "10¢", value: 0.1 },
  { key: "coins5", label: "5¢", value: 0.05 },
  { key: "coins1", label: "1¢", value: 0.01 }
];

type DenomKey = "bills100" | "bills50" | "bills20" | "bills10" | "bills5" | "bills2" | "bills1" | "coins50" | "coins25" | "coins10" | "coins5" | "coins1";

function initCounts(existing: CashCount | null): Record<DenomKey, number> {
  const keys: DenomKey[] = ["bills100", "bills50", "bills20", "bills10", "bills5", "bills2", "bills1", "coins50", "coins25", "coins10", "coins5", "coins1"];
  const init: Record<string, number> = {};
  for (const k of keys) {
    init[k] = existing ? (existing[k as keyof CashCount] as number) : 0;
  }
  return init as Record<DenomKey, number>;
}

export default function DenominationForm({
  sessionId,
  expectedCash,
  countedByName,
  existing
}: {
  sessionId: number;
  expectedCash: number;
  countedByName: string;
  existing: CashCount | null;
}) {
  const router = useRouter();
  const [counts, setCounts] = useState<Record<DenomKey, number>>(initCounts(existing));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function setCount(key: DenomKey, val: string) {
    const n = parseInt(val) || 0;
    setCounts((prev) => ({ ...prev, [key]: Math.max(0, n) }));
  }

  const billTotal = BILLS.reduce((s, b) => s + counts[b.key as DenomKey] * b.value, 0);
  const coinTotal = COINS.reduce((s, c) => s + counts[c.key as DenomKey] * c.value, 0);
  const grandTotal = Math.round((billTotal + coinTotal) * 100) / 100;
  const variance = Math.round((grandTotal - expectedCash) * 100) / 100;
  const varianceColor = variance === 0 ? "text-success" : Math.abs(variance) <= 5 ? "text-warning" : "text-destructive";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/cash-count", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, ...counts, countedByName })
      });
      if (res.ok) { router.push("/end-of-day/reconcile"); router.refresh(); }
      else { const d = await res.json(); setError(d.error ?? "Failed"); }
    } catch { setError("Something went wrong"); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bills</p>
        <div className="space-y-2">
          {BILLS.map((b) => {
            const subtotal = counts[b.key as DenomKey] * b.value;
            return (
              <div key={b.key} className="flex items-center gap-3">
                <span className="w-10 text-sm font-medium text-right">{b.label}</span>
                <span className="text-muted-foreground text-sm">×</span>
                <input
                  type="number"
                  min="0"
                  value={counts[b.key as DenomKey] || ""}
                  onChange={(e) => setCount(b.key as DenomKey, e.target.value)}
                  placeholder="0"
                  className="w-20 rounded-lg border border-border px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/70"
                />
                <span className="flex-1 text-sm text-right text-muted-foreground">
                  = {subtotal > 0 ? formatCurrency(subtotal) : "—"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Coins</p>
        <div className="space-y-2">
          {COINS.map((c) => {
            const subtotal = Math.round(counts[c.key as DenomKey] * c.value * 100) / 100;
            return (
              <div key={c.key} className="flex items-center gap-3">
                <span className="w-10 text-sm font-medium text-right">{c.label}</span>
                <span className="text-muted-foreground text-sm">×</span>
                <input
                  type="number"
                  min="0"
                  value={counts[c.key as DenomKey] || ""}
                  onChange={(e) => setCount(c.key as DenomKey, e.target.value)}
                  placeholder="0"
                  className="w-20 rounded-lg border border-border px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/70"
                />
                <span className="flex-1 text-sm text-right text-muted-foreground">
                  = {subtotal > 0 ? formatCurrency(subtotal) : "—"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg border border-border p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Bills</span>
          <span>{formatCurrency(billTotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Coins</span>
          <span>{formatCurrency(coinTotal)}</span>
        </div>
        <div className="flex justify-between font-bold border-t border-border pt-2">
          <span>Total Counted</span>
          <span className="text-lg">{formatCurrency(grandTotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Expected</span>
          <span>{formatCurrency(expectedCash)}</span>
        </div>
        <div className={`flex justify-between font-semibold ${varianceColor}`}>
          <span>Variance</span>
          <span>{variance > 0 ? "+" : ""}{formatCurrency(variance)}</span>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving…" : "Save Count & Continue"}
      </Button>
    </form>
  );
}
