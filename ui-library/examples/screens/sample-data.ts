// SAMPLE DATA, invented for this example. Back Lane Clay Co-op is fictional, as are its members.
// The numbers are shaped like the real thing: a cone 6 glaze firing ramps at 100, 150 and then
// 60 °C an hour to 1,222 °C, holds for 15 minutes, and cools on its own with the lid shut. Totals
// on screen are summed from these rows, never typed in.

import type { Point } from "@/components/ui/line-chart";

/** Minutes are counted from the start of the firing: Wednesday 4 November 2026, 08:00. */
export const FIRING_START = new Date(2026, 10, 4, 8, 0);
export const NOW_MIN = 30 * 60 + 10; // Thursday 14:10
export const SAFE_TO_OPEN_C = 200;

const AMBIENT = 20;
const PEAK = 1222;
const HOLD_END = 685;
const TAU = 613; // cooling time constant, minutes

/** The controller program: ramp, ramp, ramp, hold. */
export const planned: Point[] = [
  { x: 0, y: AMBIENT },
  { x: 348, y: 600 },
  { x: 548, y: 1100 },
  { x: 670, y: PEAK },
  { x: HOLD_END, y: PEAK },
];

function actualAt(t: number) {
  if (t <= HOLD_END) {
    // The kiln lags its program slightly on the steep middle ramp.
    for (let i = 1; i < planned.length; i++) {
      const a = planned[i - 1];
      const b = planned[i];
      if (t <= b.x) {
        const y = a.y + ((b.y - a.y) * (t - a.x)) / (b.x - a.x);
        return y - (t > 348 && t < 548 ? 18 * Math.sin(((t - 348) / 200) * Math.PI) : 0);
      }
    }
  }
  return AMBIENT + (PEAK - AMBIENT) * Math.exp(-(t - HOLD_END) / TAU);
}

// Half-hourly readings, plus the moments the controller changed segment, so the peak is a reading.
export const readings: Point[] = [
  ...new Set([...Array.from({ length: Math.floor(NOW_MIN / 30) + 1 }, (_, i) => i * 30), ...planned.map((p) => p.x), NOW_MIN]),
]
  .sort((a, b) => a - b)
  .map((x) => ({ x, y: Math.round(actualAt(x)) }));

/** When the kiln drops below the safe-to-open temperature, from the same cooling curve, rounded to
 *  5 minutes because the screen says "about". */
export const safeAtMin = 5 * Math.round((HOLD_END + TAU * Math.log((PEAK - AMBIENT) / (SAFE_TO_OPEN_C - AMBIENT))) / 5);

export const minuteToDate = (m: number) => new Date(FIRING_START.getTime() + m * 60_000);

export type KilnState = "booked" | "loading" | "firing" | "cooling" | "ready" | "fault";

export type Booking = {
  id: string;
  member: string;
  pieces: number;
  kiln: 1 | 2 | 3;
  firing: string;
  state: KilnState;
  out: string;
};

export const bookings: Booking[] = [
  { id: "b-2041", member: "Priya Natarajan", pieces: 6, kiln: 2, firing: "Glaze, cone 6", state: "cooling", out: "Today, about 14:50" },
  { id: "b-2042", member: "Tom Ellery", pieces: 3, kiln: 2, firing: "Glaze, cone 6", state: "cooling", out: "Today, about 14:50" },
  { id: "b-2043", member: "Aoife Byrne", pieces: 2, kiln: 2, firing: "Glaze, cone 6", state: "cooling", out: "Today, about 14:50" },
  { id: "b-2044", member: "Sam Okafor", pieces: 3, kiln: 2, firing: "Glaze, cone 6", state: "cooling", out: "Today, about 14:50" },
  { id: "b-2050", member: "Marta Kowalczyk", pieces: 11, kiln: 1, firing: "Bisque, cone 04", state: "loading", out: "Saturday after 10:00" },
  { id: "b-2051", member: "Dev Raman", pieces: 8, kiln: 1, firing: "Bisque, cone 04", state: "booked", out: "Saturday after 10:00" },
  { id: "b-2055", member: "Hannah Lowe", pieces: 4, kiln: 3, firing: "Raku", state: "booked", out: "Saturday, during the firing" },
  { id: "b-2033", member: "Joe Pryce", pieces: 5, kiln: 1, firing: "Bisque, cone 04", state: "ready", out: "Ready since Tuesday" },
];

export const kiln1Shelves = { booked: 9, total: 14 };
