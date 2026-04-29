"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Tab = "manual" | "csv";

export default function SalesImportForm({ sessionId }: { sessionId: number }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("manual");
  const [totalSales, setTotalSales] = useState("");
  const [cashSales, setCashSales] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleManual(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const total = parseFloat(totalSales);
    const cash = cashSales ? parseFloat(cashSales) : null;
    if (isNaN(total) || total < 0) { setError("Enter a valid total sales amount"); return; }
    if (cash !== null && (isNaN(cash) || cash < 0 || cash > total)) {
      setError("Cash sales must be between 0 and total sales"); return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/sales-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, totalSales: total, cashSales: cash })
      });
      if (res.ok) { router.push("/end-of-day/cash-count"); router.refresh(); }
      else { const d = await res.json(); setError(d.error ?? "Failed"); }
    } catch { setError("Something went wrong"); }
    finally { setLoading(false); }
  }

  async function handleCSV(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!csvFile) { setError("Select a CSV file"); return; }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("sessionId", String(sessionId));
      form.append("file", csvFile);
      const res = await fetch("/api/sales-import", { method: "POST", body: form });
      if (res.ok) { router.push("/end-of-day/cash-count"); router.refresh(); }
      else { const d = await res.json(); setError(d.error ?? "CSV parse failed"); }
    } catch { setError("Something went wrong"); }
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-5">
      <div className="flex rounded-lg border border-border overflow-hidden">
        {(["manual", "csv"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm font-medium transition ${
              tab === t ? "bg-primary text-white" : "bg-white text-muted-foreground hover:bg-muted"
            }`}
          >
            {t === "manual" ? "Manual Entry" : "Upload CSV"}
          </button>
        ))}
      </div>

      {tab === "manual" ? (
        <form onSubmit={handleManual} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="total">Total Sales ($)</Label>
            <Input id="total" type="number" min="0" step="0.01" placeholder="0.00" value={totalSales} onChange={(e) => setTotalSales(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cash">Cash Sales ($) <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Input id="cash" type="number" min="0" step="0.01" placeholder="Leave blank if unknown" value={cashSales} onChange={(e) => setCashSales(e.target.value)} />
            <p className="text-xs text-muted-foreground">Used for the expected-cash calculation. If unknown, total sales is used.</p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Saving…" : "Save & Continue"}</Button>
        </form>
      ) : (
        <form onSubmit={handleCSV} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="csv">POS Export CSV</Label>
            <Input id="csv" type="file" accept=".csv,text/csv" onChange={(e) => setCsvFile(e.target.files?.[0] ?? null)} required />
            <p className="text-xs text-muted-foreground">The CSV should have a column named &quot;total&quot;, &quot;net_sales&quot;, or &quot;revenue&quot;. Optionally a &quot;cash&quot; column.</p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Parsing…" : "Import & Continue"}</Button>
        </form>
      )}
    </div>
  );
}
