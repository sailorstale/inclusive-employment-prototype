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
/*
  Резолвер правок для ПРОИЗВОЛЬНОГО адреса. Нужен отдельно от хука: выгрузка
  «все модули» собирает страницы, на которых мы сейчас не находимся, а правки
  адресуются по pathname — с текущим адресом чужие правки не нашлись бы.
*/
export function makeMdResolver(
  edits: Record<string, { text: string; status: string }>,
  pathname: string,
): ResolveMd {
  return (type, text, md, anchor) => {
    const rec = edits[autoId(pathname, type, text, anchor)];
    if (rec && rec.text.trim() && rec.status !== "rollback") return rec.text;
    return md;
  };
}

export function useMdResolver(pathnameOverride?: string): ResolveMd {
  const { edits } = useEditor();
  const loc = useLocation();
  // Встроенный редактор модуля (внутри инспектора сайта) живёт на чужом адресе,
  // но id правок считаются от pathname — берём канонический /source/<модуль>,
  // чтобы правки совпадали с настоящим маршрутом /source.
  const pathname = pathnameOverride ?? loc.pathname;
  return React.useCallback(makeMdResolver(edits, pathname), [edits, pathname]);
}

/** Подпись типа блока — общая для плейграунда и панели «Разметка». */
export const KIND_LABEL: Record<SourceBlock["kind"], string> = {
  heading: "Заголовок",
  paragraph: "Абзац",
  quote: "Цитата",
  list: "Список",
  table: "Таблица",
  image: "Картинка",
};

/*
  Адреса блоков живут в blockId.ts — чистом модуле без React, чтобы те же id
  считала и оффлайн-утилита разметки. Здесь только пере-экспорт: для страницы
  «Редактура источника» это по-прежнему один вход.
*/
export { blockType, blockRefId } from "./blockId";

/** Полный текст блока (с учётом правок) — для подбора иконки по смыслу. */
export function iconTextOf(
  b: SourceBlock,
  anchor: string | undefined,
  resolve: ResolveMd,
): string {
  switch (b.kind) {
    case "heading":
      return resolve(`h${b.level}`, b.text, b.text, anchor);
    case "paragraph":
    case "quote":
      return resolve("paragraph", b.text, b.text, anchor);
    case "list":
      return b.items.map((i) => i.text).join(" ");
    case "table":
      return [...b.header, ...b.rows.flat()].join(" ");
    case "image":
      return b.alt || "";
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
