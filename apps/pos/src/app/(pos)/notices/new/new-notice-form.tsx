"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CATEGORIES = [
  { value: "tips", label: "Tips" },
  { value: "refund", label: "Refund" },
  { value: "deposit", label: "Deposit" },
  { value: "petty_cash", label: "Petty Cash" },
  { value: "other", label: "Other" }
];

export default function NewNoticeForm({
  sessionId,
  signerName
}: {
  sessionId: number;
  signerName: string;
}) {
  const router = useRouter();
  const [direction, setDirection] = useState<"IN" | "OUT">("IN");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [witnessName, setWitnessName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (!witnessName.trim()) {
      setError("Witness name is required (second signer)");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          daySessionId: sessionId,
          direction,
          amount: amountNum,
          description,
          category,
          witnessName: witnessName.trim()
        })
      });
      if (res.ok) {
        router.push("/notices");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? "Failed to create notice");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label>Direction</Label>
        <div className="flex gap-2">
          {(["IN", "OUT"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDirection(d)}
              className={`flex-1 rounded-lg border py-2 text-sm font-medium transition ${
                direction === d
                  ? d === "IN"
                    ? "border-success bg-success/10 text-success"
                    : "border-destructive bg-destructive/10 text-destructive"
                  : "border-border bg-white text-muted-foreground hover:bg-muted"
              }`}
            >
              {d === "IN" ? "Cash In ↑" : "Cash Out ↓"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="amount">Amount ($)</Label>
        <Input
          id="amount"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe the reason for this cash movement…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="rounded-lg border border-border p-4 space-y-4 bg-muted/30">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Two-Person Sign-Off</p>
        <div className="space-y-1.5">
          <Label>First Signer (You)</Label>
          <Input value={signerName} disabled className="bg-muted" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="witness">Second Signer (Witness Name)</Label>
          <Input
            id="witness"
            placeholder="Enter witness full name"
            value={witnessName}
            onChange={(e) => setWitnessName(e.target.value)}
            required
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? "Saving…" : "Submit Notice"}
        </Button>
      </div>
    </form>
  );
}
