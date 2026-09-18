// Сторож структуры выгрузки: сверка с файлом разработчика.
//
// ЗАЧЕМ. Сайт собран в конструкторе разработчика, и каждый шаблон там привязан
// к точной форме узла: какой компонент, во что завёрнут, какие свойства. Правка
// содержания у нас легко тянет за собой структуру — снятый конверт, пропавшее
// объединение ячеек, изменившийся размер — и у разработчика страница
// рассыпается, а у нас всё выглядит нормально. Правило Мити от 18 сентября
// 2026: структуру выгрузки не менять, только содержание; если без изменения
// структуры не обойтись — предупредить заранее и получить решение.
//
// ЧТО ДЕЛАЕТ. Собирает выгрузку тем же кодом, что и сайт, и сравнивает скелет
// каждой страницы с reference.json — файлом данных, с которым проект сдавался
// разработчику (sayt (6) (1).json от 30 августа 2026). Тексты, адреса и прочее
// содержание не сравниваются (см. CONTENT). Расхождения, одобренные дизайнером,
// перечислены в approved.json и не считаются ошибкой.
//
// Как запускать (из папки prototype):
//   npm run check:structure                         — на данных боевого стенда (по умолчанию)
//   API=http://localhost:8787 npm run check:structure  — на локальных данных
//
// Правки редактора и разметку берёт со стенда, потому что выгрузку
// разработчик скачивает именно там; замечания — тоже с боевого.
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
// По умолчанию — данные БОЕВОГО стенда: выгрузку разработчик скачивает
// оттуда, и разметка там своя (см. stand-gap). Локальные данные — API=http://localhost:8787.
const API_BASE = process.env.API || "https://inclusion-editor-production.up.railway.app";
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, init) => {
  const u = String(url);
  if (u.startsWith("/api/review"))
    return realFetch(
      `https://inclusion-editor-production.up.railway.app${u}`,
      init,
    );
  // Сервер правок — по умолчанию локальный. Переменная API позволяет собрать
  // страницу НА ДАННЫХ ДРУГОГО СТЕНДА (например, боевого) и сравнить с нашей:
  // код один и тот же, значит вся разница — в разметке, которая туда не доехала.
  if (u.startsWith("/api")) return realFetch(`${API_BASE}${u}`, init);
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

/*
  МЕТКИ ЗАМЕН СНИМАЕМ. Дамп печатает дерево страницы ДО выгрузки, а замены
  раскурсовки в нём ещё помечены служебными символами из приватной зоны Юникода
  (U+E000…U+E002): между ними лежат оба варианта, новый и прежний. На сайте по
  этой метке рисуется подсказка «было: …», а в выгрузке разработчику метки
  снимает mdToTags. В дампе же они невидимы — символы без начертания, — и строка
  выглядит задвоенной: «…для работодателей…для работодателя».

  Так уже случилось 11 августа 2026: сессия «Шага 2» приняла это за ошибку
  сборки и потратила время на поиск несуществующей поломки. Снимаем метки тем же
  stripMarks, что и остальные места, где строку показывают как есть. Просто
  выбросить служебные символы нельзя — оба варианта склеились бы в одну строку,
  и получилось бы ровно то задвоение, от которого мы уходим.
*/
const clean = (v) =>
  typeof v === "string"
    ? stripMarks(v)
    : Array.isArray(v)
      ? v.map(clean)
      : v && typeof v === "object"
        ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, clean(x)]))
        : v;

// ── Сравнение ────────────────────────────────────────────────────────────────

const { buildOsnovyExport } = await importTs("src/editor-source/site/siteExport.ts");
const HERE = path.resolve(import.meta.dirname);
const reference = JSON.parse(await fs.readFile(path.join(HERE, "reference.json"), "utf8"));
const approved = JSON.parse(await fs.readFile(path.join(HERE, "approved.json"), "utf8"));

/*
  Содержание, которое не сравниваем: тексты, адреса, подписи, мета. Всё
  остальное — компонент, вложенность, порядок, размер, маркер, цвет, картинка,
  объединение ячеек — структура.
*/
const CONTENT = new Set([
  "text", "href", "src", "photo", "logo", "alt", "title", "author", "role", "org",
  "question", "description", "explanation", "feedback", "subtitle", "caption",
  "name", "header", "rows", "label", "tag", "answers", "options", "items",
  "aspectRatio", "poster", "anchor", "h1", "meta", "meta-og", "navTitle", "navGroup", "value",
]);

