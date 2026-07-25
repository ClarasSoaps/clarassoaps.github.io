"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { SoapSketch } from "@/components/soap-sketch";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

/* Compact card tuned for phones. Two variants:
   - "rail": fixed-width tile for horizontal scroll rows on the home page
   - "grid": full-width tile for the 2-up shop grid */
export function MobileProductCard({
  product,
  variant = "grid",
}: {
  product: Product;
  variant?: "rail" | "grid";
}) {
  const { addItem } = useCart();

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border border-border bg-card p-3",
        variant === "rail" && "w-40 shrink-0 snap-start"
      )}
    >
      <Link
        href={`/product/${product.id}/`}
        aria-label={product.name}
        className="block"
      >
        <div className="rounded-xl bg-background/60 p-2">
          <SoapSketch productId={product.id} className="mx-auto w-full" />
        </div>
      </Link>

      {product.seasonal && (
        <span className="mt-2 self-start rounded-full bg-sage/25 px-2 py-0.5 font-accent text-sm text-fern dark:text-sage">
          seasonal
        </span>
      )}

      <h3 className="mt-1.5 line-clamp-2 text-base italic leading-snug">
        <Link href={`/product/${product.id}/`}>{product.name}</Link>
      </h3>

      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="font-accent text-xl text-fern dark:text-sage">
          ${product.price.toFixed(0)}
        </span>
        <button
          type="button"
          onClick={() => addItem(product.id)}
          aria-label={`Add ${product.name} to basket`}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground active:opacity-90"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
