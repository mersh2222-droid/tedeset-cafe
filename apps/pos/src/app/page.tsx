import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { todayDate } from "@/lib/utils";

export default async function RootPage() {
  const session = await getSession();
  if (!session.userId) redirect("/login");

  const today = todayDate();
  const daySession = await db.daySession.findFirst({
    where: { date: today, status: "OPEN" }
  });

  if (daySession) {
    redirect("/dashboard");
  } else {
    redirect("/open");
  }
}
