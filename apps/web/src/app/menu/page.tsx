import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { MenuGrid } from "@/components/MenuGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { BrandStamp } from "@/components/BrandStamp";
import { getMenuItems } from "@/lib/sanity.queries";

export const metadata: Metadata = {
  title: "Menu",
  description: "Explore espresso, iced drinks, tea, and pastries."
};

export default async function MenuPage() {
  const items = await getMenuItems();

  return (
    <section className="section">
      <div className="container space-y-8">
        <div className="section-divider">Cafe Menu</div>
        <div className="roast-banner">
          <div className="relative z-10 grid gap-8 p-6 lg:grid-cols-[1.15fr_0.85fr] md:p-10">
            <div className="space-y-6">
              <SectionHeader
                title="Cafe Menu"
                description="Crafted espresso, iced beverages, tea blends, and freshly baked pastries."
                descriptionClassName="text-white/95 drop-shadow-sm font-bold"
              />
              <div className="calligraphy-divider">
                <span className="!text-[#F8FAF5] font-display bg-black/90 px-4 py-1.5 rounded-full shadow-lg">
                  Menu Atelier
                </span>
              </div>
              <p className="text-sm text-white/95 drop-shadow-sm font-bold">
                Our menu is curated for slow mornings and intentional pauses, blending
                Ethiopian coffee heritage with modern cafe craft.
              </p>
            </div>
            <div className="card-glass flex flex-col justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-foreground/80">
                  Freshly Prepared
                </p>
                <p className="mt-2 text-sm text-foreground/80">
                  Crafted daily with care. Ask our baristas for pairing notes.
                </p>
              </div>
              <div className="flex items-center justify-between">
                <BrandStamp label="Menu" />
                <span className="text-xs uppercase tracking-[0.3em] text-foreground/70">
                  Daily · 9am–9pm
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Hot Rituals",
              text: "Classic shots, macchiatos, and layered espresso drinks.",
              category: "Hot"
            },
            {
              title: "Iced <span class=\"font-sans\">&</span> Cloudy",
              text: "Cold brews, iced lattes, and seasonal chilled creations.",
              category: "Iced"
            },
            {
              title: "Pastries",
              text: "Baked offerings refreshed daily.",
              category: "Pastries"
            }
          ].map((item) => (
            <Link
              key={item.title}
              href={`/menu?category=${item.category}`}
              className="card-glass block transition hover:-translate-y-1"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Highlight
              </p>
              <p className="mt-3 text-lg font-semibold font-display" dangerouslySetInnerHTML={{ __html: item.title }} />
              <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
            </Link>
          ))}
        </div>
        <div className="section-frame no-accent">
          <Suspense fallback={<div className="py-10 text-center text-sm text-muted-foreground">Loading menu…</div>}>
            <MenuGrid items={items} />
          </Suspense>
        </div>
        <div className="roast-banner">
          <div className="relative z-10 grid gap-6 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-10">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.35em] text-foreground/80">
                Roasted Daily
              </p>
              <h3 className="text-2xl font-semibold font-display text-foreground">
                Our specialty is our original Ethiopian coffee.
              </h3>
              <p className="text-sm text-white/95 drop-shadow-sm font-bold">
                Small-batch roasts, curated for depth and sweetness. Ask for tasting
                notes or a traditional ceremony pour.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

