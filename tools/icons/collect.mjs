/*
  СБОРЩИК ИКОНОК — src/ → public/figma/icons/*.svg

  Зачем. Иконки живут в коде как компоненты lucide-react, отдельных файлов у них
  нет. Дизайнеру и разработчику нужен обычный набор SVG: посмотреть, положить в
  Figma, отдать в конструктор Яндекса. Собираем его из САМОГО кода, а не руками —
  иначе набор разъедется с сайтом на первой же правке.

  Что попадает в набор. Только иконки САЙТА, в двух группах:

  - содержание — реестр iconForText.tsx: имена, которые уезжают разработчику в
    выгрузке JSON полем "icon". Реестр открытый, каждая новая иконка заводится
    там — и попадает сюда сама;
  - интерфейс — иконки компонентов Figma (src/figma) и всего, до чего сайт
    дотягивается от App.tsx: шапка, меню, поиск, главная, витрина компонентов.

  Иконки редакторских инструментов (панель правок, замечания, инвентарь) в набор
  НЕ входят: разработчику сайта они не нужны, а в папке только путали бы —
  разработчик в сентябре 2026 не понимал, зачем ей «жирный» и «курсив». Граница
  проходит по папкам src/editor и src/editor-source; единственное исключение —
  сам реестр iconForText.tsx.

  Имена файлов = КЛЮЧИ ВЫГРУЗКИ: строчными через дефис, как на lucide.dev
  («building-2», «heart-pulse»). Разработчик ищет иконку по ключу из JSON, и имя
  файла должно совпадать с ним буква в букву. Раньше файлы назывались как
  импорты в коде (Building2.svg) — разработчик ключ «building-2» в папке не
  находил. Псевдонимы схлопываются к одной иконке (`Image as ImageIcon` →
  image.svg): у lucide это один и тот же рисунок.

  Папка каждый раз пересобирается с нуля: иконку убрали из кода — её файл
  исчезает. Ручные добавления сюда класть нельзя, их сотрёт.

  Вторая копия — папка «Иконки» в корне проекта: дизайнеру нужен набор под
  рукой, а не внутри кода. Кладём её только если рядом действительно наш проект
  (проверяем по «Доска задач.md») — иначе скрипт писал бы в чужую папку.

  Запуск: npm run icons
*/
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as lucide from "lucide-react";
import { readdir, readFile, writeFile, rm, mkdir, cp, access, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SRC = path.join(ROOT, "src");
const OUT = path.join(ROOT, "public/figma/icons");
/** Копия для дизайнера — «Иконки» рядом с «Аватарки для цитат» и «logos». */
const PROJECT = path.resolve(ROOT, "..");
const MIRROR = path.join(PROJECT, "Иконки");

/** Реестр иконок содержания — те, что едут в выгрузке. */
const REGISTRY = path.join(SRC, "editor-source/source/iconForText.tsx");
/** Всё, что лежит здесь, — редакторские инструменты, не сайт. */
const EDITOR_DIRS = [path.join(SRC, "editor"), path.join(SRC, "editor-source")];

/** Импорт из lucide-react целиком — вместе с переносами строк. */
const IMPORT_RE = /import\s*\{([^}]*)\}\s*from\s*["']lucide-react["']/g;
/** Любой импорт модуля: `from "…"` и `import "…"`. Хватает и type-импортов. */
const MODULE_RE = /(?:from|import)\s*["']([^"']+)["']/g;

/** Все .ts/.tsx под папкой. */
async function sourceFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await sourceFiles(full)));
    else if (/\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

/** Имена, импортированные из lucide-react: `Image as ImageIcon` → Image. */
function importedNames(code) {
  const names = new Set();
  for (const m of code.matchAll(IMPORT_RE))
    for (const raw of m[1].split(",")) {
      const name = raw.trim().split(/\s+as\s+/)[0].trim();
      if (name) names.add(name);
    }
  return names;
}

const isEditor = (file) => EDITOR_DIRS.some((d) => file.startsWith(d + path.sep));

/** Путь модуля из импорта → файл проекта; сторонние пакеты и css — null. */
async function resolveImport(spec, from) {
  let base;
  if (spec.startsWith("@/")) base = path.join(SRC, spec.slice(2));
  else if (spec.startsWith(".")) base = path.resolve(path.dirname(from), spec);
  else return null;
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    path.join(base, "index.ts"),
    path.join(base, "index.tsx"),
  ];
  for (const c of candidates) {
    const s = await stat(c).catch(() => null);
    if (s?.isFile() && /\.tsx?$/.test(c)) return c;
  }
  return null;
}

/*
  Файлы, до которых сайт дотягивается от точки входа, минус редакторские папки.
  Мёртвые страницы (src/pages/companies, src/pages/ngo — их никто не подключает
  в App.tsx) и забытые компоненты сюда не попадают: их иконки сайту не нужны.
*/
async function reachable(entries) {
  const seen = new Set();
  const queue = [...entries];
  while (queue.length) {
    const file = queue.pop();
    if (seen.has(file) || isEditor(file)) continue;
    seen.add(file);
    const code = await readFile(file, "utf8");
    for (const m of code.matchAll(MODULE_RE)) {
      const next = await resolveImport(m[1], file);
      if (next && !seen.has(next)) queue.push(next);
    }
  }
  return seen;
}

/** Ключ выгрузки: MonitorSmartphone → monitor-smartphone (та же формула, что в contentTree.ts). */
const toKey = (name) => name.replace(/([a-z])([A-Z0-9])/g, "$1-$2").toLowerCase();

