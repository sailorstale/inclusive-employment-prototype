import type { Node, SectionNode } from "@/editor-source/source/contentTree";
import { stripDecourse } from "./decourse";
import { relatedFor } from "./relatedPages";

/*
  СТРУКТУРА СТРАНИЦЫ САЙТА — общая для рендера и экспорта.

  Страница = обвязка + контент, ОДНИМ деревом узлов (никаких «модулей» — это
  сайт, не курс): «вы узнаете» (Page Summary) → секции контента → форма мнения
  (Feedback) → «Читайте также» (Read More). И сайт, и JSON, и выгрузка строятся
  из этого одного списка — поэтому совпадают до узла.
*/

/** Заголовок секции (H2) без меток раскурсовки — для списка «вы узнаете». */
export function sectionTitle(sec: SectionNode): string | null {
  const h = sec.children.find(
    (n): n is Extract<Node, { component: "Heading" }> =>
      (n as Node).component === "Heading",
  );
  return h ? stripDecourse(h.text) : null;
}

/** Темы страницы (заголовки секций, кроме итогов) — для «вы узнаете». */
export function pageTopics(chosen: SectionNode[]): string[] {
  return chosen
    .filter((s) => s.anchor !== "podvedem-itogi")
    .map(sectionTitle)
    .filter((t): t is string => Boolean(t));
}

function pageSummaryNode(chosen: SectionNode[]): Node {
  return {
    component: "Page Summary",
    children: pageTopics(chosen).map(
      (t): Node => ({ component: "List Item", size: "L", type: "Dot", text: t }),
    ),
  };
}

function readMoreNode(slug: string): Node {
  return {
    component: "Read More",
    title: "Читайте также",
    children: relatedFor(slug).map(
      (r): Node => ({
        component: "Read More Item",
        title: r.title,
        description: r.description,
        href: r.href,
      }),
    ),
  };
}

/** Полный список узлов страницы: обвязка + секции, в порядке показа. */
export function pageChildren(
  chosen: SectionNode[],
  slug: string,
): (SectionNode | Node)[] {
  return [
    pageSummaryNode(chosen),
    ...chosen,
    { component: "Feedback" },
    readMoreNode(slug),
  ];
}
