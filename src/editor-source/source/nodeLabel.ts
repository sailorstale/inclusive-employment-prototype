import type { Doc, Node, SectionNode } from "./contentTree";

/*
  Подпись компонента для списков (пины, переходы): имя того, что видно на
  экране. Берём первый значащий текст — так строка в списке узнаётся глазами,
  а не выглядит как «Card Container».
*/

/** Узел дерева по пути «0.2.1» — тот же путь, что в data-json-path. */
export function nodeAtPath(doc: Doc, path: string): Node | SectionNode | null {
  const parts = path.split(".").map(Number);
  let cur: unknown = doc.children[parts[0]];
  for (let i = 1; i < parts.length; i++)
    cur = (cur as { children?: unknown[] })?.children?.[parts[i]];
  return (cur as Node) ?? null;
}

/** Первый значащий текст узла (с заходом внутрь контейнеров). */
export function nodeLabel(n: unknown): string {
  const o = n as Record<string, unknown> | null;
  if (!o) return "";
  for (const k of ["text", "question", "title", "author", "caption"])
    if (typeof o[k] === "string" && (o[k] as string).trim())
      return (o[k] as string).trim();
  if (Array.isArray(o.header) && o.header.length)
    return (o.header as string[]).join(" · ");
  if (Array.isArray(o.children))
    for (const c of o.children as unknown[]) {
      const t = nodeLabel(c);
      if (t) return t;
    }
  return "";
}

/** Подпись компонента по его пути в документе. */
export const nodeLabelOf = (doc: Doc, path: string): string =>
  nodeLabel(nodeAtPath(doc, path)).slice(0, 120);
