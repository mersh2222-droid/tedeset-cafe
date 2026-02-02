import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/Reveal";
import { formatPrice } from "@/lib/format";
import { urlFor } from "@/lib/sanity.image";
import type { MenuItem } from "@/lib/sanity.types";
import { cn } from "@/lib/utils";

interface MenuItemCardProps {
  item: MenuItem;
  className?: string;
}

export function MenuItemCard({ item, className }: MenuItemCardProps) {
  const badges = item.badges || [];
  const highlightBadge = badges.find((badge) =>
    ["popular", "seasonal"].includes(badge.toLowerCase())
  );

  return (
    <Reveal>
      <article className={cn("card-glass flex flex-col gap-6 md:flex-row", className)}>
        <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-accent md:h-auto md:w-2/5">
          {item.image ? (
            <Image
              src={urlFor(item.image).width(600).height(400).url()}
              alt={item.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              Image coming soon
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              {item.description ? (
                <p className="text-sm text-muted-foreground">{item.description}</p>
              ) : null}
            </div>
            {item.price ? (
              <span className="rounded-full border border-border/70 bg-white px-3 py-1 text-xs font-semibold text-foreground">
                {formatPrice(item.price)}
              </span>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {highlightBadge ? (
              <Badge variant="premium">{highlightBadge}</Badge>
            ) : null}
            {badges
              .filter((badge) => badge !== highlightBadge)
              .map((badge) => (
                <Badge key={badge} variant="subtle">
                  {badge}
                </Badge>
              ))}
          </div>
          {item.available === false ? (
            <p className="text-xs text-muted-foreground">Currently unavailable</p>
          ) : null}
        </div>
      </article>
    </Reveal>
  );
}

