import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllProducts, getProductById } from "@/lib/products";
import { SoapSketch } from "@/components/soap-sketch";
import { AddToCart } from "@/components/add-to-cart";
import { Squiggle } from "@/components/squiggle";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return {};
  return {
    title: `${product.name} - Clara's Soap`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <SoapSketch productId={product.id} className="mx-auto w-full max-w-md" />

        <div>
          {product.seasonal && (
            <p className="font-accent text-xl text-fern">seasonal</p>
          )}
          <h1 className="text-4xl italic leading-tight sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-3 font-accent text-3xl text-fern dark:text-sage">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            Buy 4 for $20 (save $4!)
          </p>

          <p className="mt-6 max-w-prose text-lg leading-relaxed">
            {product.description}
          </p>

          <div className="mt-8">
            <AddToCart productId={product.id} />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-2xl space-y-12">
        <section>
          <h3 className="text-center text-2xl">Ingredients</h3>
          <Squiggle className="mb-4 mt-2" />
          <p className="text-center leading-relaxed text-muted-foreground">
            {product.ingredients}
          </p>
        </section>

        <section>
          <h3 className="text-center text-2xl">Why You&apos;ll Love It</h3>
          <Squiggle className="mb-4 mt-2" />
          <ul className="mx-auto max-w-md space-y-2 text-center">
            {product.benefits.map((benefit) => (
              <li key={benefit} className="leading-relaxed">
                {benefit}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
