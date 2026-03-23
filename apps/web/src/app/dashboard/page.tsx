import type { Metadata } from "next";
import { DashboardClient } from "./DashboardClient";

export const metadata: Metadata = {
  title: "Cash Handling Dashboard",
  description: "Daily cash and card transaction control dashboard",
};

export default function DashboardPage() {
  return (
    <section className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display">Cash Handling Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Track and control daily cash &amp; card transactions
        </p>
      </div>
      <DashboardClient />
    </section>
  );
}
