"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function ScrollIndicator({
  targetId,
  hideWhenVisibleId,
}: {
  targetId: string;
  /** Once this element is genuinely on screen, the cue has done its job. */
  hideWhenVisibleId?: string;
}) {
  const [hidden, setHidden] = React.useState(false);

  React.useEffect(() => {
    if (!hideWhenVisibleId) return;
    const el = document.getElementById(hideWhenVisibleId);
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      // Discount the strip hidden under the fixed header (7rem) — a heading
      // tucked behind it hasn't really been seen. rootMargin takes px/%, not rem.
      { threshold: 0.6, rootMargin: "-112px 0px 0px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hideWhenVisibleId]);

  return (
    <button
      type="button"
      onClick={() =>
        document
          .getElementById(targetId)
          ?.scrollIntoView({ behavior: "smooth" })
      }
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
      className={cn(
        "mt-auto pt-12 text-fern transition-opacity duration-500 hover:scale-110 dark:text-sage",
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      )}
      aria-label="Scroll to explore"
    >
      <span className="block animate-[drift_2.5s_ease-in-out_infinite] text-3xl motion-reduce:animate-none">
        ↓
      </span>
      <span className="mt-1 block text-sm opacity-80">Scroll to Explore</span>
    </button>
  );
}
