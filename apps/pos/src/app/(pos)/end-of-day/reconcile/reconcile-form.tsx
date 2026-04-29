"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ReconcileForm({
  sessionId,
  variance,
  existingNote,
  existingSignature
}: {
  sessionId: number;
  variance: number;
  existingNote: string | null;
  existingSignature: string | null;
}) {
  const router = useRouter();
  const [note, setNote] = useState(existingNote ?? "");
  const [signature, setSignature] = useState(existingSignature ?? "");
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const needsExplanation = variance !== 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (needsExplanation && !note.trim()) { setError("An explanation is required when there is a variance"); return; }
    if (!signature.trim()) { setError("Signature required"); return; }
    if (!confirmed) { setError("Please confirm your digital signature"); return; }

    setLoading(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}/reconcile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ varianceNote: note || null, varianceSignedBy: signature })
      });
      if (res.ok) { router.push("/end-of-day/report"); router.refresh(); }
      else { const d = await res.json(); setError(d.error ?? "Failed"); }
    } catch { setError("Something went wrong"); }
    finally { setLoading(false); }
  }

  return (
    <div className="rounded-xl border border-border bg-white p-6 shadow-soft space-y-5">
      <form onSubmit={handleSubmit} className="space-y-5">
        {needsExplanation && (
          <div className="space-y-1.5">
            <Label htmlFor="note">Variance Explanation <span className="text-destructive">*</span></Label>
            <Textarea
              id="note"
              placeholder="Explain the reason for the cash variance…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
            />
          </div>
        )}

        {!needsExplanation && (
          <div className="rounded-lg bg-success/5 border border-success/20 p-3 text-sm text-success">
            Cash is balanced. No explanation required.
          </div>
        )}

        <div className="space-y-3 rounded-lg border border-border p-4 bg-muted/20">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Digital Signature</p>
          <div className="space-y-1.5">
            <Label htmlFor="sig">Full Name</Label>
            <Input id="sig" placeholder="Type your full name to sign" value={signature} onChange={(e) => setSignature(e.target.value)} required />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="h-4 w-4 rounded border-border" />
            <span className="text-sm">I confirm this is my digital signature and the information is accurate.</span>
          </label>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving…" : "Confirm & Continue"}
        </Button>
      </form>
    </div>
  );
}
