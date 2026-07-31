import type { SourceBlock } from "@/editor-source/content/source.generated";

/*
  ЛЕЧЕНИЕ ГЕНЕРАЦИИ: заголовок, ставший списком.

  Генератор (Google-док → .generated.ts) иногда превращает нумерованный
  ЗАГОЛОВОК в список из ОДНОГО пункта, не срезая markdown-маркер. На экране это
  «1. # Определите цель…»: «1.» от списка, «#» — протёкший маркер, и у всех
  «1.», потому что каждый — свой список из одного пункта (счётчик обнуляется).

  Генератора у нас нет (файлы приходят извне), поэтому чиним при загрузке блоков:
  такой пункт превращаем обратно в заголовок. Уровень — по числу «#», номер шага
  восстанавливаем по порядку внутри раздела (см. ниже). Правит разом вид
  источника, «Результат» и выгрузку и переживает перегенерацию.
*/

// «# Заголовок» — пункт, который на самом деле заголовок.
const HEAD_ITEM = /^\s*(#{1,6})\s+(.*\S)\s*$/;
// Ведущий номер, если вдруг уже есть, — снимаем, свой добавим сами.
const LEAD_NUM = /^\s*\d+[.)]\s+/;

// #×1 → h3 (шаг под секцией h2), глубже → h4. Уровень блока-заголовка: 2|3|4.
const LEVEL: Record<number, 2 | 3 | 4> = { 1: 3, 2: 4, 3: 4, 4: 4, 5: 4, 6: 4 };

const TR: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};
const slugify = (s: string) =>
  [...s.toLowerCase()]
    .map((c) => TR[c] ?? c)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "heading";

type Hit = { i: number; hashes: number; text: string; ordered: boolean; section: number };

/** Заголовки-ставшие-списком чиним обратно в заголовки. */
export function normalizeSourceBlocks(blocks: SourceBlock[]): SourceBlock[] {
  const hits: Hit[] = [];
  let section = 0;
  blocks.forEach((b, i) => {
    if (b.kind === "heading" && b.level === 2) section += 1;
    if (b.kind === "list" && b.items.length === 1) {
      const m = HEAD_ITEM.exec(b.items[0].text.trim());
      if (m)
        hits.push({
          i,
          hashes: m[1].length,
          text: m[2].replace(LEAD_NUM, "").trim(),
          ordered: b.ordered,
          section,
        });
    }
  });
  if (!hits.length) return blocks;

  /*
    НУМЕРАЦИЯ. Номер ставим, только если на одном уровне в одном разделе таких
    заголовков НЕСКОЛЬКО — это и есть нумерованные шаги (в источнике «## 1. …»,
    «## 2. …»). Одиночный заголовок (например «Подумайте…», ### без номера)
    номера не получает. Так выходит 1–6 у шагов и без номера у подзаголовка —
    ровно как в источнике истины.
  */
  const groupCount = new Map<string, number>();
  for (const h of hits)
    if (h.ordered) {
      const k = `${h.section}|${h.hashes}`;
      groupCount.set(k, (groupCount.get(k) ?? 0) + 1);
    }
  const seq = new Map<string, number>();
  const numberOf = (h: Hit): number | null => {
    if (!h.ordered) return null;
    const k = `${h.section}|${h.hashes}`;
    if ((groupCount.get(k) ?? 0) < 2) return null;
    const n = (seq.get(k) ?? 0) + 1;
    seq.set(k, n);
    return n;
  };

  const byIndex = new Map(hits.map((h) => [h.i, h]));
  return blocks.map((b, i): SourceBlock => {
    const h = byIndex.get(i);
    if (!h) return b;
    const n = numberOf(h);
    const text = n ? `${n}. ${h.text}` : h.text;
    return { kind: "heading", level: LEVEL[h.hashes] ?? 3, md: text, text, anchor: slugify(h.text) };
  });
}
