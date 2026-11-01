#!/usr/bin/env node
// slop-lint: zero-dependency detector for source-visible AI-slop tells and interface-quality
// defects in React + Tailwind code (.tsx/.jsx/.ts/.js/.html/.css/.mdx).
//
//   node slop-lint.mjs [paths...] [--mode persuade|operate] [--json] [--fail-on slop|quality|any|none]
//
// Two categories, kept apart on purpose (ux-slop-taxonomy.md §4):
//   slop    — a default nobody chose. Severity P0 (a layperson notices) / P1 (a designer does) / P2 (craft).
//             The brief can override any slop rule: allow it in .sloplintrc.json with a reason.
//   quality — broken or inaccessible. error / warn. Not overridable by taste.
// Render-only tells (palette dominance, rhythm, hierarchy, whether the idea fits the subject)
// are out of scope by design; see ux-design/skill/SKILL.md step 6.
//
// Inline control:   // slop-lint-disable-next-line rule-id   ·   /* slop-lint-disable rule-id */ (whole file)
// Config (.sloplintrc.json, nearest ancestor of cwd):
//   { "mode": "operate", "off": ["glass"], "allow": { "overused-font": ["Inter"] }, "reasons": { "glass": "nav over video" } }

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname, relative, dirname, resolve } from "node:path";
import { hexToOklch, deltaE } from "./lib/color.mjs";

// ---------------------------------------------------------------- args & config
const argv = process.argv.slice(2);
const flag = (n) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? (argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : true) : undefined; };
const flagged = new Set(["--mode", "--fail-on", "--config"]);
const paths = argv.filter((a, i) => !a.startsWith("--") && !flagged.has(argv[i - 1]));
if (!paths.length) paths.push(".");

function findConfig(start) {
  let d = resolve(start);
  for (;;) {
    const p = join(d, ".sloplintrc.json");
    if (existsSync(p)) return JSON.parse(readFileSync(p, "utf8"));
    const up = dirname(d);
    if (up === d) return {};
    d = up;
  }
}
const config = flag("config") ? JSON.parse(readFileSync(String(flag("config")), "utf8")) : findConfig(process.cwd());
const MODE = String(flag("mode") ?? config.mode ?? "persuade");
const FAIL_ON = String(flag("fail-on") ?? config.failOn ?? "default");
const OFF = new Set(config.off ?? []);
const ALLOW = config.allow ?? {};

// ---------------------------------------------------------------- file walk
const EXT = new Set([".tsx", ".jsx", ".ts", ".js", ".mjs", ".html", ".css", ".mdx", ".json"]);
const SKIP = new Set(["node_modules", ".git", "dist", "build", ".next", "out", "coverage", ".turbo", ".vercel"]);
function walk(p, out = []) {
  const st = statSync(p);
  if (st.isDirectory()) {
    for (const e of readdirSync(p)) if (!SKIP.has(e)) walk(join(p, e), out);
  } else if (EXT.has(extname(p)) && (extname(p) !== ".json" || /components\.json$/.test(p))) out.push(p);
  return out;
}
const files = paths.flatMap((p) => walk(p));

