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

  Адрес блока — его МЕСТО В ДЕРЕВЕ страницы (поле path, «1.3.0»): тот же адрес
  стоит на странице в data-json-path, и по нему переход попадает точно в блок.
  Раньше опорой был ближайший заголовок сверху, и это работало плохо: под одним
  заголовком лежит до одиннадцати карточек, а у одиннадцати блоков заголовка
  выше не было вовсе, и переход не двигал страницу совсем.

  Заголовок всё равно записываем (section и anchor): он подписывает блок в
  списке и служит запасным местом посадки, если нужного узла на странице не
  нашлось.
*/

export const BLOCK_KINDS = [
  "General Card",
  "Quiz",
  "Quote",
  "Prompt",
  "Table",
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
  Table: "Таблицы",
  Video: "Видео",
  Image: "Изображения",
  "Person Item": "Люди",
};

export type BlockRef = {
  kind: BlockKind;
  /** Адрес страницы, например «/companies/step-2». */
  slug: string;
  /** Название страницы из карты сайта. */
  page: string;
  /** Место блока в дереве страницы («1.3.0») — по нему и прокручиваем. */
  path: string;
  /** Заголовок раздела, в котором лежит блок (для человека). */
  section: string;
  /** Якорь этого заголовка — запасное место посадки. */
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

type TableNode = Extract<Node, { component: "Table" }>;

/** Первая половина подписи таблицы — фраза перед перечислением столбцов. */
const tableLead = (n: TableNode) =>
  (n.caption ?? "").split(/\s*Столбцы:/)[0].trim().replace(/\.$/, "");

/** Шапка таблицы одной строкой: «Критерий · Трудовой договор · Самозанятость». */
const tableHead = (n: TableNode) => n.header.filter(Boolean).join(" · ");

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
      return [n.author, n.org].filter(Boolean).join(", ") || n.text.split("\n")[0] || "";
    case "Prompt":
      return n.title || n.subtitle || n.text;
    /*
      У таблицы подпись — та самая caption, что уезжает скринридеру, но она
      собрана из двух частей: «Лид. Столбцы: Критерий, Договор ГПХ…». В списке
      нужна только первая: перечисление столбцов в неё не влезет, а сама
      таблица их и так показывает. Подписи нет — берём шапку.
    */
    case "Table":
      return tableLead(n) || tableHead(n);
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

    /*
      prefix — адрес родителя. Считаем его ровно так же, как страница считает
      data-json-path: номер по порядку внутри родителя через точку. Дерево тут
      то же самое (pageChildren), поэтому адреса совпадают до символа.
    */
    const walk = (nodes: (Node | SectionNode)[], prefix: string) => {
      nodes.forEach((raw, i) => {
        const path = prefix ? `${prefix}.${i}` : String(i);
        const n = raw as Node;
        if (n.component === "Heading" && n.anchor) {
          // Заменённые раскурсовкой куски помечены в тексте служебными
          // символами: на сайте это подсветка «было: …», а в списке они
          // склеивали новую формулировку со старой. В подписях снимаем.
          section = stripDecourse(n.text);
          anchor = n.anchor;
        }
        if (KINDS.has(n.component)) {
          /*
            Подпись таблицы собрана из ближайшего заголовка, и в списке она
            слово в слово повторяла бы вторую строку — «Таблицы · тот же самый
            заголовок». В таком случае показываем шапку: по столбцам таблица
            узнаётся с одного взгляда.
          */
          const own = stripDecourse(labelOf(n));
          const label =
            n.component === "Table" && own === section ? tableHead(n) : own;
          out.push({
            kind: n.component as BlockKind,
            slug: tree.slug,
            page: tree.title,
            path,
            section,
            anchor,
            label,
          });
        }
        const kids = (raw as { children?: (Node | SectionNode)[] }).children;
        if (kids) walk(kids, path);
      });
    };

    walk(tree.nodes, "");
  }

  return out;
}
