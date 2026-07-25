import Link from "next/link";
import Image from "next/image";
import { CatSitting } from "@/components/cat-sketch";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-3">
        <div>
          <Image
            src="/Claras_Soap_Logo.png"
            alt="Clara's Soap"
            width={180}
            height={60}
            className="brand-mark h-12 w-auto"
          />
          <p className="mt-3 text-sm text-muted-foreground">
            Handcrafted with love by a young entrepreneur
          </p>
          <div className="mt-4 flex items-end gap-2">
            <CatSitting className="h-20 w-auto" />
            <p className="mb-1 font-accent text-lg text-fern dark:text-sage">
              …and supervised by cats
            </p>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-lg">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shop/" className="text-muted-foreground transition-colors hover:text-primary">Shop</Link></li>
            <li><Link href="/about/" className="text-muted-foreground transition-colors hover:text-primary">About</Link></li>
            <li><Link href="/faq/" className="text-muted-foreground transition-colors hover:text-primary">FAQ</Link></li>
            <li><Link href="/contact/" className="text-muted-foreground transition-colors hover:text-primary">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-lg">Customer Care</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/faq/#shipping" className="text-muted-foreground transition-colors hover:text-primary">Shipping Info</Link></li>
            <li><Link href="/faq/#returns" className="text-muted-foreground transition-colors hover:text-primary">Returns</Link></li>
            <li><Link href="/faq/#ingredients" className="text-muted-foreground transition-colors hover:text-primary">Ingredients</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-4 text-center text-sm text-muted-foreground">
        &copy; 2025 Clara&apos;s Soap. All rights reserved.
      </div>
    </footer>
  );
}