const label = (n) => {
  if (!n || typeof n !== "object") return String(n);
  const t = n.title || n.text || n.question || n.author || "";
  return `${n.component} «${String(t).slice(0, 40)}»`;
};

/* Форма ячеек таблицы: объединения (rowSpan/colSpan) — структура, текст — нет. */
const cellShape = (rows) =>
  (rows || []).map((r) => r.map((c) => (c && typeof c === "object" ? `${c.rowSpan ?? 1}x${c.colSpan ?? 1}` : "1x1")));

function diff(ours, theirs, page, pathStr, out) {
  const keys = new Set([...Object.keys(ours), ...Object.keys(theirs)]);
  for (const k of keys) {
    if (k === "children") continue;
    if (k === "rows") {
      const a = JSON.stringify(cellShape(ours.rows)), b = JSON.stringify(cellShape(theirs.rows));
      if (a !== b) out.push({ page, path: pathStr, what: `объединение ячеек: у неё ${b}, у нас ${a}` });
      continue;
    }
    if (CONTENT.has(k)) continue;
    if (JSON.stringify(ours[k]) !== JSON.stringify(theirs[k]))
      out.push({ page, path: pathStr, what: `${k}: у неё ${JSON.stringify(theirs[k])}, у нас ${JSON.stringify(ours[k])}` });
  }
  const ca = ours.children ?? [], cb = theirs.children ?? [];
  if (ca.length !== cb.length) {
    out.push({
      page, path: pathStr,
      what: `детей ${cb.length} у неё, ${ca.length} у нас\n      у неё: ${cb.map(label).join(", ")}\n      у нас: ${ca.map(label).join(", ")}`,
    });
    return;
  }
  ca.forEach((c, i) => diff(c, cb[i], page, `${pathStr}.${i}`, out));
}

const site = await buildOsnovyExport();
const theirs = new Map(reference.pages.map((p) => [p.slug, p]));
const out = [];

const oursSlugs = site.pages.map((p) => p.slug), theirSlugs = reference.pages.map((p) => p.slug);
if (JSON.stringify(oursSlugs) !== JSON.stringify(theirSlugs))
  out.push({ page: "(список страниц)", path: "pages", what: `порядок или состав страниц отличается:\n      у неё: ${theirSlugs.join(" ")}\n      у нас: ${oursSlugs.join(" ")}` });

for (const page of site.pages) {
  const ref = theirs.get(page.slug);
  if (!ref) continue;
  const a = page.article, b = ref.article;
  if (!a && !b) continue;
  if (!a || !b || a.length !== b.length) {
    out.push({ page: page.slug, path: "article", what: `секций ${b?.length ?? 0} у неё, ${a?.length ?? 0} у нас` });
    continue;
  }
  a.forEach((sec, i) => diff(sec, b[i], page.slug, `article.${i}`, out));
}

/*
  Одобренные расхождения: запись подходит, если совпадает страница и путь
  (или путь начинается с указанного), либо сработало именованное правило.
*/
const RULES = {
  "size-L-to-M": (d) => /^size: у неё "L", у нас "M"$/.test(d.what),
};
const isApproved = (d) =>
  approved.some((a) =>
    a.rule ? RULES[a.rule]?.(d) : a.page === d.page && (d.path === a.path || d.path.startsWith(`${a.path}.`)),
  );

const bad = out.filter((d) => !isApproved(d));
const ok = out.length - bad.length;
console.log(`Страниц сверено: ${site.pages.filter((p) => p.article).length}. Расхождений: ${out.length}, из них одобрено: ${ok}.`);
if (bad.length) {
  console.error(`\nСТРУКТУРА ВЫГРУЗКИ ОТЛИЧАЕТСЯ ОТ ФАЙЛА РАЗРАБОТЧИКА — ${bad.length}:\n`);
  let cur = null;
  for (const d of bad) {
    if (d.page !== cur) { console.error(`== ${d.page}`); cur = d.page; }
    console.error(`  ${d.path} | ${d.what}`);
  }
  console.error(
    "\nЕсли это осознанное решение дизайнера — запиши его в approved.json с пояснением.\n" +
    "Если нет — верни структуру: у разработчика от такого рассыпается страница.",
  );
  process.exit(1);
}
console.log("Структура совпадает.");
