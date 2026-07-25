"use client";

import Link from "next/link";
import { ShoppingBasket } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { SoapSketch } from "@/components/soap-sketch";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="group text-center">
      <Link
        href={`/product/${product.id}/`}
        aria-label={product.name}
        className="block transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-1 group-hover:scale-[1.03]"
      >
        <SoapSketch productId={product.id} className="mx-auto w-full max-w-56" />
      </Link>

      {product.seasonal && (
        <p className="font-accent text-lg text-fern">seasonal</p>
      )}

      <h3 className="mt-1 text-xl italic leading-snug">
        <Link
          href={`/product/${product.id}/`}
          className="transition-colors hover:text-primary"
        >
          {product.name}
        </Link>
      </h3>

      <p className="font-accent text-2xl text-fern dark:text-sage">
        — ${product.price.toFixed(0)} —
      </p>

      <button
        type="button"
        onClick={() => addItem(product.id)}
        title={`Add ${product.name} to basket`}
        aria-label={`Add ${product.name} to basket`}
        className="mt-2 inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-fern/30 text-fern transition-all hover:-translate-y-0.5 hover:border-fern hover:bg-fern hover:text-white dark:text-sage"
      >
        <ShoppingBasket className="h-5 w-5" />
      </button>
    </div>
  );
}
