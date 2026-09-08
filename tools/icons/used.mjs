/*
  КАКИЕ ИКОНКИ РЕАЛЬНО УЕХАЛИ В ВЫГРУЗКУ — и на каких страницах.

  Зачем. Папка public/figma/icons собирается из кода и держит весь реестр, а
  разработчику в сентябре 2026 понадобилось другое: список ключей, которые
  стоят в выгрузке ПРЯМО СЕЙЧАС, по страницам. Реестр открытый и шире выгрузки,
  по нему этого не видно.

  Как. Собираем выгрузку тем же кодом, что и страница /checks (buildOsnovyExport),
  и обходим её, выписывая поля icon и image. Правки редактора и разметку берём с
  локального сервера правок (порт 8787, переменная API — другой стенд), замечания
  — с боевого; приём тот же, что в tools/dump-page.

  Запуск: npm run icons:used
*/
import { build } from "esbuild";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(import.meta.dirname, "../..");
async function importTs(entry) {
  const out = path.join(await fs.mkdtemp(path.join(os.tmpdir(), "icons-used-")), "bundle.mjs");
  await build({
    entryPoints: [path.join(ROOT, entry)], bundle: true, format: "esm", platform: "node",
    outfile: out, logLevel: "silent", alias: { "@": path.join(ROOT, "src") },
    define: { "import.meta.env": JSON.stringify({ BASE_URL: "/", DEV: false, PROD: true }) },
  });
  return import(pathToFileURL(out).href);
}
globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
const API_BASE = process.env.API || "http://localhost:8787";
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, init) => {
  const u = String(url);
  if (u.startsWith("/api/review")) return realFetch(`https://inclusion-editor-production.up.railway.app${u}`, init);
  if (u.startsWith("/api")) return realFetch(`${API_BASE}${u}`, init);
  if (u.startsWith("/")) {
    try {
      const body = await fs.readFile(path.join(ROOT, "public", u.slice(1)), "utf8");
      return new Response(body, { headers: { "content-type": "application/json" } });
    } catch { return new Response("{}", { status: 404 }); }
  }
  return realFetch(url, init);
};
const { buildOsnovyExport } = await importTs("src/editor-source/site/siteExport.ts");
const exp = await buildOsnovyExport();
const icons = new Map(), images = new Map(), byPage = {};
function walk(n, slug) {
  if (Array.isArray(n)) return n.forEach((x) => walk(x, slug));
  if (!n || typeof n !== "object") return;
  if (typeof n.icon === "string") { icons.set(n.icon, (icons.get(n.icon) ?? 0) + 1); (byPage[slug] ??= new Set()).add(n.icon); }
  if (typeof n.image === "string") images.set(n.image, (images.get(n.image) ?? 0) + 1);
  for (const v of Object.values(n)) if (v && typeof v === "object") walk(v, slug);
}
for (const p of exp.pages) walk(p.article, p.slug);
const list = (m) => [...m].sort().map(([k, n]) => `${k} (${n})`).join(" · ");
console.log(`Иконки в выгрузке — ${icons.size}: ${list(icons)}`);
console.log(`Картинки в выгрузке — ${images.size}: ${list(images)}`);
console.log("\nПо страницам:");
for (const [slug, set] of Object.entries(byPage)) console.log(`  ${slug}: ${[...set].sort().join(", ")}`);
