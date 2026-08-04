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

export type TocEntry = { label: string; anchor: string; level: 2 | 3 };

/*
  Оглавление «На этой странице» — секции (H2) и их подзаголовки (H3), по порядку.
  H3 берём рекурсивно из узлов Heading (не из вопросов аккордеона и не из
  заголовков карточек — там своё поле). Якорь H3 уже стоит на самом заголовке
  (см. ResultView), по нему и прокрутка, и подсветка.
*/
export function pageToc(chosen: SectionNode[]): TocEntry[] {
  const out: TocEntry[] = [];
  const walkH3 = (nodes: (Node | SectionNode)[]) => {
    for (const n of nodes) {
      const node = n as Node;
      if (node.component === "Heading" && node.level === "H3" && node.anchor)
        out.push({ label: stripDecourse(node.text), anchor: node.anchor, level: 3 });
      const kids = (n as { children?: (Node | SectionNode)[] }).children;
      if (kids) walkH3(kids);
    }
  };
  for (const sec of chosen) {
    const h2 = sectionTitle(sec);
    if (h2 && sec.anchor) out.push({ label: h2, anchor: sec.anchor, level: 2 });
    walkH3(sec.children);
  }
  return out;
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

/*
  ВСТУПЛЕНИЕ СТРАНИЦЫ — секция источника, поставленная СРАЗУ ПОД списком «вы
  узнаете», со своим заголовком («Введение»).

  В темы и в оглавление вступление не идёт: pageToc и pageTopics считают только
  выбранные секции, а вступление приходит отдельным аргументом.
*/
/** Полный список узлов страницы: обвязка + секции, в порядке показа. */
export function pageChildren(
  chosen: SectionNode[],
  slug: string,
  intro?: SectionNode,
): (SectionNode | Node)[] {
  return [
    pageSummaryNode(chosen),
    ...(intro ? [intro] : []),
    ...chosen,
    { component: "Feedback" },
    readMoreNode(slug),
  ];
}
