"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBasket } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { AnnouncementBar } from "@/components/announcement-bar";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop/", label: "Shop" },
  { href: "/about/", label: "About" },
  { href: "/faq/", label: "FAQ" },
  { href: "/contact/", label: "Contact" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href.replace(/\/$/, ""));
}

export function Navbar() {
  const pathname = usePathname();
  const { totals, hydrated, toggleCart } = useCart();

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-card/95 shadow-sm backdrop-blur-sm transition-colors">
      <AnnouncementBar />
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-8">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Image
            src="/Claras_Soap_Logo.png"
            alt="Clara's Soap"
            width={180}
            height={60}
            className="brand-mark h-12 w-auto sm:h-14"
            priority
          />
        </Link>

        <ul className="flex items-center gap-3 sm:gap-8">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "relative pb-1 text-sm text-foreground transition-colors hover:text-primary sm:text-base",
                  "after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-primary after:transition-all after:duration-300",
                  isActive(pathname, link.href) &&
                    "text-primary after:w-full"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Basket"
            onClick={toggleCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
          >
            <ShoppingBasket className="h-5 w-5" />
            {hydrated && totals.itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground">
                {totals.itemCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
