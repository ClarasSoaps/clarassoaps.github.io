"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { CatSitting } from "@/components/cat-sketch";
import { Squiggle } from "@/components/squiggle";
import { sendOrderEmails } from "@/lib/send-order-emails";
import {
  GIFT_WRAP_COST,
  PAYPAL_CLIENT_ID,
  VENMO_USERNAME,
  ZELLE_CONTACT,
  generateOrderId,
  isPayPalConfigured,
  isVenmoConfigured,
  isZelleConfigured,
  needsAddress,
  shippingCost,
  standardShippingCost,
  type ShippingMethod,
} from "@/lib/checkout-config";

const inputClass =
  "w-full rounded-lg border border-border bg-card px-4 py-2.5 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30";

const SHIPPING_OPTIONS: {
  value: ShippingMethod;
  name: string;
  description: string;
}[] = [
  {
    value: "standard",
    name: "Standard Shipping",
    description: "5–7 business days via USPS",
  },
  {
    value: "express",
    name: "Express Shipping",
    description: "2–3 business days via USPS Priority",
  },
  {
    value: "pickup",
    name: "Farm Pickup",
    description:
      "Free — I'll email you when your order is ready, along with where to come",
  },
  {
    value: "church",
    name: "Church Delivery",
    description: "Free for church members — I'll be in touch to arrange it",
  },
];

