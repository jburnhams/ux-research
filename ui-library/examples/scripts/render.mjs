// Builds the examples into dist/ and screenshots each screen at desktop and phone width, light
// and dark, into renders/. Also runs the audit's mechanical checks on every render: no console
// errors, loads at the top, no horizontal overflow, and the theme's face actually loaded.
// Needs: npm install, and Playwright with Chromium resolvable by require("playwright").
import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "dist"); // build output; slop-lint skips dist/
mkdirSync(out, { recursive: true });
mkdirSync(join(root, "renders"), { recursive: true });

execFileSync("npx", ["tailwindcss", "-i", "app/globals.css", "-o", "dist/tailwind.css"], { cwd: root, stdio: "inherit" });
await build({
  entryPoints: [join(root, "scripts/entry.tsx")],
  bundle: true,
  outdir: out,
  entryNames: "app",
  format: "iife",
  jsx: "automatic",
  loader: { ".woff2": "file", ".woff": "file" },
  alias: { "@": root },
  logLevel: "warning",
});
writeFileSync(
  join(out, "index.html"),
  `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Kiln room</title><link rel="stylesheet" href="tailwind.css"><link rel="stylesheet" href="app.css"></head><body><div id="root"></div><script src="app.js"></script></body></html>`,
);

// require() rather than import(), so a globally installed Playwright (NODE_PATH) is found too.
const { chromium } = createRequire(import.meta.url)("playwright");
const browser = await chromium.launch();
const shots = [
  ["kiln-room", "light", 1440, 900],
  ["kiln-room", "dark", 1440, 900],
  ["kiln-room", "light", 390, 844],
  ["kiln-room-loading", "light", 1440, 900],
  ["book-errors", "light", 1440, 900],
  ["book-errors", "dark", 390, 844],
  ["system", "light", 1280, 900],
  ["system", "dark", 1280, 900],
];
const problems = [];
for (const [screen, theme, width, height] of shots) {
  const page = await browser.newPage({ viewport: { width, height } });
  page.on("console", (m) => m.type() === "error" && problems.push(`${screen}/${theme}/${width}: console: ${m.text()}`));
  page.on("pageerror", (e) => problems.push(`${screen}/${theme}/${width}: ${e.message}`));
  await page.goto(`file://${join(out, "index.html")}?theme=${theme}#${screen}`);
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  const facts = await page.evaluate(() => ({
    scrollY: window.scrollY,
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    font: document.fonts.check('16px "Public Sans Variable"'),
    root: document.getElementById("root")?.childElementCount ?? 0,
  }));
  if (facts.scrollY !== 0) problems.push(`${screen}/${theme}/${width}: loads scrolled (${facts.scrollY})`);
  if (facts.overflow > 0) problems.push(`${screen}/${theme}/${width}: horizontal overflow ${facts.overflow}px`);
  if (!facts.font) problems.push(`${screen}/${theme}/${width}: Public Sans did not load`);
  if (!facts.root) problems.push(`${screen}/${theme}/${width}: blank page`);
  await page.screenshot({ path: join(root, "renders", `${screen}-${theme}-${width}.png`), fullPage: true });
  await page.close();
}
await browser.close();
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`rendered ${shots.length} screenshots; no console errors, overflow, scroll or font problems`);
