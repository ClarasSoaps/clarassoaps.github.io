"use client";

import * as React from "react";
import { getAllProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { MobileProductCard } from "@/components/mobile/mobile-product-card";
import { Squiggle } from "@/components/squiggle";
import { cn } from "@/lib/utils";
import type { ScentFamily } from "@/lib/types";

type Category = "all" | "seasonal" | "bestseller";

const scentFamilies: ScentFamily[] = [
  "floral",
  "citrus",
  "woody",
  "fresh",
  "sweet",
  "minty",
];

export default function ShopPage() {
  const [category, setCategory] = React.useState<Category>("all");
  const [scents, setScents] = React.useState<ScentFamily[]>([]);

  const filtered = getAllProducts().filter((p) => {
    if (category === "seasonal" && !p.seasonal) return false;
    if (category === "bestseller" && !p.bestseller) return false;
    if (scents.length > 0 && !p.scentFamily.some((f) => scents.includes(f)))
      return false;
    return true;
  });

  function toggleScent(scent: ScentFamily) {
    setScents((prev) =>
      prev.includes(scent) ? prev.filter((s) => s !== scent) : [...prev, scent]
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <header className="text-center">
        <h1 className="text-5xl italic">Our Soaps</h1>
        <p className="mt-3 font-accent text-2xl text-fern dark:text-sage">
          $6 each · 4 for $20 — the discount applies itself
        </p>
        <Squiggle className="mt-4" />
      </header>

      <div className="mt-10 space-y-3 text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <span className="text-base font-semibold text-muted-foreground">Show:</span>
          {(
            [
              ["all", "Everything"],
              ["seasonal", "Seasonal"],
              ["bestseller", "Best Sellers"],
            ] as [Category, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              className={cn(
                "text-base underline-offset-4 transition-colors",
                category === value
                  ? "font-bold text-primary underline decoration-primary decoration-2"
                  : "text-foreground hover:text-primary"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <span className="text-base font-semibold text-muted-foreground">Scent:</span>
          {scentFamilies.map((scent) => (
            <button
              key={scent}
              type="button"
              onClick={() => toggleScent(scent)}
              aria-pressed={scents.includes(scent)}
              className={cn(
                "text-base capitalize underline-offset-4 transition-colors",
                scents.includes(scent)
                  ? "font-bold text-primary underline decoration-primary decoration-2"
                  : "text-foreground hover:text-primary"
              )}
            >
              {scent}
            </button>
          ))}
          {scents.length > 0 && (
            <button
              type="button"
              onClick={() => setScents([])}
              className="font-accent text-base text-fern hover:text-primary"
            >
              clear
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-20 text-center text-muted-foreground">
          No soaps match those filters — try widening your search.
        </p>
      ) : (
        <>
          {/* Mobile: 2-up compact grid */}
          <div className="mt-10 grid grid-cols-2 gap-4 lg:hidden">
            {filtered.map((p) => (
              <MobileProductCard key={p.id} product={p} />
            ))}
          </div>
          {/* Desktop grid */}
          <div className="mt-16 hidden gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid lg:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
