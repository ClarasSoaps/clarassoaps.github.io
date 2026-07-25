import emailjs from "@emailjs/browser";
import type { CartItem, CartTotals } from "./types";
import {
  CLARA_EMAIL,
  EMAILJS_CLARA_TEMPLATE_ID,
  EMAILJS_CUSTOMER_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  isEmailConfigured,
} from "./checkout-config";

export interface OrderDetails {
  orderId: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
  };
  items: CartItem[];
  totals: CartTotals;
  shippingLabel: string;
  shippingCost: number;
  giftWrap: boolean;
  giftWrapCost: number;
  orderTotal: number;
  paymentMethod: string;
  transactionId: string;
}

function itemsHtml(items: CartItem[]) {
  const rows = items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0">${i.name} &times; ${i.quantity}</td>` +
        `<td style="padding:6px 0;text-align:right">$${(
          i.price * i.quantity
        ).toFixed(2)}</td></tr>`
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse">${rows}</table>`;
}

/** Sends the customer receipt and Clara's order alert. No-ops (with a console
 *  warning) until the EmailJS credentials in checkout-config are filled in. */
export async function sendOrderEmails(order: OrderDetails) {
  if (!isEmailConfigured()) {
    console.warn(
      "EmailJS is not configured — skipping order emails. See lib/checkout-config.ts."
    );
    return;
  }

  const c = order.customer;
  const shared = {
    order_id: order.orderId,
    items_html: itemsHtml(order.items),
    subtotal: `$${order.totals.subtotal.toFixed(2)}`,
    discount_line:
      order.totals.discount > 0
        ? `Bundle discount: -$${order.totals.discount.toFixed(2)}`
        : "",
    shipping_label: order.shippingLabel,
    shipping_cost:
      order.shippingCost > 0 ? `$${order.shippingCost.toFixed(2)}` : "Free",
    gift_wrap_line: order.giftWrap
      ? `Gift wrapping: $${order.giftWrapCost.toFixed(2)}`
      : "",
    order_total: `$${order.orderTotal.toFixed(2)}`,
    ship_address: [c.address, c.address2, `${c.city} ${c.state} ${c.zip}`]
      .filter(Boolean)
      .join(", "),
    payment_method: order.paymentMethod,
    transaction_id: order.transactionId,
  };

  emailjs.init(EMAILJS_PUBLIC_KEY);

  await Promise.all([
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CUSTOMER_TEMPLATE_ID, {
      ...shared,
      customer_name: c.firstName,
      to_email: c.email,
    }),
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CLARA_TEMPLATE_ID, {
      ...shared,
      customer_name: `${c.firstName} ${c.lastName}`,
      customer_email: c.email,
      customer_phone: c.phone,
      to_email: CLARA_EMAIL,
    }),
  ]);
}
