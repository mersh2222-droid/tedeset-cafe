import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/sanity.queries";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about the Tedeset Cafe and Marketplace experience."
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <section className="section relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,236,217,0.7),transparent_70%)] blur-2xl" />
        <div className="absolute bottom-10 left-[-8%] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(214,226,255,0.55),transparent_70%)] blur-2xl" />
      </div>
      <div className="container relative space-y-12">
        <div className="section-divider">About</div>
        <SectionHeader
          title={
            <>
              About Tedeset Market <span className="font-sans">&</span> Cafe
            </>
          }
          description="An independently owned destination in Northeast Portland, blending coffee culture, curated goods, and hospitality with purpose."
        />
        <div className="space-y-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal className="group relative overflow-hidden rounded-[3rem] border border-border/70 bg-white/85 p-8 shadow-soft backdrop-blur">
            <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
              <div className="absolute inset-0 rounded-[3rem] bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.7),transparent_55%)]" />
            </div>
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.75),transparent_55%)]" />
              <div className="relative space-y-6">
                <div className="inline-flex items-center gap-3 rounded-full border border-border/70 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  About Tedeset Market & Cafe
                </div>
                <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl font-display">
                  A community-first destination built on craft, integrity, and care.
                </h2>
                <p className="text-sm text-muted-foreground md:text-base">
                  Founded by Kiros Abay and Merhawi Tafere, Tedeset was created to
                  bring people together from neighbors, coffee enthusiasts, and visitors
                  discovering Portland. We blend Ethiopian heritage with modern
                  hospitality and a curated marketplace experience.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-10">
                  <Button asChild size="lg">
                    <Link href="/menu">Explore Menu</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/marketplace">Browse Marketplace</Link>
                  </Button>
                </div>
              </div>
            </Reveal>
          <Reveal className="group rounded-[3rem] border border-border/70 bg-white/85 p-6 shadow-soft backdrop-blur transition hover:-translate-y-1 hover:shadow-lg">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Our Commitment to You
                </p>
                <h3 className="text-xl font-semibold text-foreground">
                  A consistent, welcoming experience — in person and online.
                </h3>
                <p className="text-sm text-muted-foreground">
                  We focus on authenticity, accessibility, and care. Whether you visit
                  us in person or connect online, we aim to make every interaction
                  feel personal and memorable.
                </p>
              </div>
              <div className="mt-6 grid gap-3 text-sm text-muted-foreground">
                {[
                  "You are seen, valued, and cared for",
                  "Clear information and curated products",
                  "Quality, consistency, and genuine hospitality",
                  "A space designed for connection and comfort"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-primary/60" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Service", value: "Attentive" },
                  { label: "Experience", value: "Memorable" },
                  { label: "Quality", value: "Consistent" },
                  { label: "Care", value: "Genuine" }
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-border/70 bg-white/70 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-2 text-base font-semibold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal className="group relative overflow-hidden rounded-[3rem] border border-border/70 bg-white/85 p-8 shadow-soft backdrop-blur">
            <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
              <div className="absolute inset-0 rounded-[3rem] bg-[radial-gradient(circle_at_10%_10%,rgba(255,255,255,0.7),transparent_55%)]" />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.85),transparent_55%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,247,239,0.9),transparent_50%)]" />
            <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Community · Craft · Culture
                </div>
                <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl font-display">
                  A destination where coffee, culture, and hospitality feel personal.
                </h2>
                <p className="text-sm text-muted-foreground md:text-base">
                  We are stewards of a space designed to bring people together, from
                  neighbors to first-time visitors. Every detail is built with care so
                  the experience feels warm, modern, and deeply rooted in heritage.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Founded", value: "Kiros & Merhawi" },
                  { label: "Location", value: "NE Portland" },
                  { label: "Coffee", value: "Ethiopian" },
                  { label: "Cuisine", value: "East African" }
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-border/70 bg-white/70 p-4 text-center shadow-sm"
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

          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal className="group rounded-[3rem] border border-border/70 bg-white/85 p-6 shadow-soft backdrop-blur transition hover:-translate-y-1 hover:shadow-lg">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Founder Note
              </p>
              <blockquote className="mt-3 rounded-[2rem] border border-border/70 bg-white/70 p-5 text-sm text-muted-foreground">
                "We built Tedeset to feel like home for anyone seeking warmth,
                community, and care. Every cup is an invitation to slow down and
                connect."
              </blockquote>
              <p className="mt-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Kiros Abay & Merhawi Tafere
              </p>
            </Reveal>
          <Reveal className="group rounded-[3rem] border border-border/70 bg-white/85 p-6 shadow-soft backdrop-blur transition hover:-translate-y-1 hover:shadow-lg">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Our Storyline
              </p>
              <div className="mt-4 grid gap-4">
                {[
                  { label: "Craft", detail: "Hand-built space with intentional design" },
                  { label: "Culture", detail: "Ethiopian ceremony and coffee heritage" },
                  { label: "Cuisine", detail: "Authentic East African flavors" },
                  { label: "Community", detail: "A welcoming hub for Portland" }
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary/60" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal className="group rounded-[3rem] border border-border/70 bg-white/85 p-8 shadow-soft backdrop-blur transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Our Vision</p>
                <h3 className="mt-2 text-2xl font-semibold text-foreground">
                  A recognized hub for community, coffee, and authentic East African flavors.
                </h3>
              </div>
              <div className="rounded-full border border-border/70 bg-white px-4 py-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Guided by integrity
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "A gathering place for neighbors and visitors",
                "Customer-first in every product and interaction",
                "Showcasing East African and Middle Eastern traditions",
                "Hospitality, consistency, and trust in every detail"
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-border/70 bg-white/70 p-4 text-sm text-muted-foreground">
                  {item}
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal className="group flex flex-wrap items-center justify-between gap-6 rounded-[2.5rem] border border-border/70 bg-white/80 px-6 py-5 text-sm text-muted-foreground shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Visit Us</p>
            <p className="mt-1 text-base font-semibold text-foreground">
              {settings?.address || "10240 NE Halsey St, Portland, OR 97220"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full border border-border/70 bg-white px-4 py-2">
              {settings?.hours ? `Hours: ${settings.hours}` : "Daily · 9am–9pm"}
            </span>
            <span className="rounded-full border border-border/70 bg-white px-4 py-2">
              Welcoming · Modern · Intentional
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

