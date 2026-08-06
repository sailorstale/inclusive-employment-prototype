import type { Node, SectionNode } from "@/editor-source/source/contentTree";

/*
  ГРУППЫ ВОПРОСОВ — деление длинного списка «Вопросы и ответы» на разделы.

  На странице четырнадцать вопросов подряд, все одинаковой формы: свёрнутая
  строка аккордеона, которая раскрывается по клику. Найти среди них нужный
  тяжело, а в оглавлении справа они не показываются вовсе — у строки аккордеона
  нет заголовка, только вопрос.

  Разделить их по источнику нечем: там ровно такой же сплошной список. Поэтому
  делит страница — своими заголовками по темам. Каждая группа становится
  обычным разделом: заголовок H2 идёт в «вы узнаете» и в оглавление, а вопросы
  группы лежат под ним одним блоком.

  Начало группы задаётся НАЧАЛОМ первого вопроса: у аккордеона нет якоря, а
  формулировку правит редактор — сверять целиком хрупко.
*/
export type QuestionGroup = {
  /** Заголовок раздела — наш текст, в источнике его нет. */
  title: string;
  /** Якорь раздела: по нему работают оглавление и прокрутка. */
  anchor: string;
  /** Начало первого вопроса группы. */
  from: string;
};

type AccordionNode = Extract<Node, { component: "Accordion" }>;
type BlockNode = Extract<Node, { component: "Block" }>;

const isAccordion = (n: Node): n is AccordionNode => n.component === "Accordion";

/*
  Вопросы лежат внутри блока-обёртки (в слот Section Container кладутся только
  Heading и Text), поэтому разворачиваем блоки на один уровень — иначе делить
  было бы нечего.
*/
function flattenBlocks(nodes: Node[]): Node[] {
  return nodes.flatMap((n) =>
    n.component === "Block" && n.children.some(isAccordion) ? n.children : [n],
  );
}

function groupSection(group: QuestionGroup): SectionNode {
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
      { component: "Block", orientation: "Vertical", children: [] },
    ],
  };
}

/** Блок раздела, куда складываются вопросы группы. */
const bodyOf = (sec: SectionNode): BlockNode => sec.children[1] as BlockNode;

/*
  Вопросы страницы → разделы по группам.

  Всё, что стоит ДО первого вопроса, уходит во вступление страницы (заголовок
  секции при этом снимается: он повторяет название страницы). Узлы между
  вопросами остаются в своей группе — так подпись или картинка не отрывается от
  вопроса, за которым идёт.
*/
export function recutQuestions(
  picked: SectionNode[],
  groups: QuestionGroup[],
): { intro: Node[]; sections: SectionNode[] } {
  const intro: Node[] = [];
  const sections: SectionNode[] = [];

  for (const sec of picked) {
    const nodes = flattenBlocks(sec.children);
    const hasQuestions = nodes.some(
      (n) => isAccordion(n) && groups.some((g) => n.question.startsWith(g.from)),
    );
    /*
      Раздел без вопросов остаётся собой. Раньше перекройка забирала всю
      страницу целиком — это годилось, пока страница состояла из одного
      аккордеона. После слияния «Вопросов и ответов» с «Договором и
      оформлением» (правка клиента 5 августа 2026) на странице есть и обычные
      разделы, и они не должны раствориться во вступлении.
    */
    if (!hasQuestions) {
      sections.push(sec);
      continue;
    }

    let cur: SectionNode | null = null;
    for (const node of nodes) {
      const group = isAccordion(node)
        ? groups.find((g) => node.question.startsWith(g.from))
        : undefined;
      if (group) {
        cur = groupSection(group);
        sections.push(cur);
      }
      if (cur) bodyOf(cur).children.push(node);
      // До первого вопроса: заголовок раздела снимаем (его заменяют заголовки
      // групп), остальное уходит вступлением страницы.
      else if (node.component !== "Heading") intro.push(node);
    }
  }
  return { intro, sections };
}
