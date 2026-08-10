import { routeTitles } from "@/data/nav";
import type { OsnovyExport } from "./siteExport";

/*
  ПРОВЕРКА ВЫГРУЗКИ — сторож на границе с разработчиком.

  Сайт собирают руками в конструкторе Яндекса, и единственное, что туда едет, —
  этот JSON. Ошибку в нём никто не увидит: на прототипе страница выглядит
  нормально, а разработчик получает пустой контейнер, рваную таблицу или ссылку
  в никуда. Поэтому правила, о которых мы договорились письменно
  («Ответ разработчику — JSON.md», «КОМПОНЕНТЫ.md»), проверяются машиной.

  Правила проверяют ФОРМУ, а не содержание: пустое, битое, противоречивое,
  задвоенное, не по договорённости. Вкусовщину сюда не тащим — её ловит глаз.

  Проверки идут по ВЫГРУЗКЕ, а не по дереву внутри инструмента: у выгрузки свои
  правила (значения строчными, маркер списка поднят в контейнер, служебные поля
  срезаны), и разработчик видит именно её.
*/

export type Severity = "high" | "medium" | "low";

export type Problem = {
  /** Короткое имя правила — по нему проблемы группируются в списке. */
  rule: string;
  severity: Severity;
  /** Адрес страницы. */
  page: string;
  /** Путь до узла внутри страницы: article.3.children.2 — как в колонке JSON. */
  where: string;
  /** Что не так, человеческим языком. */
  message: string;
};

/*
  ЗАКРЫТЫЙ СПИСОК ИКОНОК. Обещан разработчику письмом от 28 июля: имена Lucide
  строчными через дефис, «если раскладке понадобится что-то сверх — придём к
  тебе, а не добавим молча». Проверка и есть та самая дверь: новая иконка
  зажигает предупреждение, а не уезжает тихо.
*/
export const ALLOWED_ICONS = new Set([
  // Девятнадцать из письма.
  "users", "file-text", "scale", "clock", "wallet", "graduation-cap",
  "alert-triangle", "list-checks", "search", "message-square", "shield-check",
  "accessibility", "building-2", "heart", "handshake", "target", "lightbulb",
  "info", "link",
  // Маркеры пункта списка: галочка по умолчанию, минус для «чего не делать».
  "check", "minus",
  // Иконки кнопок из второй части письма.
  "download", "copy", "arrow-right", "external-link", "mail",
]);

/** Имена компонентов, о которых договорились. Всё остальное — разъезд. */
export const ALLOWED_COMPONENTS = new Set([
  "Section Container", "Page Summary", "Heading", "Text", "Phrase", "Stack",
  "List Item", "Block", "General Card", "Accordion", "Quote", "Table",
  "Table cell", "Image", "Video", "Person Item", "Prompt", "Card Button",
  "Compare", "Compare Card", "Quiz", "Feedback", "Read More", "Read More Item",
]);

/** Цвета фона карточки — семь токенов card/bg-* из описания системы. */
const CARD_COLORS = new Set(["blue", "yellow", "pink", "green", "white", "beige", "gray"]);

/*
  Контейнеры, у которых нет своего содержимого: они только держат детей.
  Пустой такой контейнер — рамка с отступом сверху и пустое место в вёрстке.
*/
const WRAPPERS = new Set(["Block", "Stack", "Section Container", "Page Summary", "Compare", "Read More"]);

/*
  ГЛАВНОЕ ПРАВИЛО РАСКЛАДКИ (КОМПОНЕНТЫ.md): прямо в слот раздела кладётся
  проза, всё остальное заворачивается в Block.

  Проза — это не только заголовок и абзац. Список (Stack) в описании системы
  назван прямо: «кладётся куда угодно: в секцию, в карточку, в Compare Card,
  в аккордеон», и лишний конверт вокруг него ломает отступы — 48 вместо 16
  (см. NON_PROSE в contentTree.ts). Акцентная фраза (Phrase) — тоже проза,
  это выделенная мысль внутри потока, а не блок. Кнопка в потоке текста —
  оговорённое исключение.
*/
const SECTION_DIRECT = new Set([
  "Heading", "Text", "Phrase", "Stack", "Block", "Card Button", "Page Summary",
]);

/** Поля, значения которых по договорённости едут строчными. */
const LOWER_FIELDS = ["marker", "variant", "orientation", "state", "tone"] as const;

/** Поля, которые несут текст для читателя. */
const TEXT_FIELDS = ["text", "title", "question", "author", "role", "org", "subtitle", "caption", "description", "explanation"];

/** Служебные поля инструмента: в выгрузке их быть не должно. */
const INTERNAL_FIELDS = ["at", "join", "ordered"];

