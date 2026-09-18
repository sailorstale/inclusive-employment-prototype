import { routeTitles } from "@/data/nav";
import { KNOWN_ICONS } from "@/editor-source/source/iconForText";
import { isCompanyOrg } from "@/editor-source/source/orgLogo";
import { SMALL_IMAGE_SLUGS } from "@/figma/smallImageFiles";
import { editKeyConflicts } from "./clientEdits";
import { cardBlockConflicts } from "./importantCards";
import { isPlayerHref } from "./videoPlayers";
import { isPrototypePath } from "./hostedImages";
import { isFinalName } from "./hostedPhotos";
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
  ИКОНКИ. Список ОТКРЫТЫЙ — решение дизайнера: новую иконку Lucide берём, когда
  она нужна, и разработчику про неё говорим. Поэтому проверяем не «входит ли имя
  в утверждённый перечень», а «умеет ли прототип эту иконку нарисовать».

  Разница важная. Имя, которого нет в реестре (iconForText.tsx), прототип молча
  подменяет заглушкой «Info», а разработчик получает имя, которое никто не
  подключал, — и заметить это можно только случайно. Опечатка в имени выглядит
  ровно так же. Вот их проверка и ловит.
*/
const ALLOWED_ICONS = KNOWN_ICONS;

/*
  СТИКЕР-ИЛЛЮСТРАЦИЯ. Здесь список, наоборот, ЗАКРЫТЫЙ: сюжеты рисует дизайнер, и
  в наборе Small Image их ровно девятнадцать. В выгрузку сюжет уезжает слагом
  («important»), а перевод названия в слаг словарный — значит появился новый
  способ разъехаться молча: сюжет в наборе есть, а записи для него нет, и вместо
  слага уедет русское название. Глазами такое ловится случайно, поэтому ловим
  проверкой.
*/
const ALLOWED_IMAGES = new Set(SMALL_IMAGE_SLUGS);

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

/*
  ВНУТРИ КАРТОЧКИ И АККОРДЕОНА ВСЁ ОДНОГО РАЗМЕРА — M. Абзац и список рядом
  разного кегля разработчик собирает честно по файлу, и у него список
  оказывается крупнее подводки (показал 8 сентября 2026). Правило держит
  normalizeNode в contentTree; здесь — сторож, чтобы новое место сборки пунктов
  не вернуло L молча. Ходим сквозь Stack и Block, до вложенной карточки — у неё
  своя проверка.
*/
function checkInnerSizes(n: Rec, add: (rule: string, severity: Severity, message: string) => void) {
  const sizes = new Set<string>();
  const walk = (node: Rec) => {
    for (const c of kids(node)) {
      const comp = str(c.component);
      // Стек без пунктов (две цитаты, карточки) размера не несёт — его не судим.
      if ((comp === "Text" || comp === "Stack") && str(c.size)) sizes.add(`${comp} ${str(c.size)}`);
      if (comp === "Stack" || comp === "Block") walk(c);
    }
  };
  walk(n);
  const odd = [...sizes].filter((s) => !s.endsWith(" M"));
  if (odd.length)
    add(
      "размер-внутри-компонента",
      "medium",
      `Внутри ${str(n.component)} текст не M: ${odd.join(", ")} — абзацы и списки внутри компонента одного размера`,
    );
}
const str = (v: unknown): string => (typeof v === "string" ? v : "");

/*
  ОСТАТКИ MARKDOWN. Внутри инструмента текст живёт в markdown, а на границе
  выгрузки переводится в теги (mdToTags). Если звёздочки или квадратные скобки
  доехали до разработчика — перевод где-то не сработал, и читатель увидит
  «**жирный**» звёздочками.
*/
const MD_LEFTOVERS: [RegExp, Severity, string, string][] = [
  [/\*\*/, "high", "остатки-разметки", "двойные звёздочки — жирный не перевёлся в тег"],
  [/\[[^\]]+\]\([^)]*\)/, "high", "остатки-разметки", "ссылка осталась в markdown, а не тегом"],
  [/(^|\n)#{2,}\s/, "high", "остатки-разметки", "заголовок решётками внутри текста"],
  [/\{\{[^}]*\}\}/, "high", "остатки-разметки", "подсказка-тултип осталась в фигурных скобках"],
  [/&amp;(amp|lt|gt|quot);/, "high", "остатки-разметки", "двойное экранирование"],
  /*
    «Ромбик» U+FFFD появляется, когда текст прошёл через неверную
    перекодировку: буква потеряна безвозвратно и уедет на страницу такой.
  */
  [/�/, "high", "битый-символ", "вместо буквы стоит ромбик — текст где-то прошёл через неверную перекодировку"],
  [/(^|\n)\s*[•·☐]\s/, "medium", "список-символами", "маркер списка символом внутри текста — списком он не станет"],
  /*
    Перечисление дефисами внутри одного поля слипнется в сплошную строку
    «- Первое - Второе - Третье» вместо списка.
  */
  [/\s-\s[^-]{10,}\s-\s/, "medium", "список-символами", "перечисление дефисами внутри одной строки"],
  [/<(b|i|p|li|ul)>\s*<\/\1>/, "medium", "пустой-тег", "тег без содержимого"],
  /*
    Перенос строки внутри одного поля вёрстка съест: абзацы схлопнутся в один.
    Разбивать на абзацы должны отдельные узлы, а не символ переноса.
  */
  [/\n/, "medium", "перенос-в-поле", "перенос строки внутри поля — в вёрстке абзацы схлопнутся в один"],
];

