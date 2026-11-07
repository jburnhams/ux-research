// The three kilns side by side, as a member scans the room on walking in: each kiln's state in a
// word, its one figure, a trace of its temperature coloured as the kiln glows, and a test tile for
// each booking inside it, so you can spot your own glaze. It replaces the plain metric strip on
// this screen: the same figures, now carrying the room's colour (DESIGN.md, Character).
//
// The traces have no text in them, so they scale with a viewBox; the figures and words are HTML.

import * as React from "react";
import type { Point } from "@/components/ui/line-chart";
import { Status, type Tone } from "@/components/ui/status";
import type { LucideIcon } from "lucide-react";
import { GlazeTile } from "./glaze-tile";
import { heatScale } from "./heat";
import type { Glaze } from "./sample-data";

export type KilnSummary = {
  name: string;
  status: { tone: Tone; icon: LucideIcon; label: string };
  figure: string;
  unit?: string;
  note: React.ReactNode;
  /** Temperature readings for the trace; a cold kiln passes none and gets a flat line at ambient. */
  readings?: Point[];
  glazes: { glaze: Glaze; who: string }[];
};

const W = 200;
const H = 40;
const Y_MAX = 1300;

function Trace({ readings, id }: { readings?: Point[]; id: string }) {
  const pts = readings && readings.length > 1 ? readings : [{ x: 0, y: 20 }, { x: 1, y: 20 }];
  const x0 = pts[0].x;
  const x1 = pts[pts.length - 1].x;
  const sx = (x: number) => ((x - x0) / (x1 - x0 || 1)) * W;
  const sy = (y: number) => H - 2 - (y / Y_MAX) * (H - 4);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join("");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block h-10 w-full" aria-hidden>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={0} x2={0} y1={sy(0)} y2={sy(Y_MAX)}>
          {heatScale.map((s) => (
            <stop key={s.at} offset={s.at / Y_MAX} stopColor={s.colour} />
          ))}
        </linearGradient>
      </defs>
      <path d={d} fill="none" stroke={`url(#${id})`} strokeWidth={2.5} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}

export function KilnStrip({ kilns }: { kilns: KilnSummary[] }) {
  const base = React.useId().replace(/[^\w-]/g, "");
  return (
    <dl aria-label="Kilns right now" className="grid grid-cols-1 border-y border-border sm:grid-cols-3 sm:divide-x sm:divide-border">
      {kilns.map((k, i) => (
        <div key={k.name} className="grid content-start gap-2 py-4 not-first:border-t sm:px-5 sm:not-first:border-t-0 sm:first:pl-0 sm:last:pr-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <dt className="type-label">{k.name}</dt>
            <dd>
              <Status tone={k.status.tone} icon={k.status.icon}>
                {k.status.label}
              </Status>
            </dd>
          </div>
          <dd className="type-figure text-foreground">
            {k.figure}
            {k.unit && <span className="type-body text-muted-foreground">{" " + k.unit}</span>}
          </dd>
          <dd>
            <Trace readings={k.readings} id={`${base}-trace-${i}`} />
          </dd>
          <dd className="type-body-sm text-muted-foreground">{k.note}</dd>
          {k.glazes.length > 0 && (
            <dd className="flex flex-wrap gap-1.5" aria-label={`Glazes inside: ${k.glazes.map((g) => g.who).join(", ")}`}>
              {k.glazes.map((g) => (
                <span key={g.who} title={g.who}>
                  <GlazeTile glaze={g.glaze} size={18} />
                </span>
              ))}
            </dd>
          )}
        </div>
      ))}
    </dl>
  );
}
