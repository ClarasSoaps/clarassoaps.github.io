"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Store, ShoppingBasket, Menu, X, Info, HelpCircle, Mail, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

/* Mobile-only navigation. Rendered under `lg`; the desktop <Navbar/> is hidden
   under `lg` in layout.tsx. Chrome pattern is app-like: a slim sticky top bar
   (logo + basket) and a fixed bottom tab bar with a "More" slide-up sheet. */

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop/", label: "Shop", icon: Store },
];

const moreLinks = [
  { href: "/about/", label: "About", icon: Info },
  { href: "/faq/", label: "FAQ", icon: HelpCircle },
  { href: "/contact/", label: "Contact", icon: Mail },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href.replace(/\/$/, ""));
}

export function MobileNav() {
  const pathname = usePathname();
  const { totals, hydrated, toggleCart } = useCart();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [moreOpen, setMoreOpen] = React.useState(false);

  React.useEffect(() => setMounted(true), []);
  React.useEffect(() => setMoreOpen(false), [pathname]);

  const moreActive = moreLinks.some((l) => isActive(pathname, l.href));

  return (
    <div className="lg:hidden">
      {/* ---- Slim sticky top bar ---- */}
      <header className="fixed inset-x-0 top-0 z-50 bg-card/95 shadow-sm backdrop-blur-sm">
        <div className="bg-[#344e41] px-4 py-1.5 text-center text-xs text-white">
          <strong className="font-bold">4 bars for $20</strong>
          <span className="opacity-90"> — auto-applied</span>
        </div>
        <nav className="flex items-center justify-between px-4 py-2.5">
          <Link href="/" aria-label="Clara's Soap home">
            <Image
              src="/Claras_Soap_Logo.png"
              alt="Clara's Soap"
              width={150}
              height={50}
              className="brand-mark h-9 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Toggle dark mode"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground active:bg-muted"
            >
              {mounted && resolvedTheme === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* ---- "More" slide-up sheet ---- */}
      <div
        aria-hidden
        onClick={() => setMoreOpen(false)}
        className={cn(
          "fixed inset-0 z-[75] bg-black/40 transition-opacity duration-300",
          moreOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      <div
        role="dialog"
        aria-label="More menu"
        className={cn(
          "fixed inset-x-0 bottom-0 z-[80] rounded-t-3xl bg-card pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-2 shadow-2xl transition-transform duration-300",
          moreOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-border" />
        <div className="flex items-center justify-between px-5 pb-1">
          <h2 className="text-2xl">Menu</h2>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMoreOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full active:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <ul className="px-3 pb-2">
          {moreLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-4 rounded-2xl px-4 py-3.5 text-lg transition-colors active:bg-muted",
                    active ? "font-semibold text-primary" : "text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ---- Fixed bottom tab bar ---- */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-[70] border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm"
      >
        <ul className="grid grid-cols-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(pathname, tab.href);
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  className={cn(
                    "flex flex-col items-center gap-0.5 py-2.5 text-[0.68rem] transition-colors",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <Icon
                    className={cn("h-6 w-6", active && "fill-primary/10")}
                    strokeWidth={active ? 2.4 : 2}
                  />
                  {tab.label}
                </Link>
              </li>
            );
          })}

          {/* Basket tab */}
          <li>
            <button
              type="button"
              onClick={toggleCart}
              className="flex w-full flex-col items-center gap-0.5 py-2.5 text-[0.68rem] text-muted-foreground"
            >
              <span className="relative">
                <ShoppingBasket className="h-6 w-6" />
                {hydrated && totals.itemCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.6rem] font-semibold text-primary-foreground">
                    {totals.itemCount}
                  </span>
                )}
              </span>
              Basket
            </button>
          </li>

          {/* More tab */}
          <li>
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              className={cn(
                "flex w-full flex-col items-center gap-0.5 py-2.5 text-[0.68rem] transition-colors",
                moreActive || moreOpen ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Menu className="h-6 w-6" />
              More
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
