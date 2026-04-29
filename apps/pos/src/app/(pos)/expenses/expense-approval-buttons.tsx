"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ExpenseApprovalButtons({ expenseId }: { expenseId: number }) {
  const router = useRouter();
  const [rejecting, setRejecting] = useState(false);
  const [rejectionNote, setRejectionNote] = useState("");
  const [loading, setLoading] = useState(false);

  async function approve() {
    setLoading(true);
    await fetch(`/api/expenses/${expenseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "APPROVED" })
    });
    router.refresh();
    setLoading(false);
  }

  async function reject() {
    setLoading(true);
    await fetch(`/api/expenses/${expenseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "REJECTED", rejectionNote })
    });
    router.refresh();
    setLoading(false);
  }

  if (rejecting) {
    return (
      <div className="flex gap-2">
        <Input
          placeholder="Reason for rejection (optional)"
          value={rejectionNote}
          onChange={(e) => setRejectionNote(e.target.value)}
          className="flex-1"
        />
        <Button size="sm" variant="destructive" onClick={reject} disabled={loading}>
          Confirm Reject
        </Button>
        <Button size="sm" variant="outline" onClick={() => setRejecting(false)} disabled={loading}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="success" onClick={approve} disabled={loading}>
        Approve
      </Button>
      <Button size="sm" variant="outline" onClick={() => setRejecting(true)} disabled={loading}>
        Reject
      </Button>
    </div>
  );
}
