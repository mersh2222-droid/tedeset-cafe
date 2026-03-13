import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Tedeset Cash Control",
  description: "Daily cash control dashboard for Tedeset Market & Cafe",
  robots: "noindex, nofollow",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
