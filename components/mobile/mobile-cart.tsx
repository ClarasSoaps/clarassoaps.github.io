"use client";

import * as React from "react";
import Link from "next/link";
import { X, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart, normalizeImagePath } from "@/lib/cart-context";
import { CatCurled } from "@/components/cat-sketch";

/* Mobile bottom-sheet basket. Shares the same cart context / isOpen state as
   the desktop <CartSidebar/>; that one is hidden under `lg`, this one over it,
   so only one is ever visible. Slides up from the bottom, app-style. */

export function MobileCart() {
  const { items, totals, isOpen, closeCart, removeItem, setQuantity } =
    useCart();

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeCart();
    }
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  return (
    <div className="lg:hidden">
      <div
        aria-hidden
        onClick={closeCart}
        className={cn(
          "fixed inset-0 z-[85] bg-black/40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      <aside
        aria-label="Basket"
        className={cn(
          "fixed inset-x-0 bottom-0 z-[90] flex max-h-[85vh] flex-col rounded-t-[24px] bg-card shadow-2xl transition-transform duration-300",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="mx-auto mt-2 h-1.5 w-12 shrink-0 rounded-full bg-border" />
        <div className="flex shrink-0 items-center justify-between px-5 pb-3 pt-2">
          <h2 className="text-2xl">Your Basket</h2>
          <button
            type="button"
            aria-label="Close basket"
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-full active:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="py-10 text-center">
              <CatCurled className="mx-auto h-auto w-40" />
              <p className="mt-4 text-muted-foreground">Your basket is empty</p>
              <p className="font-accent text-lg text-fern dark:text-sage">
                the cat is using it as a bed
              </p>
            </div>
          ) : (
            <ul className="space-y-4 pb-2">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={normalizeImagePath(item.image)}
                    alt={item.name}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium leading-tight">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${item.name}`}
                        onClick={() => setQuantity(item.id, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-border active:bg-muted"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${item.name}`}
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-border active:bg-muted"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${item.name} from basket`}
                    onClick={() => removeItem(item.id)}
                    className="self-start rounded-full p-1 text-muted-foreground active:bg-muted"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="shrink-0 border-t border-border p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${totals.subtotal.toFixed(2)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-primary">
                <span>Bundle Discount:</span>
                <span>-${totals.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-semibold">
              <span>Total:</span>
              <span>${totals.total.toFixed(2)}</span>
            </div>
          </div>
          <Link
            href="/checkout/"
            onClick={closeCart}
            className={cn(
              "mt-4 block w-full rounded-full bg-primary px-6 py-3.5 text-center font-medium text-primary-foreground active:opacity-90",
              items.length === 0 && "pointer-events-none opacity-50"
            )}
          >
            Checkout
          </Link>
        </div>
      </aside>
    </div>
  );
}
