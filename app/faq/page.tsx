import type { Metadata } from "next";
import { FaqAccordion } from "@/components/ui/faq-chat-accordion";
import { Squiggle } from "@/components/squiggle";
import { faqData } from "@/lib/faq-data";

export const metadata: Metadata = {
  title: "FAQ - Clara's Soap",
  description:
    "Answers about ingredients, shipping, the 4-for-$20 bundle, payments, and caring for handmade soap.",
};

export default function FaqPage() {
  // Split into segments at footer deep-link anchors (#ingredients, #shipping,
  // #returns) so old links keep landing in the right place.
  const segments: { anchor?: string; items: typeof faqData }[] = [];
  for (const item of faqData) {
    if (item.anchor || segments.length === 0) {
      segments.push({ anchor: item.anchor, items: [item] });
    } else {
      segments[segments.length - 1].items.push(item);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <header className="text-center">
        <h1 className="text-5xl italic">Questions &amp; Answers</h1>
        <p className="mt-3 font-accent text-2xl text-fern dark:text-sage">
          asked often, answered honestly
        </p>
        <Squiggle className="mt-4" />
      </header>

      <div className="mt-10">
        {segments.map((segment, i) => (
          <div key={i}>
            {segment.anchor && (
              <span
                id={segment.anchor}
                aria-hidden
                className="block scroll-mt-28"
              />
            )}
            <FaqAccordion
              data={segment.items}
              timestamp={i === 0 ? "From Clara's kitchen, with love" : ""}
              className="p-0 pb-2"
              questionClassName="bg-dust/70 text-pine shadow-sm hover:bg-sage/60 rounded-2xl px-4 py-2.5"
              answerClassName="max-w-sm bg-fern text-white rounded-2xl shadow-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
