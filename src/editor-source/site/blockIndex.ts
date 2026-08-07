import type { Node, SectionNode } from "@/editor-source/source/contentTree";
import { buildSiteTrees } from "./siteExport";
import { stripDecourse } from "./decourse";

/*
  КАРТА БЛОКОВ САЙТА — где какие карточки, квизы, цитаты, заготовки, видео и
  картинки лежат. Нужна, чтобы просмотреть все однотипные блоки подряд: так
  видно разнобой оформления, который на отдельной странице не заметен.

  Считается из тех же деревьев страниц, что и сайт с выгрузкой (buildSiteTrees).
  Своего разбора источника здесь нет намеренно: посчитай мы страницы иначе —
  карта показывала бы не то, что видит читатель.

  Адрес блока — ближайший заголовок ВЫШЕ него. Своих якорей у карточки или
  цитаты нет, а заголовок есть почти всегда, и по нему страница прокручивается
  в нужное место. Если заголовка выше не нашлось (блок в самом начале), ссылка
  ведёт просто на страницу.
*/

export const BLOCK_KINDS = [
  "General Card",
  "Quiz",
  "Quote",
  "Prompt",
  "Video",
  "Image",
  "Person Item",
] as const;

export type BlockKind = (typeof BLOCK_KINDS)[number];

/** Человеческие названия для меню. */
export const KIND_LABEL: Record<BlockKind, string> = {
  "General Card": "Карточки",
  Quiz: "Квизы",
  Quote: "Цитаты",
  Prompt: "Заготовки «Скопировать»",
  Video: "Видео",
  Image: "Изображения",
  "Person Item": "Люди",
};

export type BlockRef = {
  kind: BlockKind;
  /** Адрес страницы, например «/companies/hire/step-2». */
  slug: string;
  /** Название страницы из карты сайта. */
  page: string;
  /** Заголовок раздела, в котором лежит блок (для человека). */
  section: string;
  /** Якорь этого заголовка — по нему прокручиваем страницу. */
  anchor: string;
  /** Короткая подпись самого блока. */
  label: string;
};

const KINDS = new Set<string>(BLOCK_KINDS);

/** Первая строка текста внутри узла — на случай, если своего названия нет. */
function firstText(nodes: Node[] | undefined): string {
  for (const n of nodes ?? []) {
    if ((n.component === "Text" || n.component === "Phrase") && n.text) return n.text;
    const kids = (n as { children?: Node[] }).children;
    const deep = kids && firstText(kids);
    if (deep) return deep;
  }
  return "";
}

/*
  Подпись блока в списке. У каждого типа она берётся из своего поля: у карточки
  это заголовок, у квиза вопрос, у цитаты автор с организацией. Пустая подпись
  тоже сообщение: значит, у блока нет ни названия, ни текста, и это повод
  заглянуть на страницу.
*/
function labelOf(n: Node): string {
  switch (n.component) {
    case "General Card":
      return n.title || firstText(n.children);
    case "Quiz":
      return n.title || n.question;
    case "Quote":
      return [n.author, n.org].filter(Boolean).join(", ") || n.paragraphs[0] || "";
    case "Prompt":
      return n.title || n.subtitle || n.text;
    case "Video":
      return n.href || "без адреса";
    case "Image":
      return n.alt || n.src || "без адреса";
    // Человек — ищут по имени, должность подсказывает, кто это.
    case "Person Item":
      return [n.name, n.role].filter(Boolean).join(", ");
    default:
      return "";
  }
}

/** Все блоки нужных типов по всем страницам, в порядке чтения. */
export async function buildBlockIndex(): Promise<BlockRef[]> {
  const trees = await buildSiteTrees();
  const out: BlockRef[] = [];

  for (const tree of trees) {
    // Заголовок, под которым сейчас идём: обновляется по ходу обхода.
    let section = "";
    let anchor = "";

    const walk = (nodes: (Node | SectionNode)[]) => {
      for (const raw of nodes) {
        const n = raw as Node;
        if (n.component === "Heading" && n.anchor) {
          // Заменённые раскурсовкой куски помечены в тексте служебными
          // символами: на сайте это подсветка «было: …», а в списке они
          // склеивали новую формулировку со старой. В подписях снимаем.
          section = stripDecourse(n.text);
          anchor = n.anchor;
        }
        if (KINDS.has(n.component))
          out.push({
            kind: n.component as BlockKind,
            slug: tree.slug,
            page: tree.title,
            section,
            anchor,
            label: stripDecourse(labelOf(n)),
          });
        const kids = (raw as { children?: (Node | SectionNode)[] }).children;
        if (kids) walk(kids);
      }
    };

    walk(tree.nodes);
  }

  return out;
}
