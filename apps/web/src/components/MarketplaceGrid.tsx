"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import type { Product } from "@/lib/sanity.types";
import { cn } from "@/lib/utils";

interface MarketplaceGridProps {
  products: Product[];
}

export function MarketplaceGrid({ products }: MarketplaceGridProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const categories = useMemo(() => {
    const unique = new Set(products.map((product) => product.category));
    return ["All", ...Array.from(unique)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const matchesSearch =
        !normalized ||
        product.name.toLowerCase().includes(normalized) ||
        product.category.toLowerCase().includes(normalized);
      return matchesCategory && matchesSearch;
    });

    const sorted = [...filtered].sort((a, b) => {
      const hasImageA = Boolean(a.images?.length);
      const hasImageB = Boolean(b.images?.length);
      if (hasImageA !== hasImageB) return hasImageA ? -1 : 1;
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      const orderA = a.sortOrder ?? 9999;
      const orderB = b.sortOrder ?? 9999;
      return orderA - orderB || a.name.localeCompare(b.name);
    });

    return sorted;
  }, [products, search, category]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const pagedProducts = filteredProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const goToPage = (nextPage: number) => {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages);
    setPage(safePage);
  };

  return (
    <div className="space-y-8">
      <Reveal>
        <div className="flex flex-col gap-4 rounded-[2.5rem] border border-border/70 bg-white/80 p-6 shadow-sm backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search marketplace"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((chip) => (
                <Button
                  key={chip}
                  variant="outline"
                  size="sm"
                onClick={() => {
                  setCategory(chip);
                  setPage(1);
                }}
                  className={cn(
                    "rounded-full",
                    chip === category && "border-primary bg-accent text-foreground"
                  )}
                >
                  {chip}
                </Button>
              ))}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Sorted by image, featured, custom order, then name.
          </div>
        </div>
      </Reveal>
      {products.length === 0 ? (
        <Reveal>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="h-80 rounded-[2.5rem] border border-border/70 bg-white/80 p-6 shadow-sm backdrop-blur"
              >
                <div className="h-40 rounded-2xl bg-muted animate-pulse" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-2/3 rounded-full bg-muted animate-pulse" />
                  <div className="h-3 w-1/2 rounded-full bg-muted animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      ) : filteredProducts.length ? (
        <div className="columns-1 gap-6 md:columns-2 lg:columns-3">
          {pagedProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              className="mb-6 break-inside-avoid"
            />
          ))}
        </div>
      ) : (
        <Reveal>
          <div className="rounded-3xl border border-dashed border-border bg-white p-8 text-center text-sm text-muted-foreground">
            No products match your filters yet.
          </div>
        </Reveal>
      )}
      {filteredProducts.length > pageSize ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1;
            const isActive = pageNumber === page;
            return (
              <Button
                key={`page-${pageNumber}`}
                variant={isActive ? "accent" : "outline"}
                size="sm"
                onClick={() => goToPage(pageNumber)}
              >
                {pageNumber}
              </Button>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  );
}

