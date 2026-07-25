"use client";

import * as React from "react";
import { Minus, Plus, ShoppingBasket } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export function AddToCart({ productId }: { productId: string }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = React.useState(1);

  return (
    <div className="flex flex-wrap items-center gap-5">
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Quantity</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-fern/40 text-fern transition-colors hover:bg-fern hover:text-white dark:text-sage"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-lg">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-fern/40 text-fern transition-colors hover:bg-fern hover:text-white dark:text-sage"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => addItem(productId, quantity)}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:opacity-90"
      >
        <ShoppingBasket className="h-5 w-5" />
        Add to Basket
      </button>
    </div>
  );
}
