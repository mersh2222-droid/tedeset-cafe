import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/sanity.queries";
import { ExternalLink, Phone, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Order Online",
  description: "Order Tedeset Cafe for delivery or pickup via Uber Eats or call to order."
};

export default async function OrderPage() {
  const settings = await getSiteSettings();
  const orderUrl = "https://www.ubereats.com/store/tedeset-market-and-cafe-10240a-northeast-halsey-street/9vv36UqmWXShQl442xxvQw?diningMode=DELIVERY";
  const orderProvider = "Uber Eats";
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
          description={
            orderUrl
              ? `Get delivery or pickup through ${orderProvider}. Fresh coffee, pastries, and more—right to your door or ready at the cafe.`
              : "Call to order for pickup, or add your Uber Eats (or DoorDash) store link in Site Settings."
          }
        />

        {/* Primary CTA: Uber Eats / delivery link */}
        {orderUrl ? (
          <Reveal className="relative overflow-hidden rounded-[3rem] border border-border/70 bg-white/90 p-8 shadow-soft backdrop-blur md:p-10">
            <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100" aria-hidden />
            <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Delivery & Pickup
                </div>
                <h2 className="text-3xl font-semibold tracking-tight text-foreground font-display md:text-4xl">
                  Order on {orderProvider}
                </h2>
                <p className="text-sm text-muted-foreground max-w-lg">
                  Browse our full menu, place your order, and choose delivery or pickup. Track your order in the app and enjoy Tedeset at home or on the go.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    asChild
                    size="lg"
                    className={orderProvider === "Uber Eats" ? "bg-[#06C167] hover:bg-[#05a858] text-white border-0 shadow-md" : ""}
                  >
                    <Link href={orderUrl} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Order on {orderProvider}
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/menu">View Menu</Link>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Opens in the {orderProvider} app or browser. No account? Sign up in minutes.
                </p>
              </div>
              <div className="grid gap-3">
                {[
                  { label: "Delivery", value: "To your door" },
                  { label: "Pickup", value: "Ready at the cafe" },
                  { label: "Track", value: "Real-time status" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-border/70 bg-white/80 p-4 text-center"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-1 text-base font-semibold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Phone order card – primary when no Uber Eats, secondary when present */}
          <Reveal className="group relative overflow-hidden rounded-[3rem] border border-border/70 bg-white/85 p-8 shadow-soft backdrop-blur">
            <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
              <div className="absolute inset-0 rounded-[3rem] bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.75),transparent_55%)]" />
            </div>
            <div className="relative space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {orderUrl ? "Prefer to call?" : "Phone ordering"}
              </div>
              <h3 className="text-2xl font-semibold text-foreground font-display">
                {orderUrl ? "Call to order for pickup" : "Call to order, prepared with care"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {orderUrl
                  ? "We’ll confirm your order and have it ready for pickup at the cafe."
                  : "Phone orders are the fastest way to get what you need. We’ll confirm and have it ready for pickup."}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button asChild size="lg" variant="accent">
                  <Link href={phoneHref}>
                    <Phone className="mr-2 h-4 w-4" />
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
                  { label: "Delivery", value: orderUrl ? `Via ${orderProvider}` : "Phone only" },
                  { label: "Timing", value: "Fast & fresh" },
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
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Pickup details
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                {orderUrl
                  ? `Choose pickup at checkout on ${orderProvider}, or call to place a pickup order. We’ll confirm timing. Marketplace items remain inquiry-only.`
                  : "We’ll confirm timing and have your order ready for pickup. Marketplace items remain inquiry-only."}
              </p>
              <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
                {[
                  "Pickup at our NE Halsey location",
                  "Marketplace items are inquiry-only",
                  "Friendly support for custom requests",
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
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Helpful notes
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Freshly made", detail: "Prepared to order" },
                  { label: "Large orders", detail: "Contact us in advance" },
                  { label: "Pickup", detail: "Curbside friendly" },
                  { label: "Special requests", detail: "We’ll do our best" },
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
