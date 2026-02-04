import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { getProductPriceLabel } from "@/lib/format";
import { urlFor } from "@/lib/sanity.image";
import type { Product } from "@/lib/sanity.types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const image = product.images?.[0];
  const priceLabel = getProductPriceLabel(product);

  return (
    <Reveal>
      <article
        className={cn(
          "card-glass group flex w-full flex-col overflow-hidden",
          className
        )}
      >
        <Link href={`/marketplace/${product.slug.current}`} className="block">
          <div className="relative h-52 w-full overflow-hidden rounded-[2.5rem] bg-accent">
            {image ? (
              <Image
                src={urlFor(image).width(800).height(600).url()}
                alt={product.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Image coming soon
              </div>
            )}
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
          </div>
        </Link>
        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.category}</p>
            </div>
            {product.featured ? <Badge variant="premium">Featured</Badge> : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {product.priceType === "fixed" ? (
              <>
                <Badge variant="subtle">In-store</Badge>
                {priceLabel ? <Badge variant="subtle">{priceLabel}</Badge> : null}
              </>
            ) : (
              <Badge variant="subtle">Variable</Badge>
            )}
            {product.priceType === "variable" && product.availabilityNote ? (
              <p className="text-xs text-muted-foreground">
                {product.availabilityNote}
              </p>
            ) : null}
          </div>
          <div className="mt-auto flex items-center justify-between gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/contact">Inquiry</Link>
            </Button>
            <Link
              href={`/marketplace/${product.slug.current}`}
              className="text-xs text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
            >
              View details
            </Link>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

