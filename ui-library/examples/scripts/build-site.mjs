// Builds the GitHub Pages site into dist/site/:
//   index.html, tokens.html, components.html, patterns.html, agents.html, examples.html
//                       the ui-library docs, rendered from Markdown (fonts come from demo/app.css) and styled with the example's own
//                       Strata theme (the docs use the library's tokens, so the site is a demo too)
//   demo/               the live example app: kiln room, booking form, state matrix, in light and dark
//   renders/            the committed screenshots
// Links between the docs become .html links; links into the rest of the repo point at GitHub.
// Run from ui-library/examples: `npm run site`. Set REPO_URL to override the GitHub link base.
import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, posix } from "node:path";
import { fileURLToPath } from "node:url";
import { Marked } from "marked";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const lib = join(root, "..");
const out = join(root, "dist", "site");
const repo = process.env.REPO_URL ?? "https://github.com/jburnhams/ux-research";
const branch = process.env.REPO_BRANCH ?? "main";

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, "demo"), { recursive: true });

// 1. CSS: the theme plus docs typography, compiled by Tailwind (which also scans the components).
execFileSync("npx", ["tailwindcss", "-i", "scripts/site.css", "-o", "dist/site/site.css", "--minify"], { cwd: root, stdio: "inherit" });

// 2. The demo app.
await build({
  entryPoints: [join(root, "scripts/entry.tsx")],
  bundle: true,
  minify: true,
  outdir: join(out, "demo"),
  entryNames: "app",
  format: "iife",
  jsx: "automatic",
  loader: { ".woff2": "file", ".woff": "file" },
  alias: { "@": root },
  logLevel: "warning",
});
const themeScript = `<script>try{var t=new URLSearchParams(location.search).get("theme");if(t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches)document.documentElement.classList.add("dark")}catch(e){}</script>`;
writeFileSync(
  join(out, "demo", "index.html"),
  `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Kiln room: Strata example</title>${themeScript}<link rel="stylesheet" href="../site.css"><link rel="stylesheet" href="app.css"></head><body><div id="root"></div><script src="app.js"></script></body></html>`,
);

// 3. Screenshots.
cpSync(join(root, "renders"), join(out, "renders"), { recursive: true });

// 4. Docs.
const pages = [
  { src: "README.md", out: "index.html", nav: "Design" },
  { src: "tokens.md", out: "tokens.html", nav: "Tokens" },
  { src: "components.md", out: "components.html", nav: "Components" },
  { src: "patterns.md", out: "patterns.html", nav: "Patterns" },
  { src: "character.md", out: "character.html", nav: "Character" },
  { src: "agents.md", out: "agents.html", nav: "Agents" },
  { src: "examples/README.md", out: "examples.html", nav: "Example" },
];
const bySrc = new Map(pages.map((p) => [p.src, p.out]));

/** Rewrite a Markdown link written relative to `from` (a path inside ui-library/). */
function rewrite(href, from) {
  if (/^(https?:|mailto:|#)/.test(href)) return href;
  const [path, hash = ""] = href.split("#");
  const target = posix.normalize(posix.join(posix.dirname(from), path)).replace(/\/$/, "");
  const anchor = hash ? `#${hash}` : "";
  if (bySrc.has(target)) return bySrc.get(target) + anchor;
  if (target === "examples") return "examples.html";
  if (target.startsWith("examples/renders/")) return target.slice("examples/".length);
  // Everything else lives in the repository: source files, research docs, the skill.
  const repoPath = target.startsWith("../") ? target.slice(3) : `ui-library/${target}`;
  const kind = /\.[a-z0-9]+$/i.test(repoPath) ? "blob" : "tree";
  return `${repo}/${kind}/${branch}/${repoPath}${anchor}`;
}

const slug = (text) =>
  text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s/g, "-");

const nav = (current) =>
  pages
    .map((p) => `<a href="${p.out}"${p.out === current ? ' aria-current="page"' : ""}>${p.nav}</a>`)
    .concat(`<a href="demo/">Live demo</a>`)
    .join("");

const demoLinks = `<section class="demo-links" aria-labelledby="try"><h2 id="try">Try the example</h2><ul>
<li><a href="demo/#kiln-room">Kiln room</a> (<a href="demo/?theme=dark#kiln-room">dark</a>, <a href="demo/#kiln-room-loading">loading</a>, <a href="demo/#kiln-room-empty">empty</a>)</li>
<li><a href="demo/#book">Book a firing</a> (<a href="demo/#book-errors">with errors</a>)</li>
<li><a href="demo/#system">Components and states</a> (<a href="demo/?theme=dark#system">dark</a>, <a href="demo/?density=compact#system">compact</a>)</li>
</ul></section>`;

for (const page of pages) {
  const marked = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        return `<h${depth} id="${slug(text)}">${text}</h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        return `<a href="${rewrite(href, page.src)}"${title ? ` title="${title}"` : ""}>${text}</a>`;
      },
      image({ href, text }) {
        // Width and height from the PNG header, so the page does not shift as screenshots load.
        const src = rewrite(href, page.src);
        const png = readFileSync(join(out, src));
        const [w, h] = [png.readUInt32BE(16), png.readUInt32BE(20)];
        return `<img src="${src}" alt="${text}" width="${w}" height="${h}" loading="lazy">`;
      },
    },
  });
  const md = readFileSync(join(lib, page.src), "utf8");
  const body = marked.parse(md);
  const title = (md.match(/^# (.+)$/m)?.[1] ?? page.nav).replace(/`/g, "");
  writeFileSync(
    join(out, page.out),
    `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>${themeScript}<link rel="stylesheet" href="site.css"><link rel="stylesheet" href="demo/app.css"></head>
<body><header class="site-nav"><a class="site-name" href="index.html">Strata</a><nav aria-label="Docs">${nav(page.out)}</nav></header>
<main class="doc">${page.out === "index.html" || page.out === "examples.html" ? body.replace(/(<\/h1>\n)/, `$1${demoLinks}`) : body}</main>
<footer class="site-foot">Built from <a href="${repo}/tree/${branch}/ui-library">ui-library/</a> in ux-research.</footer></body></html>`,
  );
}

writeFileSync(join(out, ".nojekyll"), "");
console.log(`site built in ${posix.relative(process.cwd(), out) || out}: ${pages.length} doc pages, demo, renders`);
