import { cn } from "@/lib/utils";

/* Three bars stacked on the shelf — a compact hero mark that stays out of
   the way. Placeholder until real photography exists. */
export function SoapStack({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 150"
      role="img"
      aria-label="A hand-drawn sketch of three bars of soap stacked with a sprig of lavender"
      className={cn("soap-sketch", className)}
    >
      {/* bottom bar */}
      <path
        className="s-bar"
        style={{ fill: "#C6BA96" }}
        d="M26,118 C24,108 30,101 42,99 C64,95 154,94 170,99 C180,102 182,112 177,120 C171,129 152,132 108,133 C74,133 36,130 30,124 C27,122 26,120 26,118 Z"
      />
      <path className="s-line" d="M40,105 C66,101 148,101 168,106" />

      {/* middle bar */}
      <path
        className="s-bar"
        style={{ fill: "#A3B18A" }}
        d="M36,92 C34,82 40,75 51,73 C71,69 148,68 163,73 C172,76 174,86 169,94 C163,103 146,106 106,107 C75,107 45,104 40,98 C37,96 36,94 36,92 Z"
      />
      <path className="s-line" d="M49,79 C72,75 143,75 161,80" />

      {/* top bar */}
      <path
        className="s-bar"
        style={{ fill: "#B0A8BE" }}
        d="M48,66 C46,57 51,50 61,48 C79,45 142,44 155,48 C163,51 165,60 161,67 C155,75 140,78 104,79 C77,79 56,76 52,71 C49,69 48,68 48,66 Z"
      />
      <path className="s-line" d="M60,54 C80,50 137,50 153,54" />

      {/* lavender sprig resting on top */}
      <path className="s-line" d="M150,14 C143,26 132,36 122,45" />
      <ellipse className="s-bud" cx="147" cy="20" rx="4" ry="7" transform="rotate(-38 147 20)" />
      <ellipse className="s-bud" cx="140" cy="29" rx="4" ry="7" transform="rotate(-38 140 29)" />
      <ellipse className="s-bud" cx="132" cy="38" rx="4" ry="7" transform="rotate(-38 132 38)" />
    </svg>
  );
}
