"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Receipt,
  ClipboardList,
  History,
  LogOut,
  CoffeeIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  user: { name: string; role: "CASHIER" | "OWNER" };
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/notices", label: "Cash Notices", icon: FileText },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/end-of-day", label: "End of Day", icon: ClipboardList }
];

const ownerItems = [{ href: "/history", label: "History", icon: History }];

export default function POSSidebar({ user }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="hidden w-60 flex-col border-r border-border bg-white lg:flex">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <CoffeeIcon className="h-5 w-5 text-primary" />
        <span className="font-display text-lg font-bold text-primary">Tedeset POS</span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
              pathname === href || pathname.startsWith(href + "/")
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}

        {user.role === "OWNER" && (
          <>
            <div className="my-2 border-t border-border" />
            {ownerItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                  pathname.startsWith(href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </>
        )}
      </nav>

      <div className="border-t border-border p-3">
        <div className="mb-2 flex items-center gap-2 px-3 py-1">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <Badge variant={user.role === "OWNER" ? "default" : "muted"} className="mt-0.5 text-[10px]">
              {user.role}
            </Badge>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
