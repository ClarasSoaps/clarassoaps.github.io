import { getProductById } from "@/lib/products";
import { cn } from "@/lib/utils";

/* Hand-drawn stand-ins for product photography (none exists yet).
   Each soap gets the same ink-sketch bar with its own tint and a small
   garnish keyed to its scent family, so the shelf reads as a family of
   drawings rather than repeated placeholders. Swap for real photos when
   they exist. */

// Muted, earthy tints that sit inside the forest palette while staying
// distinguishable from each other on the shelf.
const tints: Record<string, string> = {
  lavender: "#B0A8BE",
  cedarwood: "#A89078",
  "lemongrass-strawflower": "#C3C48B",
  "lemongrass-exfoliating": "#C6BA96",
  "cucumber-melon": "#A3B18A",
  peppermint: "#9BBBA8",
  "sugar-cookie": "#D3C6A6",
  "christmas-wreath": "#588157",
};

// Slight per-product lean so the shelf feels hand-placed, not stamped.
const leans: Record<string, string> = {
  lavender: "-rotate-1",
  cedarwood: "rotate-1",
  "lemongrass-strawflower": "rotate-[1.5deg]",
  "lemongrass-exfoliating": "-rotate-[1.5deg]",
  "cucumber-melon": "rotate-[0.5deg]",
  peppermint: "-rotate-1",
  "sugar-cookie": "rotate-1",
  "christmas-wreath": "-rotate-[0.5deg]",
};

function Garnish({ family }: { family: string }) {
  switch (family) {
    case "floral":
      return (
        <g>
          <path className="s-line" d="M138,28 C132,42 124,54 116,66" />
          <ellipse className="s-bud" cx="136" cy="34" rx="3.5" ry="6" transform="rotate(-30 136 34)" />
          <ellipse className="s-bud" cx="129" cy="45" rx="3.5" ry="6" transform="rotate(-30 129 45)" />
          <ellipse className="s-bud" cx="122" cy="56" rx="3.5" ry="6" transform="rotate(-30 122 56)" />
        </g>
      );
    case "woody":
      return (
        <g>
          <path className="s-line" d="M124,30 L112,64" />
          <path className="s-line" d="M124,36 L117,33 M122,42 L115,40 M120,48 L113,46 M118,54 L112,52" />
          <path className="s-line" d="M126,36 L131,32 M124,42 L130,39 M122,48 L128,46" />
        </g>
      );
    case "citrus":
      return (
        <g>
          <circle className="s-line" cx="124" cy="46" r="14" />
          <path className="s-line" d="M124,32 v28 M110,46 h28 M114,36 L134,56 M134,36 L114,56" />
        </g>
      );
    case "fresh":
      return (
        <g>
          <path className="s-line" d="M118,66 C110,50 116,36 130,28 C136,42 132,58 118,66 Z" />
          <path className="s-line" d="M120,62 C122,50 126,40 129,33" />
        </g>
      );
    case "sweet":
      return (
        <g>
          <path className="s-line" d="M112,38 l6,2 M126,30 l6,3 M120,50 l6,2 M134,44 l5,3" />
        </g>
      );
    case "minty":
      return (
        <g>
          <path className="s-line" d="M122,64 C114,52 118,40 128,32 C133,42 131,56 122,64 Z" />
          <path className="s-line" d="M112,60 C106,52 108,44 114,38 C118,45 117,54 112,60 Z" />
        </g>
      );
    default:
      return null;
  }
}

export function SoapSketch({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const product = getProductById(productId);
  const tint = tints[productId] ?? "#E5D8C8";
  const family = product?.scentFamily[0] ?? "fresh";

  return (
    <svg
      viewBox="0 0 200 150"
      role="img"
      aria-label={product ? `Hand-drawn sketch of the ${product.name} soap bar` : "Hand-drawn soap bar sketch"}
      className={cn("soap-sketch", leans[productId], className)}
    >
      <path
        className="s-bar"
        style={{ fill: tint }}
        d="M32,92 C29,78 37,68 52,64 C78,58 134,57 154,64 C167,68 169,84 162,96 C154,109 132,114 101,115 C66,115 42,110 35,102 C33,99 32,96 32,92 Z"
      />
      <path className="s-line" d="M50,72 C78,68 128,67 152,73" />
      <path className="s-line" d="M47,81 C78,77 132,76 155,82" />
      <Garnish family={family} />
    </svg>
  );
}
