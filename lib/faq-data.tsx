import type * as React from "react";

export interface FaqEntry {
  id: number;
  question: string;
  answer: React.ReactNode;
  icon?: string;
  iconPosition?: "left" | "right";
  /** Footer deep-link target rendered before this item (#ingredients etc.) */
  anchor?: string;
}

const ul = "mt-2 list-disc space-y-1 pl-5";

export const faqData: FaqEntry[] = [
  {
    id: 1,
    anchor: "ingredients",
    icon: "🌿",
    iconPosition: "left",
    question: "What ingredients are in your soaps?",
    answer: (
      <>
        <p>
          All Clara&apos;s Soap bars are made with high-quality natural
          ingredients including:
        </p>
        <ul className={ul}>
          <li>Olive oil, coconut oil, and shea butter for moisturizing</li>
          <li>Pure essential oils for natural fragrance</li>
          <li>Natural colorants derived from plants and minerals</li>
          <li>
            Botanicals like strawflower petals, oats, and other natural
            exfoliants
          </li>
        </ul>
        <p className="mt-2">
          I never use synthetic fragrances, parabens, sulfates, or harsh
          chemicals.
        </p>
      </>
    ),
  },
  {
    id: 2,
    question: "Are your soaps safe for sensitive skin?",
    answer: (
      <>
        <p>
          Yes! My soaps are made with gentle, natural ingredients that are
          suitable for most skin types, including sensitive skin. However, if
          you have specific allergies or skin conditions, I recommend checking
          the ingredient list for each soap or consulting with your
          dermatologist.
        </p>
        <p className="mt-2">
          All ingredients are clearly listed on our product pages.
        </p>
      </>
    ),
  },
  {
    id: 3,
    anchor: "shipping",
    icon: "📦",
    iconPosition: "right",
    question: "What are your shipping options?",
    answer: (
      <>
        <p>I offer several shipping options:</p>
        <ul className={ul}>
          <li>
            <strong>Standard Shipping:</strong> Flat-rate base fee plus a small
            increase per soap. Typically arrives in 5-7 business days.
          </li>
          <li>
            <strong>Express Shipping:</strong> Available for faster delivery
            (2-3 business days) at an additional cost.
          </li>
          <li>
            <strong>Local Pickup:</strong> Free! Pick up your order at my farm
            (often available when purchasing flowers as well).
          </li>
          <li>
            <strong>Church Delivery:</strong> Free delivery available for church
            members.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 4,
    question: "How does the bundle discount work?",
    answer: (
      <p>
        My soaps are $6 each, or you can get 4 for $20 (saving $4!). The
        discount is applied automatically when you add 4 or more soaps to your
        cart. You can mix and match any scents you like.
      </p>
    ),
  },
  {
    id: 5,
    question: "What payment methods do you accept?",
    answer: (
      <>
        <p>I accept:</p>
        <ul className={ul}>
          <li>
            Credit and debit cards (Visa, Mastercard, American Express,
            Discover)
          </li>
          <li>PayPal</li>
          <li>Venmo</li>
          <li>Other common payment methods through my secure checkout</li>
        </ul>
      </>
    ),
  },
  {
    id: 6,
    icon: "🎁",
    iconPosition: "left",
    question: "Can I add gift wrapping to my order?",
    answer: (
      <p>
        Yes! I offer gift wrapping for a small additional fee. You can select
        this option during checkout.
      </p>
    ),
  },
  {
    id: 7,
    question: "What are seasonal soaps?",
    answer: (
      <>
        <p>
          Seasonal soaps are special scents available only during certain times
          of the year. These include:
        </p>
        <ul className={ul}>
          <li>
            <strong>Peppermint:</strong> Winter/Holiday season
          </li>
          <li>
            <strong>Sugar Cookie:</strong> Holiday season
          </li>
          <li>
            <strong>Christmas Wreath:</strong> Holiday season
          </li>
        </ul>
        <p className="mt-2">
          When seasonal soaps are out of season, they&apos;ll show as &quot;out
          of stock&quot; on my website. Sign up for notifications to be alerted
          when they return!
        </p>
      </>
    ),
  },
  {
    id: 8,
    question: "How do I stay updated on new releases?",
    answer: (
      <p>
        Sign up for my notification list on the home page! You&apos;ll be the
        first to know about new scents, seasonal releases, and special offers.
      </p>
    ),
  },
  {
    id: 9,
    question: "How should I store my soap?",
    answer: (
      <>
        <p>To make your soap last longer:</p>
        <ul className={ul}>
          <li>Keep it in a well-drained soap dish between uses</li>
          <li>Store unused bars in a cool, dry place</li>
          <li>Avoid leaving it in standing water</li>
          <li>Let it dry completely between uses</li>
        </ul>
      </>
    ),
  },
  {
    id: 10,
    anchor: "returns",
    question: "What is your return policy?",
    answer: (
      <>
        <p>
          I want you to love your Clara&apos;s Soap! If you&apos;re not
          completely satisfied with your purchase, please contact me within 14
          days of receiving your order. I&apos;ll work with you to find a
          solution.
        </p>
        <p className="mt-2">
          Due to the nature of handmade soap, I cannot accept returns on used
          products, but I&apos;m happy to address any quality concerns.
        </p>
      </>
    ),
  },
  {
    id: 11,
    question: "How long does a bar of soap last?",
    answer: (
      <p>
        With proper care and storage, one bar typically lasts 3-4 weeks with
        daily use. Handmade soaps last longer than commercial soaps because they
        retain their natural glycerin and moisturizing oils.
      </p>
    ),
  },
  {
    id: 12,
    icon: "⭐",
    iconPosition: "left",
    question: "Do you offer wholesale or bulk orders?",
    answer: (
      <p>
        Yes! If you&apos;re interested in wholesale pricing or bulk orders for
        events, gifts, or retail, please{" "}
        <a href="/contact/" className="underline underline-offset-2">
          contact us
        </a>{" "}
        directly and we&apos;ll create a custom quote for you.
      </p>
    ),
  },
];
