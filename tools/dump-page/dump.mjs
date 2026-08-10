// Дерево страницы сайта в текст — чтобы читать её глазами, а не по браузеру.
//
// Зачем. Замечания клиента адресуются АДРЕСОМ УЗЛА («2.36» — секция 2, блок 36),
// тем же, что стоит в data-json-path на странице. Разбирая замечание, надо
// быстро понять, что это за блок, откуда он взялся в источнике и что рядом.
// Дамп отвечает на всё это одной строкой на узел:
//
//   2.36  Text | text="Сообщества ВКонтакте" | at=["4:6"]
//         ↑адрес узла                          ↑адрес блока в источнике
//                                               (секция источника 4, блок 6)
//
// Как запускать (из папки prototype):
//   node tools/dump-page/dump.mjs /general/how
//   node tools/dump-page/dump.mjs /general/how tree.json   — ещё и JSON целиком
//
// Страница собирается ТЕМ ЖЕ кодом, что и сайт (buildSiteTrees), поэтому дамп и
// страница не могут разъехаться. Правки редактора и разметку берём с локального
// сервера, замечания — с боевого: адреса те же, что в браузере.
import { build } from "esbuild";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(import.meta.dirname, "../..");

/*
  Файлы проекта на TypeScript, а скрипт обычный. Собираем нужный модуль тем же
  esbuild, который стоит под Vite, — так дамп читает НАСТОЯЩУЮ сборку страницы,
  а не её пересказ. Тот же приём, что в tools/check-review.
*/
async function importTs(entry) {
  const out = path.join(
    await fs.mkdtemp(path.join(os.tmpdir(), "dump-page-")),
    "bundle.mjs",
  );
  await build({
    entryPoints: [path.join(ROOT, entry)],
    bundle: true,
    format: "esm",
    platform: "node",
    outfile: out,
    logLevel: "silent",
    alias: { "@": path.join(ROOT, "src") },
    define: {
      "import.meta.env": JSON.stringify({ BASE_URL: "/", DEV: false, PROD: true }),
    },
  });
  return import(pathToFileURL(out).href);
}

/*
  Сборка страницы писалась под браузер и ходит по относительным адресам. В узле
  их некому разрешить, поэтому подставляем те же цели, что и dev-сервер: «/api»
  — локальный сервер правок, «/api/review» — боевой список замечаний, остальное
  — файлы из public.
*/
globalThis.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, init) => {
  const u = String(url);
  if (u.startsWith("/api/review"))
    return realFetch(
      `https://inclusion-editor-production.up.railway.app${u}`,
      init,
    );
  if (u.startsWith("/api")) return realFetch(`http://localhost:8787${u}`, init);
  if (u.startsWith("/")) {
    try {
      const body = await fs.readFile(path.join(ROOT, "public", u.slice(1)), "utf8");
      return new Response(body, { headers: { "content-type": "application/json" } });
    } catch {
      return new Response("{}", { status: 404 });
    }
  }
  return realFetch(url, init);
};

const { buildSiteTrees } = await importTs("src/editor-source/site/siteExport.ts");
const trees = await buildSiteTrees();
const slug = process.argv[2] ?? "/general/how";
const tree = trees.find((t) => t.slug === slug);
if (!tree) {
  console.error(`Нет такой страницы: ${slug}\nЕсть: ${trees.map((t) => t.slug).join(", ")}`);
  process.exit(1);
}
if (process.argv[3]) await fs.writeFile(process.argv[3], JSON.stringify(tree, null, 1));

/** Служебные поля узла в одну строку: всё, кроме детей и имени компонента. */
const skip = new Set(["children", "kind", "type"]);
const brief = (v) =>
  typeof v === "string" ? JSON.stringify(v.slice(0, 160)) : JSON.stringify(v).slice(0, 200);

function walk(nodes, prefix) {
  nodes.forEach((n, i) => {
    const at = prefix ? `${prefix}.${i}` : String(i);
    const fields = Object.entries(n)
      .filter(([k, v]) => !skip.has(k) && v !== undefined)
      .map(([k, v]) => `${k}=${brief(v)}`);
    console.log(`${at}\t${fields.join(" | ")}`);
    if (Array.isArray(n.children)) walk(n.children, at);
  });
}
walk(tree.nodes, "");
