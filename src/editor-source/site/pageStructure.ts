import type { Node, SectionNode } from "@/editor-source/source/contentTree";
import { stripDecourse } from "./decourse";
import { relatedFor } from "./relatedPages";
import { recapFor, type Recap } from "./recap";

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

/*
  Якорь секции итогов. В источнике их двадцать одна, и нумерация сквозная по
  всему курсу («podvedem-itogi-3», «podvedem-itog-2»), поэтому сверяем по началу
  строки — иначе итог попадал в темы «вы узнаете» на одиннадцати страницах.
*/
const isRecapAnchor = (anchor?: string) =>
  Boolean(anchor && /^podvedem-itog/.test(anchor));

/** Темы страницы (заголовки секций, кроме итогов) — для «вы узнаете». */
export function pageTopics(chosen: SectionNode[]): string[] {
  return chosen
    .filter((s) => !isRecapAnchor(s.anchor))
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
export function pageToc(chosen: SectionNode[], slug?: string): TocEntry[] {
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
  for (const sec of withRecap(chosen, slug)) {
    const h2 = sectionTitle(sec);
    if (h2 && sec.anchor) out.push({ label: h2, anchor: sec.anchor, level: 2 });
    walkH3(sec.children);
  }
  return out;
}

/*
  ИТОГ СТРАНИЦЫ. Секцию «Подведём итоги» из источника со страницы снимаем и
  ставим на её место свою — короткую и одинаковую по форме на всех страницах
  (текст и объяснение почему — в recap.ts). Итог всегда последний раздел
  страницы, перед формой мнения.

  Хвост секции. В шести местах внутри итога живёт «Практическое задание», а в
  «Команде и коммуникации» — пять правил общения с видео. К итогу это отношения
  не имеет и пропасть не должно: всё от первого H3 остаётся отдельным разделом.
  По умолчанию этот H3 становится заголовком раздела; если у раздела должно быть
  своё название (правила общения), оно задаётся полем tail в recap.ts.
*/
const RECAP_ANCHOR = "podvedem-itogi";

function recapSection(recap: Recap): SectionNode {
  return {
    component: "Section Container",
    anchor: RECAP_ANCHOR,
    children: [
      { component: "Heading", level: "H2", text: "Подведём итоги", anchor: RECAP_ANCHOR },
      { component: "Text", size: "L", text: recap.lead },
      {
        component: "Stack",
        ordered: false,
        children: recap.points.map(
          (text): Node => ({ component: "List Item", size: "L", type: "Dot", text }),
        ),
      },
    ],
  };
}

/** Раздел из хвоста секции итогов (задание, правила) — или null, если хвоста нет. */
function tailSection(sec: SectionNode, tail?: Recap["tail"]): SectionNode | null {
  /*
    Где начинается хвост. Обычно это подзаголовок H3 («Практическое задание…»).
    Но разметка могла превратить его во что-то другое: пять правил общения в
    «Команде» собраны в карточки, и заголовка среди узлов уже нет. Тогда начало
    хвоста задаётся полем from — искать «первый не-текст» нельзя, в самой сводке
    попадаются списки.
  */
  const from = tail?.from;
  const i = sec.children.findIndex((n) =>
    from
      ? n.component === from
      : n.component === "Heading" && n.level === "H3",
  );
  if (i < 0) return null;
  if (tail)
    return {
      ...sec,
      anchor: tail.anchor,
      children: [
        { component: "Heading", level: "H2", text: tail.title, anchor: tail.anchor },
        ...sec.children.slice(i),
      ],
    };
  const head = sec.children[i] as Extract<Node, { component: "Heading" }>;
  return {
    ...sec,
    anchor: head.anchor,
    children: [{ ...head, level: "H2" }, ...sec.children.slice(i + 1)],
  };
}

/*
  Секции страницы с нашим итогом вместо курсового. Без записи в recap.ts (входы
  треков, «Правовые основы», «Особые ситуации») секции остаются как есть.

  Адрес необязателен: оглавление зовут и из соседней сессии, где адрес пока не
  передают. Без адреса просто нечего подставлять.
*/
export function withRecap(chosen: SectionNode[], slug?: string): SectionNode[] {
  const recap = slug ? recapFor(slug) : undefined;
  if (!recap) return chosen;
  const kept = chosen.flatMap((sec) => {
    if (!isRecapAnchor(sec.anchor)) return [sec];
    const tail = tailSection(sec, recap.tail);
    return tail ? [tail] : [];
  });
  return [...kept, recapSection(recap)];
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
  ВСТУПЛЕНИЕ СТРАНИЦЫ — секция источника, которая открывает страницу лидом: в
  самом начале, ДО списка «вы узнаете».

  Заголовка у лида нет: собственный заголовок секции («Введение») снимаем —
  читатель уже прочёл название страницы в шапке, и слово «Введение» между ними
  ничего не добавляет. Абзацы выкладываем прямо на страницу, без обёртки-секции:
  раздела здесь нет, есть вступительный текст.

  Первый абзац крупный (Text XL — в наборе компонентов это и есть лид),
  остальные обычные. Иначе вступление из четырёх абзацев заняло бы крупным
  кеглем весь первый экран.

  В темы и в оглавление вступление не идёт: pageToc и pageTopics считают только
  выбранные секции, а вступление приходит отдельным аргументом.
*/
function introNodes(intro?: SectionNode): Node[] {
  if (!intro) return [];
  const body = intro.children as Node[];
  // Снимаем ТОЛЬКО открывающий заголовок секции: подзаголовки внутри (если
  // они там есть) — часть текста, и терять их нельзя.
  const rest = body[0]?.component === "Heading" ? body.slice(1) : body;
  return rest.map((n, i) =>
    i === 0 && n.component === "Text" ? { ...n, size: "XL" } : n,
  );
}

/** Полный список узлов страницы: обвязка + секции, в порядке показа. */
export function pageChildren(
  chosen: SectionNode[],
  slug: string,
  intro?: SectionNode,
): (SectionNode | Node)[] {
  const sections = withRecap(chosen, slug);
  return [
    ...introNodes(intro),
    pageSummaryNode(sections),
    ...sections,
    { component: "Feedback" },
    readMoreNode(slug),
  ];
}
