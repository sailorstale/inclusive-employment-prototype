import type { Doc, Node, SectionNode } from "@/editor-source/source/contentTree";

/*
  ВОПРОСЫ И ОТВЕТЫ — РАЗДАНЫ ПО СТРАНИЦАМ.

  В источнике это одна секция из четырнадцати вопросов подряд, все одинаковой
  формы: свёрнутая строка, которая раскрывается по клику. Для курса так и надо —
  вопросы в конце главы. На сайте страница равна теме, и вопрос должен стоять
  там, где эту тему только что прочитали.

  Замечания Юли от 6 августа 2026: вопросы про рабочее время и льготы уносим на
  «Льготы сотрудников», вопрос про выполнение квоты — на «Квоты и господдержку»,
  вопросы про ГПХ и самозанятость — на «Форматы занятости». На «Договоре и
  оформлении» остаются документы и увольнение.

  ПОЭТОМУ ГРУППА НАЗЫВАЕТ СВОИ ВОПРОСЫ ПОИМЁННО, а не отрезком «отсюда и до
  следующей группы». Раньше вопросы делились по порядку источника: группа
  начиналась с первого своего вопроса и тянулась до начала следующей. Пока все
  четырнадцать жили на одной странице, этого хватало. После раздачи не хватает:
  «Льготы сотрудников» забирают вопросы 3, 4, 5 и 7, а шестой между ними уезжает
  на другую страницу — отрезком такое не описать.

  Устроено так же, как раздача квизов (см. quizzes.ts): страница не забирает
  секцию источника себе, а собирает свой раздел из нужных вопросов. Вопрос, не
  названный ни одной страницей, на сайт не попадает.

  Ключ — НАЧАЛО вопроса, а не весь текст: формулировки правит редактор, и сверка
  целиком ломалась бы от любой запятой. Не совпал ключ — на странице вместо
  вопроса встанет служебная пометка, молча пропасть он не может.
*/
export type QuestionGroup = {
  /** Заголовок раздела — наш текст, в источнике его нет. */
  title: string;
  /** Якорь раздела: по нему работают оглавление и прокрутка. */
  anchor: string;
  /** Начала вопросов группы, в том порядке, в каком они встанут на странице. */
  questions: string[];
};

type AccordionNode = Extract<Node, { component: "Accordion" }>;

const isAccordion = (n: Node): n is AccordionNode => n.component === "Accordion";

/** Все свёрнутые вопросы модуля: они лежат внутри блоков, поэтому идём вглубь. */
function allAccordions(nodes: (Node | SectionNode)[]): AccordionNode[] {
  const out: AccordionNode[] = [];
  const walk = (list: (Node | SectionNode)[]) => {
    for (const n of list) {
      const node = n as Node;
      if (isAccordion(node)) out.push(node);
      const kids = (n as { children?: (Node | SectionNode)[] }).children;
      if (kids) walk(kids);
    }
  };
  walk(nodes);
  return out;
}

/*
  Разделы с вопросами для страницы — по одному на группу.

  Вопросы кладём в Block: прямо в слот Section Container идут только Heading и
  Text (КОМПОНЕНТЫ.md), всё остальное заворачивается в блок.
*/
export function questionSections(doc: Doc, groups?: QuestionGroup[]): SectionNode[] {
  if (!groups?.length) return [];
  const all = allAccordions(doc.children);

  return groups.map((group) => {
    const picked: Node[] = group.questions.map((start) => {
      const found = all.find((a) => a.question.startsWith(start));
      return found ?? { component: "note", text: `вопрос не найден: «${start}…»` };
    });
    return {
      component: "Section Container",
      anchor: group.anchor,
      children: [
        {
          component: "Heading",
          level: "H2",
          text: group.title,
          anchor: group.anchor,
        },
        { component: "Block", orientation: "Vertical", children: picked },
      ],
    };
  });
}
