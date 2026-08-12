/*
  СБОРКА СПРАВОЧНИКА ФОРМАТА: markdown → модуль с блоками.

  Читает src/docs/json-bible.md и пишет src/editor-source/bible/bible.generated.ts.
  Тем же приёмом собран источник страниц (tools/source-export/parse.mjs): текст
  правится в markdown, а в приложение уезжает готовая структура.

  Почему не разбирать markdown прямо в браузере: адрес блока считается из его
  текста, и считать его надо ОДИНАКОВО в приложении и в проверках. Один разбор
  на сборке — один набор адресов. Заодно читатель не платит за разбор 80 КБ
  текста при каждом открытии страницы.

  Запуск: npm run bible (из папки prototype).
*/
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(HERE, "../../src/docs/json-bible.md");
const OUT = path.join(HERE, "../../src/editor-source/bible/bible.generated.ts");

/* ─── Адрес блока ────────────────────────────────────────────────────────── */

/*
  Хэш и нормализация — копия ids.ts. Копия намеренная: скрипт запускается
  обычным node, а ids.ts живёт в приложении и написан для сборщика. Разъедутся
  реализации — разъедутся и адреса, поэтому обе строки держим одинаковыми.
*/
const normalizeText = (s) => s.replace(/\s+/g, " ").trim();

function hashStr(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

/*
  Якорь раздела в адресе — чтобы правка одного абзаца не сдвигала адреса всех
  остальных: комментарий держится за блок, пока не изменили сам блок.
*/
const blockId = (anchor, kind, text) =>
  `bible::${anchor || "-"}::${kind}::${hashStr(normalizeText(text))}`;

/* ─── Якорь заголовка ────────────────────────────────────────────────────── */

const TRANS = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

function slug(text) {
  const clean = text.replace(/`/g, "").toLowerCase();
  let out = "";
  for (const ch of clean) out += TRANS[ch] ?? ch;
  return out.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

/* ─── Разбор ─────────────────────────────────────────────────────────────── */

/** Текст блока без разметки — из него считается адрес и снимок для панели. */
function plain(md) {
  return md
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/^>\s*/gm, "");
}

const splitRow = (line) =>
  line.replace(/^\||\|$/g, "").split(/(?<!\\)\|/).map((c) => c.trim());

function parse(md) {
  const lines = md.split("\n");
  const blocks = [];
  const toc = [];
  /** Сколько раз встретился такой же адрес: два одинаковых блока в разделе. */
  const seen = new Map();
  let anchor = "";
  let i = 0;

  const push = (kind, text, extra) => {
    const base = blockId(anchor, kind, text);
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    blocks.push({ id: n ? `${base}~${n}` : base, kind, ...extra });
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim() || "text";
      const body = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith("```")) body.push(lines[i++]);
      i += 1;
      const code = body.join("\n");
      push("code", code, { lang, body: code, text: code });
      continue;
    }

    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1].length;
      const text = h[2];
      i += 1;
      // Заголовок документа и строка версии живут в шапке страницы.
      if (level === 1) {
        while (i < lines.length && (!lines[i].trim() || /^Версия/.test(lines[i]))) i += 1;
        continue;
      }
      if (level === 2 || level === 3) anchor = slug(text);
      const own = slug(text);
      if (level <= 3) toc.push({ level, anchor: own, text: plain(text) });
      push("heading", text, { level, md: text, text: plain(text), anchor: own });
      continue;
    }

    if (line.startsWith("|") && lines[i + 1] && /^\|[\s:|-]+\|$/.test(lines[i + 1])) {
      const header = splitRow(line);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].startsWith("|")) rows.push(splitRow(lines[i++]));
      const flat = [...header, ...rows.flat()].map(plain).join(" | ");
      push("table", flat, { header, rows, text: flat });
      continue;
    }

    if (line.startsWith("> ")) {
      const body = [];
      while (i < lines.length && lines[i].startsWith("> ")) body.push(lines[i++].slice(2));
      const text = body.join(" ");
      push("quote", text, { md: text, text: plain(text) });
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i]))
        items.push(lines[i++].replace(/^[-*]\s+/, ""));
      const flat = items.map(plain).join(" ¶ ");
      push("list", flat, { items, text: flat });
      continue;
    }

    // Разделитель разделов рисует сама страница, отдельным блоком он не нужен.
    if (line.trim() === "---" || !line.trim()) {
      i += 1;
      continue;
    }

    const para = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,4}\s|\||>\s|[-*]\s|```|---$)/.test(lines[i])
    )
      para.push(lines[i++]);
    const text = para.join(" ");
    push("para", text, { md: text, text: plain(text) });
  }

  return { blocks, toc };
}

/* ─── Запись модуля ──────────────────────────────────────────────────────── */

const HEAD = `/*
  СОБРАНО СКРИПТОМ — руками не править.

  Источник: src/docs/json-bible.md. Пересобрать: npm run bible.
  Правка этого файла молча разойдётся с исходником, а адреса блоков — с теми,
  на которых висят комментарии разработчика.
*/

/** Уровень заголовка внутри документа. */
export type BibleHeadingLevel = 2 | 3 | 4;

/*
  Блок документа. Поле id — адрес, по которому к блоку привязан комментарий:
  «bible::якорь-раздела::вид::хэш-текста». Пока текст блока не изменили, адрес
  держится (см. ids.ts, тот же приём на страницах сайта).

  Поле md несёт разметку для показа (жирный, ссылки, код в строке), text — тот
  же кусок без разметки: из него считается адрес и снимок для панели замечаний.
*/
export type BibleBlock =
  | {
      kind: "heading";
      id: string;
      level: BibleHeadingLevel;
      md: string;
      text: string;
      /** Якорь для оглавления и ссылки на раздел. */
      anchor: string;
    }
  | { kind: "para"; id: string; md: string; text: string }
  | { kind: "quote"; id: string; md: string; text: string }
  | { kind: "list"; id: string; items: string[]; text: string }
  | { kind: "table"; id: string; header: string[]; rows: string[][]; text: string }
  | { kind: "code"; id: string; lang: string; body: string; text: string };

/** Пункт оглавления: разделы (2) и компоненты внутри них (3). */
export type BibleTocItem = { level: number; anchor: string; text: string };
`;

const { blocks, toc } = parse(readFileSync(SRC, "utf8"));

mkdirSync(path.dirname(OUT), { recursive: true });
writeFileSync(
  OUT,
  `${HEAD}
export const bibleBlocks: BibleBlock[] = ${JSON.stringify(blocks, null, 2)};

export const bibleToc: BibleTocItem[] = ${JSON.stringify(toc, null, 2)};
`,
);

const byKind = blocks.reduce((a, b) => ({ ...a, [b.kind]: (a[b.kind] ?? 0) + 1 }), {});
console.log(
  `Справочник собран: ${blocks.length} блоков (${Object.entries(byKind)
    .map(([k, n]) => `${k} ${n}`)
    .join(", ")}), ${toc.length} пунктов оглавления.`,
);
