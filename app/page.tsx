import Image from "next/image";
import { getAllProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { Store } from "lucide-react";
import { SoapStack } from "@/components/soap-stack";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { SnapScroll } from "@/components/snap-scroll";
import { PawPrints } from "@/components/cat-sketch";
import { NewsletterForm } from "@/components/newsletter-form";
import { Reveal } from "@/components/reveal";
import { ScrollIndicator } from "@/components/scroll-indicator";
import { Squiggle } from "@/components/squiggle";

export default function Home() {
  const all = getAllProducts();
  const featured = all.filter((p) => !p.seasonal).slice(0, 4);
  const seasonal = all.filter((p) => p.seasonal);

  return (
    <>
      <SnapScroll />

      {/* Hero */}
      <section className="snap-section flex min-h-[calc(100vh-7rem)] flex-col items-center px-6 pb-10 pt-20 text-center">
        <Image
          src="/Claras_Soap_Logo.png"
          alt="Clara's Soap"
          width={520}
          height={173}
          priority
          className="brand-mark h-auto w-[min(60vw,260px)]"
        />
        <p className="mt-2 font-accent text-2xl text-fern sm:text-3xl dark:text-sage">
          Handcrafted with Love
        </p>

        {/* Placeholder sketch until real product photography is added */}
        <SoapStack className="mt-6 h-auto w-[min(48vw,190px)]" />

        <h1 className="mt-6 max-w-[20ch] text-4xl italic sm:text-5xl">
          Handcrafted Soaps for All Seasons
        </h1>
        <p className="mt-3 text-lg text-fern dark:text-sage">
          Luxurious, natural soaps made with love
        </p>
        <InteractiveHoverButton
          href="/shop/"
          text="Open Shop"
          icon={<Store className="h-5 w-5" />}
          className="mt-8"
        />

        <ScrollIndicator
          targetId="featured"
          hideWhenVisibleId="featured-heading"
        />
      </section>

      {/* Featured */}
      <Reveal className="snap-section">
        <section id="featured" className="mx-auto max-w-5xl scroll-mt-28 px-6 pb-20 pt-12">
          <h2 id="featured-heading" className="text-center text-4xl">
            Featured Soaps
          </h2>
          <Squiggle className="mb-14 mt-3" />
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </Reveal>

      {/* Seasonal */}
      <Reveal className="snap-section">
        <section className="mx-auto max-w-4xl px-6 py-20">
          <h2 className="text-center text-4xl">Seasonal Favorites</h2>
          <p className="mt-2 text-center font-accent text-xl text-fern dark:text-sage">
            limited-time scents crafted for the season
          </p>
          <Squiggle className="mb-14 mt-3" />
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-3">
            {seasonal.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </Reveal>

      {/* Newsletter */}
      <Reveal className="snap-section">
        <section className="mx-auto max-w-3xl px-6 py-20 text-center">
          <PawPrints className="mx-auto mb-8 h-8 w-32" />
          <h2 className="text-4xl">Stay Updated</h2>
          <p className="mb-8 mt-2 text-muted-foreground">
            Be the first to know about new scents and seasonal releases
          </p>
          <NewsletterForm />
        </section>
      </Reveal>
    </>
  );
}
