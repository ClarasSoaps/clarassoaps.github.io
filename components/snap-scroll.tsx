"use client";

import * as React from "react";

/* Page-at-a-time scrolling.
   CSS scroll-snap hands the timing to the browser, which waits for the gesture
   to end before sliding — that read as "a nudge, a pause, then a jump". This
   takes the wheel event immediately and drives the scroll itself, so the
   takeover is instant and the travel is slow and deliberate. */

const DURATION = 1100;
const HEADER = 112;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function SnapScroll() {
  React.useEffect(() => {
    const wideEnough = window.matchMedia("(min-width: 1024px)");
    const wantsLessMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Below 1024px the grids stack far taller than the window, and hijacking
    // the scroll on a section you cannot fit on screen traps the reader.
    if (!wideEnough.matches || wantsLessMotion.matches) return;

    let animating = false;
    let frame = 0;

    const sections = () =>
      Array.from(document.querySelectorAll<HTMLElement>(".snap-section"));

    const stopsFor = (els: HTMLElement[]) =>
      els.map((el) =>
        Math.round(el.getBoundingClientRect().top + window.scrollY - HEADER)
      );

    function animateTo(to: number) {
      animating = true;
      const from = window.scrollY;
      const distance = to - from;
      const started = performance.now();

      // Native smooth scrolling would fight the per-frame writes below.
      const previous = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";

      const step = (now: number) => {
        const t = Math.min(1, (now - started) / DURATION);
        window.scrollTo(0, from + distance * easeInOutCubic(t));
        if (t < 1) {
          frame = requestAnimationFrame(step);
        } else {
          document.documentElement.style.scrollBehavior = previous;
          animating = false;
        }
      };
      frame = requestAnimationFrame(step);
    }

    function onWheel(event: WheelEvent) {
      if (event.ctrlKey) return; // pinch-zoom

      // Already travelling: swallow the input rather than compounding it.
      if (animating) {
        event.preventDefault();
        return;
      }

      const els = sections();
      if (els.length === 0) return;

      const stops = stopsFor(els);
      const y = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const down = event.deltaY > 0;

      let index = 0;
      for (let i = 0; i < stops.length; i++) if (y >= stops[i] - 4) index = i;

      // A section taller than the window is read normally until its far edge.
      const height = els[index].getBoundingClientRect().height;
      const visible = window.innerHeight - HEADER;
      if (height > visible + 2) {
        const bottom = stops[index] + height - visible;
        if (down && y < bottom - 4) return;
        if (!down && y > stops[index] + 4) return;
      }

      if (down) {
        const next = index + 1;
        // Past the final section sits the footer — let that scroll normally.
        if (next >= stops.length) return;
        event.preventDefault();
        animateTo(Math.min(stops[next], maxScroll));
        return;
      }

      // Scrolling up while adrift (e.g. down in the footer) returns to the
      // top of the current section before stepping back a section.
      if (y > stops[index] + 8) {
        event.preventDefault();
        animateTo(stops[index]);
        return;
      }
      if (index === 0) return;
      event.preventDefault();
      animateTo(Math.max(stops[index - 1], 0));
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(frame);
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return null;
}
