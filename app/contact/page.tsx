"use client";

import * as React from "react";
import { toast } from "sonner";
import { Squiggle } from "@/components/squiggle";

const contactItems = [
  {
    label: "Email",
    value: (
      <a href="mailto:claralouise319@gmail.com" className="hover:text-primary">
        claralouise319@gmail.com
      </a>
    ),
  },
  {
    label: "Phone",
    value: (
      <a href="tel:+18033193717" className="hover:text-primary">
        (803) 319-3717
      </a>
    ),
  },
  {
    label: "Response Time",
    value: "I typically respond within 24-48 hours",
  },
  {
    label: "Local Pickup",
    value: "Available at the farm (often alongside flower purchases)",
  },
  {
    label: "Church Delivery",
    value: "Available for church members",
  },
];

const inputClass =
  "w-full rounded-lg border border-border bg-card px-4 py-2.5 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30";

export default function ContactPage() {
  const [sent, setSent] = React.useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
    toast("Thank you for your message! I'll get back to you soon.");
    e.currentTarget.reset();
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <header className="text-center">
        <h1 className="text-5xl italic">Get in Touch</h1>
        <p className="mt-3 font-accent text-2xl text-fern dark:text-sage">
          have a question? I&apos;d love to hear from you
        </p>
        <Squiggle className="mt-4" />
      </header>

      <div className="mt-14 grid gap-14 md:grid-cols-2">
        <section>
          <h2 className="text-3xl">Contact Information</h2>
          <dl className="mt-6 space-y-5">
            {contactItems.map((item) => (
              <div key={item.label}>
                <dt className="text-lg italic">{item.label}</dt>
                <dd className="text-muted-foreground">{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2 className="text-3xl">Send Me a Message</h2>
          {sent ? (
            <p className="mt-6 font-accent text-2xl text-fern dark:text-sage">
              Thank you for your message! I&apos;ll get back to you soon.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm">
                  Name *
                </label>
                <input id="name" name="name" type="text" required className={inputClass} />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm">
                  Email *
                </label>
                <input id="email" name="email" type="email" required className={inputClass} />
              </div>
              <div>
                <label htmlFor="subject" className="mb-1 block text-sm">
                  Subject *
                </label>
                <input id="subject" name="subject" type="text" required className={inputClass} />
              </div>
              <div>
                <label htmlFor="message" className="mb-1 block text-sm">
                  Message *
                </label>
                <textarea id="message" name="message" rows={6} required className={inputClass} />
              </div>
              <button
                type="submit"
                className="rounded-full bg-primary px-8 py-3 font-medium text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:opacity-90"
              >
                Send Message
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
