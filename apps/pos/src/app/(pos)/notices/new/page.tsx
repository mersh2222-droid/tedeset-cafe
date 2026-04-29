import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { todayDate } from "@/lib/utils";
import NewNoticeForm from "./new-notice-form";

export default async function NewNoticePage() {
  const user = await requireSession();
  const session = await db.daySession.findFirst({
    where: { date: todayDate(), status: "OPEN" }
  });
  if (!session) redirect("/open");

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">New Cash Notice</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Record any cash that enters or leaves outside the register. Two signatures required.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-white p-6 shadow-soft">
        <NewNoticeForm sessionId={session.id} signerName={user.name} />
      </div>
    </div>
  );
}