/* 1. Содержание — реестр. */
const contentNames = importedNames(await readFile(REGISTRY, "utf8"));

/* 2. Интерфейс — всё, до чего сайт дотягивается от App.tsx и слоя Figma. */
const uiFiles = await reachable([
  path.join(SRC, "App.tsx"),
  ...(await sourceFiles(path.join(SRC, "figma"))),
]);
const uiNames = new Set();
for (const file of uiFiles)
  for (const name of importedNames(await readFile(file, "utf8"))) uiNames.add(name);

/*
  Схлопываем псевдонимы: у компонента lucide есть displayName — настоящее имя
  иконки. Иконки содержания называем ключом выгрузки (он считается от имени в
  реестре, а не от displayName: `AlertTriangle` едет как «alert-triangle», хотя
  lucide.dev зовёт её «triangle-alert»). Иконки интерфейса — каноническим
  именем lucide. Одна и та же иконка в обеих группах считается содержанием.
*/
/** displayName → { file, group, real } */
const byIcon = new Map();
/** Ключ файла → имя на lucide.dev, когда они разошлись. */
const aliases = new Map();
const missing = [];

function register(name, group) {
  const Icon = lucide[name];
  /*
    Импорт из lucide-react, который не является иконкой (тип, утилита) — не наш
    случай, но проверяем: молча пропустить значило бы потерять иконку. Сами
    иконки — это forwardRef, то есть объекты, а не функции.
  */
  if (!Icon || (typeof Icon !== "function" && typeof Icon !== "object")) {
    missing.push(name);
    return;
  }
  const real = Icon.displayName ?? name;
  const prev = byIcon.get(real);
  if (prev && (prev.group === "content" || group === "ui")) return;
  const file = group === "content" ? toKey(name) : toKey(real);
  if (file !== toKey(real)) aliases.set(file, toKey(real));
  byIcon.set(real, { file, group, Icon });
}

for (const name of contentNames) register(name, "content");
for (const name of uiNames) register(name, "ui");

if (missing.length) {
  console.error(`Не нашлось в lucide-react: ${missing.join(", ")}`);
  process.exit(1);
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const entries = [...byIcon.values()].sort((a, b) => a.file.localeCompare(b.file));
for (const { file, Icon } of entries) {
  // class="lucide lucide-…" нужен рантайму React, отдельному файлу — нет.
  const svg = renderToStaticMarkup(createElement(Icon)).replace(/ class="[^"]*"/, "");
  await writeFile(path.join(OUT, `${file}.svg`), `${svg}\n`, "utf8");
}

/*
  Памятка рядом с файлами — чтобы тот, кто откроет папку, не начал править SVG
  руками и понял, откуда взялись имена.
*/
const content = entries.filter((e) => e.group === "content").map((e) => e.file);
const ui = entries.filter((e) => e.group === "ui").map((e) => e.file);
/** «52 иконки», «30 иконок», «21 иконка». */
const iconsWord = (n) => {
  const d = n % 10;
  if (n % 100 >= 11 && n % 100 <= 14) return "иконок";
  if (d === 1) return "иконка";
  if (d >= 2 && d <= 4) return "иконки";
  return "иконок";
};
const aliasLines = [...aliases]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([file, real]) => `- \`${file}.svg\` — на lucide.dev эта иконка называется \`${real}\``);

await writeFile(
  path.join(OUT, "README.md"),
  [
    "# Иконки сайта",
    "",
    `Здесь ${entries.length} ${iconsWord(entries.length)} — ровно те, что использует сайт. Набор —`,
    "[Lucide](https://lucide.dev), размер 24 на 24, цвет наследуется от текста",
    "(`currentColor`).",
    "",
    "**Папка собирается автоматически.** Команда: `npm run icons`. Руками сюда",
    "ничего не кладите и файлы не правьте — следующая сборка всё сотрёт.",
    "",
    "**Имя файла = ключ иконки в выгрузке JSON.** В выгрузке стоит",
    '`"icon": "building-2"` — значит файл `building-2.svg`. Это же имя иконки на',
    "lucide.dev: строчными, слова через дефис.",
    "",
    `## Иконки содержания — ${content.length}`,
    "",
    "Едут разработчику в выгрузке полем `icon` у карточек и списков. Список",
    "открытый: новая иконка заводится в реестре (`iconForText.tsx`) и появляется",
    "здесь при следующей сборке.",
    "",
    ...content.map((n) => `- ${n}`),
    "",
    `## Иконки интерфейса — ${ui.length}`,
    "",
    "Шапка, меню, поиск, кнопки, главная страница. В выгрузке их нет — они часть",
    "компонентов Figma, а не содержания.",
    "",
    ...ui.map((n) => `- ${n}`),
    ...(aliasLines.length ? ["", "## Где имя на lucide.dev другое", "", ...aliasLines] : []),
    "",
    "Иконки редакторских инструментов (панель правок, замечания) в набор не входят:",
    "сайту они не нужны.",
    "",
  ].join("\n"),
  "utf8",
);

/* Копия в корне проекта — только если это действительно наша папка. */
const isProjectFolder = await access(path.join(PROJECT, "Доска задач.md")).then(
  () => true,
  () => false,
);
if (isProjectFolder) {
  await rm(MIRROR, { recursive: true, force: true });
  await cp(OUT, MIRROR, { recursive: true });
}

console.log(
  `Иконок собрано: ${entries.length} (содержание ${content.length}, интерфейс ${ui.length}) → public/figma/icons/` +
    (isProjectFolder ? " и «Иконки» в корне проекта" : ""),
);
