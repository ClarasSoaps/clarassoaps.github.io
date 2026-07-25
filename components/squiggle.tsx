import { cn } from "@/lib/utils";

/* Small hand-drawn flourish used under section headings. */
export function Squiggle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 12"
      aria-hidden="true"
      className={cn("mx-auto h-3 w-28 text-fern", className)}
    >
      <path
        d="M4,8 C14,2 22,10 32,6 C42,2 50,10 60,6 C70,2 78,10 88,6 C98,2 106,10 116,6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}
