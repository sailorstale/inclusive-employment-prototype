/*
  ДЕРЕВО КОНТЕНТА — единственный источник правды о том, во что раскладывается
  источник.

  Зачем отдельным модулем. Из этого дерева кормятся ДВА потребителя: режим
  «Результат» (превью на экране) и выгрузка JSON для разработчика. Если бы
  каждый собирал сам, они бы неизбежно разъехались — дизайнер видел бы одно,
  а разработчик получал другое. Здесь чистые данные, без React.

  Имена узлов совпадают с именами компонентов в Figma один в один («Card
  Container», «General Card»): по ним разработчик находит нужный компонент
  в конструкторе. Это же имя стоит в шильдике прототипа.

  Правило раскладки (КОМПОНЕНТЫ.md): в слот Section Container кладём только
  Heading и Text, всё остальное заворачиваем в Card Container.

  Служебные пометки инструмента («убрано по директиве», «дополнить авторство»)
  — это узлы note. В превью они видны, в выгрузку НЕ идут: в JSON должен ехать
  только контент.
*/

import type { Directive } from "@/editor-source/directives";
import type { SourceBlock } from "@/editor-source/content/source.generated";
import type { Section } from "./PlaygroundColumn";
import { blockRefId, type ResolveMd } from "./blockResolve";
import { findSlug, mentionsYandex, type LogoEntry } from "./orgLogo";

export type HeadingLevel = "H2" | "H3" | "H4" | "H5";
export type TextSize = "XL" | "L" | "M" | "S";
export type PhraseSize = "L" | "M";

export type Node =
  | { component: "Heading"; level: HeadingLevel; text: string }
  | { component: "Text"; size: TextSize; text: string }
  | { component: "Phrase"; size: PhraseSize; text: string }
  | { component: "List Container"; ordered: boolean; children: Node[] }
  | { component: "List Item"; size: "L" | "M"; type: "Dot" | "Icon" | "Number"; text: string }
  | { component: "Card Container"; orientation: "Vertical" | "Horizontal"; children: Node[] }
  | { component: "Page Summary"; children: Node[] }
  | {
      component: "General Card";
      orient: "Vertical" | "Horizontal";
      bgColor: string;
      icon?: string;
      title?: string;
      children: Node[];
    }
  | { component: "Accordion"; state: "Collapsed" | "Expanded"; question: string; children: Node[] }
  | {
      component: "Quote";
      size: "L" | "S";
      author?: string;
      role?: string;
      org?: string;
      logo?: string;
      yandex?: boolean;
      paragraphs: string[];
    }
  | { component: "Table"; header: string[]; rows: string[][] }
  | { component: "Image"; src: string; alt?: string }
  | { component: "Video" }
  | { component: "Prompt"; title: string; warning: string; text: string }
  /** Пометка инструмента для редактора. В выгрузку не попадает. */
  | { component: "note"; text: string };

export type SectionNode = {
  component: "Section Container";
  anchor?: string;
  children: Node[];
};

export type Doc = {
  module: string;
  /** Page Summary живёт вне секций — по правилу это вступление всей страницы. */
  children: (SectionNode | Node)[];
};

type Item = { b: SourceBlock; anchor?: string };
type Group = { dir?: Directive; items: Item[] };

const isActive = (d?: Directive) =>
  !!d && (d.status === "applied" || d.status === "verified");

/*
  Инструкции из комментария, которые исполняются механически.

  ВНИМАНИЕ: хвост русского слова — это \p{L} с флагом u, а НЕ \w. \w в JS это
  [A-Za-z0-9_], кириллицу он не покрывает, и «убра\w*\s+жирн» молча не
  совпадал с «Убрать жирный».
*/
const wantsDelete = (d?: Directive) =>
  !!d && !d.target && /^\s*удали/i.test((d.comment || "").trim());
const wantsUnbold = (d?: Directive) =>
  !!d && /(убра|убер|сня|без)\p{L}*\s+(жирн|болд|bold)/iu.test(d.comment || "");
/*
  Курсив просили снимать теми же словами, что и жирный («убрать курсив»,
  «убрать италик»), но шаблон ловил только «жирн» — комментарий молча не
  срабатывал. Держим оба написания: и «курсив», и «италик».
*/
const wantsUnitalic = (d?: Directive) =>
  !!d && /(убра|убер|сня|без)\p{L}*\s+(курсив|италик|italic)/iu.test(d.comment || "");
/*
  «Убрать нумерацию в заголовках» — источник нумерует подряд («1. Особенности…»,
  «Пример 1. Трудоустройство…»), а в аккордеоне и карточке номер лишний.
  Касается ТОЛЬКО заголовков и вопросов, не тела текста.
*/
const wantsUnnumber = (d?: Directive) =>
  !!d && /(убра|убер|сня|без)\p{L}*\s+(нумерац|нумирац|номер)/iu.test(d.comment || "");

const SERVICE_WORD =
  /^(заголов\p{L}*|загловк\p{L}*|подпис\p{L}*|надпис\p{L}*|слов\p{L}*|строк\p{L}*|текст\p{L}*|блок\p{L}*|эти|все|всё)$/iu;

