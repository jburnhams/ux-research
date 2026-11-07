// The booking's figure: kiln 2 in section, its shelves and what is already on them, with the
// person's own pieces set down on the shelf they will go on. It answers the two things a member
// asks after booking (where do my pieces go, and do they fit) in the studio's own picture of a
// kiln, drawn from the booking's numbers. It is the product's one illustration, and it is data.
//
// Heights are to scale; widths are indicative (a shelf is round and pieces are packed in two
// dimensions). Text lives in HTML around the drawing, so it stays 12px+ at any width.

import type { Piece } from "./sample-data";

const K = 2.4; // drawing units per centimetre
const GAP = 4; // drawing units between pieces
const INSET = 12; // drawing units kept clear at each end of a shelf

/** Whether a row of pieces fits along one shelf, in the drawing's terms. */
export const fitsOnShelf = (pieces: Piece[], shelfWidthCm: number) =>
  pieces.reduce((n, p) => n + p.w * K, 0) + GAP * Math.max(0, pieces.length - 1) <= shelfWidthCm * K - 2 * INSET;

/** A pot outline in a w×h box standing on y = base: bowls are wide, vases tall, the rest cylinders. */
function pot(x: number, base: number, p: Piece) {
  const w = p.w * K;
  const h = p.h * K;
  const t = base - h;
  if (p.w > p.h * 1.1)
    return `M${x},${t} Q${x + w * 0.04},${base} ${x + w * 0.32},${base} L${x + w * 0.68},${base} Q${x + w * 0.96},${base} ${x + w},${t} Z`;
  if (p.h > p.w * 1.8)
    return `M${x + w * 0.32},${t} L${x + w * 0.32},${t + h * 0.14} C${x - w * 0.05},${t + h * 0.4} ${x},${base} ${x + w * 0.26},${base} L${x + w * 0.74},${base} C${x + w},${base} ${x + w * 1.05},${t + h * 0.4} ${x + w * 0.68},${t + h * 0.14} L${x + w * 0.68},${t} Z`;
  return `M${x},${t} L${x + w * 0.06},${base} L${x + w * 0.94},${base} L${x + w},${t} Z`;
}

function Row({ pieces, base, x0, mine }: { pieces: Piece[]; base: number; x0: number; mine?: boolean }) {
  let x = x0;
  return (
    <g>
      {pieces.map((p, i) => {
        const d = pot(x, base, p);
        x += p.w * K + GAP;
        return (
          <path
            key={i}
            d={d}
            strokeWidth={1.25}
            strokeLinejoin="round"
            fill={mine ? "var(--primary-7)" : "var(--neutral-3)"}
            stroke={mine ? "var(--primary-11)" : "var(--neutral-8)"}
          />
        );
      })}
    </g>
  );
}

export function ShelfFigure({
  levels,
  shelfWidthCm,
  shelfGapCm,
  mine,
  onLevel,
}: {
  levels: Piece[][];
  shelfWidthCm: number;
  shelfGapCm: number;
  mine: Piece[];
  /** Index into `levels`, counted from the bottom. */
  onLevel: number;
}) {
  const inner = shelfWidthCm * K;
  const levelH = shelfGapCm * K;
  const wall = 10;
  const left = wall + 4;
  const top = 12;
  const floor = top + levels.length * levelH + 6;
  const width = inner + 2 * left + 64;
  const height = floor + wall;
  const base = (i: number) => floor - 6 - i * levelH; // top surface of shelf i
  const tallest = Math.max(...mine.map((p) => p.h));
  const myBase = base(onLevel);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="block h-auto w-full max-w-md" aria-hidden>
      {/* The kiln: brick walls and lid in section, the chamber inside. */}
      <rect x={0} y={0} width={inner + 2 * left} height={height} rx={6} fill="var(--neutral-5)" />
      <rect x={wall} y={top - 2} width={inner + 8} height={floor - top + 2} fill="var(--surface-sunken)" />
      {levels.map((_, i) => (
        <g key={i}>
          <rect x={left} y={base(i)} width={inner} height={4} rx={1} fill="var(--neutral-8)" />
          {i > 0 && (
            <>
              <rect x={left + 6} y={base(i) + 4} width={4} height={levelH - 4} fill="var(--neutral-7)" />
              <rect x={left + inner - 10} y={base(i) + 4} width={4} height={levelH - 4} fill="var(--neutral-7)" />
            </>
          )}
        </g>
      ))}
      {levels.map((pieces, i) => (i === onLevel ? null : <Row key={i} pieces={pieces} base={base(i)} x0={left + INSET} />))}
      {/* The person's pieces, set down on their shelf once, as the moment. */}
      <g className="enter-moment">
        <Row pieces={mine} base={myBase} x0={left + INSET} mine />
      </g>
      {/* Clearance: from the top of the tallest piece to the underside of the shelf above. */}
      <g stroke="var(--primary-11)" strokeWidth={1}>
        <line x1={left} x2={left + inner + 22} y1={myBase - tallest * K} y2={myBase - tallest * K} strokeDasharray="3 3" />
        <line x1={left + inner + 18} x2={left + inner + 18} y1={myBase - levelH + 4} y2={myBase - tallest * K} />
      </g>
      <text
        x={left + inner + 24}
        y={myBase - (tallest * K + levelH) / 2 + 2}
        dominantBaseline="middle"
        className="fill-primary-11"
        style={{ fontSize: 8, fontWeight: 500 }}
      >
        {shelfGapCm - tallest} cm clear
      </text>
    </svg>
  );
}
