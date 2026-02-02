"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuItemCard } from "@/components/MenuItemCard";
import { Reveal } from "@/components/Reveal";
import type { MenuItem, MenuItemCategory } from "@/lib/sanity.types";

interface MenuGridProps {
  items: MenuItem[];
}

const categories: MenuItemCategory[] = ["Hot", "Iced", "Pastries"];

export function MenuGrid({ items }: MenuGridProps) {
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const searchParams = useSearchParams();
  const paramCategory = searchParams.get("category");
  const initialCategory =
    categories.find((category) => category.toLowerCase() === paramCategory?.toLowerCase()) ||
    categories[0];
  const [activeCategory, setActiveCategory] = useState<MenuItemCategory>(initialCategory);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    const nextCategory =
      categories.find((category) => category.toLowerCase() === paramCategory?.toLowerCase()) ||
      categories[0];
    setActiveCategory(nextCategory);
    setPage(1);
  }, [paramCategory]);

  useEffect(() => {
    setPage(1);
  }, [activeCategory, showAvailableOnly]);

  const itemsByCategory = useMemo(() => {
    return categories.reduce<Record<MenuItemCategory, MenuItem[]>>((acc, category) => {
      acc[category] = items.filter((item) => item.category === category);
      return acc;
    }, { Hot: [], Iced: [], Pastries: [] });
  }, [items]);

  return (
    <div className="space-y-6">
      <Tabs
        value={activeCategory}
        onValueChange={(value) => {
          setActiveCategory(value as MenuItemCategory);
          setPage(1);
        }}
      >
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TabsList className="flex flex-wrap justify-start gap-2">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAvailableOnly((prev) => !prev)}
            >
              {showAvailableOnly ? "Showing Available" : "Show Available Only"}
            </Button>
          </div>
        </Reveal>
        {categories.map((category) => {
          const filtered = itemsByCategory[category].filter((item) =>
            showAvailableOnly ? item.available !== false : true
          );
          const sorted = [...filtered].sort((a, b) => {
            const hasImageA = Boolean(a.image);
            const hasImageB = Boolean(b.image);
            if (hasImageA !== hasImageB) return hasImageA ? -1 : 1;
            const orderA = a.sortOrder ?? 9999;
            const orderB = b.sortOrder ?? 9999;
            return orderA - orderB || a.name.localeCompare(b.name);
          });

          const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
          const pageForCategory = activeCategory === category ? page : 1;
          const pagedItems = sorted.slice(
            (pageForCategory - 1) * pageSize,
            pageForCategory * pageSize
          );

          return (
            <TabsContent key={category} value={category}>
              {sorted.length ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {pagedItems.map((item) => (
                    <MenuItemCard key={item._id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="rounded-[2.5rem] border border-dashed border-border bg-white p-8 text-center text-sm text-muted-foreground">
                  No menu items in this category yet.
                </div>
              )}
              {activeCategory === category && sorted.length > pageSize ? (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;
                    const isActive = pageNumber === page;
                    return (
                      <Button
                        key={`menu-page-${pageNumber}`}
                        variant={isActive ? "accent" : "outline"}
                        size="sm"
                        onClick={() => setPage(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              ) : null}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

