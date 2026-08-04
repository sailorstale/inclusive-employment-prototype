import type { Node, SectionNode } from "@/editor-source/source/contentTree";

/*
  ССЫЛКА ВНУТРИ ЗАГОЛОВКА — уезжает вниз, в конец своего раздела.

  В курсе практическое задание давали ссылкой прямо в заголовке: «Практическое
  [задание](…) для представителей НКО». На странице это читается плохо. Одно
  слово посреди крупного заголовка становится синим и подчёркнутым, будто
  заголовок сломан; в правом меню на его месте вообще видна сырая разметка
  («Практическое [задание](https://docs.google.com/…»); а нажать на ссылку в
  заголовке читателю в голову приходит не сразу.

  ПРАВИЛО. Если в заголовке есть ссылка И вокруг неё есть свой текст — ссылка со
  своего места снимается. Заголовок остаётся обычным текстом (слова ссылки в нём
  сохраняются), а сама ссылка встаёт отдельной строкой в конце раздела, там, где
  читатель уже прочитал задание и готов его открыть.

  Заголовок, который ЦЕЛИКОМ является ссылкой, не трогаем: там ссылка и есть имя
  того, на что она ведёт («Абилимпикс», «Трудовой кодекс Российской Федерации»,
  «Составьте план адаптации рабочих процессов»). Снимать её было бы потерей.

  Подпись строки — «Открыть задание». Это надпись интерфейса, а не текст курса:
  собственная подпись ссылки («задание») отдельной строкой не читается.
*/
const LINK = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;

const OPEN_LABEL = "Открыть задание";

type HeadingNode = Extract<Node, { component: "Heading" }>;

const isHeading = (n: Node): n is HeadingNode => n.component === "Heading";

/** Ссылки заголовка, если вокруг них есть свой текст. Иначе пусто. */
function liftableLinks(text: string): string[] {
  const urls = [...text.matchAll(LINK)].map((m) => m[2]);
  if (!urls.length) return [];
  const around = text.replace(LINK, "").trim();
  return around ? urls : [];
}

/** Раздел без ссылок в заголовках: они переехали строкой в его конец. */
function liftInSection(sec: SectionNode): SectionNode {
  const moved: string[] = [];
  const children = sec.children.map((node) => {
    if (!isHeading(node)) return node;
    const urls = liftableLinks(node.text);
    if (!urls.length) return node;
    moved.push(...urls);
    return { ...node, text: node.text.replace(LINK, "$1") };
  });
  if (!moved.length) return sec;
  return {
    ...sec,
    children: [
      ...children,
      ...moved.map(
        (href): Node => ({
          component: "Text",
          size: "L",
          text: `[${OPEN_LABEL}](${href})`,
        }),
      ),
    ],
  };
}

/** Тот же список разделов, но ссылки из заголовков опущены вниз. */
export function liftHeadingLinks(sections: SectionNode[]): SectionNode[] {
  return sections.map(liftInSection);
}
