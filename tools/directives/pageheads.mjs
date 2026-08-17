import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import { build } from "esbuild";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadModule } from "./lib.mjs";

/*
  ВСЕ ЗАГОЛОВКИ СТРАНИЦЫ САЙТА — с уровнями и якорями, в порядке показа.

  Нужна, чтобы писать перекройку страницы (outline в pageMap.ts): там надо знать
  якорь каждого заголовка и уровень, который он получил ПОСЛЕ разметки, а не в
  гуглдоке. Оглавление (pagetoc.mjs) для этого не годится — оно показывает
  только то, что попало в навигацию, а решение принимается по всему списку.

    node tools/directives/pageheads.mjs /companies/step-4
    node tools/directives/pageheads.mjs            — все страницы
*/

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const SRC = path.join(ROOT, "src");

const out = path.join(await fs.mkdtemp(path.join(os.tmpdir(), "heads-")), "heads.mjs");
await build({
  stdin: {
    contents: `
      export { buildDoc } from "@/editor-source/source/contentTree";
      export { pageBySlug, OSNOVY_PAGES } from "@/editor-source/site/pageMap";
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
const { buildDoc, pageBySlug, OSNOVY_PAGES } = await import(pathToFileURL(out).href);

const slugs = process.argv.slice(2).length
  ? process.argv.slice(2)
  : OSNOVY_PAGES.map((p) => p.slug);
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
  const byAnchor = new Map(
    doc.children
      .filter((n) => n.component === "Section Container")
      .map((n) => [n.anchor ?? "", n]),
  );

  console.log(`\n### ${slug} — ${page.title} (${page.module})`);
  for (const a of page.sections) {
    const sec = byAnchor.get(a);
    if (!sec) {
      console.log(`  ! секции нет в модуле: ${a}`);
      continue;
    }
    const walk = (nodes) => {
      for (const n of nodes) {
        if (n.component === "Heading")
          console.log(
            `${"  ".repeat(Number(n.level[1]) - 2)}${n.level}  ${n.text.slice(0, 80)}  [${n.anchor ?? "—"}]`,
          );
        if (n.children) walk(n.children);
      }
    };
    walk(sec.children);
  }
}
