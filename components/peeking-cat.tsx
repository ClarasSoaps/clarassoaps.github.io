"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* A cat hiding behind the header. Her paws hook over the edge; hover (or
   focus) and she leans out; click to cycle her expression. She breathes,
   blinks and twitches an ear on her own while she waits. */

const FACES = ["normal", "eyes-closed", "tongue"] as const;
type CatFace = (typeof FACES)[number];

function FaceMarks({ face }: { face: CatFace }) {
  if (face === "tongue") {
    return (
      <>
        <path className="c-line" d="M34,59 q6,-7 12,0" />
        <path className="c-line" d="M54,59 q6,-7 12,0" />
        <path className="c-line" d="M45,75 q5,4 10,0" />
        <path className="c-tongue" d="M45,77 q5,11 10,0 Z" />
      </>
    );
  }

  if (face === "eyes-closed") {
    return (
      <>
        <path className="c-line" d="M34,59 q6,-7 12,0" />
        <path className="c-line" d="M54,59 q6,-7 12,0" />
        <path className="c-line" d="M46,76 q4,3 8,0" />
      </>
    );
  }

  // Big round eyes with a glint — the resting, friendliest face.
  return (
    <>
      <g className="cat-eyes">
        <circle className="c-eye" cx="40" cy="58" r="6.5" />
        <circle className="c-eye" cx="60" cy="58" r="6.5" />
        <circle className="c-glint" cx="42.2" cy="55.6" r="2.2" />
        <circle className="c-glint" cx="62.2" cy="55.6" r="2.2" />
      </g>
      <path className="c-line" d="M44,76 q3,3 6,0 q3,3 6,0" />
    </>
  );
}

export function PeekingCat() {
  const [face, setFace] = React.useState<CatFace>("normal");
  const [peeking, setPeeking] = React.useState(false);

  const cycle = () =>
    setFace((f) => FACES[(FACES.indexOf(f) + 1) % FACES.length]);

  return (
    <div className="pointer-events-none fixed left-[62%] top-28 z-40 hidden -translate-x-1/2 sm:block">
      <button
        type="button"
        aria-label="Peek at Clara's cat"
        onClick={() => {
          setPeeking(true);
          cycle();
        }}
        onMouseEnter={() => setPeeking(true)}
        onMouseLeave={() => setPeeking(false)}
        onFocus={() => setPeeking(true)}
        onBlur={() => setPeeking(false)}
        className="pointer-events-auto block cursor-pointer bg-transparent"
      >
        <div
          className={cn(
            "transition-transform duration-700 [transition-timing-function:cubic-bezier(0.34,1.4,0.64,1)]",
            peeking ? "translate-y-0" : "-translate-y-[66%]"
          )}
        >
          <svg viewBox="0 0 100 130" className="peeking-cat h-24 w-auto">
            {/* ears */}
            <path className="c-fill cat-ear-l" d="M31,42 L28,16 L48,33 Z" />
            <path className="c-fill cat-ear-r" d="M69,42 L72,16 L52,33 Z" />
            {/* head */}
            <ellipse className="c-fill" cx="50" cy="62" rx="27" ry="29" />
            {/* blushed cheeks */}
            <ellipse className="c-blush" cx="29" cy="70" rx="6" ry="4" />
            <ellipse className="c-blush" cx="71" cy="70" rx="6" ry="4" />
            <FaceMarks face={face} />
            {/* nose */}
            <path className="c-line" d="M47,69 l3,3 l3,-3" />
            {/* whiskers */}
            <path className="c-line" d="M18,65 L28,68" />
            <path className="c-line" d="M18,75 L28,75" />
            <path className="c-line" d="M82,65 L72,68" />
            <path className="c-line" d="M82,75 L72,75" />

            {/* paws hooked over the edge, tucked under the chin so she reads
                as one cat rather than a head above two floating mittens */}
            <g className="cat-paw-l">
              <ellipse className="c-fill" cx="33" cy="100" rx="12" ry="11" />
              <circle className="c-bean" cx="27" cy="95" r="2.1" />
              <circle className="c-bean" cx="33" cy="93.5" r="2.1" />
              <circle className="c-bean" cx="39" cy="95" r="2.1" />
            </g>
            <g className="cat-paw-r">
              <ellipse className="c-fill" cx="67" cy="100" rx="12" ry="11" />
              <circle className="c-bean" cx="61" cy="95" r="2.1" />
              <circle className="c-bean" cx="67" cy="93.5" r="2.1" />
              <circle className="c-bean" cx="73" cy="95" r="2.1" />
            </g>
          </svg>
        </div>
      </button>
    </div>
  );
}
