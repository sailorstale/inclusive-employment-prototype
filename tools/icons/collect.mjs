/*
  СБОРЩИК ИКОНОК — src/ → public/figma/icons/*.svg

  Зачем. Иконки живут в коде как компоненты lucide-react, отдельных файлов у них
  нет. Дизайнеру и разработчику нужен обычный набор SVG: посмотреть, положить в
  Figma, отдать в конструктор Яндекса. Собираем его из САМОГО кода, а не руками —
  иначе набор разъедется с сайтом на первой же правке.

  Как. Проходим по src/, находим все импорты из "lucide-react", берём оттуда
  имена, рисуем каждую иконку в статический SVG и раскладываем по файлам.

  Имена файлов = имена иконок в коде. Псевдонимы схлопываются к настоящему имени
  (`Image as ImageIcon` → Image.svg): у lucide это одна и та же иконка, и два
  одинаковых файла в папке только путали бы.

  Папка каждый раз пересобирается с нуля: иконку убрали из кода — её файл
  исчезает. Ручные добавления сюда класть нельзя, их сотрёт.

  Запуск: npm run icons
*/
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as lucide from "lucide-react";
import { readdir, readFile, writeFile, rm, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SRC = path.join(ROOT, "src");
const OUT = path.join(ROOT, "public/figma/icons");

/** Импорт из lucide-react целиком — вместе с переносами строк. */
const IMPORT_RE = /import\s*\{([^}]*)\}\s*from\s*["']lucide-react["']/g;

/** Все .ts/.tsx под src/. */
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

const files = await sourceFiles(SRC);
const used = new Set();
for (const file of files)
  for (const name of importedNames(await readFile(file, "utf8"))) used.add(name);

/*
  Схлопываем псевдонимы: у компонента lucide есть displayName — настоящее имя
  иконки. По нему же и называем файл.
*/
const byIcon = new Map();
/** Имя в коде → имя файла, когда они разошлись (псевдонимы lucide). */
const aliases = new Map();
const missing = [];
for (const name of used) {
  const Icon = lucide[name];
  /*
    Импорт из lucide-react, который не является иконкой (тип, утилита) — не наш
    случай, но проверяем: молча пропустить значило бы потерять иконку. Сами
    иконки — это forwardRef, то есть объекты, а не функции.
  */
  if (!Icon || (typeof Icon !== "function" && typeof Icon !== "object")) {
    missing.push(name);
    continue;
  }
  const real = Icon.displayName ?? name;
  if (real !== name) aliases.set(name, real);
  byIcon.set(real, Icon);
}

if (missing.length) {
  console.error(`Не нашлось в lucide-react: ${missing.join(", ")}`);
  process.exit(1);
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

for (const [name, Icon] of [...byIcon].sort(([a], [b]) => a.localeCompare(b))) {
  // class="lucide lucide-…" нужен рантайму React, отдельному файлу — нет.
  const svg = renderToStaticMarkup(createElement(Icon)).replace(
    / class="[^"]*"/,
    "",
  );
  await writeFile(path.join(OUT, `${name}.svg`), `${svg}\n`, "utf8");
}

/*
  Памятка рядом с файлами — чтобы тот, кто откроет папку, не начал править SVG
  руками и понял, откуда взялись имена.
*/
const names = [...byIcon.keys()].sort((a, b) => a.localeCompare(b));
const aliasLines = [...aliases]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([from, to]) => `- \`${from}\` в коде — это \`${to}.svg\``);

await writeFile(
  path.join(OUT, "README.md"),
  [
    "# Иконки сайта",
    "",
    `Здесь ${names.length} иконок — ровно те, что используются в коде прототипа.`,
    "",
    "**Папка собирается автоматически.** Команда: `npm run icons`. Руками сюда",
    "ничего не кладите и файлы не правьте — следующая сборка всё сотрёт.",
    "",
    "Имя файла = имя иконки в коде. Набор — [Lucide](https://lucide.dev),",
    "размер 24 на 24, цвет наследуется от текста (`currentColor`).",
    ...(aliasLines.length
      ? ["", "## Где имя в коде другое", "", ...aliasLines]
      : []),
    "",
    "## Список",
    "",
    ...names.map((n) => `- ${n}`),
    "",
  ].join("\n"),
  "utf8",
);

console.log(`Иконок собрано: ${byIcon.size} → public/figma/icons/`);
