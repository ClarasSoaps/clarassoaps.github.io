import Image from "next/image";
import Link from "next/link";
import { Store } from "lucide-react";
import { getAllProducts } from "@/lib/products";
import { SoapStack } from "@/components/soap-stack";
import { Squiggle } from "@/components/squiggle";
import { NewsletterForm } from "@/components/newsletter-form";
import { PawPrints } from "@/components/cat-sketch";
import { MobileProductCard } from "@/components/mobile/mobile-product-card";

/* Mobile home. No scroll-hijack (SnapScroll bails under 1024px anyway); this is
   a straightforward app-style scroll: compact hero, horizontal product rails,
   newsletter. Rendered under `lg`; the desktop home markup is hidden under lg. */
export function MobileHome() {
  const all = getAllProducts();
  const featured = all.filter((p) => !p.seasonal).slice(0, 6);
  const seasonal = all.filter((p) => p.seasonal);

  return (
    <div className="lg:hidden">
      {/* Hero */}
      <section className="flex flex-col items-center px-6 pb-8 pt-6 text-center">
        <Image
          src="/Claras_Soap_Logo.png"
          alt="Clara's Soap"
          width={420}
          height={140}
          priority
          className="brand-mark h-auto w-[min(70vw,240px)]"
        />
        <p className="mt-1 font-accent text-xl text-fern dark:text-sage">
          Handcrafted with Love
        </p>

        <SoapStack className="mt-4 h-auto w-[min(46vw,160px)]" />

        <h1 className="mt-4 text-3xl italic leading-tight">
          Soaps for All Seasons
        </h1>
        <p className="mt-2 text-base text-fern dark:text-sage">
          Luxurious, natural, made with love
        </p>

        <Link
          href="/shop/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 font-semibold text-primary-foreground shadow-sm active:opacity-90"
        >
          <Store className="h-5 w-5" />
          Open Shop
        </Link>
      </section>

      {/* Featured rail */}
      <section className="pb-10 pt-2">
        <div className="flex items-baseline justify-between px-6">
          <h2 className="text-2xl">Featured</h2>
          <Link href="/shop/" className="text-sm font-semibold text-primary">
            See all
          </Link>
        </div>
        <Squiggle className="mx-6 mb-4 mt-2" />
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {featured.map((p) => (
            <MobileProductCard key={p.id} product={p} variant="rail" />
          ))}
        </div>
      </section>

      {/* Seasonal grid */}
      {seasonal.length > 0 && (
        <section className="px-6 pb-12">
          <h2 className="text-center text-2xl">Seasonal Favorites</h2>
          <p className="mt-1 text-center font-accent text-lg text-fern dark:text-sage">
            limited-time scents
          </p>
          <Squiggle className="mb-5 mt-2" />
          <div className="grid grid-cols-2 gap-4">
            {seasonal.map((p) => (
              <MobileProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="px-6 pb-16 text-center">
        <PawPrints className="mx-auto mb-5 h-7 w-28" />
        <h2 className="text-2xl">Stay Updated</h2>
        <p className="mb-6 mt-1 text-muted-foreground">
          Be first to know about new &amp; seasonal scents
        </p>
        <NewsletterForm />
      </section>
    </div>
  );
}
