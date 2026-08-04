import type {
  Doc,
  HeadingLevel,
  Node,
  SectionNode,
} from "@/editor-source/source/contentTree";
import type { OsnovyPage } from "./pageMap";
import { quizSection } from "./quizzes";
import { recutQuestions } from "./questionGroups";
import { liftHeadingLinks } from "./headingLinks";

/*
  ПЕРЕКРОЙКА СТРАНИЦЫ — раздел определяет карта страницы, а не уровень в источнике.

  Источник режется на секции по заголовкам второго уровня (toSections), и для
  адресов блоков это правильно: по ним живут правки и разметка, менять нельзя.
  Но для САЙТА такое деление врёт. В курсе вторым уровнем оформлены и настоящие
  темы, и врезки с цитатами («Что говорит бизнес»), а настоящие темы шага часто
  лежат третьим уровнем внутри одной большой секции-главы.

  Итог на Шаге 3 был такой: страница считала, что состоит из семи разделов, шесть
  из которых называются «Что говорит бизнес» и «Что говорят люди с
  инвалидностью», а четыре темы шага в навигацию не попадали вовсе.

  Уровнями это не лечится (см. ДИРЕКТИВЫ.md, проход 28): заголовок секции идёт в
  оглавление независимо от уровня, а опущенный до H3 появляется в нём дважды.
  Поэтому решает карта страницы — она называет разделом ЛЮБОЙ заголовок, а лишние
  разжалует. Гугдок остаётся источником формулировок, структура — наша.

  РОЛЬ ЗАГОЛОВКА внутри страницы:
    • sections — раздел: рисуется H2, идёт в «вы узнаете» и в оглавление;
    • inline — врезка: заголовок остаётся на месте, но из навигации уходит (H4).
      Сюда идут голоса, примеры и кейсы: по ним нельзя понять, о чём часть
      страницы, и они почти всегда продолжают предыдущую мысль;
    • остальные — подзаголовки: уровень пересчитывается от своего раздела, чтобы
      после повышения темы её части не провалились ниже навигации.

  Всё, что стоит ДО первого раздела, становится вступлением страницы, а его
  собственный заголовок снимается: он повторял название страницы (оно уже стоит
  в шапке и в меню слева).
*/
export type PageOutline = {
  /** Якоря заголовков любого уровня, которые становятся разделами страницы. */
  sections: string[];
  /** Якоря заголовков-врезок: остаются в тексте, из навигации уходят. */
  inline?: string[];
  /*
    Якоря заголовков, которые со страницы снимаются совсем. Текст под ними
    остаётся и продолжает свой раздел — уходит только сам заголовок. Нужно там,
    где курс подводил промежуточный итог посреди главы: на странице итог уже
    один, общий и в конце (см. recap.ts), и второй сбивает с толку.
  */
  drop?: string[];
};

const LEVEL: Record<HeadingLevel, number> = { H2: 2, H3: 3, H4: 4, H5: 5 };

/* Подзаголовок не может подняться до раздела (H2) и не бывает мельче H5. */
const levelByNumber = (n: number): HeadingLevel =>
  n <= 3 ? "H3" : n >= 5 ? "H5" : "H4";

type HeadingNode = Extract<Node, { component: "Heading" }>;

const isHeading = (n: Node): n is HeadingNode => n.component === "Heading";

/*
  Уровень подзаголовка внутри раздела.

  Считаем от уровня заголовка, открывшего раздел: тема шага была H3, поднялась в
  разделы — значит её части (H4) должны подняться до H3, иначе они провалятся
  ниже навигации.

  Обратный случай: раздел источника, который разделом быть перестал (в карте его
  нет). Он опускается до подзаголовка, и вместе с ним обязаны опуститься его
  собственные дети — иначе ребёнок встаёт вровень с родителем, ровно та поломка,
  из-за которой всё и затевалось. Для этого держим стопку «кого насколько
  опустили»: заголовок глубже наследует сдвиг ближайшего предка сверху.
*/
function makeDemoter(base: number) {
  const stack: { level: number; extra: number }[] = [];
  return (level: number): HeadingLevel => {
    while (stack.length && stack[stack.length - 1].level >= level) stack.pop();
    const inherited = stack.length ? stack[stack.length - 1].extra : 0;
    const natural = 2 + (level - base) + inherited;
    const final = levelByNumber(natural);
    stack.push({ level, extra: LEVEL[final] - (2 + (level - base)) });
    return final;
  };
}

