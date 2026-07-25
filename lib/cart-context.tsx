"use client";

import * as React from "react";
import { toast } from "sonner";
import { getProductById } from "./products";
import type { CartItem, CartTotals } from "./types";

// localStorage key and raw-array value shape are inherited from the previous
// site (cart.js) and must never change: returning visitors' carts depend on it.
const STORAGE_KEY = "clarasSoapCart";

type CartAction =
  | { type: "hydrate"; items: CartItem[] }
  | { type: "add"; item: CartItem; quantity: number }
  | { type: "remove"; id: string }
  | { type: "setQuantity"; id: string; quantity: number }
  | { type: "clear" };

interface CartState {
  items: CartItem[];
  hydrated: boolean;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { items: action.items, hydrated: true };
    case "add": {
      const existing = state.items.find((i) => i.id === action.item.id);
      const items = existing
        ? state.items.map((i) =>
            i.id === action.item.id
              ? { ...i, quantity: i.quantity + action.quantity }
              : i
          )
        : [...state.items, { ...action.item, quantity: action.quantity }];
      return { ...state, items };
    }
    case "remove":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case "setQuantity": {
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.id !== action.id) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, quantity: action.quantity } : i
        ),
      };
    }
    case "clear":
      return { ...state, items: [] };
  }
}

// Bundle discount ported verbatim from cart.js: every 4 bars saves $4 (4 for $20).
export function calculateTotals(items: CartItem[]): CartTotals {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const discount = Math.floor(itemCount / 4) * 4;
  return { subtotal, discount, total: subtotal - discount, itemCount };
}

// Old carts store relative paths ("images/x.jpg"); never rewrite stored data,
// just normalize when rendering.
export function normalizeImagePath(image: string): string {
  return image.startsWith("/") || image.startsWith("http")
    ? image
    : "/" + image;
}

interface CartContextValue {
  items: CartItem[];
  hydrated: boolean;
  totals: CartTotals;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = React.createContext<CartContextValue | null>(null);

function loadStoredCart(): CartItem[] {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(cartReducer, {
    items: [],
    hydrated: false,
  });
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    dispatch({ type: "hydrate", items: loadStoredCart() });
  }, []);

  React.useEffect(() => {
    if (!state.hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // Storage unavailable (private mode); cart still works in-memory.
    }
  }, [state.items, state.hydrated]);

  const addItem = React.useCallback((productId: string, quantity = 1) => {
    const product = getProductById(productId);
    if (!product) return;
    dispatch({
      type: "add",
      item: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 0,
      },
      quantity,
    });
    toast(`${product.name} added to your basket!`);
  }, []);

  const removeItem = React.useCallback(
    (id: string) => dispatch({ type: "remove", id }),
    []
  );
  const setQuantity = React.useCallback(
    (id: string, quantity: number) => dispatch({ type: "setQuantity", id, quantity }),
    []
  );
  const clearCart = React.useCallback(() => dispatch({ type: "clear" }), []);

  const value: CartContextValue = {
    items: state.items,
    hydrated: state.hydrated,
    totals: calculateTotals(state.items),
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    toggleCart: () => setIsOpen((v) => !v),
    addItem,
    removeItem,
    setQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
