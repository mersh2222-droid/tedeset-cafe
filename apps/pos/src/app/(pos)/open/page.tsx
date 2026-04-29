import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { todayDate } from "@/lib/utils";
import OpenSessionForm from "./open-session-form";

export default async function OpenSessionPage() {
  const today = todayDate();
  const existing = await db.daySession.findFirst({ where: { date: today, status: "OPEN" } });
  if (existing) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Open Day</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Set the opening cash balance to begin today&apos;s session.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-white p-6 shadow-soft">
        <OpenSessionForm date={today} />
      </div>
    </div>
  );
}
