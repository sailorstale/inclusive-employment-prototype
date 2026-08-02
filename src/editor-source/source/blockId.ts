import { autoId } from "@/editor-source/ids";
import type { SourceBlock } from "@/editor-source/content/source.generated";

/*
  Стабильный адрес блока источника. Чистый модуль без React — им пользуется и
  приложение (через blockResolve), и оффлайн-утилита разметки (tools/directives),
  которая считает те же id вне браузера. Одна реализация на оба берега: разъедься
  они — директивы перестали бы находить свои блоки.
*/

// Тип блока в адресе (id): как в Editable — цитата адресуется как paragraph.
export function blockType(b: SourceBlock): string {
  return b.kind === "heading" ? `h${b.level}` : "paragraph";
}

/*
  Для текстовых блоков адрес совпадает с адресом редактора (autoId), для
  списков/таблиц/картинок — контент-хэш их данных.
*/
export function blockRefId(
  b: SourceBlock,
  pathname: string,
  anchor?: string,
): string {
  switch (b.kind) {
    case "heading":
      return autoId(pathname, `h${b.level}`, b.text, anchor);
    case "paragraph":
    case "quote":
      return autoId(pathname, "paragraph", b.text, anchor);
    case "list":
      return autoId(pathname, "list", b.items.map((i) => i.text).join(" ¶ "), anchor);
    case "table":
      return autoId(pathname, "table", [...b.header, ...b.rows.flat()].join(" | "), anchor);
    case "image":
      return autoId(pathname, "image", b.src, anchor);
  }
}

/** Разбивка модуля на секции по h2 — та же, что на странице «Редактура источника». */
export type BlockSection = { anchor?: string; blocks: SourceBlock[] };
export function toSections(blocks: SourceBlock[]): BlockSection[] {
  const sections: BlockSection[] = [];
  let cur: BlockSection = { blocks: [] };
  for (const b of blocks) {
    if (b.kind === "heading" && b.level === 2) {
      if (cur.blocks.length) sections.push(cur);
      cur = { anchor: b.anchor, blocks: [b] };
    } else {
      cur.blocks.push(b);
    }
  }
  if (cur.blocks.length) sections.push(cur);
  return sections;
}
