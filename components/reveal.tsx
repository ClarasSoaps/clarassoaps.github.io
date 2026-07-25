"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        // Fade only — no translate. These sections are scroll-snap targets, and
        // shifting them as they animate moves the snap point mid-scroll.
        "transition-opacity duration-1000 [transition-timing-function:cubic-bezier(0.25,0.46,0.45,0.94)] motion-reduce:transition-none",
        revealed ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}