/** Секции источника → разделы страницы по её перекройке. */
export function recutSections(
  picked: SectionNode[],
  outline: PageOutline,
): { intro: Node[]; sections: SectionNode[] } {
  const wanted = new Set(outline.sections);
  const inline = new Set(outline.inline ?? []);
  const dropped = new Set(outline.drop ?? []);
  const intro: Node[] = [];
  const sections: SectionNode[] = [];
  let cur: SectionNode | null = null;
  let demote = makeDemoter(2);

  for (const node of picked.flatMap((s) => s.children)) {
    if (isHeading(node) && node.anchor && wanted.has(node.anchor)) {
      demote = makeDemoter(LEVEL[node.level]);
      cur = {
        component: "Section Container",
        anchor: node.anchor,
        at: node.at,
        children: [{ ...node, level: "H2" }],
      };
      sections.push(cur);
      continue;
    }
    // Заголовок вступления снимаем — он повторяет название страницы.
    if (isHeading(node) && !cur) continue;
    // Заголовок, снятый по карте: текст под ним остаётся в своём разделе.
    if (isHeading(node) && node.anchor && dropped.has(node.anchor)) continue;

    const next: Node = !isHeading(node)
      ? node
      : node.anchor && inline.has(node.anchor)
        ? // Врезка вложенности не задаёт: она комментирует раздел, а не делит его.
          { ...node, level: "H4" }
        : { ...node, level: demote(LEVEL[node.level]) };
    if (cur) cur.children.push(next);
    else intro.push(next);
  }
  return { intro, sections };
}

/*
  Разделы страницы и её вступление — общий вход для сайта и для выгрузки, чтобы
  они не разъехались (одна страница — одно дерево).
*/
export function pageParts(
  doc: Doc,
  page: OsnovyPage,
): { intro?: SectionNode; chosen: SectionNode[] } {
  const byAnchor = new Map(
    doc.children
      .filter(
        (n): n is SectionNode =>
          (n as SectionNode).component === "Section Container",
      )
      .map((n) => [n.anchor ?? "", n]),
  );
  const picked = page.sections
    .map((a) => byAnchor.get(a))
    .filter((s): s is SectionNode => Boolean(s));

  /*
    Квизы приходят не из карты секций: в источнике они лежат кучей в конце
    модуля, а на странице встают последним разделом — после материала, но перед
    итогом (его добавляет pageStructure). Кому какой квиз — в quizzes.ts.
  */
  const quizzes = quizSection(doc, page.slug);
  /*
    Общая доводка разделов страницы, одна для обеих веток (с перекройкой и без):
    ссылки из заголовков уезжают вниз (headingLinks), после чего добавляется квиз.
  */
  const finish = (list: SectionNode[]) => {
    const done = liftHeadingLinks(list);
    return quizzes ? [...done, quizzes] : done;
  };

  // Страница вопросов делится не заголовками, а самими вопросами (аккордеон).
  const cut = page.questions
    ? recutQuestions(picked, page.questions)
    : page.outline
      ? recutSections(picked, page.outline)
      : null;

  if (!cut)
    return {
      intro: page.intro ? byAnchor.get(page.intro) : undefined,
      chosen: finish(picked),
    };

  const { intro, sections } = cut;
  /*
    Вступление отдаём той же формой, что и секция-«Введение» модуля: контейнером.
    Слагаемых у него два, и оба необязательны: объявленное вступление страницы
    (intro в карте) и то, что осталось от главы до первого раздела. Заголовка у
    второго нет — он снят при перекройке, — поэтому в темах и в оглавлении
    вступление не всплывёт.
  */
  const declared = page.intro ? byAnchor.get(page.intro) : undefined;
  const children = [...(declared?.children ?? []), ...intro];
  return {
    intro: children.length
      ? {
          component: "Section Container",
          anchor: declared?.anchor,
          children,
        }
      : undefined,
    chosen: finish(sections),
  };
}
