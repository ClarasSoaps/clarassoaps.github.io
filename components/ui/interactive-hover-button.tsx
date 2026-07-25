import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  /** Shown in the resting state, before the fill sweeps in. */
  icon?: React.ReactNode;
  /** Renders a link instead of a button, so navigation keeps link semantics. */
  href?: string;
}

const EASE = "[transition-timing-function:cubic-bezier(0.22,1,0.36,1)]";

/** Shared innards so the button and link forms stay identical. */
function ButtonBody({ text, icon }: { text: string; icon?: React.ReactNode }) {
  return (
    <>
      {/* resting label */}
      <span
        className={cn(
          "relative z-10 inline-flex items-center gap-2 transition-all duration-700",
          EASE,
          "group-hover:translate-x-[130%] group-hover:opacity-0"
        )}
      >
        {icon}
        {text}
      </span>

      {/* label revealed once the fill lands */}
      <span
        className={cn(
          "absolute inset-0 z-10 flex -translate-x-[130%] items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-700",
          EASE,
          "group-hover:translate-x-0 group-hover:opacity-100"
        )}
      >
        {text}
        <ArrowRight className="h-5 w-5" />
      </span>

      {/* fill sweeps across from the left — nothing visible at rest */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 -translate-x-full bg-fern transition-transform duration-700",
          EASE,
          "group-hover:translate-x-0"
        )}
      />
    </>
  );
}

const baseClass =
  "group relative inline-block cursor-pointer overflow-hidden rounded-full border-2 border-fern bg-background px-8 py-3.5 text-center font-semibold text-fern shadow-sm transition-shadow hover:shadow-md";

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", icon, href, className, ...props }, ref) => {
  if (href) {
    return (
      <Link href={href} className={cn(baseClass, className)}>
        <ButtonBody text={text} icon={icon} />
      </Link>
    );
  }

  return (
    <button ref={ref} className={cn(baseClass, className)} {...props}>
      <ButtonBody text={text} icon={icon} />
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
