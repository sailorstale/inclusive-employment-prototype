import * as React from "react";
import { useLocation } from "react-router-dom";
import { autoId } from "@/editor-source/ids";
import { useEditor } from "@/editor-source/EditorProvider";
import type { SourceBlock } from "@/editor-source/content/source.generated";

/*
  Резолвер редакции и стабильные id блоков — общие для плейграунда, панели
  «Разметка» и сборки директив. Вынесено из компонентного файла, чтобы не мешать
  fast-refresh и переиспользовать в SourcePage.
*/

export type ResolveMd = (
  type: string,
  text: string,
  md: string,
  anchor?: string,
) => string;

/*
  Возвращает АКТУАЛЬНЫЙ текст блока — с внесённой правкой, если она есть (и не
  откат), иначе оригинал. Повторяет подстановку Editable из первой колонки:
  плейграунд показывает ту же редакцию, а не сырой исходник. id считается так же:
  autoId(страница, тип, текст, раздел).
*/
export function useMdResolver(): ResolveMd {
  const { edits } = useEditor();
  const { pathname } = useLocation();
  return React.useCallback(
    (type, text, md, anchor) => {
      const rec = edits[autoId(pathname, type, text, anchor)];
      if (rec && rec.text.trim() && rec.status !== "rollback") return rec.text;
      return md;
    },
    [edits, pathname],
  );
}

// Тип блока в адресе (id): как в Editable — цитата адресуется как paragraph.
export function blockType(b: SourceBlock): string {
  return b.kind === "heading" ? `h${b.level}` : "paragraph";
}

/*
  Стабильный id блока для директив — на него ссылается директива, чтобы «Применить»
  находило блок по содержимому, а не по позиции. Для текстовых блоков совпадает с
  адресом редактора (autoId), для списков/таблиц/картинок — контент-хэш их данных.
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

/** Короткий текст блока для подписи в директиве (с учётом правок). */
export function blockSnippet(
  b: SourceBlock,
  resolve: ResolveMd,
  anchor?: string,
): string {
  let s: string;
  switch (b.kind) {
    case "heading":
      s = resolve(`h${b.level}`, b.text, b.md, anchor);
      break;
    case "paragraph":
    case "quote":
      s = resolve("paragraph", b.text, b.md, anchor);
      break;
    case "list":
      s = `${b.items.length} пунктов`;
      break;
    case "table":
      s = `таблица · ${b.rows.length} строк`;
      break;
    case "image":
      s = `картинка${b.alt ? ` · ${b.alt}` : ""}`;
      break;
  }
  return s.length > 90 ? s.slice(0, 90) + "…" : s;
}