/** Следы курса, которых на сайте быть не должно. */
const COURSE_TRACES = /\b(модул[ья]|в этом модуле|пройдите тест|в следующей редакции гида)\b/i;

function checkText(field: string, value: string, add: (rule: string, sev: Severity, msg: string) => void) {
  if (!value.trim()) {
    add("пустой-текст", "high", `Поле «${field}» пустое`);
    return;
  }
  for (const [re, sev, rule, what] of MD_LEFTOVERS)
    if (re.test(value)) add(rule, sev, `${what} — поле «${field}»: ${value.slice(0, 70)}`);
  if (COURSE_TRACES.test(value))
    add("след-курса", "medium", `След курса в поле «${field}»: ${value.slice(0, 70)}`);
  if (/ {2,}/.test(value)) add("двойной-пробел", "low", `Два пробела подряд в поле «${field}»`);
}

/*
  Все href из тегов внутри текста плюс собственные адреса узлов. У тега
  запоминаем хвост атрибутов: по нему сверяется договор о ссылках. У адреса-поля
  (href у Read More Item, Video) атрибутов нет и сверять нечего.
*/
function hrefsOf(n: Rec): { href: string; attrs?: string }[] {
  const out: { href: string; attrs?: string }[] = [];
  for (const v of Object.values(n)) {
    const texts = typeof v === "string" ? [v] : Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
    for (const t of texts as string[]) {
      const re = /<a\s+href="([^"]*)"([^>]*)>/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(t))) out.push({ href: m[1], attrs: m[2] });
    }
  }
  if (typeof n.href === "string") out.push({ href: n.href });
  return out;
}