type Rec = Record<string, unknown>;

const isRec = (v: unknown): v is Rec => !!v && typeof v === "object" && !Array.isArray(v);
const kids = (n: Rec): Rec[] => (Array.isArray(n.children) ? (n.children as unknown[]).filter(isRec) : []);
const str = (v: unknown): string => (typeof v === "string" ? v : "");

/*
  ОСТАТКИ MARKDOWN. Внутри инструмента текст живёт в markdown, а на границе
  выгрузки переводится в теги (mdToTags). Если звёздочки или квадратные скобки
  доехали до разработчика — перевод где-то не сработал, и читатель увидит
  «**жирный**» звёздочками.
*/
const MD_LEFTOVERS: [RegExp, string][] = [
  [/\*\*/, "двойные звёздочки — жирный не перевёлся в тег"],
  [/\[[^\]]+\]\([^)]*\)/, "ссылка осталась в markdown, а не тегом"],
  [/(^|\n)#{2,}\s/, "заголовок решётками внутри текста"],
  [/\{\{[^}]*\}\}/, "подсказка-тултип осталась в фигурных скобках"],
  [/&amp;(amp|lt|gt|quot);/, "двойное экранирование"],
  [/(^|\n)\s*[•·]\s/, "маркер списка символом внутри текста"],
];

/** Следы курса, которых на сайте быть не должно. */
const COURSE_TRACES = /\b(модул[ья]|в этом модуле|пройдите тест|в следующей редакции гида)\b/i;

function checkText(field: string, value: string, add: (rule: string, sev: Severity, msg: string) => void) {
  if (!value.trim()) {
    add("пустой-текст", "high", `Поле «${field}» пустое`);
    return;
  }
  for (const [re, what] of MD_LEFTOVERS)
    if (re.test(value)) add("остатки-разметки", "high", `${what} — поле «${field}»: ${value.slice(0, 70)}`);
  if (COURSE_TRACES.test(value))
    add("след-курса", "medium", `След курса в поле «${field}»: ${value.slice(0, 70)}`);
  if (/ {2,}/.test(value)) add("двойной-пробел", "low", `Два пробела подряд в поле «${field}»`);
}

/** Все href из тегов внутри текста плюс собственные адреса узлов. */
function hrefsOf(n: Rec): { href: string; external: boolean }[] {
  const out: { href: string; external: boolean }[] = [];
  for (const v of Object.values(n)) {
    const texts = typeof v === "string" ? [v] : Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
    for (const t of texts as string[]) {
      const re = /<a\s+href="([^"]*)"([^>]*)>/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(t))) out.push({ href: m[1], external: /rel="external"/.test(m[2]) });
    }
  }
  if (typeof n.href === "string") out.push({ href: n.href, external: /^https?:/.test(n.href) });
  return out;
}

