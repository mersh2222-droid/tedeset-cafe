"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, Receipt, ClipboardList,
  History, LogOut, CoffeeIcon, Menu, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

function NavLinks({ user, pathname, onNav }: { user: Props["user"]; pathname: string; onNav?: () => void }) {
  return (
    <nav className="flex-1 space-y-1 p-3">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onNav}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
            pathname === href || pathname.startsWith(href + "/")
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Icon className="h-4 w-4 shrink-0" />
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
              onClick={onNav}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                pathname.startsWith(href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </>
      )}
    </nav>
  );
}

export default function POSSidebar({ user }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const userFooter = (
    <div className="border-t border-border p-3">
      <div className="mb-2 flex items-center gap-2 px-3 py-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <Badge variant={user.role === "OWNER" ? "default" : "muted"} className="text-[10px]">
            {user.role}
          </Badge>
        </div>
      </div>
      <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground" onClick={handleLogout}>
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-white lg:flex">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <CoffeeIcon className="h-5 w-5 text-primary" />
          <span className="font-display text-lg font-bold text-primary">Tedeset POS</span>
        </div>
        <NavLinks user={user} pathname={pathname} />
        {userFooter}
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-white px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <CoffeeIcon className="h-5 w-5 text-primary" />
          <span className="font-display text-base font-bold text-primary">Tedeset POS</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <CoffeeIcon className="h-5 w-5 text-primary" />
                <span className="font-display text-lg font-bold text-primary">Tedeset POS</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1 text-muted-foreground hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavLinks user={user} pathname={pathname} onNav={() => setMobileOpen(false)} />
            {userFooter}
          </aside>
        </div>
      )}
    </>
  );
}
