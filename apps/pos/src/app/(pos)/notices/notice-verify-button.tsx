"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function NoticeVerifyButton({ noticeId }: { noticeId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleVerify() {
    setLoading(true);
    await fetch(`/api/notices/${noticeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verified: true })
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleVerify} disabled={loading}>
      <CheckCircle2 className="h-4 w-4" />
      {loading ? "Verifying…" : "Mark Verified"}
    </Button>
  );
}
