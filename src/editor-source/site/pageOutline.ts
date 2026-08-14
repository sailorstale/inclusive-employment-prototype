import type {
  Doc,
  HeadingLevel,
  Node,
  SectionNode,
} from "@/editor-source/source/contentTree";
import type { OsnovyPage } from "./pageMap";
import { quizSection, quizHost, withQuizInside } from "./quizzes";
import { hideQuizVerdict } from "./quizVerdict";
import { questionSections } from "./questionGroups";
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
    • inline — врезка: заголовок остаётся на месте и остаётся третьим уровнем,
      но в оглавлении не показывается. Сюда идут голоса, примеры и кейсы: по ним
      нельзя понять, о чём часть страницы, и они почти всегда продолжают
      предыдущую мысль;
    • остальные — подзаголовки: уровень пересчитывается от своего раздела, чтобы
      после повышения темы её части не провалились ниже навигации.

  Всё, что стоит ДО первого раздела, становится вступлением страницы, а его
  собственный заголовок снимается: он повторял название страницы (оно уже стоит
  в шапке и в меню слева).
*/
export type PageOutline = {
  /** Якоря заголовков любого уровня, которые становятся разделами страницы. */
  sections: string[];
  /*
    Якоря заголовков-врезок: остаются в тексте своим уровнем, но в оглавлении не
    показываются (см. hiddenFromToc).

    Раньше врезку опускали до четвёртого уровня — оглавление собирается из
    второго и третьего, и понижение работало выключателем. Расплата была
    структурой: врезка стоит прямо в разделе, то есть по смыслу она третьего
    уровня, а в документе после второго сразу шёл четвёртый. Уровень описывает
    структуру и ничего больше; спрятать из меню — отдельное дело.
  */
  inline?: string[];
  /*
    Якоря заголовков, которые со страницы снимаются совсем. Текст под ними
    остаётся и продолжает свой раздел — уходит только сам заголовок. Нужно там,
    где курс подводил промежуточный итог посреди главы: на странице итог уже
    один, общий и в конце (см. recap.ts), и второй сбивает с толку.
  */
  drop?: string[];
  /*
    Якоря заголовков, которые в источнике стоят ВРОВЕНЬ со своими же частями.
    Всё, что идёт следом на том же уровне или глубже, опускается на ступень — и
    так до первого заголовка выше: там кончается то, что заголовок открывает.

    Нужно там, где структура в источнике описана неверно: заголовок задаёт
    вопрос, а ответ на него разложен по соседним заголовкам того же уровня. Это
    не про показ — уровень описывает структуру документа, и здесь мы её
    исправляем, а не подгоняем под внешний вид.
  */
  nest?: string[];
  /*
    Уровень заголовка, названный решением дизайнера: якорь → уровень. Отменяет
    пересчёт от раздела для этого одного заголовка.

    Нужно там, где дизайнер отвечает на замечание клиента одной меткой — «H4».
    Пересчёт даёт таким заголовкам третий уровень, а третий уровень идёт в меню
    справа: получается, что «убрать из меню» и «сделать помельче» пересчётом не
    выполнить. Снять заголовок совсем (untype) — не то же самое: строка перестаёт
    быть заголовком и в выгрузке для разработчика приходит абзацем.

    Части заголовка едут за ним: сдвиг запоминается той же стопкой, что и
    пересчёт (makeDemoter), поэтому подзаголовки внутри опускаются на столько же.

    Разделу уровень так не задать: он всегда H2. Заголовок, названный и здесь, и
    в sections, останется разделом — чтобы опустить его, надо убрать его из
    sections.
  */
  level?: Record<string, HeadingLevel>;
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
  /*
    forced — уровень, названный картой страницы (см. level в PageOutline). Он
    заменяет пересчитанный, но в стопку кладётся тем же порядком: значит части
    заголовка опустятся ровно на столько же, на сколько опустился он сам.
  */
  return (level: number, forced?: HeadingLevel): HeadingLevel => {
    while (stack.length && stack[stack.length - 1].level >= level) stack.pop();
    const inherited = stack.length ? stack[stack.length - 1].extra : 0;
    const natural = 2 + (level - base) + inherited;
    const final = forced ?? levelByNumber(natural);
    stack.push({ level, extra: LEVEL[final] - (2 + (level - base)) });
    return final;
  };
}

