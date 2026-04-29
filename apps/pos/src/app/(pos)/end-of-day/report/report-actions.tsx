"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Printer, Mail, CheckCircle2, Loader2 } from "lucide-react";

interface Props {
  sessionId: number;
  isClosed: boolean;
  reportExists: boolean;
  emailSentAt: string | null;
  role: "CASHIER" | "OWNER";
}

export default function ReportActions({ sessionId, isClosed, reportExists, emailSentAt, role }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<"generate" | "email" | "close" | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function generateReport() {
    setLoading("generate");
    setError("");
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId })
    });
    if (res.ok) { router.refresh(); }
    else { const d = await res.json(); setError(d.error ?? "Failed"); }
    setLoading(null);
  }

  async function sendEmail() {
    setLoading("email");
    setError("");
    const res = await fetch("/api/reports/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId })
    });
    if (res.ok) { setSuccess("Email sent to owner!"); router.refresh(); }
    else { const d = await res.json(); setError(d.error ?? "Failed to send email"); }
    setLoading(null);
  }

  async function closeDay() {
    setLoading("close");
    setError("");
    const res = await fetch(`/api/sessions/${sessionId}/close`, { method: "POST" });
    if (res.ok) { router.push("/open"); router.refresh(); }
    else { const d = await res.json(); setError(d.error ?? "Failed to close day"); }
    setLoading(null);
  }

  return (
    <div className="no-print space-y-3">
      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-success">{success}</p>}

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="h-4 w-4" /> Print Report
        </Button>

        {!reportExists && (
          <Button variant="outline" onClick={generateReport} disabled={loading === "generate"}>
            {loading === "generate" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Generate Report
          </Button>
        )}

        {reportExists && (
          <Button variant="outline" onClick={sendEmail} disabled={loading === "email" || !!emailSentAt}>
            {loading === "email" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            {emailSentAt ? "Email Sent ✓" : "Email to Owner"}
          </Button>
        )}

        {!isClosed && (
          <Button
            variant="accent"
            onClick={closeDay}
            disabled={loading === "close" || !reportExists}
          >
            {loading === "close" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Close Day
          </Button>
        )}

        {isClosed && (
          <div className="flex items-center gap-2 text-success font-medium text-sm">
            <CheckCircle2 className="h-5 w-5" /> Day Closed
          </div>
        )}
      </div>

      {!reportExists && (
        <p className="text-xs text-muted-foreground">Generate the report first, then you can email it and close the day.</p>
      )}
    </div>
  );
}
