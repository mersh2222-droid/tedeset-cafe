import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { ProductCard } from "@/components/ProductCard";
import { getProductBySlug, getProducts, getSiteSettings } from "@/lib/sanity.queries";
import { getProductPriceLabel } from "@/lib/format";
import { urlFor } from "@/lib/sanity.image";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return {
      title: "Product Not Found"
    };
  }
  return {
    title: product.name,
    description: `${product.name} in our curated marketplace catalog.`
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) return notFound();

  const [allProducts, settings] = await Promise.all([
    getProducts(),
    getSiteSettings()
  ]);
  const related = allProducts
    .filter((item) => item._id !== product._id)
    .filter((item) => item.category === product.category)
    .slice(0, 3);

  const priceLabel = getProductPriceLabel(product);
  const images = product.images ?? [];

  return (
    <section className="section">
      <div className="container space-y-12">
        <div className="section-divider">Marketplace</div>
        <SectionHeader
          title={product.name}
          description="Inquiry-only marketplace item. Contact us to reserve or learn availability."
        />
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal className="space-y-4">
            <div className="relative h-[380px] overflow-hidden rounded-[2.5rem] border border-border/70 bg-accent">
              {images[0] ? (
                <Image
                  src={urlFor(images[0]).width(1200).height(900).url()}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Image coming soon
                </div>
              )}
            </div>
            {images.length > 1 ? (
              <div className="grid gap-4 sm:grid-cols-3">
                {images.slice(1, 4).map((image, index) => (
                  <div
                    key={`${product._id}-thumb-${index}`}
                    className="relative h-28 overflow-hidden rounded-2xl border border-border/70 bg-accent"
                  >
                    <Image
                      src={urlFor(image).width(500).height(400).url()}
                      alt={`${product.name} detail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </Reveal>
          <Reveal className="space-y-6 rounded-[2.5rem] border border-border/70 bg-white/85 p-6 shadow-sm backdrop-blur">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                {product.category}
              </p>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">{product.name}</h1>
                {product.featured ? <Badge variant="accent">Featured</Badge> : null}
              </div>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex flex-wrap items-center gap-2">
                {product.priceType === "fixed" ? (
                  <>
                    <Badge variant="subtle">In-store</Badge>
                    {priceLabel ? <Badge variant="subtle">{priceLabel}</Badge> : null}
                  </>
                ) : (
                  <Badge variant="subtle">Variable</Badge>
                )}
              </div>
              {product.priceType === "variable" && product.availabilityNote ? (
                <p>{product.availabilityNote}</p>
              ) : null}
            </div>
            <div className="rounded-2xl border border-border/70 bg-accent/40 p-4 text-sm text-muted-foreground">
              Marketplace items are inquiry-only. We will confirm availability and timing.
            </div>
            <div className="space-y-3 rounded-2xl border border-border/70 bg-white p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Inquiry options</p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/contact">Start Inquiry</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={settings?.phone ? `tel:${settings.phone}` : "/contact"}>
                    Call
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link
                    href={
                      settings?.email
                        ? `mailto:${settings.email}`
                        : "mailto:hello@tedesetcafe.com"
                    }
                  >
                    Email
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="ghost" size="sm">
                <Link href="/marketplace">Back to Marketplace</Link>
              </Button>
            </div>
          </Reveal>
        </div>
        <section className="section">
          <SectionHeader
            title="Related Items"
            description="More items from the same collection."
          />
          {related.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-white p-8 text-center text-sm text-muted-foreground">
              More curated items coming soon.
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

