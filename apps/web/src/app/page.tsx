import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/Hero";
import { PopularCarousel } from "@/components/PopularCarousel";
import { MenuItemCard } from "@/components/MenuItemCard";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeader } from "@/components/SectionHeader";
import { getHomePage, getMenuItems, getProducts, getSiteSettings } from "@/lib/sanity.queries";
import { urlFor } from "@/lib/sanity.image";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [home, settings] = await Promise.all([getHomePage(), getSiteSettings()]);

  const heroHeadline =
    home?.heroHeadline || "A premium cafe experience with a marketplace.";
  const heroSubheadline =
    home?.heroSubheadline ||
    "Freshly made coffee, traditional flavors, and specialty items under one roof.";

  const featuredMenuItems =
    home?.featuredMenuItems?.length
      ? home.featuredMenuItems
      : (await getMenuItems()).slice(0, 4);

  const featuredProducts =
    home?.featuredProducts?.length
      ? home.featuredProducts
      : (await getProducts()).slice(0, 6);

  const showFeaturedMenu = home?.showFeaturedMenu ?? true;
  const showFeaturedProducts = home?.showFeaturedProducts ?? true;

  return (
    <>
      <Hero
        headline={heroHeadline}
        subheadline={heroSubheadline}
        imageUrl={home?.heroImage ? urlFor(home.heroImage).width(1200).height(900).url() : undefined}
        orderUrl={settings?.doorDashUrl}
        address={settings?.address}
        socialLinks={settings?.socialLinks}
      />
      <section className="section">
        <div className="container">
          <div className="section-divider">Popular</div>
          <div className="section-frame">
            <SectionHeader
              title="Popular This Week"
              description="Small-batch favorites and seasonal highlights from our baristas."
            />
            <PopularCarousel items={featuredMenuItems} />
          </div>
        </div>
      </section>
      {showFeaturedMenu ? (
        <section className="section bg-white">
          <div className="container">
            <div className="section-divider">Cafe Menu</div>
            <SectionHeader
              title="Featured Menu"
              description="A few favorites from today’s espresso, iced, tea, and pastry selections."
            />
            <div className="section-frame">
              <div className="grid gap-6 md:grid-cols-2">
                {featuredMenuItems.map((item) => (
                  <MenuItemCard key={item._id} item={item} />
                ))}
              </div>
              <div className="mt-8 flex">
                <Button asChild variant="outline">
                  <Link href="/menu">View Full Menu</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      ) : null}
      {showFeaturedProducts ? (
        <section className="section">
          <div className="container">
            <div className="section-divider">Marketplace</div>
            <SectionHeader
              title="Marketplace Highlights"
              description="Curated goods and pantry essentials chosen to pair with your cafe routine."
            />
            <div className="section-frame">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <div className="mt-8 flex">
                <Button asChild variant="outline">
                  <Link href="/marketplace">Browse Marketplace</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