// ---------------------------------------------------------------- extraction helpers
const lineOf = (text, idx) => text.slice(0, idx).split("\n").length;
function classStrings(text) {
  const out = [];
  const re = /\bclass(?:Name)?\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*`([^`]*)`\s*\}|\{\s*"([^"]*)"\s*\})/g;
  for (const m of text.matchAll(re)) out.push({ s: m[1] ?? m[2] ?? m[3] ?? m[4], i: m.index });
  const cn = /\b(?:cn|clsx|cva|twMerge|classNames)\(([\s\S]*?)\)/g;
  for (const m of text.matchAll(cn)) for (const s of m[1].matchAll(/["'`]([^"'`]*)["'`]/g)) out.push({ s: s[1], i: m.index + s.index });
  return out;
}
function textNodes(text) {
  const out = [];
  for (const m of text.matchAll(/>([^<>{}]*[A-Za-z0-9\p{Extended_Pictographic}→][^<>{}]*)</gu)) {
    const t = m[1].replace(/\s+/g, " ").trim();
    if (t && !/^[\w.-]+\s*=/.test(t)) out.push({ s: t, i: m.index + 1 });
  }
  for (const m of text.matchAll(/\b(?:title|label|description|placeholder|alt|aria-label|heading|subtitle|cta|text)\s*[=:]\s*["'`]([^"'`]{2,})["'`]/g)) out.push({ s: m[1], i: m.index });
  return out;
}
const tokens = (s) => s.split(/\s+/).filter(Boolean).map((t) => t.replace(/^(?:[a-z0-9-]+:)+/, "")); // strip variants md:, hover:, dark:

const PALETTE = "red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";
const NEUTRAL = "slate|gray|zinc|neutral|stone|black|white";

// ---------------------------------------------------------------- rules
// Each rule: id, cat ("slop"|"quality"), sev, modes (optional), run(ctx) -> [{i, msg}]
const R = [];
const rule = (id, cat, sev, run, opts = {}) => R.push({ id, cat, sev, run, ...opts });
const eachClass = (ctx, pred, msg) => ctx.classes.filter((c) => pred(c.s, tokens(c.s))).map((c) => ({ i: c.i, msg: typeof msg === "function" ? msg(c.s) : msg }));

// --- slop: colour & surface
rule("ai-palette", "slop", "P0", (ctx) =>
  eachClass(ctx, (s, t) => t.some((x) => new RegExp(`^(?:bg|from|via|to|text|border|ring|shadow|fill|stroke|outline|decoration|accent|caret|divide)-(?:indigo|violet|purple|fuchsia)-\\d{2,3}`).test(x)),
    "indigo/violet/purple utility: the unchosen 'AI purple' (Tailwind UI's indigo-500 lineage). Use a theme token chosen from the brief"));
rule("default-gradient", "slop", "P0", (ctx) => [
  ...eachClass(ctx, (s, t) => t.some((x) => /^bg-(?:gradient-to|linear-to|linear-\d+)/.test(x)) && t.some((x) => /^(?:from|via|to)-(?:indigo|violet|purple|fuchsia|blue|pink|cyan|sky)-\d/.test(x)),
    "blue/indigo/purple/pink gradient: the canonical wave-1 tell. Flat colour, or a tonal gradient within one brand hue"),
  ...[...ctx.text.matchAll(/linear-gradient\(\s*(?:135deg|to (?:right|bottom right))[^)]*(#(?:6366f1|8b5cf6|a855f7|7c3aed|4f46e5|3b82f6|ec4899))/gi)].map((m) => ({ i: m.index, msg: "135° indigo/violet/blue gradient in CSS" })),
]);
rule("gradient-text", "slop", "P0", (ctx) => [
  ...eachClass(ctx, (s, t) => t.includes("bg-clip-text") && t.includes("text-transparent"), "gradient-filled text: decorative, weakens contrast. Solid ink; emphasis from size and weight"),
  ...[...ctx.text.matchAll(/(?:-webkit-)?background-clip\s*:\s*text/g)].map((m) => ({ i: m.index, msg: "background-clip: text (gradient text)" })),
]);
rule("glow-shadow", "slop", "P1", (ctx) => [
  ...eachClass(ctx, (s, t) => t.some((x) => new RegExp(`^shadow-(?:${PALETTE})-\\d{2,3}`).test(x) || /^(?:drop-)?shadow-\[0_0_/.test(x)),
    "coloured glow shadow: decoration with no elevation meaning. Neutral offset shadows, or none"),
  ...[...ctx.text.matchAll(/box-shadow\s*:\s*0(?:px)?\s+0(?:px)?\s+\d+px[^;]*(?:rgba?\((?!0,\s*0,\s*0)|#(?!000))/g)].map((m) => ({ i: m.index, msg: "zero-offset coloured box-shadow halo" })),
]);
rule("radial-glow", "slop", "P1", (ctx) =>
  eachClass(ctx, (s, t) => t.includes("rounded-full") && t.some((x) => /^blur-(?:2xl|3xl|\[\d{2,}px\])$/.test(x)) && t.some((x) => new RegExp(`^bg-(?:${PALETTE}|primary|accent)`).test(x)),
    "blurred colour blob / radial halo behind content: the 'Linear glow' reflex"));
rule("side-stripe", "slop", "P1", (ctx) =>
  eachClass(ctx, (s, t) => t.some((x) => /^border-[lt]-(?:[2-8]|\[\d+px\])$/.test(x)) && t.some((x) => /^rounded(?:-|$)/.test(x)) && t.some((x) => new RegExp(`^border-(?:[lt]-)?(?:${PALETTE}|primary|accent)`).test(x)),
    "coloured side/top stripe on a rounded card: 'the most recognizable tell' (Impeccable side-tab). Use weight, fill or position; Alert for callouts"));
rule("dark-saas-card", "slop", "P1", (ctx) =>
  eachClass(ctx, (s, t) => t.some((x) => /^bg-(?:zinc|neutral|gray|slate)-9[05]0/.test(x)) && t.some((x) => /^border-white\/(?:5|10)$/.test(x)),
    "zinc-950 + border-white/10: the stock 'modern dark' card"));
rule("glass", "slop", "P2", (ctx) => {
  const hits = ctx.classes.filter((c) => tokens(c.s).some((x) => /^backdrop-blur/.test(x)));
  return hits.length >= 3 ? hits.slice(2).map((c) => ({ i: c.i, msg: `backdrop-blur on ${hits.length} elements: glass as decoration. Keep it where layering is real (a bar over scrolling content)` })) : [];
});
rule("tell-colour", "slop", "P1", (ctx) => {
  const out = [];
  for (const m of ctx.text.matchAll(/#[0-9a-fA-F]{6}\b/g)) {
    const hex = m[0];
    const [L, C, h] = hexToOklch(hex);
    if (L >= 0.9 && L <= 0.985 && C >= 0.008 && C <= 0.05 && h >= 60 && h <= 105) out.push({ i: m.index, msg: `${hex} is a warm cream/parchment ground (frontend-design cluster 1)` });
    else if (deltaE(hex, "#D97757") < 6) out.push({ i: m.index, msg: `${hex} is ΔE ${deltaE(hex, "#D97757").toFixed(1)} from #D97757, Claude's own terracotta accent` });
  }
  return out;
});
rule("untouched-shadcn", "slop", "P0", (ctx) => {
  const out = [];
  if (/components\.json$/.test(ctx.file)) {
    const m = ctx.text.match(/"baseColor"\s*:\s*"(zinc|slate|neutral|gray|stone)"/);
    if (m && !ctx.project.themed) out.push({ i: m.index, msg: `shadcn baseColor "${m[1]}" and no themed tokens found: the untouched kit (K1). Theme --primary/--radius/fonts in globals.css` });
  }
  for (const m of ctx.text.matchAll(/--primary:\s*oklch\(0\.205 0 0\)/g)) out.push({ i: m.index, msg: "shadcn default --primary (oklch(0.205 0 0)) left as installed" });
  return out;
});

// --- slop: typography
const OVERUSED = ["Inter", "Geist", "Space Grotesk", "Space_Grotesk", "Fraunces", "Plus Jakarta Sans", "Plus_Jakarta_Sans", "Instrument Serif", "Instrument_Serif", "Syne", "Sora", "Roboto", "Poppins", "Cal Sans", "DM Sans", "DM_Sans", "Manrope"];
rule("overused-font", "slop", "P1", (ctx) => {
  const allow = new Set((ALLOW["overused-font"] ?? []).map((f) => f.replace(/_/g, " ")));
  const out = [];
  const re = new RegExp(`(?:import\\s*\\{[^}]*\\b(${OVERUSED.join("|")})\\b[^}]*\\}\\s*from\\s*["']next/font|font-family\\s*:\\s*["']?(${OVERUSED.join("|")})\\b|--font-[\\w-]+\\s*:\\s*["']?(${OVERUSED.join("|")})\\b|font-\\[['"]?(${OVERUSED.join("|")}))`, "g");
  for (const m of ctx.text.matchAll(re)) {
    const f = (m[1] ?? m[2] ?? m[3] ?? m[4]).replace(/_/g, " ");
    if (!allow.has(f)) out.push({ i: m.index, msg: `${f}: one of the faces every generated page converges on. Choose a face for this brief (or allow it in .sloplintrc.json with a reason)` });
  }
  return out;
}, { modes: ["persuade"] });
rule("eyebrow", "slop", "P1", (ctx) => {
  const hits = ctx.classes.filter((c) => { const t = tokens(c.s); return t.includes("uppercase") && t.some((x) => /^tracking-(?:wide|wider|widest|\[0?\.\d+em\])$/.test(x)) && t.some((x) => /^text-(?:xs|sm|\[1[0-3]px\])$/.test(x)); });
  const budget = MODE === "operate" ? 1 : 0; // taste-skill: at most one tracked uppercase label on an app screen
  return hits.slice(budget).map((c) => ({ i: c.i, msg: "tracked ALL-CAPS micro-label (eyebrow/kicker): fold it into the heading or delete it; sentence case if it carries information" }));
});
rule("accent-word", "slop", "P1", (ctx) => {
  const out = [];
  for (const m of ctx.text.matchAll(/<h[12][^>]*>([\s\S]{0,200}?)<\/h[12]>/g)) {
    if (/<(?:span|em|i)\b[^>]*(?:className=["'][^"']*(?:italic|font-serif|text-(?:primary|accent|[a-z]+-\d{3})|bg-clip-text)|style=)/.test(m[1])) out.push({ i: m.index, msg: "one word of the headline set apart (italic / serif / colour): the instant-emphasis tell. Let the whole headline carry it" });
  }
  return out;
}, { modes: ["persuade"] });
rule("mono-costume", "slop", "P2", (ctx) =>
  eachClass(ctx, (s, t) => t.includes("font-mono") && (t.includes("uppercase") || t.some((x) => /^tracking-(?:wide|wider|widest)/.test(x))),
    "monospace + caps as a 'technical' costume: mono is for code, IDs and data"));

// --- slop: layout & components
rule("icon-chip", "slop", "P1", (ctx) =>
  eachClass(ctx, (s) => {
    const t = s.split(/\s+/); // resting classes only: hover:bg-* / focus:bg-* is not a tinted chip
    const h = t.find((x) => /^h-(?:8|9|10|11|12|14|16)$/.test(x));
    const square = t.some((x) => /^size-(?:8|9|10|11|12|14|16)$/.test(x)) || (h && t.includes(`w-${h.slice(2)}`));
    return square && t.some((x) => /^rounded-(?:md|lg|xl|2xl|full)$/.test(x)) && t.some((x) => new RegExp(`^bg-(?:(?:${PALETTE})-(?:50|100|500\\/10|500\\/15|500\\/20)|primary\\/(?:5|10|15|20)|accent|muted)$`).test(x)) && t.includes("items-center") && t.includes("justify-center");
  },
    "icon in a tinted rounded square: the universal generated feature-card / KPI template (0 of 23 real app screens). Icon beside the label, or none"));
rule("window-chrome", "slop", "P2", (ctx) => {
  const out = [];
  for (const m of ctx.text.matchAll(/bg-red-[45]00[\s\S]{0,240}?bg-(?:yellow|amber)-[45]00[\s\S]{0,240}?bg-green-[45]00/g)) out.push({ i: m.index, msg: "macOS traffic-light dots: fake window chrome standing in for a real product shot" });
  return out;
});
rule("stock-effect", "slop", "P1", (ctx) => {
  const out = [];
  for (const m of ctx.text.matchAll(/\b(Spotlight|BackgroundBeams(?:WithCollision)?|Meteors|ShimmerButton|BorderBeam|NumberTicker|SparklesCore|AnimatedBeam|TextGenerateEffect|AuroraBackground|BackgroundGradientAnimation|WavyBackground|ShootingStars|GridPattern|DotPattern|Marquee)\b(?=[^\n]*(?:from|<))/g))
    out.push({ i: m.index, msg: `${m[1]}: stock effect-library component (Aceternity / Magic UI). Build the one effect from the product's own data, or cut it` });
  return out;
});
rule("worn-icons", "slop", "P2", (ctx) => {
  const out = [];
  for (const m of ctx.text.matchAll(/import\s*\{([^}]*)\}\s*from\s*["']lucide-react["']/g)) {
    const worn = m[1].split(",").map((x) => x.trim().split(/\s+as\s+/)[0]).filter((x) => /^(?:Sparkles|Sparkle|Rocket|Zap|Shield|ShieldCheck|BarChart3|Wand2|WandSparkles|Bot|BrainCircuit)$/.test(x));
    if (worn.length) out.push({ i: m.index, msg: `${worn.join(", ")}: the worn Lucide set (Sparkles-for-AI above all). Pick icons for meaning, or none` });
  }
  return out;
});
rule("numbered-markers", "slop", "P2", (ctx) => {
  const hits = ctx.texts.filter((t) => /^(?:0[1-9]|\(0\d{2}\))\.?$/.test(t.s));
  return hits.length >= 3 ? hits.map((t) => ({ i: t.i, msg: "decorative 01/02/03 markers: only for a real sequence (then use <ol>)" })) : [];
});
rule("hero-badge", "slop", "P2", (ctx) =>
  ctx.texts.filter((t) => /^(?:✨\s*)?(?:New|Introducing|Now in beta|Beta|Announcing|v\d[\w.]*)\b.{0,40}$/i.test(t.s) && /rounded-full/.test(ctx.text.slice(Math.max(0, t.i - 300), t.i)))
    .map((t) => ({ i: t.i, msg: `pill badge "${t.s}" above the hero: say it in the supporting sentence, unless it is real dated news` })), { modes: ["persuade"] });

// --- slop: motion
rule("fade-up-everywhere", "slop", "P2", (ctx) => {
  const hits = [...ctx.text.matchAll(/initial=\{\{\s*opacity:\s*0\s*,\s*y:\s*\d+|whileInView=|data-aos=["']fade-up|animate-fade-(?:in-)?up/g)];
  return hits.length >= 3 ? hits.slice(2).map((m) => ({ i: m.index, msg: `${hits.length} identical scroll entrances in one file: one authored moment beats a fade-up on every block (and none on Operate surfaces)` })) : [];
});
rule("bounce-easing", "slop", "P2", (ctx) => [
  ...eachClass(ctx, (s, t) => t.includes("animate-bounce"), "animate-bounce: dated, tacky interface motion. Ease out without overshoot"),
  ...[...ctx.text.matchAll(/\b(easeOutBack|backOut|easeInOutBack|elastic(?:Out|In)?)\b|bounce:\s*0?\.[3-9]|cubic-bezier\([^)]*,\s*1\.[1-9]/g)].map((m) => ({ i: m.index, msg: "overshooting/bouncy easing. Interface springs stay near critical damping (Material spatial springs: damping 0.9; effects: 1.0)" })),
]);
rule("pulse-dot", "slop", "P2", (ctx) =>
  eachClass(ctx, (s, t) => (t.includes("animate-ping") || t.includes("animate-pulse")) && t.includes("rounded-full") && t.some((x) => /^(?:size|h|w)-(?:1|1\.5|2|2\.5|3)$/.test(x)),
    "decorative pulsing 'live' dot: reserve pulse for genuinely live data"));

// --- slop: copy
const BUZZ = /\b(supercharge[sd]?|unlock(?:s|ing)? the power|elevate[sd]? your|empower(?:s|ing)?|seamless(?:ly)?|streamline[sd]?|leverage[sd]?|cutting[- ]edge|world[- ]class|best[- ]in[- ]class|next[- ]gen(?:eration)?|game[- ]chang(?:er|ing)|all[- ]in[- ]one|revolutioni[sz]e|effortless(?:ly)?|unleash|take your \w+ to the next level|build the future of|reimagine[ds]?)\b/i;
rule("buzzword", "slop", "P1", (ctx) => ctx.texts.filter((t) => BUZZ.test(t.s)).map((t) => ({ i: t.i, msg: `"${t.s.match(BUZZ)[0]}": benefit-speak. Say what the product literally does, for whom` })));
rule("not-just", "slop", "P1", (ctx) => ctx.texts.filter((t) => /\bnot just\b.{1,60}\b(?:it'?s|it is|but)\b|\bisn'?t just\b|\bmore than just\b|\bNot an? \w+\. An? \w+\./i.test(t.s)).map((t) => ({ i: t.i, msg: `"${t.s.slice(0, 60)}": the manufactured-contrast cadence` })));
rule("tricolon", "slop", "P2", (ctx) => ctx.texts.filter((t) => /^(?:[A-Z][a-z]+(?:er)?[.,]\s+){2}(?:and\s+)?[A-Z]?[a-z]+(?:er)?\.?$/.test(t.s)).map((t) => ({ i: t.i, msg: `"${t.s}": tricolon slogan. One concrete claim instead` })));
rule("arrow-label", "slop", "P1", (ctx) => ctx.texts.filter((t) => /\s[→↗➜›»]$|^[→↗]\s/.test(t.s)).map((t) => ({ i: t.i, msg: `"${t.s}": arrow glyph stapled to the label. Drop it, or use a real icon where direction means something` })));
rule("emoji-icon", "slop", "P1", (ctx) => ctx.texts.filter((t) => /(?![©®™‼⁉])\p{Extended_Pictographic}/u.test(t.s)).map((t) => ({ i: t.i, msg: `emoji in interface text ("${t.s.slice(0, 40)}"): use a real icon set, or words` })));
rule("generic-cta", "slop", "P2", (ctx) => ctx.texts.filter((t) => /^(?:Get started|Learn more|Submit|Click here|Sign up now|Start now|Get started for free|Read more)$/i.test(t.s)).map((t) => ({ i: t.i, msg: `"${t.s}": name the action and its object ("Start a 14-day trial", "Save changes")` })));
rule("placeholder-identity", "slop", "P1", (ctx) => [
  ...ctx.texts.filter((t) => /\b(?:lorem ipsum|John Doe|Jane Doe|Acme(?: Inc| Corp)?|User \d)\b/i.test(t.s)).map((t) => ({ i: t.i, msg: `placeholder identity "${t.s.slice(0, 40)}": use believable domain data, labelled as sample` })),
  ...[...ctx.text.matchAll(/(?:i\.pravatar\.cc|api\.dicebear\.com|randomuser\.me|placehold\.co|via\.placeholder\.com|picsum\.photos)/g)].map((m) => ({ i: m.index, msg: `${m[0]}: stock avatar/placeholder service` })),
]);
rule("vanity-stat", "slop", "P1", (ctx) => ctx.texts.filter((t) => /^(?:\d{1,3}(?:,\d{3})+|\d+(?:\.\d)?[kKM])\+$|^99\.9+%$|\b\d{1,3}(?:,\d{3})+\+ (?:users|teams|customers|developers|companies)\b/.test(t.s)).map((t) => ({ i: t.i, msg: `"${t.s}": round vanity number. Use a real, sourced figure or cut the strip` })));
rule("welcome-greeting", "slop", "P2", (ctx) => ctx.texts.filter((t) => /^(?:Welcome back|Good (?:morning|afternoon|evening))\b/i.test(t.s)).map((t) => ({ i: t.i, msg: `"${t.s}": generated dashboard greeting. A noun title for the screen` })), { modes: ["operate", "persuade"] });
rule("middot-meta", "slop", "P2", (ctx) => ctx.texts.filter((t) => (t.s.match(/ · /g) ?? []).length >= 2).map((t) => ({ i: t.i, msg: `"${t.s.slice(0, 50)}": middle-dot meta string (template chrome)` })));
rule("em-dash-density", "slop", "P2", (ctx) => {
  const prose = ctx.texts.map((t) => t.s).join(" ");
  const n = (prose.match(/—|\s--\s/g) ?? []).length;
  return n >= 8 && n / Math.max(prose.length, 1) >= 1 / 500 ? [{ i: 0, msg: `${n} em dashes in ${prose.length} chars of interface copy: an AI cadence tell at this density` }] : [];
});

// --- quality (Vercel WIG anti-patterns, shadcn rules, WCAG)
rule("transition-all", "quality", "warn", (ctx) => eachClass(ctx, (s, t) => t.includes("transition-all"), "transition-all: list the properties (transform, opacity, colors)"));
rule("outline-none", "quality", "warn", (ctx) =>
  ctx.classes.filter((c) => tokens(c.s).some((x) => /^(?:outline-none|outline-hidden)$/.test(x)))
    // Accept a focus replacement anywhere in the same class attribute / cn() call (it may sit in a sibling string),
    // including focus:bg-* on roving-focus menu items.
    .filter((c) => !/focus(?:-visible|-within)?:(?:ring|outline|border|bg|shadow|underline|text)|data-\[(?:highlighted|focus)/.test(ctx.text.slice(Math.max(0, c.i - 600), c.i + c.s.length + 600)))
    .map((c) => ({ i: c.i, msg: "outline-none with no visible focus replacement nearby: keyboard users lose their place" })));
rule("div-onclick", "quality", "error", (ctx) => [...ctx.text.matchAll(/<(?:div|span|li)\b(?:(?!\brole=)[^>])*\bonClick=/g)].map((m) => ({ i: m.index, msg: "click handler on a div/span: use <button> (actions) or <a>/<Link> (navigation)" })));
rule("img-dimensions", "quality", "warn", (ctx) => [...ctx.text.matchAll(/<img\b(?![^>]*\bwidth=)[^>]*>/g)].map((m) => ({ i: m.index, msg: "<img> without width/height: layout shift (CLS)" })));
rule("img-alt", "quality", "error", (ctx) => [...ctx.text.matchAll(/<(?:img|Image)\b(?![^>]*\balt=)[^>]*\/?>/g)].map((m) => ({ i: m.index, msg: "image without alt (use alt=\"\" if decorative)" })));
rule("zoom-disabled", "quality", "error", (ctx) => [...ctx.text.matchAll(/user-scalable\s*=\s*(?:no|0)|maximum-scale\s*=\s*1(?:\.0)?\b|userScalable:\s*false|maximumScale:\s*1\b/g)].map((m) => ({ i: m.index, msg: "zoom disabled: never block pinch-zoom" })));
rule("paste-blocked", "quality", "error", (ctx) => [...ctx.text.matchAll(/onPaste=\{[^}]*preventDefault/g)].map((m) => ({ i: m.index, msg: "paste blocked: breaks password managers and 2FA codes" })));
rule("icon-button-label", "quality", "error", (ctx) => [...ctx.text.matchAll(/<Button\b(?![^>]*\baria-label)[^>]*\bsize=["']icon(?:-\w+)?["']/g)]
  .filter((m) => {
    const rest = ctx.text.slice(m.index);
    const open = rest.match(/^<Button\b[\s\S]*?(?<!=)>/);       // end of the opening tag (skips "=>" in handlers)
    if (!open || /\/>$/.test(open[0]) || /\{\.\.\.props\}|aria-labelledby/.test(open[0])) return false; // self-closing render prop, or label via props
    const close = rest.indexOf("</Button>");
    const inner = close > 0 ? rest.slice(open[0].length, close) : "";
    if (/sr-only|aria-label/.test(inner)) return false;
    const textOnly = inner.replace(/<[^>]*>/g, "").replace(/\s+/g, "");
    return textOnly.length === 0;                                 // nothing but an icon element inside
  })
  .map((m) => ({ i: m.index, msg: "icon-only Button without an accessible name (aria-label or sr-only text)" })));
rule("dark-override", "quality", "warn", (ctx) => eachClass(ctx, (s) => new RegExp(`\\bdark:(?:bg|text|border)-(?:${PALETTE}|${NEUTRAL})(?:-\\d{2,3})?\\b`).test(s), "manual dark: colour override: the token is missing. Use semantic tokens (bg-background, text-muted-foreground)"));
rule("token-bypass", "quality", "warn", (ctx) =>
  ctx.project.themed ? eachClass(ctx, (s, t) => t.some((x) => new RegExp(`^(?:bg|text|border|ring)-(?:${PALETTE.replace("|indigo|violet|purple|fuchsia", "")})-\\d{3}$`).test(x)), (s) => `raw palette colour in a themed project (${s.match(new RegExp(`(?:bg|text|border|ring)-(?:${PALETTE})-\\d{3}`))?.[0]}): use a role token so the theme stays in one place`) : []);
rule("autofocus", "quality", "warn", (ctx) => [...ctx.text.matchAll(/\bautoFocus\b/g)].map((m) => ({ i: m.index, msg: "autoFocus: desktop-only, single primary input, with a reason" })));

// ---------------------------------------------------------------- project-level facts
const project = { themed: false, reducedMotion: false, motion: false };
for (const f of files) {
  const t = readFileSync(f, "utf8");
  if (/--primary:\s*(?!oklch\(0\.205 0 0\))/.test(t) && /@theme/.test(t)) project.themed = true;
  if (/prefers-reduced-motion|useReducedMotion|MotionConfig[^>]*reducedMotion|motion-reduce:/.test(t)) project.reducedMotion = true;
  if (/from ["'](?:framer-motion|motion\/react|motion)["']|@keyframes|animate-\w/.test(t)) project.motion = true;
}

// ---------------------------------------------------------------- run
const findings = [];
for (const file of files) {
  const text = readFileSync(file, "utf8");
  const fileOff = new Set([...text.matchAll(/slop-lint-disable\s+([\w-]+(?:\s*,\s*[\w-]+)*)/g)].flatMap((m) => m[1].split(/\s*,\s*/)));
  const ctx = { file, text, classes: classStrings(text), texts: /\.(?:css|json)$/.test(file) ? [] : textNodes(text), project };
  const lines = text.split("\n");
  for (const r of R) {
    if (OFF.has(r.id) || fileOff.has(r.id) || (r.modes && !r.modes.includes(MODE))) continue;
    const seen = new Set();
    for (const f of r.run(ctx)) {
      const line = lineOf(text, f.i);
      if (seen.has(line)) continue;
      seen.add(line);
      const prev = lines[line - 2] ?? "";
      if (new RegExp(`slop-lint-disable-next-line\\b[^\\n]*\\b${r.id}\\b`).test(prev)) continue;
      findings.push({ file: relative(process.cwd(), file), line, rule: r.id, cat: r.cat, sev: r.sev, msg: f.msg });
    }
  }
}
if (project.motion && !project.reducedMotion && !OFF.has("reduced-motion"))
  findings.push({ file: "(project)", line: 0, rule: "reduced-motion", cat: "quality", sev: "error", msg: "animation found but no prefers-reduced-motion / useReducedMotion / MotionConfig reducedMotion=\"user\" anywhere" });

// ---------------------------------------------------------------- report
const distinctSlop = new Set(findings.filter((f) => f.cat === "slop").map((f) => f.rule));
if (flag("json")) {
  process.stdout.write(JSON.stringify({ mode: MODE, files: files.length, findings, distinctSlopRules: [...distinctSlop] }, null, 2) + "\n");
} else {
  const byFile = new Map();
  for (const f of findings) (byFile.get(f.file) ?? byFile.set(f.file, []).get(f.file)).push(f);
  for (const [file, fs] of byFile) {
    process.stdout.write(`\n${file}\n`);
    for (const f of fs.sort((a, b) => a.line - b.line)) process.stdout.write(`  ${file}:${f.line}  ${f.cat}/${f.sev}  ${f.rule}  ${f.msg}\n`);
  }
  const c = (pred) => findings.filter(pred).length;
  process.stdout.write(`\nslop-lint (${MODE} mode): ${files.length} files · slop P0 ${c((f) => f.sev === "P0")} · P1 ${c((f) => f.sev === "P1")} · P2 ${c((f) => f.sev === "P2")} · quality errors ${c((f) => f.sev === "error")} · warnings ${c((f) => f.sev === "warn")}\n`);
  if (distinctSlop.size >= 5) process.stdout.write(`${distinctSlop.size} distinct slop rules fired (${[...distinctSlop].join(", ")}): judged as a combination, this reads as a template.\n`);
}

const failing = findings.filter((f) => {
  if (FAIL_ON === "none") return false;
  if (FAIL_ON === "any") return true;
  if (FAIL_ON === "slop") return f.cat === "slop";
  if (FAIL_ON === "quality") return f.sev === "error";
  return f.sev === "P0" || f.sev === "P1" || f.sev === "error"; // default
});
process.exit(failing.length ? 1 : 0);
