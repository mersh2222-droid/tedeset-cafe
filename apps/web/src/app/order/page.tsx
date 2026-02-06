import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/sanity.queries";

export const metadata: Metadata = {
  title: "Order Online",
  description: "Order Tedeset Cafe favorites via DoorDash."
};

export default async function OrderPage() {
  const settings = await getSiteSettings();
  const phoneNumber = settings?.phone || "+1 (503) 460-6006";
  const phoneHref = `tel:${phoneNumber.replace(/\D/g, "")}`;

  return (
    <section className="section relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-[-12%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,236,217,0.7),transparent_70%)] blur-2xl" />
        <div className="absolute bottom-8 left-[-6%] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(214,226,255,0.55),transparent_70%)] blur-2xl" />
      </div>
      <div className="container relative space-y-10">
        <div className="section-divider">Order Online</div>
        <SectionHeader
          title="Order Online"
          description="Phone orders only. Call us and we’ll prepare your order for pickup."
        />
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal className="group relative overflow-hidden rounded-[3rem] border border-border/70 bg-white/85 p-8 shadow-soft backdrop-blur">
            <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
              <div className="absolute inset-0 rounded-[3rem] bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.75),transparent_55%)]" />
            </div>
            <div className="relative space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Phone Ordering
              </div>
              <h3 className="text-2xl font-semibold text-foreground font-display">
                Call to order, prepared with care.
              </h3>
              <p className="text-sm text-muted-foreground">
                Phone orders are the fastest way to get what you need. We’ll confirm your
                order and have it ready for pickup.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button asChild size="lg" variant="accent">
                  <Link href={phoneHref}>
                    Call to Order
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/menu">Explore Menu</Link>
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Pickup", value: "Available" },
                  { label: "Delivery", value: "Phone only" },
                  { label: "Timing", value: "Fast & Fresh" }
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-border/70 bg-white/70 p-4 text-center"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-2 text-base font-semibold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <div className="space-y-6">
            <Reveal className="rounded-[3rem] border border-border/70 bg-white/85 p-6 shadow-soft backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Pickup Details
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Phone orders only. We’ll confirm timing and have your order ready for pickup.
                Marketplace items remain inquiry-only. Need help? We’ll assist quickly.
              </p>
              <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
                {[
                  "Pickup only at our NE Halsey location",
                  "Marketplace items are inquiry-only",
                  "Friendly support for custom requests"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-primary/60" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button asChild variant="outline">
                  <Link href="/contact">Contact Us</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/faq">View FAQ</Link>
                </Button>
              </div>
            </Reveal>
            <Reveal className="rounded-[3rem] border border-border/70 bg-white/85 p-6 shadow-soft backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Helpful Notes
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Freshly made", detail: "Prepared to order" },
                  { label: "Large orders", detail: "Contact us in advance" },
                  { label: "Pickup", detail: "Curbside friendly" },
                  { label: "Special requests", detail: "We’ll do our best" }
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-border/70 bg-white/70 p-4">
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

