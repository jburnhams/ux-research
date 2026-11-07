// node --test ux-design/tests
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const scripts = join(here, "..", "skill", "scripts");
const fixtures = join(here, "..", "fixtures");

const lint = (cwd, ...args) => {
  const r = spawnSync("node", [join(scripts, "slop-lint.mjs"), ".", "--json", ...args], { cwd, encoding: "utf8" });
  return { code: r.status, ...JSON.parse(r.stdout) };
};

test("slop fixture: every catalogued tell in it is detected", () => {
  const r = lint(join(fixtures, "slop"));
  assert.equal(r.code, 1);
  const expected = [
    "ai-palette", "default-gradient", "gradient-text", "glow-shadow", "radial-glow", "side-stripe", "dark-saas-card",
    "glass", "tell-colour", "untouched-shadcn", "overused-font", "eyebrow", "accent-word", "icon-chip", "window-chrome",
    "stock-effect", "worn-icons", "numbered-markers", "hero-badge", "fade-up-everywhere", "bounce-easing", "pulse-dot",
    "buzzword", "not-just", "tricolon", "arrow-label", "emoji-icon", "generic-cta", "placeholder-identity", "vanity-stat",
    "confetti", "stock-whimsy", "stock-illustration",
  ];
  for (const id of expected) assert.ok(r.distinctSlopRules.includes(id), `expected ${id}`);
  const quality = new Set(r.findings.filter((f) => f.cat === "quality").map((f) => f.rule));
  for (const id of ["transition-all", "outline-none", "div-onclick", "img-dimensions", "img-alt", "reduced-motion", "vague-error", "sound-without-control"]) assert.ok(quality.has(id), `expected quality ${id}`);
});

test("clean fixture passes in its configured operate mode and in persuade mode", () => {
  for (const mode of [[], ["--mode", "persuade"]]) {
    const r = lint(join(fixtures, "clean"), ...mode);
    assert.deepEqual(r.findings, [], JSON.stringify(r.findings, null, 1));
    assert.equal(r.code, 0);
  }
});

test("operate mode relaxes landing-page-only rules", () => {
  const p = lint(join(fixtures, "slop"));
  const o = lint(join(fixtures, "slop"), "--mode", "operate");
  assert.ok(p.distinctSlopRules.includes("overused-font"));
  assert.ok(!o.distinctSlopRules.includes("overused-font"));
  assert.ok(!o.distinctSlopRules.includes("hero-badge"));
});

test("palette generator passes its own gates across varied seeds", () => {
  for (const seed of ["#000000", "#1f3a5f", "#6366f1", "#d97757", "#2f5d50", "#ffb000", "#7a3cff", "#00a6a6", "#ffffff"]) {
    for (const level of ["0", "0.5", "1"]) {
      const r = spawnSync("node", [join(scripts, "palette.mjs"), "--primary", seed, "--contrast", level], { encoding: "utf8" });
      assert.equal(r.status, 0, `${seed} @${level}:\n${r.stderr}`);
      assert.match(r.stdout, /@theme inline/);
    }
  }
});

test("palette flags the tell clusters it is asked to reproduce, without failing", () => {
  const r = spawnSync("node", [join(scripts, "palette.mjs"), "--primary", "#d97757"], { encoding: "utf8" });
  assert.equal(r.status, 0);
  assert.match(r.stderr, /WARN tell:terracotta/);
});

test("colour maths: known WCAG and OKLab values", async () => {
  const c = await import(join(scripts, "lib", "color.mjs"));
  assert.equal(c.contrast("#000000", "#ffffff").toFixed(2), "21.00");
  assert.equal(c.contrast("#777777", "#ffffff").toFixed(2), "4.48");
  const [L, C] = c.hexToOklch("#ffffff");
  assert.ok(Math.abs(L - 1) < 1e-3 && C < 1e-3);
  assert.equal(c.oklchToHex(c.hexToOklch("#3366cc")), "#3366cc");
  assert.ok(c.deltaE("#F4F0E4", "#F4F1EA") < 1);
});

test("ui-library worked example passes slop-lint in its configured operate mode", () => {
  const r = lint(join(here, "..", "..", "ui-library", "examples"));
  assert.deepEqual(r.findings, [], JSON.stringify(r.findings, null, 1));
  assert.equal(r.code, 0);
});
