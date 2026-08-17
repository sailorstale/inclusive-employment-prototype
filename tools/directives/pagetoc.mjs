import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import { build } from "esbuild";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadModule } from "./lib.mjs";

/*
  Оглавление страницы сайта («На этой странице») — тем же кодом, что и на сайте
  (pageToc). Проверка результата после правки уровней: в оглавление идут секции
  (H2) и подзаголовки H3, всё, что мельче, из него уходит.

    node tools/directives/pagetoc.mjs /companies/step-3
    node tools/directives/pagetoc.mjs            — все страницы
*/

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const SRC = path.join(ROOT, "src");

const out = path.join(await fs.mkdtemp(path.join(os.tmpdir(), "toc-")), "toc.mjs");
await build({
  stdin: {
    contents: `
      export { buildDoc } from "@/editor-source/source/contentTree";
      export { pageToc, pageChildren } from "@/editor-source/site/pageStructure";
      export { pageBySlug, OSNOVY_PAGES } from "@/editor-source/site/pageMap";
      export { pageParts, hiddenFromToc } from "@/editor-source/site/pageOutline";
    `,
    resolveDir: ROOT,
    loader: "ts",
  },
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: out,
  logLevel: "silent",
  alias: { "@": SRC },
  loader: { ".css": "empty", ".svg": "empty" },
});
const { buildDoc, pageToc, pageBySlug, pageParts, hiddenFromToc, OSNOVY_PAGES } =
  await import(pathToFileURL(out).href);

const slugs = process.argv.slice(2).length ? process.argv.slice(2) : OSNOVY_PAGES.map((p) => p.slug);
const all = await fetch("http://localhost:8787/api/source/directives").then((r) => r.json());

for (const slug of slugs) {
  const page = pageBySlug(slug);
  if (!page) {
    console.log(`нет такой страницы: ${slug}`);
    continue;
  }
  const { flat, sections } = await loadModule(page.module);
  const mine = Object.values(all).filter(
    (d) => d.module === page.module && d.blocks.length && d.review !== "rejected",
  );
  const ids = flat.map((it) => it.id);
  const byKey = new Map();
  const busy = new Set();
  for (const d of mine) {
    const want = d.blocks.map((b) => b.id);
    for (let s = 0; s + want.length <= ids.length; s++) {
      if (!want.every((id, k) => ids[s + k] === id)) continue;
      if (Array.from({ length: want.length }, (_, k) => s + k).some((i) => busy.has(i))) continue;
      for (let k = 0; k < want.length; k++) {
        busy.add(s + k);
        byKey.set(`${flat[s + k].si}:${flat[s + k].bi}`, d);
      }
      break;
    }
  }
  const doc = buildDoc(page.module, sections, (_t, _x, md) => md, [], (si, bi) =>
    byKey.get(`${si}:${bi}`),
  );
  // Разделы страницы — тем же кодом, что и на сайте (с перекройкой по карте).
  const { chosen } = pageParts(doc, page);
  console.log(`\n### ${slug} — ${page.title} (${page.module})`);
  // Скрытые заголовки (noToc и врезки) передаём так же, как страница: иначе
  // инструмент показывал бы строки, которых в меню у читателя нет.
  for (const t of pageToc(chosen, page.slug, hiddenFromToc(page)))
    console.log(`${t.level === 2 ? "" : "    "}H${t.level}  ${t.label.slice(0, 90)}`);
}
