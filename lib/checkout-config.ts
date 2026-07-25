/* ============================================================
   CHECKOUT SETUP — replace these placeholders to go live.
   ------------------------------------------------------------
   Each value can be supplied at build time via an environment
   variable (recommended) or by editing the fallback string here.

   Create a file named `.env.local` in the project root:

     NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
     NEXT_PUBLIC_VENMO_USERNAME=...
     NEXT_PUBLIC_ZELLE_CONTACT=...
     NEXT_PUBLIC_CLARA_EMAIL=...
     NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
     NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
     NEXT_PUBLIC_EMAILJS_CUSTOMER_TEMPLATE_ID=...
     NEXT_PUBLIC_EMAILJS_CLARA_TEMPLATE_ID=...

   Until they are set, PayPal shows a "not configured" notice and
   no order emails are sent — checkout still completes locally so
   the flow can be tested safely.
   ============================================================ */

export const PAYPAL_CLIENT_ID =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "YOUR_PAYPAL_CLIENT_ID";

export const VENMO_USERNAME =
  process.env.NEXT_PUBLIC_VENMO_USERNAME || "YOUR_VENMO_USERNAME";

export const ZELLE_CONTACT =
  process.env.NEXT_PUBLIC_ZELLE_CONTACT || "YOUR_EMAIL_OR_PHONE";

export const CLARA_EMAIL =
  process.env.NEXT_PUBLIC_CLARA_EMAIL || "YOUR_GMAIL_ADDRESS";

export const EMAILJS_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "YOUR_EMAILJS_PUBLIC_KEY";

export const EMAILJS_SERVICE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "YOUR_EMAILJS_SERVICE_ID";

export const EMAILJS_CUSTOMER_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_CUSTOMER_TEMPLATE_ID ||
  "YOUR_CUSTOMER_TEMPLATE_ID";

export const EMAILJS_CLARA_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_CLARA_TEMPLATE_ID || "YOUR_CLARA_TEMPLATE_ID";

export const isPayPalConfigured = () =>
  PAYPAL_CLIENT_ID !== "YOUR_PAYPAL_CLIENT_ID";

export const isEmailConfigured = () =>
  EMAILJS_SERVICE_ID !== "YOUR_EMAILJS_SERVICE_ID";

export const isVenmoConfigured = () =>
  VENMO_USERNAME !== "YOUR_VENMO_USERNAME";

export const isZelleConfigured = () =>
  ZELLE_CONTACT !== "YOUR_EMAIL_OR_PHONE";

/* ---- Pricing rules (unchanged from the original site) ---- */

export const GIFT_WRAP_COST = 3;
export const EXPRESS_COST = 12;

/** Standard shipping: $5 base plus $1 per bar. */
export const standardShippingCost = (itemCount: number) => 5 + itemCount;

export type ShippingMethod = "standard" | "express" | "pickup" | "church";

export const shippingCost = (method: ShippingMethod, itemCount: number) => {
  switch (method) {
    case "standard":
      return standardShippingCost(itemCount);
    case "express":
      return EXPRESS_COST;
    default:
      return 0;
  }
};

export const needsAddress = (method: ShippingMethod) =>
  method === "standard" || method === "express";

/** Order reference, e.g. CS-4KP2XQ. Ambiguous characters omitted. */
export function generateOrderId() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "";
  for (let i = 0; i < 6; i++) {
    id += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `CS-${id}`;
}