const emptyCustomer = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totals, hydrated, clearCart } = useCart();

  const [step, setStep] = React.useState(1);
  const [customer, setCustomer] = React.useState(emptyCustomer);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [shipping, setShipping] = React.useState<ShippingMethod>("standard");
  const [giftWrap, setGiftWrap] = React.useState(false);
  const [payTab, setPayTab] = React.useState<"paypal" | "venmo" | "zelle">(
    "paypal"
  );
  const [orderId, setOrderId] = React.useState("");
  // Captured at the moment the order is placed — the live basket is emptied
  // straight after, so the confirmation must not read from it.
  const [placed, setPlaced] = React.useState<null | {
    firstName: string;
    method: string;
    transactionId: string;
    total: number;
  }>(null);

  // Order reference is created client-side only, after mount.
  React.useEffect(() => setOrderId(generateOrderId()), []);

  // An empty basket has nothing to check out.
  React.useEffect(() => {
    if (hydrated && items.length === 0 && !placed) router.replace("/shop/");
  }, [hydrated, items.length, placed, router]);

  const ship = shippingCost(shipping, totals.itemCount);
  const wrap = giftWrap ? GIFT_WRAP_COST : 0;
  const orderTotal = totals.total + ship + wrap;
  const shippingLabel =
    SHIPPING_OPTIONS.find((o) => o.value === shipping)?.name ?? "";

  function set<K extends keyof typeof customer>(key: K, value: string) {
    setCustomer((c) => ({ ...c, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function validateStep(target: number) {
    const next: Record<string, string> = {};
    if (target > 1) {
      if (!customer.firstName.trim()) next.firstName = "Please enter your first name";
      if (!customer.lastName.trim()) next.lastName = "Please enter your last name";
      if (!customer.email.trim()) next.email = "Please enter your email";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))
        next.email = "That email address doesn't look right";
      if (!customer.phone.trim()) next.phone = "Please enter your phone number";
    }
    if (target > 2 && needsAddress(shipping)) {
      if (!customer.address.trim()) next.address = "Please enter your street address";
      if (!customer.city.trim()) next.city = "Please enter your city";
      if (!customer.state.trim()) next.state = "Required";
      if (!customer.zip.trim()) next.zip = "Required";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goToStep(target: number) {
    if (target > step && !validateStep(target)) return;
    setStep(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function completeOrder(method: string, transactionId: string) {
    const snapshot = {
      orderId,
      customer,
      items,
      totals,
      shippingLabel,
      shippingCost: ship,
      giftWrap,
      giftWrapCost: wrap,
      orderTotal,
      paymentMethod: method,
      transactionId,
    };
    setPlaced({
      firstName: customer.firstName,
      method,
      transactionId,
      total: orderTotal,
    });
    clearCart();
    try {
      await sendOrderEmails(snapshot);
    } catch (err) {
      console.error("Order email failed", err);
    }
  }

  function copy(text: string, label: string) {
    navigator.clipboard?.writeText(text).then(
      () => toast(`${label} copied`),
      () => toast(`Couldn't copy — the ${label.toLowerCase()} is ${text}`)
    );
  }

  if (!hydrated) return null;

  /* ---------------- Success ---------------- */
  if (placed) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <CatSitting className="mx-auto h-40 w-auto" />
        <h1 className="mt-6 text-4xl italic">Order received!</h1>
        <Squiggle className="mt-3" />
        <p className="mt-5 text-lg">
          Thank you, {placed.firstName}! Clara will be in touch soon.
        </p>
        <dl className="mt-8 space-y-1 text-muted-foreground">
          <div>
            <dt className="inline">Order reference: </dt>
            <dd className="inline font-semibold text-foreground">{orderId}</dd>
          </div>
          <div>
            <dt className="inline">Payment: </dt>
            <dd className="inline">{placed.method}</dd>
          </div>
          <div>
            <dt className="inline">Total: </dt>
            <dd className="inline">${placed.total.toFixed(2)}</dd>
          </div>
        </dl>
        <Link
          href="/shop/"
          className="mt-10 inline-block rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:opacity-90"
        >
          Keep Shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) return null;

  /* ---------------- Checkout ---------------- */
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <header className="text-center">
        <h1 className="text-5xl italic">Checkout</h1>
        <Squiggle className="mt-3" />
      </header>

      {/* Step indicator */}
      <ol className="mt-10 flex items-center justify-center gap-2 sm:gap-4">
        {["Contact", "Delivery", "Payment"].map((label, i) => {
          const n = i + 1;
          return (
            <li key={label} className="flex items-center gap-2 sm:gap-4">
              <button
                type="button"
                onClick={() => n < step && goToStep(n)}
                disabled={n > step}
                className={cn(
                  "flex items-center gap-2",
                  n < step && "cursor-pointer"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
                    n <= step
                      ? "border-fern bg-fern text-white"
                      : "border-border text-muted-foreground"
                  )}
                >
                  {n < step ? <Check className="h-4 w-4" /> : n}
                </span>
                <span
                  className={cn(
                    "hidden text-sm sm:inline",
                    n === step ? "font-bold text-fern" : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              </button>
              {n < 3 && <span className="h-px w-6 bg-border sm:w-12" />}
            </li>
          );
        })}
      </ol>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_320px]">
        <div>
          {/* STEP 1 — Contact */}
          {step === 1 && (
            <section>
              <h2 className="text-3xl">Contact Information</h2>
              <p className="mt-1 text-muted-foreground">
                So Clara can confirm your order.
              </p>
              <div className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    id="firstName"
                    label="First Name"
                    value={customer.firstName}
                    error={errors.firstName}
                    onChange={(v) => set("firstName", v)}
                    autoComplete="given-name"
                  />
                  <Field
                    id="lastName"
                    label="Last Name"
                    value={customer.lastName}
                    error={errors.lastName}
                    onChange={(v) => set("lastName", v)}
                    autoComplete="family-name"
                  />
                </div>
                <Field
                  id="email"
                  label="Email"
                  type="email"
                  value={customer.email}
                  error={errors.email}
                  onChange={(v) => set("email", v)}
                  autoComplete="email"
                />
                <Field
                  id="phone"
                  label="Phone"
                  type="tel"
                  value={customer.phone}
                  error={errors.phone}
                  onChange={(v) => set("phone", v)}
                  autoComplete="tel"
                />
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:opacity-90"
                >
                  Continue to Delivery →
                </button>
              </div>
            </section>
          )}

          {/* STEP 2 — Delivery */}
          {step === 2 && (
            <section>
              <h2 className="text-3xl">Delivery Method</h2>
              <p className="mt-1 text-muted-foreground">
                How would you like to receive your soaps?
              </p>

              <div className="mt-6 space-y-3">
                {SHIPPING_OPTIONS.map((option) => {
                  const cost = shippingCost(option.value, totals.itemCount);
                  return (
                    <label
                      key={option.value}
                      className={cn(
                        "flex cursor-pointer gap-3 rounded-lg border-2 p-4 transition-colors",
                        shipping === option.value
                          ? "border-fern bg-fern/5"
                          : "border-border hover:border-sage"
                      )}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value={option.value}
                        checked={shipping === option.value}
                        onChange={() => setShipping(option.value)}
                        className="mt-1.5 accent-[#588157]"
                      />
                      <span className="flex-1">
                        <span className="flex items-baseline justify-between gap-3">
                          <span className="font-semibold">{option.name}</span>
                          <span
                            className={cn(
                              "font-semibold",
                              cost === 0 && "text-fern"
                            )}
                          >
                            {cost === 0 ? "Free" : `$${cost.toFixed(2)}`}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-sm text-muted-foreground">
                          {option.description}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>

              {needsAddress(shipping) && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-2xl">Shipping Address</h3>
                  <Field
                    id="address"
                    label="Street Address"
                    value={customer.address}
                    error={errors.address}
                    onChange={(v) => set("address", v)}
                    autoComplete="street-address"
                  />
                  <Field
                    id="address2"
                    label="Apt, Suite, etc. (optional)"
                    value={customer.address2}
                    onChange={(v) => set("address2", v)}
                    autoComplete="address-line2"
                    optional
                  />
                  <div className="grid gap-4 sm:grid-cols-[2fr_1fr_1fr]">
                    <Field
                      id="city"
                      label="City"
                      value={customer.city}
                      error={errors.city}
                      onChange={(v) => set("city", v)}
                      autoComplete="address-level2"
                    />
                    <Field
                      id="state"
                      label="State"
                      value={customer.state}
                      error={errors.state}
                      onChange={(v) => set("state", v.toUpperCase())}
                      autoComplete="address-level1"
                      maxLength={2}
                    />
                    <Field
                      id="zip"
                      label="ZIP"
                      value={customer.zip}
                      error={errors.zip}
                      onChange={(v) => set("zip", v)}
                      autoComplete="postal-code"
                      maxLength={10}
                    />
                  </div>
                </div>
              )}

              <label
                className={cn(
                  "mt-6 flex cursor-pointer gap-3 rounded-lg border-2 p-4 transition-colors",
                  giftWrap ? "border-fern bg-fern/5" : "border-border hover:border-sage"
                )}
              >
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  className="mt-1.5 accent-[#588157]"
                />
                <span className="flex-1">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="font-semibold">Add gift wrapping</span>
                    <span className="font-semibold">
                      + ${GIFT_WRAP_COST.toFixed(2)}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    Wrapped by hand before it ships
                  </span>
                </span>
              </label>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="rounded-full border-2 border-fern px-6 py-3 font-semibold text-fern transition-colors hover:bg-fern hover:text-white"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  className="rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:opacity-90"
                >
                  Continue to Payment →
                </button>
              </div>
            </section>
          )}

          {/* STEP 3 — Payment */}
          {step === 3 && (
            <section>
              <h2 className="text-3xl">Payment</h2>
              <p className="mt-1 text-muted-foreground">
                Choose how you&apos;d like to pay. Order{" "}
                <span className="font-semibold text-foreground">{orderId}</span>.
              </p>

              <div className="mt-6 flex gap-1 border-b border-border">
                {(
                  [
                    ["paypal", "Card / PayPal"],
                    ["venmo", "Venmo"],
                    ["zelle", "Zelle"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPayTab(value)}
                    className={cn(
                      "-mb-px border-b-[3px] px-4 py-2.5 text-sm font-semibold transition-colors",
                      payTab === value
                        ? "border-fern text-fern"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {payTab === "paypal" && (
                <div className="mt-6">
                  <p className="text-muted-foreground">
                    Pay with any credit card, debit card, or PayPal — no account
                    needed.
                  </p>
                  <div className="mt-4">
                    {isPayPalConfigured() ? (
                      <PayPalScriptProvider
                        options={{ clientId: PAYPAL_CLIENT_ID, currency: "USD" }}
                      >
                        <PayPalButtons
                          style={{ shape: "pill", color: "black" }}
                          createOrder={(_data, actions) =>
                            actions.order.create({
                              intent: "CAPTURE",
                              purchase_units: [
                                {
                                  custom_id: orderId,
                                  description: "Clara's Soap order",
                                  amount: {
                                    currency_code: "USD",
                                    value: orderTotal.toFixed(2),
                                  },
                                },
                              ],
                            })
                          }
                          onApprove={async (_data, actions) => {
                            const details = await actions.order?.capture();
                            await completeOrder(
                              "PayPal",
                              details?.id ?? orderId
                            );
                          }}
                          onError={(err) => {
                            console.error(err);
                            toast(
                              "Payment error — please try again, or use Venmo or Zelle."
                            );
                          }}
                        />
                      </PayPalScriptProvider>
                    ) : (
                      <p className="rounded-lg border-2 border-dashed border-border p-4 text-sm text-muted-foreground">
                        Card and PayPal checkout isn&apos;t switched on yet. Use
                        Venmo or Zelle below, or see{" "}
                        <code className="text-xs">lib/checkout-config.ts</code>{" "}
                        to add the PayPal client ID.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {payTab === "venmo" && (
                <ManualPayment
                  label="Venmo"
                  handle={`@${VENMO_USERNAME}`}
                  configured={isVenmoConfigured()}
                  amount={orderTotal}
                  orderId={orderId}
                  onCopy={copy}
                  onConfirm={() => completeOrder("Venmo", `MANUAL-${orderId}`)}
                />
              )}

              {payTab === "zelle" && (
                <ManualPayment
                  label="Zelle"
                  handle={ZELLE_CONTACT}
                  configured={isZelleConfigured()}
                  amount={orderTotal}
                  orderId={orderId}
                  onCopy={copy}
                  onConfirm={() => completeOrder("Zelle", `MANUAL-${orderId}`)}
                />
              )}

              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="rounded-full border-2 border-fern px-6 py-3 font-semibold text-fern transition-colors hover:bg-fern hover:text-white"
                >
                  ← Back
                </button>
              </div>
            </section>
          )}
        </div>

        {/* Order summary */}
        <aside className="h-fit rounded-lg border border-border bg-card p-6 lg:sticky lg:top-32">
          <h2 className="text-2xl">Your Order</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3">
                <span>
                  {item.name}{" "}
                  <span className="text-muted-foreground">
                    &times; {item.quantity}
                  </span>
                </span>
                <span className="whitespace-nowrap">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-1.5 border-t border-border pt-4 text-sm">
            <Row label="Subtotal" value={`$${totals.subtotal.toFixed(2)}`} />
            {totals.discount > 0 && (
              <Row
                label="Bundle discount"
                value={`-$${totals.discount.toFixed(2)}`}
                accent
              />
            )}
            <Row
              label={step >= 2 ? shippingLabel : "Shipping"}
              value={
                step >= 2
                  ? ship === 0
                    ? "Free"
                    : `$${ship.toFixed(2)}`
                  : `from $${standardShippingCost(totals.itemCount).toFixed(2)}`
              }
            />
            {giftWrap && (
              <Row label="Gift wrapping" value={`$${wrap.toFixed(2)}`} />
            )}
            <div className="flex justify-between border-t border-border pt-3 text-lg font-bold">
              <dt>Total</dt>
              <dd>${orderTotal.toFixed(2)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

/* ---------------- small pieces ---------------- */

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={cn("flex justify-between gap-3", accent && "text-fern")}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  maxLength,
  optional,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  maxLength?: number;
  optional?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm">
        {label} {!optional && <span aria-hidden>*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputClass, error && "border-destructive")}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function ManualPayment({
  label,
  handle,
  configured,
  amount,
  orderId,
  onCopy,
  onConfirm,
}: {
  label: string;
  handle: string;
  configured: boolean;
  amount: number;
  orderId: string;
  onCopy: (text: string, label: string) => void;
  onConfirm: () => void;
}) {
  return (
    <div className="mt-6 rounded-lg border-2 border-border p-5">
      {!configured && (
        <p className="mb-4 rounded-lg border-2 border-dashed border-border p-3 text-sm text-muted-foreground">
          Clara&apos;s {label} details haven&apos;t been added yet — see{" "}
          <code className="text-xs">lib/checkout-config.ts</code>.
        </p>
      )}
      <p className="text-sm text-muted-foreground">Send payment to</p>
      <div className="mt-1 flex items-center gap-3">
        <span className="text-xl font-semibold">{handle}</span>
        <button
          type="button"
          onClick={() => onCopy(handle, `${label} handle`)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm transition-colors hover:border-fern hover:text-fern"
        >
          <Copy className="h-3.5 w-3.5" />
          Copy
        </button>
      </div>

      <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
        <span className="text-muted-foreground">Amount to send</span>
        <strong className="text-xl">${amount.toFixed(2)}</strong>
      </div>

      <p className="mt-4 rounded-lg bg-muted p-3 text-sm">
        Please put your name and <strong>{orderId}</strong> in the note so Clara
        knows which order it belongs to.
      </p>

      <button
        type="button"
        onClick={onConfirm}
        disabled={!configured}
        className="mt-5 w-full rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
      >
        I&apos;ve sent the payment ✓
      </button>
    </div>
  );
}