/*
  «Удалить заголовок Пояснение» — точечное удаление служебной подписи внутри
  директивы С целью. Правило намеренно строгое вдвойне: слова берём из
  комментария, а выбрасываем только блок, ВЕСЬ текст которого равен одному из
  них. Содержательный абзац пропасть не может.
*/
function labelsToDrop(d?: Directive): string[] {
  if (!d?.target) return [];
  const out: string[] = [];
  const re = /(?:удали|убра)\p{L}*\s+([^.;!?\n]+)/giu;
  let m: RegExpExecArray | null;
  while ((m = re.exec(d.comment || ""))) {
    for (const w of m[1].split(/[\s,]+/)) {
      const bare = w.replace(/[«»"'*_:]/g, "").trim();
      if (bare.length >= 3 && !SERVICE_WORD.test(bare)) out.push(bare.toLowerCase());
    }
  }
  return out;
}

/*
  Комментарий без фраз-удалений. Нужен, чтобы «удалить заголовок Пояснение» не
  прочиталось как «задать заголовок Пояснение»: это ровно противоположные
  намерения, а слово «заголовок» в них одно и то же.
*/
const withoutRemovals = (c: string) =>
  c
    /*
      Инструкции дизайнер часто пишет в одну строку без знаков препинания:
      «Убрать болд сделать заг Важно». Без границы фраза-удаление съедала и
      вторую инструкцию, и заголовок терялся. Ставим границу перед глаголом
      следующей инструкции.
    */
    .replace(/\s+(?=(?:сдела|добав|постав|нужн)\p{L}*)/giu, ". ")
    .replace(/(?:удали|убра|убер|сня)\p{L}*[^.;!?\n]*/giu, " ");

/*
  Просьба разбить набор на несколько карточек/аккордеонов («сделать три
  карточки», «сделать 6 аккордионов»). Деление пока не автоматизировано —
  флаг нужен, чтобы НЕ навесить один заголовок на слипшуюся карточку:
  «с заголовками 1-2-3 группа» — это три разных заголовка, а не один.
*/
const RU_NUM: Record<string, number> = {
  два: 2, две: 2, три: 3, четыре: 4, пять: 5, шесть: 6, семь: 7, восемь: 8,
};

/** Сколько карточек/аккордеонов просили сделать. undefined — не просили. */
const splitCount = (d?: Directive): number | undefined => {
  const m = /(\d+|дв[ае]|три|четыре|пять|шесть|семь|восемь)\s+(?:карточ|аккорд|аккард)/iu.exec(
    d?.comment || "",
  );
  if (!m) return undefined;
  const raw = m[1].toLowerCase();
  const n = /^\d+$/.test(raw) ? Number(raw) : RU_NUM[raw];
  return n && n >= 2 && n <= 20 ? n : undefined;
};

const wantsSplit = (d?: Directive) => splitCount(d) !== undefined;

/*
  «Все в одну карточку», «В одну карточку» — обратное делению: автоматика
  разложила бы набор по жирным лидам и заголовкам, а дизайнер хочет один блок.
*/
const wantsMerge = (d?: Directive) =>
  /в\s+одну\s+карточ|одной\s+карточк|все\s+в\s+одну/iu.test(d?.comment || "");

/*
  «Эту таблицу сложно читать, сделай из неё текст с заголовками, перечисления —
  списками». Таблица на четыре колонки в узкой вёрстке действительно не читается.

  Разбор идёт по смыслу таблицы, а не механически: строка — это один предмет
  рассказа (её первая ячейка — заголовок), а колонки — аспекты этого предмета
  (имя колонки становится подзаголовком, содержимое ячейки — текстом). Ячейки с
  маркерами «•» распадаются на список.
*/
const wantsTableToText = (d?: Directive) => {
  const c = d?.comment || "";
  return (
    /таблиц/iu.test(c) &&
    /(текст|заголовк|загов|списк|перечислен|разбер|разобра|переработ)/iu.test(c)
  );
};

/*
  Узнало ли ХОТЬ ОДНО правило что-нибудь в комментарии.

  Нужно, чтобы комментарий не мог пропасть молча. Просьба вроде «сделай из
  таблицы текст со списками» — это переструктурирование КОНТЕНТА, раскладка так
  не умеет; раньше она просто рендерила блок как есть и ничего не говорила.
  Теперь неразобранный комментарий виден заметкой в превью.

  Список намеренно перечисляет все правила поимённо: добавили новое — допишите
  сюда, иначе оно будет считаться «непонятым» и давать ложную заметку.
*/
const commentRecognized = (d?: Directive): boolean =>
  wantsDelete(d) ||
  wantsUnbold(d) ||
  wantsUnitalic(d) ||
  wantsUnnumber(d) ||
  wantsMerge(d) ||
  wantsCapitalize(d) ||
  wantsNoColon(d) ||
  wantsTableToText(d) ||
  splitCount(d) !== undefined ||
  explicitTitle(d) !== undefined ||
  leadWordToDrop(d) !== undefined ||
  labelsToDrop(d).length > 0;

/*
  «далее предложение с большой буквы» — поднять регистр первой буквы тела.

  Запас на опечатку в корне обязателен: живой комментарий пришёл как «с болшой
  буквы» (без мягкого знака), и жёсткое «больш» молча не сработало. Поэтому
  между «бол» и «ш» допускаем любые буквы.
*/
const wantsCapitalize = (d?: Directive) =>
  /с\s+бол\p{L}*ш\p{L}*\s+букв/iu.test(d?.comment || "");

/*
  «без двоеточия» — источник пишет ярлык как «Важно:», и двоеточие тянется в
  заголовок карточки. Снимаем хвостовой знак у заголовка по просьбе.
*/
const wantsNoColon = (d?: Directive) =>
  /без\s+двоеточ|убра\p{L}*\s+двоеточ|убер\p{L}*\s+двоеточ/iu.test(d?.comment || "");

/*
  Блок-ЯРЛЫК: весь текст блока — одно служебное слово («Пример», «Важно»,
  «Важно:»). В источнике это подпись к следующему абзацу, а в карточке — её
  ЗАГОЛОВОК. Оставлять его текстом нельзя: он либо дублирует заданный заголовок
  («Важно» сверху и «Важно:» первой строкой), либо болтается как сирота.
*/
const LABEL_WORD =
  /^[*_\s]*(пример|важно|суть|итог|вывод|совет|правило|запомнить)\p{L}*\s*[:.]?[*_\s]*$/iu;
const isLabelBlock = (t: string) => LABEL_WORD.test(t.trim());
/** Ярлык как заголовок: без хвостового двоеточия и разметки. */
const labelAsTitle = (t: string) =>
  t.replace(/[*_]/g, "").replace(/\s*[:.]\s*$/, "").trim();

const capitalizeFirst = (t: string) =>
  t.replace(/^\s*(\p{Ll})/u, (m, c: string) => m.replace(c, c.toUpperCase()));

/*
  «Слово Важно убрать в начале предложения», «Слово Суть убрать» — источник
  начинает абзац служебным словом-ярлыком («Важно: …», «Суть — …»), которое в
  карточке дублирует заголовок. Убираем это слово ТОЛЬКО из начала текста:
  внутри предложения оно может быть по делу.
*/
const leadWordToDrop = (d?: Directive): string | undefined => {
  const m = /слов\p{L}*\s+[«"']?([^\s,.;:!?»"']+)[»"']?\s+убра/iu.exec(d?.comment || "");
  const w = m?.[1]?.trim();
  return w && w.length >= 2 ? w : undefined;
};

const stripLeadWord = (t: string, w: string): string => {
  const esc = w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Слово может быть обёрнуто в жирный и отделено двоеточием или тире.
  const out = t.replace(
    new RegExp(`^\\s*[*_]*${esc}[*_]*\\s*[:—–-]?\\s*`, "iu"),
    "",
  );
  return out.trim() ? out : t;
};

/*
  Карточка из строки вида «**1-я группа** — наиболее выраженные особенности…»:
  жирное начало (а если его нет — часть до тире) становится ЗАГОЛОВКОМ, остальное
  телом. Тире-разделитель при этом уходит — это и есть «убрать тире».

  Если жирная часть — это весь текст, заголовка нет: строка целиком жирная это
  не заголовок с телом, а просто акцент.
*/
const splitTitleBody = (text: string): { title?: string; body: string } => {
  const bold = text.match(/^\s*\*\*(.+?)\*\*\s*/);
  if (bold) {
    const rest = text
      .slice(bold[0].length)
      .replace(/^\s*[—–-]\s*/, "")
      .replace(/^\s*:\s*/, "");
    if (rest.trim())
      return { title: bold[1].trim().replace(/[.:;]+$/, ""), body: rest.trim() };
    return { body: text.trim() };
  }
  const dash = text.match(/^(.{2,60}?)\s+[—–]\s+(.+)$/s);
  if (dash) return { title: dash[1].trim(), body: dash[2].trim() };
  return { body: text.trim() };
};

/*
  Явный заголовок карточки из комментария: «Добавь заголовок Важно»,
  «карточка с загловоком Пример». Опечатки дизайнера частые, поэтому корень
  берём с запасом (загол/заглов/загов/заглав).
*/
const explicitTitle = (d?: Directive): string | undefined => {
  if (!d?.target || wantsSplit(d)) return undefined;
  // «заг» принимаем только целым словом: иначе «загрузить» дало бы заголовок.
  const m = /(?:заг(?=\s)|загол\p{L}*|заглов\p{L}*|загов\p{L}*|заглав\p{L}*)\s+(?:[«"'])?([^«»"'.,;:!?\n]+)/iu.exec(
    withoutRemovals(d.comment || ""),
  );
  const t = m?.[1]?.replace(/[*_]/g, "").trim();
  if (!t || t.length < 2 || t.length > 60) return undefined;
  /*
    Заголовок — короткая подпись («Важно», «Пример»), а не кусок фразы. Без этой
    проверки описательное предложение «сделай текст с заголовками и там ещё есть
    перечисления…» давало заголовком весь хвост фразы.

    Отсекаем по двум признакам: слишком много слов и начало со служебного слова
    (в осмысленной подписи его не бывает).
  */
  const words = t.split(/\s+/);
  const FILLER = /^(и|а|но|или|там|тут|где|что|как|это|эти|все|всё|ещё|еще|же|в|на|с|со|для|по|из)$/iu;
  if (words.length > 4 || FILLER.test(words[0])) return undefined;
  return t;
};

/*
  «Пояснение» — строительные леса исходника: внутри аккордеона ответ и ЕСТЬ
  пояснение, ярлык только шумит. «Миф» и «Правда» оставляем — они несут вердикт.
  На уровне модуля, потому что нужен и сборке аккордеона, и стражу потерь.
*/
const isExplainLabel = (t: string) =>
  /^[*_\s]*пояснени\p{L}*\s*:?[*_\s]*$/iu.test(t);

const isDroppedLabel = (raw: string, labels: string[]) => {
  const bare = raw.replace(/[*_]/g, "").replace(/:$/, "").trim().toLowerCase();
  return bare.length > 0 && labels.includes(bare);
};

const stripBold = (md: string) => md.replace(/\*\*(.+?)\*\*/g, "$1");

/*
  Курсив — ОДИНОЧНАЯ звёздочка (или подчёркивание). Двойную не трогаем: это
  жирный, у него своя чистка. Поэтому по краям требуем «не звёздочку», иначе
  «**текст**» распался бы на «*текст*».
*/
const stripItalic = (md: string) =>
  md
    .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1$2")
    .replace(/(^|[^_])_([^_\n]+)_(?!_)/g, "$1$2");

/*
  Ведущая нумерация заголовка: «1. », «2) », «Пример 1. », «Ситуация 3 — ».
  Снимаем только ПРЕФИКС и только если после него что-то осталось: заголовок
  вида «1» (сам по себе номер) не должен превратиться в пустой.
*/
const stripNumber = (t: string) => {
  const out = t.replace(
    /^\s*(?:[«"']?\p{Lu}\p{L}*\s+)?\d+\s*(?:[.)»"']|—|–|-|:)?\s+/u,
    "",
  );
  return out.trim() ? out.trim() : t.trim();
};

/** Текстовые чистки из комментария — общие для всей группы блоков. */
type TextFix = { unbold: boolean; unitalic: boolean; unnumber: boolean };
/** Те же чистки, но к готовой строке: у пунктов списка своего md() нет. */
const applyFix = (t: string, fix: TextFix): string => {
  let out = t;
  if (fix.unbold) out = stripBold(out);
  if (fix.unitalic) out = stripItalic(out);
  return out;
};
const NO_FIX: TextFix = { unbold: false, unitalic: false, unnumber: false };
const textFix = (d?: Directive): TextFix => ({
  unbold: wantsUnbold(d),
  unitalic: wantsUnitalic(d),
  unnumber: wantsUnnumber(d),
});

/*
  Заголовок несёт свой вес сам (Heading, вопрос аккордеона, заголовок карточки).
  В источнике такие строки часто обёрнуты в «**…**» — если оставить, жирность
  ляжет поверх жирности. Поэтому в заголовках разметку веса снимаем.
*/
const headingText = (t: string, fix: TextFix = NO_FIX) => {
  const s = stripBold(t).trim();
  return fix.unnumber ? stripNumber(s) : s;
};
const stripEmph = (t: string) => t.replace(/^[*_]+|[*_]+$/g, "").trim();

/*
  Группы по ВСЕМУ модулю: подряд идущие блоки одной директивы — вместе.

  Почему сквозным проходом, а не внутри каждой секции. Директива — единое целое,
  но секции режутся по h2. Директива, охватывающая несколько h2 (четыре меры
  господдержки — каждая заголовком h2), разрывалась на части: каждый аккордеон
  уезжал в собственную секцию, между ними появлялись отбивки, и общий конверт
  собрать было нельзя.

  Поэтому группа продолжается через границу секции, а принадлежит той секции,
  где НАЧАЛАСЬ. Секции, чей заголовок ушёл внутрь такой директивы, своего
  содержимого не получают и не рисуются вовсе.
*/
type PlacedGroup = Group & { si: number };

function groupsOfDoc(
  sections: Section[],
  directiveAt?: (si: number, bi: number) => Directive | undefined,
): PlacedGroup[] {
  const groups: PlacedGroup[] = [];
  let cur: PlacedGroup | null = null;
  sections.forEach((sec, si) => {
    sec.blocks.forEach((b, bi) => {
      const d = directiveAt?.(si, bi);
      const active = isActive(d) ? d : undefined;
      const item = { b, anchor: sec.anchor };
      if (active && cur?.dir?.id === active.id) {
        cur.items.push(item);
      } else {
        cur = { dir: active, items: [item], si };
        groups.push(cur);
      }
    });
  });
  return groups;
}

/*
  Не-проза: в секцию напрямую не кладётся, только через Card Container.

  List Container сюда НЕ входит, хотя соблазн есть. В КОМПОНЕНТЫ.md про него
  сказано прямо: «кладётся куда угодно: в секцию, в карточку, в Compare Card,
  в аккордеон», и в перечне того, что требует конверта, списка нет. Лишний
  конверт давал +32 к собственным 16 контейнера — отбивка от абзаца выходила
  48 вместо 16.
*/
const NON_PROSE = new Set([
  "GeneralCard",
  "Accordion",
  "Quote",
  "Table",
  "Prompt",
  "Quiz",
  "Compare",
  "Image",
  "Video",
]);

const isPageSummary = (g: Group) => g.dir?.target === "PageSummary";

function needsCard(g: Group): boolean {
  if (isPageSummary(g)) return false;
  if (g.dir?.target) return NON_PROSE.has(g.dir.target);
  const k = g.items[0]?.b.kind;
  // Блок-цитата без автора становится Phrase — это проза, конверт не нужен.
  return k === "table" || k === "image";
}

const cardOrientation = (g: Group): "Vertical" | "Horizontal" =>
  g.dir?.target === "GeneralCard" && g.dir.modifiers?.orient === "Horizontal"
    ? "Horizontal"
    : "Vertical";

const LINK_RE = /\[([^\]]+)\]\((?:https?:)?\/\/[^)]+\)/;

/*
  СКЛЕЙКА СОСЕДНИХ СПИСКОВ.

  Парсер источника отдаёт каждый пункт списка ОТДЕЛЬНЫМ блоком (в директивах это
  видно как «1 пунктов»). Без склейки каждый пункт получал свой List Container,
  а тот — свой Card Container: 32 пикселя от конверта плюс 16 от контейнера на
  КАЖДЫЙ пункт. Списки разъезжались на пол-экрана.

  По системе List Container — это вертикальный стек с равным шагом, и шаг задаёт
  он сам. Поэтому соседние списки одного типа сливаем в один контейнер: пункты
  идут подряд, промежуток — штатный gap.
*/
function listInside(n?: Node): Extract<Node, { component: "List Container" }> | undefined {
  if (!n) return undefined;
  if (n.component === "List Container") return n;
  if (
    n.component === "Card Container" &&
    n.children.length === 1 &&
    n.children[0].component === "List Container"
  )
    return n.children[0];
  return undefined;
}

/*
  Однородный конверт: какой ОДИН тип компонента лежит внутри Card Container.
  Служебные пометки инструмента не в счёт — они не контент.
*/
function soleKind(n?: Node): string | undefined {
  if (!n || n.component !== "Card Container") return undefined;
  const kinds = new Set(
    n.children.filter((c) => c.component !== "note").map((c) => c.component),
  );
  return kinds.size === 1 ? [...kinds][0] : undefined;
}

/*
  СКЛЕЙКА СОСЕДЕЙ. Два правила, оба про «не плодить обёртки»:

  1. Соседние списки одного типа — в один List Container (он и есть стек с
     равным шагом, шаг задаёт сам).
  2. Соседние Card Container с ОДНИМ И ТЕМ ЖЕ типом внутри — в один конверт.
     Восемь мифов подряд это восемь аккордеонов в ОДНОМ Card Container, а не
     восемь конвертов по одному: каждый конверт добавлял свои 32 сверху, и
     ряд однотипных блоков разъезжался.

  Ориентация конвертов должна совпадать: вертикальный столбик и горизонтальный
  ряд карточек — разные раскладки, их сливать нельзя.
*/
function mergeSiblings(nodes: Node[]): Node[] {
  const out: Node[] = [];
  for (const raw of nodes) {
    // Сначала внутрь: аккордеоны и карточки тоже держат списки и конверты.
    const n: Node =
      "children" in raw && Array.isArray(raw.children)
        ? ({ ...raw, children: mergeSiblings(raw.children) } as Node)
        : raw;

    const prev = out[out.length - 1];

    // 1. Списки
    const a = listInside(prev);
    const b = listInside(n);
    if (a && b && a.ordered === b.ordered) {
      const merged = { ...a, children: [...a.children, ...b.children] };
      out[out.length - 1] =
        prev!.component === "Card Container"
          ? { ...prev!, children: [merged] }
          : merged;
      continue;
    }

    // 2. Однотипные конверты
    const ka = soleKind(prev);
    const kb = soleKind(n);
    if (
      ka &&
      ka === kb &&
      prev!.component === "Card Container" &&
      n.component === "Card Container" &&
      prev!.orientation === n.orientation
    ) {
      out[out.length - 1] = {
        ...prev!,
        children: [...prev!.children, ...n.children],
      };
      continue;
    }

    out.push(n);
  }
  return out;
}

export function buildDoc(
  moduleId: string,
  sections: Section[],
  resolve: ResolveMd,
  logoIndex: LogoEntry[],
  directiveAt?: (si: number, bi: number) => Directive | undefined,
): Doc {
  /** Актуальная разметка блока (с учётом правок) + чистки из комментария. */
  const md = (it: Item, fix: TextFix = NO_FIX): string => {
    const b = it.b;
    const type = b.kind === "heading" ? `h${b.level}` : "paragraph";
    // У таблицы, картинки и СПИСКА своего поля text нет: у списка текст живёт
    // в items. Без этой проверки адрес правки считался бы от undefined и падал.
    const raw =
      b.kind === "table" || b.kind === "image" || b.kind === "list"
        ? ""
        : resolve(type, (b as { text: string }).text, (b as { md: string }).md, it.anchor);
    return applyFix(raw, fix);
  };

  const liText = (it: Item, li: { text: string; md: string }) =>
    resolve("li", li.text, li.md, it.anchor);

  /** Блок без директивы — обычная раскладка по правилам системы. */
  const plainNodes = (it: Item, fix: TextFix, inCard = false): Node[] => {
    const b = it.b;
    switch (b.kind) {
      case "heading":
        return [
          {
            component: "Heading",
            level: `H${b.level}` as HeadingLevel,
            text: headingText(md(it, fix), fix),
          },
        ];
      case "paragraph":
        // Body L — только проза страницы, вне карточек и прочих компонентов.
        // Внутри General Card, аккордеона и подобных текст на ступень мельче.
        return [{ component: "Text", size: inCard ? "M" : "L", text: md(it, fix) }];
      case "quote":
        // Quote — только речь человека с именем. Блок «>» автора не несёт,
        // поэтому по правилу это Phrase: фраза-врезка курсивом.
        return [{ component: "Phrase", size: "L", text: md(it, fix) }];
      case "list":
        return [
          {
            component: "List Container",
            ordered: b.ordered,
            children: b.items.map((li) => ({
              component: "List Item" as const,
              size: "L" as const,
              type: (b.ordered ? "Number" : "Dot") as "Number" | "Dot",
              text: liText(it, li),
            })),
          },
        ];
      case "table":
        return [{ component: "Table", header: b.header, rows: b.rows }];
      case "image":
        return b.src
          ? [{ component: "Image", src: b.src, alt: b.alt }]
          : [{ component: "Video" }];
    }
  };

  /*
    СТРАЖ ПОТЕРЬ.

    Контент не должен исчезать молча — только по явной команде «удалить».
    Правило раскладки сложное (лиды, ярлыки, деление на карточки), и один
    недосмотр уже стоил нам целого блока: список, попавший в карточку первым,
    пропадал бесследно.

    Поэтому сверяем: текст каждого исходного блока обязан оставить след в
    собранных узлах. Не оставил — рисуем заметку прямо в превью. Заметка
    служебная, в выгрузку не идёт: её задача — чтобы пропажу заметил человек.
  */
  const nodeText = (n: Node | SectionNode): string => {
    const parts: string[] = [];
    const o = n as Record<string, unknown>;
    for (const k of ["text", "question", "title", "alt", "author", "role", "org"])
      if (typeof o[k] === "string") parts.push(o[k] as string);
    if (Array.isArray(o.paragraphs)) parts.push((o.paragraphs as string[]).join(" "));
    if (Array.isArray(o.header)) parts.push((o.header as string[]).join(" "));
    if (Array.isArray(o.rows)) parts.push((o.rows as string[][]).flat().join(" "));
    if (Array.isArray(o.children))
      parts.push((o.children as Node[]).map(nodeText).join(" "));
    return parts.join(" ");
  };

  /** Текст исходного блока — включая те виды, у которых своего поля text нет. */
  const itemText = (it: Item): string => {
    const b = it.b;
    if (b.kind === "list") return b.items.map((li) => liText(it, li)).join(" ");
    if (b.kind === "table") return [...b.header, ...b.rows.flat()].join(" ");
    if (b.kind === "image") return b.alt || "";
    return md(it);
  };

  /** Сравниваем по сути: без разметки, регистра и пунктуации. */
  const signature = (s: string) =>
    s
      /*
        Адрес ссылки в сверке не участвует: в исходнике он есть
        («[Фонд…](https://…)»), а в собранном узле остаётся только название —
        URL живёт отдельным полем. Иначе каждая цитата со ссылкой давала
        ложную тревогу.
      */
      .replace(/\]\([^)]*\)/g, " ")
      .replace(/https?:\/\/\S+/gi, " ")
      .replace(/[*_`#>[\]()«»"'—–\-.,;:!?]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

  const guarded = (g: Group): Node[] => {
    const base = groupNodes(g);
    /*
      Комментарий, в котором ни одно правило ничего не узнало, — не «пожелание
      в воздух»: дизайнер его написал и ждёт результата. Показываем прямо в
      превью, иначе просьба исчезает бесследно (так и случилось с таблицей).
    */
    const comment = (g.dir?.comment || "").trim();
    const out: Node[] =
      comment && !commentRecognized(g.dir)
        ? [
            ...base,
            {
              component: "note",
              text: `комментарий не разобран${
                g.dir?.target ? "" : " (компонент не выбран)"
              }: «${comment.replace(/\s+/g, " ").slice(0, 120)}»`,
            },
          ]
        : base;
    // Удаление и снятие ярлыков — намеренные потери, о них не предупреждаем.
    if (wantsDelete(g.dir)) return out;
    const drop = labelsToDrop(g.dir);
    const produced = signature(out.map(nodeText).join(" "));
    const lost = g.items.filter((it) => {
      const raw = itemText(it);
      if (drop.length && isDroppedLabel(raw, drop)) return false;
      if (isExplainLabel(raw)) return false;
      const sig = signature(raw);
      // Короткие служебные подписи («Миф», «Правда») проверять бессмысленно:
      // они и так растворяются в тексте соседей и дают ложные тревоги.
      if (sig.length < 25) return false;
      /*
        Сверяем по ХВОСТУ, а не по началу: наши же правила срезают именно
        префикс («Пример 1. Трудоустройство…» → «Трудоустройство…»), и проба
        с начала давала ложную тревогу на каждом таком заголовке. Конец текста
        правила не трогают.
      */
      return !produced.includes(sig.slice(-40));
    });
    if (!lost.length) return out;
    return [
      ...out,
      {
        component: "note",
        text: `не попало в раскладку — ${lost.length} блок(ов): ${lost
          .map((it) => signature(itemText(it)).slice(0, 45))
          .join(" · ")}`,
      },
    ];
  };

  /*
    Ячейка таблицы — не всегда «просто текст» или «просто список». В одной могут
    лежать: вводная фраза, пронумерованные случаи жирным («**1. Работа
    допускается…**») и перечисление примеров через «•».

    Раскладывать это плоским списком нельзя: вводная фраза становилась пунктом,
    а текст ПОСЛЕ перечисления прилипал к последнему пункту. Поэтому читаем
    структуру: нумерованный жирный — подзаголовок и граница, «•» — пункты
    списка, всё остальное — текст.
  */
  const cellNodes = (cell: string): Node[] => {
    const out: Node[] = [];
    let bullets: string[] = [];
    const flushList = () => {
      if (!bullets.length) return;
      out.push({
        component: "List Container",
        ordered: false,
        children: bullets.map((t) => ({
          component: "List Item" as const,
          size: "L" as const,
          type: "Dot" as const,
          text: t,
        })),
      });
      bullets = [];
    };
    const pushText = (t: string) => {
      const s = t.trim();
      if (s) out.push({ component: "Text", size: "L", text: s });
    };

    for (const part of cell.split(/(\*\*\s*\d+\.\s*[^*]+?\*\*)/g)) {
      const head = part.match(/^\*\*\s*(\d+\.\s*[^*]+?)\s*\*\*$/);
      if (head) {
        flushList();
        // Хвостовая точка в подзаголовке не нужна, номер случая — нужен.
        out.push({
          component: "Heading",
          level: "H5",
          text: head[1].replace(/\s*[.:]\s*$/, "").trim(),
        });
        continue;
      }
      const chunks = part.split(/\s*•\s*/);
      const lead = chunks.shift() ?? "";
      if (lead.trim()) {
        flushList();
        pushText(lead);
      }
      for (const c of chunks) if (c.trim()) bullets.push(c.trim());
    }
    flushList();
    return out;
  };

  /** Таблица → проза: строка даёт заголовок, колонки — подзаголовки с текстом. */
  const tableToText = (
    b: Extract<SourceBlock, { kind: "table" }>,
    fix: TextFix,
  ): Node[] => {
    const out: Node[] = [];
    for (const row of b.rows) {
      const [first, ...rest] = row;
      if (first?.trim())
        out.push({
          component: "Heading",
          level: "H4",
          text: headingText(first, fix),
        });
      rest.forEach((cell, i) => {
        if (!cell?.trim()) return;
        const col = b.header[i + 1];
        // Имя колонки — подзаголовок. Без него читатель не поймёт, что за текст.
        if (col?.trim())
          out.push({ component: "Heading", level: "H5", text: headingText(col, fix) });
        out.push(...cellNodes(cell));
      });
    }
    return out;
  };

  const groupNodes = (g: Group): Node[] => {
    const { dir } = g;

    if (wantsDelete(dir))
      return [
        { component: "note", text: `убрано по директиве: ${g.items.length} блок(ов)` },
      ];

    const fix = textFix(dir);
    const drop = labelsToDrop(dir);
    const items = drop.length
      ? g.items.filter((it) => !isDroppedLabel(md(it), drop))
      : g.items;

    /*
      Разбор таблицы в текст работает и БЕЗ выбранного компонента: дизайнер
      описал результат словами, и цель тут не нужна — таблица превращается в
      обычную прозу с заголовками.
    */
    if (wantsTableToText(dir))
      return items.flatMap((it) =>
        it.b.kind === "table" ? tableToText(it.b, fix) : plainNodes(it, fix),
      );

    if (!dir?.target) return items.flatMap((it) => plainNodes(it, fix));

    const mods = dir.modifiers || {};

    switch (dir.target) {
      case "PageSummary":
        return [
          {
            component: "Page Summary",
            children: items.flatMap((it): Node[] =>
              it.b.kind === "list"
                ? it.b.items.map((li) => ({
                    component: "List Item" as const,
                    size: "L" as const,
                    type: "Dot" as const,
                    text: liText(it, li),
                  }))
                : [{ component: "Text", size: "M", text: md(it, fix) }],
            ),
          },
        ];

      case "GeneralCard": {
        /*
          КАЖДЫЙ блок с ведущим **жирным** начинает СВОЮ карточку: «**Медицинский
          подход** …» и «**Социальный подход** …» — это две равнозначные карточки
          в ряд, а не одна с двумя абзацами. Блоки без такого лида продолжают
          текущую карточку («**Пример.** …» плюс продолжение абзацами).

          Сами карточки всегда Vertical (иконка сверху, под ней заголовок и
          текст). «Горизонтально» из директивы — про РЯД: это ориентация
          конверта Card Container, две карточки по половине колонки бок о бок.

          Иконка у каждой карточки своя — подобрана по тексту её блока.
        */
        const cards: Node[] = [];
        const bg = typeof mods.bg === "string" ? mods.bg : "blue";
        const forcedTitle = explicitTitle(dir);
        /*
          Чистки ТЕЛА карточки: снять служебное слово-ярлык в начале и поднять
          регистр. Раньше регистр применялся только в режиме деления, поэтому
          «начать предложение с большой буквы» в обычной карточке молчало.
        */
        const dropWord = leadWordToDrop(dir);
        const capBody = wantsCapitalize(dir);
        const noColon = wantsNoColon(dir);
        /** Хвостовое двоеточие заголовка — по просьбе «без двоеточия». */
        const titleFix = (t?: string) =>
          t && noColon ? t.replace(/\s*[:：]\s*$/, "").trim() || t : t;
        const bodyText = (t: string) => {
          let out = dropWord ? stripLeadWord(t, dropWord) : t;
          if (capBody) out = capitalizeFirst(out);
          return out.trim();
        };
        // Иконки лежат в директиве в том же порядке, что и блоки.
        const iconOf = (it: Item) =>
          dir.blocks.find((x) => x.snippet && md(it).startsWith(x.snippet.slice(0, 20)))
            ?.icon;

        /*
          ЯВНОЕ ДЕЛЕНИЕ «сделать N карточек».

          Автоматика делит по жирному лиду, и когда это расходится с замыслом,
          возразить ей было нечем. Теперь количество можно назвать в комментарии.

          Единицу деления берём однозначную, без догадок: либо блоков ровно N
          (каждый блок — карточка), либо это один список из N пунктов (каждый
          пункт — карточка). Не сошлось — не выдумываем: оставляем автоматику и
          говорим об этом заметкой, иначе дизайнер будет думать, что просьба
          исполнена.
        */
        /*
          «Все в одну карточку» — обратное делению. Автоматика разложила бы набор
          по жирным лидам, а дизайнер хочет один блок: первый блок даёт заголовок
          (или он задан явно), остальное идёт телом подряд.
        */
        if (wantsMerge(dir)) {
          const [head, ...tail] = items;
          const t0 = md(head, fix);
          /*
            Блок-ярлык («Пример», «Важно:») даёт заголовок и в тело не идёт:
            иначе слово стоит и заголовком, и первой строкой текста.
          */
          const headIsLabel = isLabelBlock(t0);
          const auto = headIsLabel ? { title: labelAsTitle(t0), body: "" } : splitTitleBody(t0);
          const title = titleFix(
            forcedTitle ?? (auto.title ? headingText(auto.title, fix) : undefined),
          );
          const firstBody = headIsLabel ? "" : forcedTitle ? t0 : auto.body;
          const icon = iconOf(head);
          const kids: Node[] = [];
          if (bodyText(firstBody))
            kids.push({ component: "Text", size: "M", text: bodyText(firstBody) });
          for (const it of tail) kids.push(...plainNodes(it, fix, true));
          return [
            {
              component: "General Card",
              orient: "Vertical",
              bgColor: bg,
              icon: mods.icon && icon ? icon : undefined,
              title,
              children: kids,
            },
          ];
        }

        const want = splitCount(dir);
        const unitText = (it: Item) =>
          it.b.kind === "list"
            ? it.b.items.map((li) => applyFix(liText(it, li), fix)).join(" ")
            : md(it, fix);

        let units: { it: Item; text: string }[] | null = null;
        if (want) {
          if (items.length === want) {
            units = items.map((it) => ({ it, text: unitText(it) }));
          } else if (
            items.length === 1 &&
            items[0].b.kind === "list" &&
            items[0].b.items.length === want
          ) {
            const it = items[0];
            units = (it.b as { items: { text: string; md: string }[] }).items.map((li) => ({
              it,
              text: applyFix(liText(it, li), fix),
            }));
          }
        }

        if (units) {
          return units.map(({ it, text }) => {
            const { title, body } = splitTitleBody(text);
            const icon = iconOf(it);
            return {
              component: "General Card",
              orient: "Vertical",
              bgColor: bg,
              icon: mods.icon && icon ? icon : undefined,
              title: titleFix(title ? headingText(title, fix) : undefined),
              children: bodyText(body)
                ? [{ component: "Text", size: "M", text: bodyText(body) }]
                : [],
            };
          });
        }

        for (const it of items) {
          const t = md(it, fix);
          const lead = t.match(/^\s*\*\*(.+?)\*\*:?\s*/);
          const after = lead ? t.slice(lead[0].length) : t;
          /*
            Карточку начинает ЛИД — жирное начало, за которым идёт текст, либо
            заголовок. Блок целиком жирный («**Миф**», «**Пояснение**») — это
            служебный ярлык, а не заголовок карточки: он остаётся внутри
            текущей, иначе каждый ярлык плодил бы пустую карточку.
          */
          const startsCard =
            (lead && after.trim().length > 0) ||
            it.b.kind === "heading" ||
            isLabelBlock(t);
          if (startsCard || !cards.length) {
            // Хвостовая пунктуация в заголовке не нужна: «**Пример.**» → «Пример».
            const derived = lead
              ? headingText(lead[1].replace(/[.:;]+$/, ""), fix)
              : it.b.kind === "heading"
                ? headingText(t, fix)
                : undefined;
            /*
              Заголовок из комментария перебивает выведенный из жирного лида, и
              только у ПЕРВОЙ карточки: он задан один, размножать его по всем
              нельзя. Сам лид тогда уходит в тело — иначе текст, который был
              «заголовком», просто пропал бы.
            */
            const forced = cards.length === 0 ? forcedTitle : undefined;
            /*
              Блок-ярлык («Важно:») — это заголовок, а не текст. Если заголовок
              уже задан комментарием, ярлык просто выбрасываем: иначе слово
              стоит дважды — заголовком и первой строкой тела.
            */
            const labelOnly = isLabelBlock(t);
            const title = titleFix(
              forced ?? (labelOnly ? labelAsTitle(t) : derived),
            );
            /*
              Блок, обёрнутый в жирный ЦЕЛИКОМ, — это метка «важное утверждение»,
              которой источник помечал заголовок. С явным заголовком метка лишняя:
              акцент несут карточка и заголовок, а жирное тело целиком читается как
              ошибка вёрстки. Поэтому у такого лида снимаем жирность.

              Жирные вставки ВНУТРИ обычного текста не трогаем: там это смысловое
              выделение, а не метка.
            */
            const rest = labelOnly
              ? ""
              : forced
                ? lead && !after.trim()
                  ? lead[1]
                  : t
                : lead
                  ? after
                  : it.b.kind === "heading"
                    ? ""
                    : t;
            const icon = iconOf(it);
            /*
              У списка, таблицы и картинки СВОЕГО текста нет — md() для них
              пустой, он читает поля text/md, которых у этих видов не бывает.
              Раньше такой блок, попав в карточку ПЕРВЫМ, исчезал молча: rest
              пустой → тело пустое → контент терялся. Рендерим его как есть.

              Пустое тело законно только у заголовка (он ушёл в title) и у
              блока, чей текст целиком стал заголовком.
            */
            const ownText =
              it.b.kind !== "list" && it.b.kind !== "table" && it.b.kind !== "image";
            cards.push({
              component: "General Card",
              orient: "Vertical",
              bgColor: bg,
              icon: mods.icon && icon ? icon : undefined,
              title,
              children: bodyText(rest)
                ? [{ component: "Text", size: "M", text: bodyText(rest) }]
                : ownText
                  ? []
                  : plainNodes(it, fix, true),
            });
          } else {
            const last = cards[cards.length - 1] as Extract<
              Node,
              { component: "General Card" }
            >;
            last.children.push(...plainNodes(it, fix, true));
          }
        }
        /*
          Автоматика делит по заголовкам и жирным лидам и часто САМА даёт
          нужное число — тогда просьба исполнена, и заметка была бы ложной
          тревогой. Сообщаем, только если число реально разошлось.
        */
        return want && cards.length !== want
          ? [
              ...cards,
              {
                component: "note" as const,
                text: `просили ${want} карточек, получилось ${cards.length} — проверьте деление`,
              },
            ]
          : cards;
      }

      case "Accordion": {
        /*
          Новый аккордеон начинает заголовок ВЕРХНЕГО в группе уровня (обычно h3
          с формулировкой мифа). Заголовки помельче («Кейс из практики», h4) —
          часть ответа и уходят внутрь тела, а не отрываются в отдельный вопрос.
        */
        /*
          «Пояснение» из аккордеона убираем всегда. Это строительные леса
          исходного текста: внутри аккордеона ответ и ЕСТЬ пояснение, ярлык
          только шумит. «Миф» и «Правда» оставляем — они несут вердикт, без них
          читатель не поймёт, подтверждают утверждение или опровергают.
        */
        const items2 = items.filter((it) => !isExplainLabel(md(it)));

        const levels = items2
          .filter((it) => it.b.kind === "heading")
          .map((it) => (it.b as { level: number }).level);
        const topLevel = levels.length ? Math.min(...levels) : 0;
        const out: Node[] = [];
        let q: string | null = null;
        let body: Node[] = [];
        const flush = () => {
          if (q === null) return;
          out.push({
            component: "Accordion",
            state: mods.state === "Expanded" ? "Expanded" : "Collapsed",
            question: q,
            children: body,
          });
          q = null;
          body = [];
        };
        for (const it of items2) {
          const isTop =
            it.b.kind === "heading" && (it.b as { level: number }).level === topLevel;
          if (isTop) {
            flush();
            q = headingText(md(it, fix), fix);
          } else if (q !== null) {
            // Тело аккордеона — внутри компонента: Body L там не используется.
            body.push(...plainNodes(it, fix, true));
          } else {
            out.push(...plainNodes(it, fix));
          }
        }
        flush();
        /*
          Число аккордеонов задаётся заголовками источника, а не комментарием:
          деление по количеству тут не автоматизировано. Но молчать нельзя —
          если получилось не столько, сколько просили, дизайнер должен узнать
          об этом сразу, а не искать глазами.
        */
        const wantAcc = splitCount(dir);
        return wantAcc && out.length !== wantAcc
          ? [
              ...out,
              {
                component: "note" as const,
                text: `просили ${wantAcc} аккордеонов, получилось ${out.length} — деление идёт по заголовкам источника, проверьте`,
              },
            ]
          : out;
      }

      case "Quote": {
        /*
          Вся группа — ОДНА цитата: выделили блоки и указали компонент, значит
          они упаковываются в него. Строку авторства разбираем на имя,
          должность, организацию. Организацию берём ТОЛЬКО вплотную к строке
          авторства (ссылкой внутри неё или соседним блоком-ссылкой) — иначе
          цитате доставался логотип из чужого блока через два абзаца.
        */
        const parsed = items.map((it) => {
          const t = md(it).trim();
          const head = t.replace(new RegExp(`\\s*${LINK_RE.source}\\s*$`), "").trim();
          const bare = stripEmph(head);
          return {
            it,
            text: t,
            bare,
            isLinkOnly:
              it.b.kind === "paragraph" &&
              LINK_RE.test(t) &&
              !stripEmph(t.replace(LINK_RE, "")),
            looksAuthor:
              it.b.kind === "paragraph" &&
              /^[*_]{1,2}.+[*_]{1,2}$/.test(head) &&
              bare.includes(","),
          };
        });

        const ai = parsed.findIndex((p) => p.looksAuthor);
        let author: string | undefined;
        let role: string | undefined;
        if (ai >= 0) {
          const [name, ...restRole] = parsed[ai].bare.split(",");
          author = name.trim() || undefined;
          role = restRole.join(",").trim() || undefined;
        }

        let orgName: string | undefined;
        let orgIdx = -1;
        if (ai >= 0) {
          const inline = parsed[ai].text.match(LINK_RE);
          if (inline) orgName = inline[1].trim();
          else
            for (const j of [ai - 1, ai + 1])
              if (orgIdx < 0 && parsed[j]?.isLinkOnly) {
                orgName = parsed[j].text.match(LINK_RE)![1].trim();
                orgIdx = j;
              }
        } else {
          orgIdx = parsed.findIndex((p) => p.isLinkOnly);
          if (orgIdx >= 0) orgName = parsed[orgIdx].text.match(LINK_RE)![1].trim();
        }

        const yandex =
          Boolean(mods.yandex) || mentionsYandex([author ?? "", role ?? ""]);
        const org = yandex ? undefined : orgName;
        const logo = org ? findSlug(org, logoIndex) : undefined;
        const speech = parsed.filter((_, i) => i !== ai && i !== orgIdx);

        const missing = [
          !author && "имя",
          !role && "должность",
          !yandex && !org && "организация",
          org && !logo && `логотип «${org}» не найден в каталоге`,
        ].filter(Boolean) as string[];

        return [
          {
            component: "Quote",
            size: mods.size === "S" ? "S" : "L",
            author,
            role,
            org,
            logo,
            yandex: yandex || undefined,
            paragraphs: speech.map((p) => stripEmph(p.text)),
          },
          ...(missing.length
            ? [{ component: "note" as const, text: `Дополнить авторство: ${missing.join(", ")}` }]
            : []),
        ];
      }

      case "Text":
        return items.map((it): Node =>
          // size=Phrase остаётся от старой разметки, когда фраза была вариантом
          // Text. Теперь это отдельный компонент Phrase — так и собираем.
          mods.size === "Phrase"
            ? { component: "Phrase", size: "L", text: md(it, fix) }
            : {
                component: "Text",
                size: (["XL", "L", "M", "S"] as const).includes(mods.size as "L")
                  ? (mods.size as TextSize)
                  : "L",
                text: md(it, fix),
              },
        );

      case "Phrase":
        return items.map((it) => ({
          component: "Phrase" as const,
          size: mods.size === "M" ? "M" : "L",
          text: md(it, fix),
        }));

      case "Heading":
        return items.map((it) => ({
          component: "Heading" as const,
          level: (["H2", "H3", "H4", "H5"] as const).includes(mods.level as "H2")
            ? (mods.level as HeadingLevel)
            : "H2",
          text: headingText(md(it, fix), fix),
        }));

      case "List": {
        const marker =
          mods.marker === "Number" ? "Number" : mods.marker === "Icon" ? "Icon" : "Dot";
        return [
          {
            component: "List Container",
            ordered: marker === "Number",
            children: items.flatMap((it): Node[] =>
              it.b.kind === "list"
                ? it.b.items.map((li) => ({
                    component: "List Item" as const,
                    size: "L" as const,
                    type: marker,
                    text: liText(it, li),
                  }))
                : [{ component: "List Item", size: "L", type: marker, text: md(it, fix) }],
            ),
          },
        ];
      }

      case "Prompt": {
        const head = items[0] ? md(items[0]).replace(/\*\*/g, "") : "Заготовка";
        const text = items.slice(1).map((it) => md(it)).join("\n\n");
        return [
          {
            component: "Prompt",
            title: head,
            warning: "Проверьте текст перед использованием — вслепую применять нельзя.",
            text: text || head,
          },
        ];
      }

      default:
        return [
          { component: "note", text: `${dir.targetLabel}: сборки пока нет` },
          ...items.flatMap((it) => plainNodes(it, fix)),
        ];
    }
  };

  const allGroups = groupsOfDoc(sections, directiveAt);
  const summary = allGroups.find(isPageSummary);

  const children: (SectionNode | Node)[] = [];
  if (summary) children.push(...mergeSiblings(guarded(summary)));

  /*
    Секция, чей собственный заголовок h2 ушёл ВНУТРЬ директивы (стал вопросом
    аккордеона или заголовком карточки), перестаёт быть секцией: заголовка у неё
    больше нет. Отдельный Section Container дал бы пустую отбивку и разорвал бы
    то, что дизайнер собирал одним блоком. Содержимое продолжает предыдущую
    секцию — ту, чей заголовок уцелел.

    Цель «Заголовок» не считается поглощением: там заголовок остаётся собой.
  */
  const absorbed = (si: number): boolean => {
    const first = sections[si]?.blocks[0];
    if (!first || first.kind !== "heading") return false;
    const d = directiveAt?.(si, 0);
    return isActive(d) && Boolean(d?.target) && d?.target !== "Heading";
  };

  const hostOf = (si: number): number => {
    let s = si;
    while (s > 0 && absorbed(s)) s -= 1;
    return s;
  };

  // Группа принадлежит секции, где началась: директива не рвётся границей h2.
  const bySection = new Map<number, PlacedGroup[]>();
  for (const g of allGroups) {
    if (g === summary) continue;
    const host = hostOf(g.si);
    const list = bySection.get(host);
    if (list) list.push(g);
    else bySection.set(host, [g]);
  }

  sections.forEach((sec, i) => {
    const kids: Node[] = [];
    for (const g of bySection.get(i) ?? []) {
      const nodes = guarded(g);
      if (needsCard(g))
        kids.push({
          component: "Card Container",
          orientation: cardOrientation(g),
          children: nodes,
        });
      else kids.push(...nodes);
    }
    /*
      Секция без содержимого не рисуется: её заголовок ушёл внутрь директивы,
      начавшейся выше (стал вопросом аккордеона). Пустой Section Container дал
      бы лишнюю отбивку на пустом месте.
    */
    if (!kids.length) return;
    children.push({
      component: "Section Container",
      anchor: sec.anchor,
      children: mergeSiblings(kids),
    });
  });

  return { module: moduleId, children };
}

/*
  Выгрузка для разработчика: то же дерево, но без служебных пометок инструмента
  и без пустых полей. В JSON едет только контент — так решено, чтобы структура
  была чёткой и без мусора.
*/
export function toExport<T extends Node | SectionNode>(nodes: T[]): unknown[] {
  const clean = (n: Node | SectionNode): unknown | null => {
    if ((n as Node).component === "note") return null;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(n)) {
      if (v === undefined || v === null || v === false) continue;
      if (Array.isArray(v) && v.length === 0) continue;
      if (typeof v === "string" && !v.trim()) continue;
      if (k === "children") {
        const kids = (v as Node[]).map(clean).filter(Boolean);
        if (kids.length) out.children = kids;
        continue;
      }
      out[k] = v;
    }
    return out;
  };
  return nodes.map(clean).filter(Boolean);
}

export function docToExport(doc: Doc) {
  return { module: doc.module, children: toExport(doc.children) };
}

/*
  РАССТАНОВКА ДИРЕКТИВ ПО ПОЗИЦИЯМ.

  Почему не по тексту: id блока считается от его текста и якоря раздела, а
  повторяющиеся строки («**Миф**», «**Пояснение**») стоят в каждом из девяти
  мифов ОДНОГО раздела — id у них совпадает. Если отдавать такой блок «первой
  попавшейся» директиве, группа рвётся: заголовок остаётся в одной группе,
  хвост мифа — в другой, и аккордеон собирается пустым, с одним вопросом.

  Поэтому директиву прикладываем к документу целиком: ищем непрерывный участок,
  где подряд идущие id совпадают с её списком блоков. Уникальные соседи
  однозначно пришпиливают участок к нужному месту.

  Два прохода: сначала директивы с ЕДИНСТВЕННЫМ возможным местом, потом
  остальные — жадно, в первое свободное. Так директива из одного повторяющегося
  блока (шесть «**Почему это важно**») не отбирает место у той, которой деваться
  некуда.
*/
export function placeDirectives(
  sections: Section[],
  pathname: string,
  moduleId: string,
  directives: Directive[],
): (si: number, bi: number) => Directive | undefined {
  const flat: { key: string; id: string }[] = [];
  sections.forEach((sec, si) =>
    sec.blocks.forEach((b, bi) =>
      flat.push({ key: `${si}:${bi}`, id: blockRefId(b, pathname, sec.anchor) }),
    ),
  );

  const mine = directives.filter((d) => d.module === moduleId && d.blocks.length);
  const taken = new Set<number>();
  const map = new Map<string, Directive>();

  const candidates = (ids: string[]) => {
    const out: number[] = [];
    for (let p = 0; p + ids.length <= flat.length; p++) {
      let ok = true;
      for (let k = 0; k < ids.length; k++)
        if (flat[p + k].id !== ids[k]) {
          ok = false;
          break;
        }
      if (ok) out.push(p);
    }
    return out;
  };

  const place = (d: Directive, p: number) => {
    for (let k = 0; k < d.blocks.length; k++) {
      taken.add(p + k);
      map.set(flat[p + k].key, d);
    }
  };

  const pending: { d: Directive; at: number[] }[] = [];
  for (const d of mine) {
    const at = candidates(d.blocks.map((b) => b.id));
    if (at.length === 1) place(d, at[0]);
    else if (at.length > 1) pending.push({ d, at });
  }
  for (const { d, at } of pending) {
    const free = at.find((p) => d.blocks.every((_, k) => !taken.has(p + k)));
    if (free !== undefined) place(d, free);
  }

  return (si, bi) => map.get(`${si}:${bi}`);
}
