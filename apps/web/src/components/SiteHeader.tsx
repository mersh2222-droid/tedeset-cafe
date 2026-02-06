import Image from "next/image";
import Link from "next/link";
import { Menu, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Order Online", href: "/order" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" }
];

interface SiteHeaderProps {
  orderUrl?: string | null;
  phone?: string | null;
}

export function SiteHeader({ orderUrl, phone }: SiteHeaderProps) {
  const phoneHref = phone ? `tel:${phone.replace(/\D/g, "")}` : null;
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="flex items-center gap-3 text-lg font-semibold tracking-tight font-display"
        >
          <Image src="/logo.png" alt="Tedeset Cafe" width={160} height={46} className="h-10 w-auto" />
          <span>
            Tedeset Cafe <span className="font-sans">&amp;</span> Marketplace
          </span>
        </Link>
        <nav className="hidden items-center gap-6 rounded-full border border-border/60 bg-white/70 px-5 py-2 text-sm shadow-sm backdrop-blur md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative text-muted-foreground transition hover:text-foreground"
            >
              {item.label}
              <span className="pointer-events-none absolute -bottom-2 left-0 h-px w-0 bg-primary/70 transition-all group-hover:w-full" />
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="accent" className="hidden md:inline-flex">
            <Link href={phoneHref || orderUrl || "/order"}>Order Online</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={cn("md:hidden")}
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Tedeset
                  </p>
                  <p className="text-lg font-semibold">Cafe & Marketplace</p>
                </div>
                <nav className="grid gap-3 rounded-3xl border border-border/70 bg-white/80 p-4 text-sm shadow-sm backdrop-blur">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className="flex items-center justify-between text-muted-foreground transition hover:text-foreground"
                      >
                        <span>{item.label}</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <SheetClose asChild>
                  <Button asChild className="w-full">
                    <Link href={phoneHref || orderUrl || "/order"}>Order Online</Link>
                  </Button>
                </SheetClose>
                <div className="rounded-3xl border border-border/70 bg-white/70 p-4 text-xs text-muted-foreground">
                  10240 NE Halsey St, Portland, OR 97220
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

