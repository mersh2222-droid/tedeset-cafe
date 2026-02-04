import type { Metadata } from "next";
import { MarketplaceGrid } from "@/components/MarketplaceGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { BrandStamp } from "@/components/BrandStamp";
import { getProducts } from "@/lib/sanity.queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Browse curated pantry goods and marketplace essentials."
};

export default async function MarketplacePage() {
  const products = await getProducts();
  const productsWithImages = products.filter((product) => product.images?.length);

  return (
    <section className="section">
      <div className="container space-y-8">
        <div className="section-divider">Marketplace</div>
        <SectionHeader
          title="Marketplace Catalog"
          description="Curated goods, pantry essentials, and local collaborations—browse only, no checkout."
        />
        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="card-glass">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Curated shelves
            </p>
            <p className="mt-3 text-2xl font-semibold font-display">
              Thoughtful goods from local makers and global traditions.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Every item is selected to complement your cafe ritual. Browse and inquire
              for availability.
            </p>
            <div className="mt-4">
              <BrandStamp label="Marketplace" />
            </div>
          </div>
          <div className="card-glass grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Total items
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {products.length}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Inquiry only
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">Yes</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Pickup
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Same-day available</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Delivery
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Local options</p>
            </div>
          </div>
        </div>
        <div className="section-frame">
          <MarketplaceGrid products={productsWithImages.length ? productsWithImages : products} />
        </div>
      </div>
    </section>
  );
}