/*
  Выравнивание вложенности ДО перекройки (см. nest в PageOutline).

  Группу закрывает только заголовок ВЫШЕ открывшего. Заголовок того же уровня
  закрыть её не может: он и есть та часть, ради которой всё затевалось.
*/
function nestUnder(nodes: Node[], anchors: Set<string>): Node[] {
  if (!anchors.size) return nodes;
  let open: number | null = null;
  return nodes.map((n) => {
    if (!isHeading(n)) return n;
    const level = LEVEL[n.level];
    if (open !== null && level < open) open = null;
    if (n.anchor && anchors.has(n.anchor)) {
      open = level;
      return n;
    }
    return open === null ? n : { ...n, level: levelByNumber(level + 1) };
  });
}

/** Секции источника → разделы страницы по её перекройке. */
export function recutSections(
  picked: SectionNode[],
  outline: PageOutline,
): { intro: Node[]; sections: SectionNode[] } {
  const wanted = new Set(outline.sections);
  const inline = new Set(outline.inline ?? []);
  const dropped = new Set(outline.drop ?? []);
  const forced = outline.level ?? {};
  const intro: Node[] = [];
  const sections: SectionNode[] = [];
  let cur: SectionNode | null = null;
  let demote = makeDemoter(2);

  const nested = nestUnder(
    picked.flatMap((s) => s.children),
    new Set(outline.nest ?? []),
  );

  for (const node of nested) {
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
        ? /*
             Врезка комментирует раздел, а не делит его: стоит прямо в разделе,
             значит третий уровень. Через demote не пропускаем намеренно — она
             не должна сдвигать уровни следующих за ней подзаголовков.
          */
          { ...node, level: "H3" }
        : {
            ...node,
            level: demote(
              LEVEL[node.level],
              node.anchor ? forced[node.anchor] : undefined,
            ),
          };
    if (cur) cur.children.push(next);
    else intro.push(next);
  }
  return { intro, sections };
}

/*
  Заголовки, которых не должно быть в оглавлении: врезки страницы плюс те, что
  названы в карте отдельно (noToc — для страниц без перекройки).

  Отдельно от уровня: уровень описывает структуру документа, оглавление решает,
  что показывать читателю. Смешивать их нельзя — так и появлялись пропущенные
  ступени.
*/
export function hiddenFromToc(page: OsnovyPage): Set<string> {
  return new Set([...(page.outline?.inline ?? []), ...(page.noToc ?? [])]);
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
    Вопросы и ответы приходят так же, как квизы, — не из карты секций. В
    источнике все четырнадцать лежат одной секцией в конце модуля, а на сайте
    разданы по страницам: кому какой вопрос — в questionGroups.ts.

    Раздача ДОБАВЛЯЕТ разделы, а не перекраивает страницу. Раньше вопросы
    отменяли перекройку по карте (одна страница — одна ветка), и странице с
    перекройкой нельзя было дать ни одного вопроса. Теперь можно и то, и другое:
    «Форматы занятости» перекроены картой и при этом забирают пять вопросов.
  */
  const questions = questionSections(doc, page.questions);
  /*
    Общая доводка разделов страницы, одна для обеих веток (с перекройкой и без):
    ссылки из заголовков уезжают вниз (headingLinks), следом встают вопросы, а
    последним — квиз.
  */
  /*
    Страница может попросить положить квиз ВНУТРЬ раздела, а не ставить его
    отдельным разделом в конце (см. QUIZ_INSIDE в quizzes.ts). Тогда последним
    на странице остаются вопросы и ответы, а «Проверьте себя» читается частью
    своего раздела.
  */
  const host = quizzes ? quizHost(page.slug) : undefined;
  /*
    Строку-вердикт над разбором квиза на некоторых страницах не показываем — см.
    quizVerdict.ts. Делаем это здесь, в общей доводке: так снятие достаётся и
    квизам из карты секций, и тем, что приезжают отдельным разделом.
  */
  const finish = (list: SectionNode[]) => {
    const done = hideQuizVerdict(liftHeadingLinks(list), page.slug);
    const quiz = quizzes
      ? hideQuizVerdict([quizzes], page.slug)[0]
      : undefined;
    if (quiz && host)
      return [
        ...done.map((s) => (s.anchor === host ? withQuizInside(s, quiz) : s)),
        ...questions,
      ];
    return [...done, ...questions, ...(quiz ? [quiz] : [])];
  };

  const cut = page.outline ? recutSections(picked, page.outline) : null;

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
