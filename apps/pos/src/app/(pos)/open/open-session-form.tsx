"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/utils";

export default function OpenSessionForm({ date }: { date: string }) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const openingBalance = parseFloat(amount);
    if (isNaN(openingBalance) || openingBalance < 0) {
      setError("Please enter a valid opening balance");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ openingBalance, date })
      });
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? "Failed to open session");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <p className="text-sm text-muted-foreground">Date</p>
        <p className="font-medium">{formatDate(date)}</p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="opening">Opening Balance ($)</Label>
        <Input
          id="opening"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground">Count the cash in the drawer and enter the total.</p>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Opening…" : "Open Day"}
      </Button>
    </form>
  );
}
