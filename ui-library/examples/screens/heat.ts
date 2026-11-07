// The kiln's glow as a colour scale, for the firing chart. Each stop is a temperature where the
// colour through the peephole changes; between stops the chart blends. Nothing glows below about
// 525 °C (the Draper point), so up to 500 °C the line is the unlit clay brown. Values live in
// app/globals.css (--heat-*), solved for >= 3:1 against the ground in light and dark.
export const heatScale = [
  { at: 0, colour: "var(--heat-unlit)" },
  { at: 500, colour: "var(--heat-unlit)" },
  { at: 600, colour: "var(--heat-dull-red)" },
  { at: 800, colour: "var(--heat-cherry)" },
  { at: 1000, colour: "var(--heat-orange)" },
  { at: 1200, colour: "var(--heat-yellow)" },
];
