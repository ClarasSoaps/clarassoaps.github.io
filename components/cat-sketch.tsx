import { cn } from "@/lib/utils";

/* Clara's cats, drawn in the same ink language as the soaps. */

export function CatSitting({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 118"
      role="img"
      aria-label="A hand-drawn sketch of a sitting cat"
      className={cn("cat-sketch", className)}
    >
      {/* body */}
      <path
        className="c-fill"
        d="M33,54 C28,74 30,96 37,104 L63,104 C70,96 72,74 67,54 Z"
      />
      {/* tail curling round the side */}
      <path
        className="c-line"
        d="M67,100 C85,102 92,86 84,74 C80,68 74,68 72,72"
      />
      {/* ears */}
      <path className="c-line" d="M34,28 L37,10 L49,21" />
      <path className="c-line" d="M66,28 L63,10 L51,21" />
      {/* head */}
      <ellipse className="c-fill" cx="50" cy="36" rx="21" ry="19" />
      {/* eyes */}
      <path className="c-line" d="M41,33 q3.5,-4.5 7,0" />
      <path className="c-line" d="M52,33 q3.5,-4.5 7,0" />
      {/* nose + mouth */}
      <path className="c-line" d="M47,42 l3,3 l3,-3" />
      {/* whiskers */}
      <path className="c-line" d="M36,41 L24,38" />
      <path className="c-line" d="M36,45 L24,48" />
      <path className="c-line" d="M64,41 L76,38" />
      <path className="c-line" d="M64,45 L76,48" />
    </svg>
  );
}

export function CatCurled({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 130 86"
      role="img"
      aria-label="A hand-drawn sketch of a cat curled up asleep"
      className={cn("cat-sketch", className)}
    >
      {/* curled body */}
      <path
        className="c-fill"
        d="M18,56 C18,32 44,20 70,24 C94,28 112,40 110,56 C108,70 88,78 62,78 C36,78 18,72 18,56 Z"
      />
      {/* tail wrapping the front */}
      <path
        className="c-line"
        d="M110,56 C118,62 114,74 100,76 C88,78 74,77 66,74"
      />
      {/* ears */}
      <path className="c-line" d="M24,44 L22,30 L34,39" />
      <path className="c-line" d="M42,39 L48,28 L50,42" />
      {/* head tucked in */}
      <ellipse className="c-fill" cx="37" cy="53" rx="17" ry="15" />
      {/* sleeping eyes */}
      <path className="c-line" d="M27,50 q3.5,3.5 7,0" />
      <path className="c-line" d="M40,50 q3.5,3.5 7,0" />
      {/* nose */}
      <path className="c-line" d="M34,58 l3,2.5 l3,-2.5" />
      {/* whiskers */}
      <path className="c-line" d="M24,57 L13,55" />
      <path className="c-line" d="M50,57 L61,55" />
    </svg>
  );
}

export function PawPrints({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 34"
      aria-hidden="true"
      className={cn("cat-sketch", className)}
    >
      {[8, 48, 88].map((x, i) => (
        <g key={x} transform={`translate(${x} ${i % 2 === 0 ? 4 : 12})`}>
          <ellipse className="c-solid" cx="10" cy="14" rx="7" ry="5.5" />
          <ellipse className="c-solid" cx="3" cy="6" rx="2.4" ry="3" />
          <ellipse className="c-solid" cx="8" cy="3" rx="2.4" ry="3" />
          <ellipse className="c-solid" cx="13.5" cy="3.4" rx="2.4" ry="3" />
          <ellipse className="c-solid" cx="18" cy="7" rx="2.4" ry="3" />
        </g>
      ))}
    </svg>
  );
}
