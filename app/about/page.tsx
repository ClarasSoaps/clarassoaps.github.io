import type { Metadata } from "next";
import { Squiggle } from "@/components/squiggle";

export const metadata: Metadata = {
  title: "About - Clara's Soap",
  description:
    "Meet Clara — the 16-year-old soap maker behind Clara's Soap — and learn why every bar is handcrafted with natural ingredients.",
};

const values = [
  {
    name: "Natural Ingredients",
    text: "Only the finest natural oils, butters, and essential oils",
  },
  {
    name: "Handcrafted",
    text: "Each bar is made by hand in small batches",
  },
  {
    name: "Made with Love",
    text: "Every soap is crafted with care and attention to detail",
  },
  {
    name: "Unique Scents",
    text: "Carefully blended fragrances for every season",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <header className="text-center">
        <h1 className="text-5xl italic">About Clara&apos;s Soap</h1>
        <Squiggle className="mt-4" />
      </header>

      <article className="mt-12 space-y-5 text-lg leading-relaxed">
        <h2 className="text-3xl">Meet Clara</h2>
        <p>
          Hi! I&apos;m Clara, a 16-year-old Catholic school student with a
          passion for creating beautiful, natural soaps. What started as a hobby
          has grown into a small business that helps me fund my education and
          personal expenses.
        </p>
        <p>
          Every bar of soap I create is handcrafted with care, using
          high-quality natural ingredients. I believe that self-care should be
          both luxurious and accessible, which is why I pour my heart into each
          batch, ensuring every soap is perfect.
        </p>
        <p>
          My journey began in our family kitchen, experimenting with different
          essential oils and natural ingredients. I was fascinated by how
          simple, pure ingredients could transform into something both beautiful
          and functional. Each scent tells a story, and I love creating soaps
          that bring joy to everyday routines.
        </p>

        <h3 className="pt-4 text-2xl">Why Handmade?</h3>
        <p>
          Commercial soaps often contain harsh chemicals and synthetic
          fragrances that can irritate sensitive skin. My soaps are made with
          natural oils, butters, and essential oils that nourish and protect
          your skin. Every ingredient is carefully selected for its benefits,
          creating a gentle, moisturizing bar that&apos;s suitable for all skin
          types.
        </p>

        <h3 className="pt-4 text-2xl">A Business with Purpose</h3>
        <p>
          Clara&apos;s Soap isn&apos;t just about making beautiful
          products&mdash;it&apos;s about independence, creativity, and
          entrepreneurship. Through this business, I&apos;m learning valuable
          skills while doing something I truly love. Every purchase supports my
          education and helps me pursue my dreams.
        </p>
        <p className="font-accent text-2xl text-fern dark:text-sage">
          Thank you for supporting a young entrepreneur and choosing
          handcrafted, natural skincare!
        </p>
      </article>

      <section className="mt-16">
        <h2 className="text-center text-3xl">What Makes My Soaps Special</h2>
        <Squiggle className="mb-8 mt-3" />
        <dl className="space-y-5">
          {values.map((v) => (
            <div key={v.name} className="text-center">
              <dt className="text-xl italic">{v.name}</dt>
              <dd className="text-muted-foreground">{v.text}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
