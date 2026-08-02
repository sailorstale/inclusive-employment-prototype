import { build } from "esbuild";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { promises as fs } from "node:fs";
import os from "node:os";

/*
  Общая часть утилиты разметки: загрузка модуля источника ВНЕ браузера, с теми же
  id блоков, что считает приложение.

  Почему через esbuild, а не своим парсером: адрес блока (хэш текста + якорь
  раздела) и лечение «заголовок стал списком» — это код приложения. Перепиши мы
  его здесь, при первой же правке две реализации разъедутся, и директивы начнут
  промахиваться мимо блоков молча. Поэтому берём настоящие модули, собираем их
  во временный файл и импортируем.
*/

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const SRC = path.join(ROOT, "src");

/** Собирает чистые (без React) модули приложения и отдаёт их как обычный импорт. */
async function loadAppModules() {
  const entry = `
    export { normalizeSourceBlocks } from "@/editor-source/source/normalizeBlocks";
    export { blockRefId, toSections } from "@/editor-source/source/blockId";
    export { sourceModulesMeta, moduleLoaders } from "@/editor-source/content/source.generated";
  `;
  const out = path.join(
    await fs.mkdtemp(path.join(os.tmpdir(), "directives-")),
    "app.mjs",
  );
  await build({
    stdin: { contents: entry, resolveDir: ROOT, loader: "ts" },
    bundle: true,
    format: "esm",
    platform: "node",
    outfile: out,
    logLevel: "silent",
    alias: { "@": SRC },
  });
  return import(pathToFileURL(out).href);
}

let appPromise;
const app = () => (appPromise ??= loadAppModules());

/**
 * Плоский список блоков модуля — ровно в том виде, в каком их видит страница
 * «Редактура источника»: после лечения генерации и разбивки на секции.
 */
export async function loadModule(moduleId) {
  const { normalizeSourceBlocks, toSections, moduleLoaders } = await app();
  const loader = moduleLoaders[moduleId];
  if (!loader) throw new Error(`Нет такого модуля: ${moduleId}`);
  const mod = await loader();
  const sections = toSections(normalizeSourceBlocks(mod.blocks));
  const pathname = `/source/${moduleId}`;
  const { blockRefId } = await app();

  const flat = [];
  sections.forEach((sec, si) =>
    sec.blocks.forEach((b, bi) => {
      flat.push({
        n: flat.length,
        si,
        bi,
        anchor: sec.anchor,
        kind: b.kind,
        id: blockRefId(b, pathname, sec.anchor),
        text: previewOf(b),
        block: b,
      });
    }),
  );
  return { moduleId, pathname, sections, flat };
}

export async function listModules() {
  const { sourceModulesMeta } = await app();
  return sourceModulesMeta;
}

/** «15-18», [15,16], 15 или «15» → массив номеров блоков. */
export function parseRange(v) {
  if (Array.isArray(v)) return v.map(Number);
  if (typeof v === "number") return [v];
  const s = String(v).trim();
  if (/^\d+$/.test(s)) return [Number(s)];
  const m = s.match(/^(\d+)\s*-\s*(\d+)$/);
  if (!m) throw new Error(`Не понял блоки: ${v}`);
  const [a, b] = [Number(m[1]), Number(m[2])];
  return Array.from({ length: b - a + 1 }, (_, i) => a + i);
}

/** Короткая подпись блока для карты и для поля snippet директивы. */
export function previewOf(b) {
  switch (b.kind) {
    case "heading":
      return `H${b.level} ${b.md}`;
    case "paragraph":
    case "quote":
      return b.md;
    case "list":
      return `список: ${b.items.map((i) => i.text).join(" · ")}`;
    case "table":
      return `таблица ${b.rows.length}×${b.header.length}: ${[...b.header].join(" | ")}`;
    case "image":
      return `картинка ${b.alt || b.src}`;
    default:
      return "";
  }
}

/** Тот же снипет, что кладёт в директиву приложение (обрезка на 90 знаков). */
export function snippetOf(b) {
  const s =
    b.kind === "list"
      ? `${b.items.length} пунктов`
      : b.kind === "table"
        ? `таблица · ${b.rows.length} строк`
        : b.kind === "image"
          ? `картинка${b.alt ? ` · ${b.alt}` : ""}`
          : b.md;
  return s.length > 90 ? s.slice(0, 90) + "…" : s;
}
