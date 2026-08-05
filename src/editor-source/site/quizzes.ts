import type { Doc, Node, SectionNode } from "@/editor-source/source/contentTree";

/*
  КВИЗЫ ПО СТРАНИЦАМ.

  В курсе все восемь квизов лежали одной кучей в конце правового модуля — на
  странице «Вопросы и ответы», под заголовком «Проверьте себя». Для курса это
  логично: тест в конце главы. На сайте страница равна теме, и проверять себя
  человек должен там, где эту тему только что прочитал, а не через две страницы.
  Поэтому куча расформирована: каждый квиз приписан к своей странице.

  Ключ — НАЧАЛО вопроса, а не весь текст. Формулировки правит редактор (правки
  живут поверх источника), и сверка целиком ломалась бы от любой запятой.

  Все восемь квизов распределены, ничей не потерян: три на «Договор и
  оформление», четыре на «Льготы и формы занятости», один на «Квоты и
  господдержку». Если начало вопроса перестанет совпадать, на странице вместо
  квиза появится служебная пометка — молча пропасть он не может.
*/
const QUIZ_PAGES: Record<string, string[]> = {
  "/general/legal/contract": [
    "Что из перечисленного может быть указано в ИПРА",
    "Какие утверждения верны",
    "Крупной IT-компании нужен тестировщик",
  ],
  "/general/legal/benefits": [
    "Какие льготы положены сотруднику с инвалидностью I или II группы",
    "Частному детскому саду нужна разовая консультация юриста",
    "Предположим, что человек с инвалидностью II группы",
    "Какой из перечисленных видов деятельности запрещён для самозанятых",
  ],
  "/general/legal/quotas": ["Какая форма занятости позволяет выполнить квоту"],
};

/** Якорь и заголовок раздела с квизами — одинаковые на всех страницах. */
const QUIZ_ANCHOR = "proverte-sebya";
const QUIZ_TITLE = "Проверьте себя";

type QuizNode = Extract<Node, { component: "Quiz" }>;

const isQuiz = (n: Node): n is QuizNode => n.component === "Quiz";

/** Все квизы модуля, в порядке источника (лежат внутри блоков, поэтому обходим вглубь). */
function allQuizzes(nodes: (Node | SectionNode)[]): QuizNode[] {
  const out: QuizNode[] = [];
  const walk = (list: (Node | SectionNode)[]) => {
    for (const n of list) {
      const node = n as Node;
      if (isQuiz(node)) out.push(node);
      const kids = (n as { children?: (Node | SectionNode)[] }).children;
      if (kids) walk(kids);
    }
  };
  walk(nodes);
  return out;
}

/*
  Раздел «Проверьте себя» для страницы — или null, если квизов ей не назначено.

  Квизы идут в том же порядке, в каком стоят в карте: на странице про льготы
  сначала про льготы, потом про формы занятости. Внутри раздела они лежат в
  Block: в слот Section Container кладутся только Heading и Text (КОМПОНЕНТЫ.md).
*/
export function quizSection(doc: Doc, slug: string): SectionNode | null {
  const wanted = QUIZ_PAGES[slug];
  if (!wanted) return null;

  const quizzes = allQuizzes(doc.children);
  /*
    Ищем по ВСЕЙ верхушке квиза, а не по одному полю. Раньше сверяли начало
    вопроса, но 5 августа 2026 верхушку разделили на заголовок, описание и сам
    вопрос (см. splitQuizTop): сценарий уехал в описание, и ключ «Крупной
    IT-компании нужен тестировщик» перестал совпадать — квиз про формы занятости
    пропал со страницы «Договор и оформление». Ключ может лежать в любой из трёх
    частей, поэтому склеиваем их и ищем вхождение.
  */
  const topText = (q: QuizNode) =>
    [q.title, q.description, q.question].filter(Boolean).join(" ");
  const picked: Node[] = wanted.map((start) => {
    const found = quizzes.find((q) => topText(q).includes(start));
    return (
      found ?? { component: "note", text: `квиз не найден: «${start}…»` }
    );
  });

  return {
    component: "Section Container",
    anchor: QUIZ_ANCHOR,
    children: [
      {
        component: "Heading",
        level: "H2",
        text: QUIZ_TITLE,
        anchor: QUIZ_ANCHOR,
      },
      { component: "Block", orientation: "Vertical", children: picked },
    ],
  };
}
