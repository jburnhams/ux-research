// A glaze as its test tile: a small square swatch with the glaze breaking thinner (lighter) over
// the top edge, as real glaze does over a tile's rim. The name always sits beside it, so colour is
// never the only cue. Product-specific: the colours are the co-op's (--glaze-* in globals.css).

import type * as React from "react";
import { glazeNames, type Glaze } from "./sample-data";

export function GlazeTile({ glaze, size = 14 }: { glaze: Glaze; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden className="shrink-0">
      <rect x="0.5" y="0.5" width="13" height="13" rx="2" fill={`var(--glaze-${glaze})`} stroke="var(--neutral-8)" strokeOpacity={0.5} />
      <rect x="1" y="1" width="12" height="3" rx="1.5" fill="white" fillOpacity={0.22} />
    </svg>
  );
}

export function GlazeLabel({ glaze, children }: { glaze: Glaze; children?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <GlazeTile glaze={glaze} />
      {children ?? glazeNames[glaze]}
    </span>
  );
}
