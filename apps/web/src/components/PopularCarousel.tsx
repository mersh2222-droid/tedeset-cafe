import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/Reveal";
import { formatPrice } from "@/lib/format";
import type { MenuItem } from "@/lib/sanity.types";

interface PopularCarouselProps {
  items: MenuItem[];
}

export function PopularCarousel({ items }: PopularCarouselProps) {
  return (
    <Reveal>
      <div className="relative rounded-[2.5rem] border border-border/70 bg-white/70 p-5 shadow-sm backdrop-blur">
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
          {items.map((item) => (
            <article
              key={item._id}
              className="min-w-[240px] flex-1 snap-start rounded-[2rem] border border-border/70 bg-white/85 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold">{item.name}</h3>
                {item.price ? (
                  <span className="text-xs font-medium text-muted-foreground">
                    {formatPrice(item.price)}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {item.description || "Small-batch favorite, crafted daily."}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.badges?.some((badge) => badge.toLowerCase() === "popular") ? null : (
                  <Badge className="bg-black text-white">Popular</Badge>
                )}
                {item.badges?.slice(0, 1).map((badge) => (
                  <Badge key={badge} variant="subtle">
                    {badge}
                  </Badge>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-4 w-16 bg-gradient-to-l from-white/80 to-transparent" />
      </div>
    </Reveal>
  );
}

