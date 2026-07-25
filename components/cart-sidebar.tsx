"use client";

import * as React from "react";
import Link from "next/link";
import { X, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart, normalizeImagePath } from "@/lib/cart-context";
import { CatCurled } from "@/components/cat-sketch";

export function CartSidebar() {
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
    <>
      <div
        aria-hidden
        onClick={closeCart}
        className={cn(
          "fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      <aside
        aria-label="Basket"
        className={cn(
          "fixed right-0 top-0 z-[70] flex h-full w-full max-w-sm flex-col bg-card shadow-2xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-2xl">Your Basket</h2>
          <button
            type="button"
            aria-label="Close basket"
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="mt-10 text-center">
              <CatCurled className="mx-auto h-auto w-40" />
              <p className="mt-4 text-muted-foreground">
                Your basket is empty
              </p>
              <p className="font-accent text-lg text-fern dark:text-sage">
                the cat is using it as a bed
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
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
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${item.name}`}
                        onClick={() => setQuantity(item.id, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${item.name}`}
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${item.name} from basket`}
                    onClick={() => removeItem(item.id)}
                    className="self-start rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-border p-4">
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
              "mt-4 block w-full rounded-full bg-primary px-6 py-3 text-center font-medium text-primary-foreground transition-all hover:opacity-90",
              items.length === 0 && "pointer-events-none opacity-50"
            )}
          >
            Checkout
          </Link>
        </div>
      </aside>
    </>
  );
}