function checkNode(n: Rec, page: string, where: string, ctx: Ctx, out: Problem[]) {
  const comp = str(n.component);
  const add = (rule: string, severity: Severity, message: string) =>
    out.push({ rule, severity, page, where, message });

  if (!ALLOWED_COMPONENTS.has(comp))
    add("имя-компонента", "high", `Компонента «${comp}» нет в списке, согласованном с разработчиком`);

  if (WRAPPERS.has(comp) && !kids(n).length)
    add("пустой-конверт", "high", `«${comp}» без содержимого — на странице это пустая рамка`);

  for (const f of INTERNAL_FIELDS)
    if (f in n) add("служебное-поле", "medium", `Служебное поле «${f}» уехало в выгрузку`);

  for (const f of LOWER_FIELDS) {
    const v = str(n[f]);
    if (v && v !== v.toLowerCase())
      add("перечисление-не-строчное", "medium", `«${f}: ${v}» — договорились писать строчными`);
  }

  const icon = str(n.icon);
  if (icon && !ALLOWED_ICONS.has(icon))
    add("иконка-не-из-списка", "medium", `Иконки «${icon}» нет в закрытом списке, обещанном разработчику`);

  for (const f of TEXT_FIELDS) if (typeof n[f] === "string") checkText(f, n[f] as string, add);
  if (Array.isArray(n.paragraphs))
    (n.paragraphs as unknown[]).forEach((p, i) => typeof p === "string" && checkText(`абзац ${i + 1}`, p, add));

  for (const { href, external } of hrefsOf(n)) {
    if (!href.trim()) add("ссылка-пустая", "high", "Ссылка без адреса");
    else if (/^https?:\/\//.test(href)) {
      if (!external) add("ссылка-без-пометки", "medium", `Внешняя ссылка без rel="external": ${href}`);
      if (/localhost|example\.com|TODO/i.test(href)) add("ссылка-заглушка", "high", `Адрес-заглушка: ${href}`);
    } else if (href.startsWith("/")) {
      /*
        Сверяем с адресами САЙТА, а не с выгрузкой. Хабы треков («Для компаний»,
        «Для НКО») собраны руками — это навигация, а не материал источника, и в
        JSON их нет намеренно. Ссылка на такой хаб верная.
      */
      if (!ctx.routes.has(href.split("#")[0]))
        add("ссылка-в-никуда", "high", `Внутренняя ссылка ведёт на адрес, которого на сайте нет: ${href}`);
    } else if (!/^(mailto:|tel:|#)/.test(href))
      add("ссылка-протокол", "high", `Адрес не по правилу «внешняя с протоколом, внутренняя от корня»: ${href}`);
  }

  switch (comp) {
    case "Section Container":
      for (const [i, c] of kids(n).entries())
        if (!SECTION_DIRECT.has(str(c.component)))
          out.push({
            rule: "в-секции-без-конверта",
            severity: "medium",
            page,
            where: `${where}.children.${i}`,
            message: `«${str(c.component)}» лежит в разделе напрямую — по правилу раскладки его заворачивают в Block`,
          });
      break;

    case "Heading": {
      const anchor = str(n.anchor);
      if (!anchor) add("якорь-пустой", "medium", "У заголовка нет якоря — к нему нельзя дать ссылку");
      else if (!/^[a-z0-9-]+$/.test(anchor))
        add("якорь-не-латиница", "medium", `Якорь «${anchor}» не из латинских букв, цифр и дефисов`);
      else if (ctx.anchors.has(anchor)) add("якорь-дубль", "high", `Якорь «${anchor}» на странице уже занят`);
      ctx.anchors.add(anchor);
      break;
    }

    case "General Card": {
      const bg = str(n.bgColor);
      if (bg && !CARD_COLORS.has(bg)) add("цвет-карточки", "medium", `Цвет фона «${bg}» не из семи токенов card/bg-*`);
      break;
    }

    case "Quote": {
      if (!str(n.org)) add("цитата-неполная", "high", "У цитаты нет организации — логотип останется без подписи");
      if (!str(n.logo)) add("цитата-неполная", "high", "У цитаты нет логотипа");
      if (!Array.isArray(n.paragraphs) || !n.paragraphs.length)
        add("цитата-неполная", "high", "У цитаты нет текста");
      /*
        Исключение из правила «имя и должность всегда»: на «Инклюзивном
        трудоустройстве» говорит не человек, а фонд ОРБИ — подписью работает
        название организации. Оно описано разработчику письмом.
      */
      if (!str(n.author) && !str(n.photo) && str(n.org) !== "ОРБИ")
        add("цитата-без-автора", "medium", `Цитата без имени автора (организация: ${str(n.org)})`);
      break;
    }

    case "Table": {
      const header = Array.isArray(n.header) ? (n.header as unknown[]) : [];
      const rows = Array.isArray(n.rows) ? (n.rows as unknown[][]) : [];
      if (!str(n.caption)) add("таблица-без-подписи", "medium", "У таблицы нет caption для скринридера");
      if (!header.length) add("таблица-без-шапки", "high", "У таблицы нет шапки");
      rows.forEach((row, i) => {
        if (Array.isArray(row) && header.length && row.length !== header.length)
          out.push({
            rule: "таблица-рваная",
            severity: "high",
            page,
            where: `${where}.rows.${i}`,
            message: `В строке ${i + 1} ячеек ${row.length}, а в шапке столбцов ${header.length}`,
          });
      });
      break;
    }

    case "Quiz": {
      const items = Array.isArray(n.items) ? (n.items as Rec[]) : [];
      const correct = items.filter((it) => it.correct === true);
      if (!items.length) add("квиз-без-вариантов", "high", "У квиза нет вариантов ответа");
      if (items.length && !correct.length) add("квиз-без-верного", "high", "Ни один вариант не отмечен верным");
      const mode = str(n.mode);
      if (mode === "single" && correct.length > 1)
        add("квиз-режим", "high", `Режим single, а верных вариантов ${correct.length}`);
      if (mode === "multiple" && correct.length === 1)
        add("квиз-режим", "medium", "Режим multiple, а верный вариант один");
      const seen = new Set<string>();
      for (const it of items) {
        const t = str(it.text).trim();
        if (!t) add("квиз-пустой-вариант", "high", "Пустой вариант ответа");
        else if (seen.has(t)) add("квиз-дубль-варианта", "medium", `Вариант «${t.slice(0, 40)}» повторяется`);
        seen.add(t);
      }
      if (!str(n.explanation)) add("квиз-без-разбора", "low", "У квиза нет разбора");
      break;
    }

    case "Person Item":
      if (!str(n.name)) add("человек-без-имени", "high", "У карточки человека нет имени");
      if (!str(n.photo)) add("человек-без-фото", "low", "У карточки человека нет фотографии");
      break;

    case "Image":
      if (!str(n.src)) add("медиа-без-адреса", "high", "У картинки нет файла");
      break;

    case "Video":
      if (!str(n.href)) add("медиа-без-адреса", "high", "У видео нет адреса");
      break;
  }

  kids(n).forEach((c, i) => checkNode(c, page, `${where}.children.${i}`, ctx, out));
  if (Array.isArray(n.rows))
    (n.rows as unknown[][]).forEach((row, ri) =>
      (Array.isArray(row) ? row : []).forEach((cell, ci) => {
        if (isRec(cell)) checkNode(cell, page, `${where}.rows.${ri}.${ci}`, ctx, out);
      }),
    );
}

/** routes — все адреса сайта (страницы выгрузки плюс рукописные хабы). */
type Ctx = { routes: Set<string>; anchors: Set<string> };

/*
  МЕТА СТРАНИЦЫ. Длина описания важна не для красоты: поисковая выдача режет
  описание примерно на ста шестидесяти знаках, и обрезанная фраза выглядит как
  недоделка. Пустое описание уже случалось — страницу добавили, описание
  забыли, и заметить это глазами было нельзя.
*/
function checkPage(page: Rec, ctx: Ctx, out: Problem[]) {
  const slug = str(page.slug);
  const add = (rule: string, severity: Severity, message: string) =>
    out.push({ rule, severity, page: slug, where: "meta", message });

  if (!str(page.h1)) add("страница-без-h1", "high", "У страницы нет заголовка h1");

  const meta = isRec(page.meta) ? page.meta : {};
  const og = isRec(page["meta-og"]) ? (page["meta-og"] as Rec) : {};
  const title = str(meta.title);
  const description = str(meta.description);

  if (!title) add("мета-пусто", "high", "Пустой title — вкладка браузера и выдача поиска останутся без названия");
  else if (title.length > 65) add("мета-длина", "low", `Title длиной ${title.length} знаков — в выдаче обрежется`);
  if (!description) add("мета-пусто", "high", "Пустое description — в выдаче поиска не будет подписи");
  else if (description.length > 160)
    add("мета-длина", "low", `Description длиной ${description.length} знаков — в выдаче обрежется`);
  if (!str(og.title) || !str(og.description))
    add("мета-og-пусто", "medium", "У карточки для мессенджеров нет заголовка или описания");
}

/** Пройти по всей выгрузке и собрать список проблем. */
export function checkExport(site: OsnovyExport): Problem[] {
  const out: Problem[] = [];
  const pages = (site.pages ?? []) as unknown as Rec[];
  const routes = new Set([...pages.map((p) => str(p.slug)), ...Object.keys(routeTitles)]);

  const seenSlugs = new Set<string>();
  const seenDescriptions = new Map<string, string>();

  for (const page of pages) {
    const slug = str(page.slug);
    if (seenSlugs.has(slug))
      out.push({ rule: "страница-дубль", severity: "high", page: slug, where: "slug", message: "Такой адрес в выгрузке уже есть" });
    seenSlugs.add(slug);

    const description = str(isRec(page.meta) ? page.meta.description : "");
    const twin = seenDescriptions.get(description);
    if (description && twin)
      out.push({
        rule: "мета-дубль",
        severity: "medium",
        page: slug,
        where: "meta",
        message: `Описание слово в слово совпадает со страницей ${twin} — поиск сочтёт страницы одинаковыми`,
      });
    if (description) seenDescriptions.set(description, slug);

    const ctx: Ctx = { routes, anchors: new Set() };
    checkPage(page, ctx, out);
    const article = Array.isArray(page.article) ? (page.article as unknown[]) : [];
    article.forEach((n, i) => {
      if (isRec(n)) checkNode(n, slug, `article.${i}`, ctx, out);
    });
  }

  return out;
}

const ORDER: Record<Severity, number> = { high: 0, medium: 1, low: 2 };

/** Проблемы, сгруппированные по правилу: сначала самые тяжёлые. */
export function groupProblems(problems: Problem[]): { rule: string; severity: Severity; items: Problem[] }[] {
  const byRule = new Map<string, Problem[]>();
  for (const p of problems) {
    const list = byRule.get(p.rule);
    if (list) list.push(p);
    else byRule.set(p.rule, [p]);
  }
  return [...byRule.entries()]
    .map(([rule, items]) => ({ rule, severity: items[0].severity, items }))
    .sort((a, b) => ORDER[a.severity] - ORDER[b.severity] || b.items.length - a.items.length);
}