/*
  ДОГОВОР О ССЫЛКАХ (журнал изменений разработчика от 30 августа 2026, раздел 2):
  тег уходит на страницу как есть, поэтому атрибуты обязаны стоять в данных.
  Наружу — target="_blank" rel="noreferrer external", внутрь сайта —
  target="_blank" rel="noopener", якорь «#…» — без атрибутов. Правило записано
  здесь второй раз нарочно: сторож сверяет выгрузку с договором, а не с кодом,
  который её собирает (см. linkAttrs в contentTree.ts).
*/
const LINK_ATTRS = {
  external: ' target="_blank" rel="noreferrer external"',
  internal: ' target="_blank" rel="noopener"',
  anchor: "",
};

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
    add(
      "иконка-не-заведена",
      "medium",
      `Иконку «${icon}» прототип нарисовать не умеет — заведите её в iconForText.ts или проверьте написание`,
    );

  /*
    Портрет и логотип едут адресом хостинга разработчика (hostedPhotos.ts). Имя
    вместо адреса значит, что файл разработчику ещё не отдан: у него на странице
    картинки не будет. Исключение — «yandex», его он держит именем сам.
  */
  for (const f of ["photo", "logo"] as const) {
    const v = str(n[f]);
    if (v && !/^https?:\/\//.test(v) && !isFinalName(v))
      add("портрет-не-на-хостинге", "medium", `Поле «${f}» едет именем «${v}», а не адресом хостинга — файл разработчику не отдан`);
  }

  const image = str(n.image);
  if (image && !ALLOWED_IMAGES.has(image))
    add(
      "картинка-не-заведена",
      "medium",
      `Сюжет «${image}» уехал не слагом — заведите его в smallImageFiles.ts или проверьте написание`,
    );

  for (const f of TEXT_FIELDS) if (typeof n[f] === "string") checkText(f, n[f] as string, add);

  for (const { href, attrs } of hrefsOf(n)) {
    if (!href.trim()) add("ссылка-пустая", "high", "Ссылка без адреса");
    else if (/^https?:\/\//.test(href)) {
      if (attrs !== undefined && attrs !== LINK_ATTRS.external)
        add("ссылка-без-пометки", "medium", `Внешняя ссылка не по договору — нужно${LINK_ATTRS.external}: ${href}`);
      if (/localhost|example\.com|TODO/i.test(href)) add("ссылка-заглушка", "high", `Адрес-заглушка: ${href}`);
      /*
        Адрес по http:// браузер помечает небезопасным, а часть сайтов по нему
        уже не отвечает. Соседние ссылки на те же сайты идут по https.
      */
      if (href.startsWith("http://"))
        add("ссылка-без-шифрования", "low", `Ссылка по http:// вместо https://: ${href}`);
    } else if (href.startsWith("/")) {
      /*
        Сверяем с адресами САЙТА, а не с выгрузкой. Хабы треков («Для компаний»,
        «Для НКО») собраны руками — это навигация, а не материал источника, и в
        JSON их нет намеренно. Ссылка на такой хаб верная.
      */
      if (!ctx.routes.has(href.split("#")[0]))
        add("ссылка-в-никуда", "high", `Внутренняя ссылка ведёт на адрес, которого на сайте нет: ${href}`);
      if (attrs !== undefined && attrs !== LINK_ATTRS.internal)
        add("ссылка-без-пометки", "medium", `Внутренняя ссылка не по договору — нужно${LINK_ATTRS.internal}: ${href}`);
    } else if (href.startsWith("#")) {
      if (attrs !== undefined && attrs !== LINK_ATTRS.anchor)
        add("ссылка-без-пометки", "medium", `Якорь внутри страницы едет с атрибутами, а по договору без них: ${href}`);
    } else if (!/^(mailto:|tel:)/.test(href))
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

    /*
      Заголовок, целиком завёрнутый в ссылку, ПРОВЕРКОЙ НЕ СЧИТАЕТСЯ: так
      задумано. Правило в headingLinks.ts: ссылку из заголовка вынимают только
      тогда, когда вокруг неё есть свой текст, а «заголовок, который целиком
      является ссылкой, не трогаем — там ссылка и есть имя того, на что она
      ведёт».
    */
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
      /*
        Заголовок у карточки необязателен по типу, но карточка без него — почти
        всегда та, у которой заголовок остался первым абзацем внутри: на
        странице он выглядит заголовком, а разработчик соберёт обычный текст.
      */
      if (!str(n.title))
        add("карточка-без-заголовка", "medium", "У карточки нет title — проверьте, не остался ли заголовок первым абзацем внутри");
      checkInnerSizes(n, add);
      break;
    }

    case "Accordion":
      checkInnerSizes(n, add);
      break;

    case "Quote": {
      const org = str(n.org);
      if (!org) add("цитата-неполная", "high", "У цитаты нет организации — логотип останется без подписи");
      /*
        Название организации уходит в alt логотипа: его прочитает вслух
        скринридер. Поэтому оно должно быть именем, а не куском фразы —
        с большой буквы, с парными кавычками и без имени автора внутри.
      */
      if (org) {
        const quotes = (org.match(/[«»"]/g) ?? []).length;
        if (quotes % 2) add("организация-битая", "high", `Непарная кавычка в названии организации: «${org}»`);
        if (/^[а-яё]/.test(org))
          add("организация-битая", "medium", `Название организации со строчной буквы — похоже на падежную форму: «${org}»`);
        if (str(n.author) && org.includes(str(n.author)))
          add("организация-битая", "medium", `В названии организации сидит имя автора: «${org}»`);
      }
      // У частных компаний логотипа нет по решению дизайнера (COMPANIES в
      // orgLogo) — это не дыра, а правило, и сторож о нём молчит.
      if (!str(n.logo) && !isCompanyOrg(org)) add("цитата-неполная", "high", "У цитаты нет логотипа");
      if (!str(n.text)) add("цитата-неполная", "high", "У цитаты нет текста");
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
      const caption = str(n.caption);
      if (!caption) add("таблица-без-подписи", "medium", "У таблицы нет caption для скринридера");
      /*
        Подпись собирается из ближайшего заголовка сверху и списка столбцов.
        Если сверху оказался ярлык-врезка («Важно», «Например»), подпись
        начинается с него и таблицу не называет: незрячий читатель услышит
        «Важно. Столбцы: …» и не поймёт, о чём таблица.
      */
      else {
        const head = caption.split("Столбцы:")[0].trim().replace(/\.$/, "");
        if (/^(Важно|Например|Пример|Обратите внимание|Итого|МИФ)\b/i.test(head) || head.length < 12)
          add("подпись-не-называет", "medium", `Подпись таблицы начинается со служебной строки: «${caption.slice(0, 70)}»`);
      }
      if (!header.length) add("таблица-без-шапки", "high", "У таблицы нет шапки");
      if (!rows.length) add("таблица-без-строк", "high", "У таблицы есть шапка, но нет ни одной строки");
      /*
        Пустая ячейка почти всегда значит, что содержимое съехало: в источнике
        стояла объединённая ячейка на несколько строк, при разборе она
        потерялась, и вся строка сдвинулась на колонку влево.
      */
      const blank = rows.filter((r) => Array.isArray(r) && r.some((c) => typeof c === "string" && !c.trim())).length;
      if (blank) add("таблица-пустые-ячейки", "medium", `Пустых ячеек в ${blank} строках — обычно это съехавшая разметка`);
      /*
        ШИРИНА СТРОКИ СЧИТАЕТСЯ С ОБЪЕДИНЕНИЯМИ. Ячейка с colSpan занимает
        несколько колонок, а ячейка с rowSpan забирает место в строках ниже —
        там её попросту нет. Считать голые длины строк после появления
        объединений нельзя: любая склейка выглядела бы как рваная таблица.
      */
      const carried: number[] = []; // сколько колонок заняты сверху в этой строке
      rows.forEach((row, i) => {
        if (!Array.isArray(row) || !header.length) return;
        let width = carried[i] ?? 0;
        for (const cell of row) {
          const span = isRec(cell) ? cell : null;
          const colSpan = typeof span?.colSpan === "number" ? span.colSpan : 1;
          const rowSpan = typeof span?.rowSpan === "number" ? span.rowSpan : 1;
          for (let r = 1; r < rowSpan; r += 1)
            carried[i + r] = (carried[i + r] ?? 0) + colSpan;
          width += colSpan;
        }
        if (width !== header.length)
          out.push({
            rule: "таблица-рваная",
            severity: "high",
            page,
            where: `${where}.rows.${i}`,
            message: `В строке ${i + 1} колонок ${width} (с учётом объединений), а в шапке столбцов ${header.length}`,
          });
      });
      break;
    }

    case "Quiz": {
      const items = Array.isArray(n.items) ? (n.items as Rec[]) : [];
      /*
        Квиз без вопроса бывает законно: у квиза-темы («Зрение», «Слух») вопрос
        весь в заголовке, и компонент намеренно не рисует пустое место
        (Quiz.tsx). Тревога только если нет ни вопроса, ни заголовка — тогда
        читателю нечего отвечать.
      */
      if (!str(n.question) && !str(n.title))
        add("квиз-без-вопроса", "high", "У квиза нет ни вопроса, ни заголовка — читателю нечего отвечать");
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
      /*
        Вердикт над разбором считается по correct, а разбор из источника сам
        начинался с «Верно.» — и слово шло дважды подряд. Срезает normalizeDoc
        (contentTree.ts); здесь ловим, если разбор пришёл в обход него.
      */
      for (const it of items) {
        if (/^\s*(?:не)?верно[.!]/iu.test(str(it.feedback)))
          add("квиз-вердикт-в-разборе", "medium", `Разбор варианта начинается со слова-вердикта: «${str(it.feedback).slice(0, 40)}»`);
      }
      if (!str(n.explanation)) add("квиз-без-разбора", "low", "У квиза нет разбора");
      break;
    }

    /*
      «Читайте также» ведёт ВНУТРИ своего раздела (решение Мити от 13 августа
      2026). Человек читает трек подряд, как инструкцию, и карточка в чужой
      раздел выбивает его из этого чтения. Раздел — первый кусок адреса:
      /general, /companies, /ngo.
    */
    case "Read More Item": {
      const href = str(n.href);
      const track = (s: string) => s.split("/")[1] ?? "";
      if (href.startsWith("/") && track(href) !== track(page))
        add(
          "читайте-также-наружу",
          "medium",
          `Карточка ведёт в раздел «${track(href)}», а страница из раздела «${track(page)}»`,
        );
      break;
    }

    case "Person Item": {
      if (!str(n.name)) add("человек-без-имени", "high", "У карточки человека нет имени");
      const photo = str(n.photo);
      if (!photo) add("человек-без-фото", "low", "У карточки человека нет фотографии");
      // Адрес хостинга у фото проверяет общее правило «портрет-не-на-хостинге»
      // выше: с 9 сентября 2026 фото едет адресом, как у цитат (hostedPhotos.ts).
      break;
    }


    case "Image":
      if (!str(n.src)) add("медиа-без-адреса", "high", "У картинки нет файла");
      /*
        Путь прототипа существует только у нас. Разработчик заливает схему к
        себе и присылает адрес, мы заводим его в hostedImages.ts — до этого
        картинка у него на странице битая.
      */
      else if (isPrototypePath(str(n.src)))
        add("картинка-не-на-хостинге", "medium", `Схема едет путём прототипа, а не адресом хостинга разработчика: ${str(n.src)}`);
      /*
        Без alt картинка для незрячего читателя не существует: скринридер
        прочитает имя файла или промолчит. Формат не ломается — поле
        необязательное, и в исходных документах подписи просто нет. Поэтому
        мелочью, но помечаем: это дырка в контенте, и закрыть её можно только
        руками.
      */
      if (!str(n.alt)) add("картинка-без-подписи", "low", "У картинки нет alt — для незрячего читателя её не существует");
      break;

    /*
      МАРКЕР СПИСКА ПОДНЯТ В КОНТЕЙНЕР (договорённость с разработчиком, п. 3).
      Оговорка там же: если внутри одного списка маркеры разные, поле остаётся
      у пунктов. Значит иконка у части пунктов при другом маркере контейнера —
      это не аккуратность, а склеенные в один два разных списка.
    */
    case "Stack": {
      const items = kids(n);
      const withIcon = items.filter((c) => str(c.icon)).length;
      if (withIcon && str(n.marker) !== "icon")
        add(
          "список-смешанный",
          "high",
          `Маркер списка «${str(n.marker)}», но у ${withIcon} пунктов из ${items.length} своя иконка — похоже, склеены два разных списка`,
        );
      /*
        Нумерованный список из одного пункта. Нумерация в нём смысла не несёт, а
        следующий такой же список начнёт счёт заново — читатель увидит два
        первых пункта подряд.
      */
      if (str(n.marker) === "number" && items.length === 1)
        add("список-из-одного", "low", "Нумерованный список из одного пункта — счёт начнётся заново у следующего");
      break;
    }

    case "Video":
      if (!str(n.href)) add("медиа-без-адреса", "high", "У видео нет адреса");
      /*
        Ролики с 30 августа 2026 едут адресом плеера Яндекса, а не файлом на
        Диске (см. videoPlayers.ts). Адрес Диска значит, что ролик новый и в
        таблицу плееров ещё не внесён.
      */
      else if (!isPlayerHref(str(n.href)))
        add("видео-не-плеер", "medium", `Ролик ведёт не на плеер Яндекса, а на файл: ${str(n.href)}`);
      /*
        Пропорции — со слэшем, как в CSS: «16/9», «2/3.5». Вариант через букву x
        разработчик отменил (ответ Евгении 9 сентября 2026).
      */
      if ("aspectRatio" in n && !/^\d+(\.\d+)?\/\d+(\.\d+)?$/.test(str(n.aspectRatio)))
        add("видео-пропорции", "medium", `Пропорции ролика не по договору — нужно «16/9» или «2/3.5»: ${str(n.aspectRatio)}`);
      break;
  }

  /*
    Два соседних узла, совпадающих байт в байт, — это задвоение при сборке, а не
    приём. Одна и та же строка «Открыть задание» подряд дважды выглядит как
    ошибка вёрстки и у нас, и у разработчика.
  */
  const children = kids(n);
  for (let i = 1; i < children.length; i += 1)
    if (JSON.stringify(children[i]) === JSON.stringify(children[i - 1]))
      out.push({
        rule: "узел-задвоен",
        severity: "medium",
        page,
        where: `${where}.children.${i}`,
        message: `Узел «${str(children[i].component)}» повторяет предыдущий слово в слово`,
      });

  children.forEach((c, i) => checkNode(c, page, `${where}.children.${i}`, ctx, out));
  if (Array.isArray(n.rows))
    (n.rows as unknown[][]).forEach((row, ri) =>
      (Array.isArray(row) ? row : []).forEach((cell, ci) => {
        const at = `${where}.rows.${ri}.${ci}`;
        if (isRec(cell)) checkNode(cell, page, at, ctx, out);
        /*
          Ячейка-строка тоже несёт текст: перечисление дефисами внутри неё
          слипнется в сплошную строку, а маркер «•» так и уедет символом.
          Проверяем теми же правилами, что и обычные поля.
        */
        else if (typeof cell === "string" && cell.trim())
          checkText("ячейка таблицы", cell, (rule, severity, message) =>
            out.push({ rule, severity, page, where: at, message }),
          );
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

  /*
    Страница есть в выгрузке, но её нет в навигации сайта. Значит попасть на
    неё можно только по прямому адресу: ни в меню, ни в крошках её нет, и
    заметить пропажу глазами нельзя — страница-то работает.
  */
  if (slug && !(slug in routeTitles))
    add("страница-вне-навигации", "medium", "Страница есть в выгрузке, но в навигации сайта её нет — читатель на неё не попадёт");

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

  /*
    Правки по замечаниям лежат по файлу на страницу, и ключом там всегда текст
    блока в источнике. Один и тот же текст принадлежит одной странице, поэтому
    совпадение ключа у двух страниц — ошибка: молча выиграет последний набор, а
    правка соседней страницы просто перестанет работать. Проверка не про
    выгрузку, но живёт здесь: это единственное место, куда человек смотрит перед
    отправкой результата разработчику.
  */
  for (const c of editKeyConflicts)
    out.push({
      rule: "правка-задвоена",
      severity: "high",
      page: c.pages[0],
      where: "clientEdits",
      message: `${c.kind} «${c.key}» заявлен сразу несколькими страницами: ${c.pages.join(", ")}. Работает только последняя.`,
    });

  /*
    То же самое у карточек: блок принадлежит одной карточке, и две записи на
    него значат, что две страницы взялись за один кусок.
  */
  for (const c of cardBlockConflicts)
    out.push({
      rule: "карточка-задвоена",
      severity: "high",
      page: c.pages[0],
      where: "importantCards",
      message: `Блок ${c.block} заявлен в карточку сразу несколькими страницами: ${c.pages.join(", ")}. Вторая запись не работает.`,
    });

  const seenSlugs = new Set<string>();
  const seenDescriptions = new Map<string, string>();

  for (const page of pages) {
    const slug = str(page.slug);
    if (seenSlugs.has(slug))
      out.push({ rule: "страница-дубль", severity: "high", page: slug, where: "slug", message: "Такой адрес в выгрузке уже есть" });
    seenSlugs.add(slug);

    /*
      Запись раздела меню («Основы», «Для НКО») — без содержимого, у неё только
      адрес и подпись (см. withHubs в siteExport). Меты и статьи у неё нет по
      устройству, проверять её как страницу нельзя.
    */
    if (!("article" in page)) {
      if (!str(page.navTitle))
        out.push({ rule: "раздел-без-подписи", severity: "high", page: slug, where: "navTitle", message: "У раздела меню нет подписи" });
      continue;
    }

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

    /*
      Два раздела с одинаковым заголовком H2 — почти всегда след перекройки:
      страницу собрали из разных мест источника, и один и тот же раздел приехал
      дважды. В оглавлении читатель увидит две одинаковые строки.
    */
    const h2 = new Set<string>();
    const collect = (n: unknown) => {
      if (Array.isArray(n)) return n.forEach(collect);
      if (!isRec(n)) return;
      if (n.component === "Heading" && n.level === "H2") {
        const t = str(n.text);
        if (h2.has(t))
          out.push({
            rule: "заголовок-задвоен",
            severity: "medium",
            page: slug,
            where: "article",
            message: `На странице два раздела с заголовком «${t}» — в оглавлении будут две одинаковые строки`,
          });
        h2.add(t);
      }
      Object.values(n).forEach((v) => v && typeof v === "object" && collect(v));
    };
    collect(article);

    /*
      «Читайте также» стоит внизу каждой страницы (pageStructure.ts). Страница
      без него — это тупик: читателю некуда идти дальше.
    */
    if (!JSON.stringify(article).includes('"Read More"'))
      out.push({
        rule: "страница-тупик",
        severity: "medium",
        page: slug,
        where: "article",
        message: "Внизу страницы нет блока «Читайте также» — читателю некуда идти дальше",
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
