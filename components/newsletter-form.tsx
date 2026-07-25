"use client";

import * as React from "react";
import { toast } from "sonner";

export function NewsletterForm() {
  const [email, setEmail] = React.useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production, this would send to a backend service
    toast(`Thanks for subscribing, ${email}!`);
    setEmail("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        aria-label="Email address"
        className="flex-1 rounded-full border border-border bg-card px-5 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
      <button
        type="submit"
        className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Notify Me
      </button>
    </form>
  );
}
