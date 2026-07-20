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
export type TextSize = "XL" | "L" | "M" | "S" | "Phrase" | "Button";

export type Node =
  | { component: "Heading"; level: HeadingLevel; text: string }
  | { component: "Text"; size: TextSize; text: string }
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
  !!d && /(убра|сня|без)\p{L}*\s+жирн/iu.test(d.comment || "");

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

const isDroppedLabel = (raw: string, labels: string[]) => {
  const bare = raw.replace(/[*_]/g, "").replace(/:$/, "").trim().toLowerCase();
  return bare.length > 0 && labels.includes(bare);
};

const stripBold = (md: string) => md.replace(/\*\*(.+?)\*\*/g, "$1");

/*
  Заголовок несёт свой вес сам (Heading, вопрос аккордеона, заголовок карточки).
  В источнике такие строки часто обёрнуты в «**…**» — если оставить, жирность
  ляжет поверх жирности. Поэтому в заголовках разметку веса снимаем.
*/
const headingText = (t: string) => stripBold(t).trim();
const stripEmph = (t: string) => t.replace(/^[*_]+|[*_]+$/g, "").trim();

/** Группы внутри ОДНОЙ секции: подряд идущие блоки одной директивы — вместе. */
function groupsOf(
  sec: Section,
  si: number,
  directiveAt?: (si: number, bi: number) => Directive | undefined,
): Group[] {
  const groups: Group[] = [];
  let cur: Group | null = null;
  sec.blocks.forEach((b, bi) => {
    const d = directiveAt?.(si, bi);
    const active = isActive(d) ? d : undefined;
    if (active && cur?.dir?.id === active.id) {
      cur.items.push({ b, anchor: sec.anchor });
    } else {
      cur = { dir: active, items: [{ b, anchor: sec.anchor }] };
      groups.push(cur);
    }
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
  // Блок-цитата без автора становится Text · Phrase — это проза, конверт не нужен.
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

function mergeLists(nodes: Node[]): Node[] {
  const out: Node[] = [];
  for (const raw of nodes) {
    // Сначала внутрь: аккордеоны и карточки тоже держат списки.
    const n: Node =
      "children" in raw && Array.isArray(raw.children)
        ? ({ ...raw, children: mergeLists(raw.children) } as Node)
        : raw;

    const prev = out[out.length - 1];
    const a = listInside(prev);
    const b = listInside(n);
    if (a && b && a.ordered === b.ordered) {
      const merged = { ...a, children: [...a.children, ...b.children] };
      // Склеенный список кладём обратно в ту же обёртку, что была у соседа.
      out[out.length - 1] =
        prev!.component === "Card Container"
          ? { ...prev!, children: [merged] }
          : merged;
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
  /** Актуальная разметка блока (с учётом правок), при необходимости без жирного. */
  const md = (it: Item, unbold = false): string => {
    const b = it.b;
    const type = b.kind === "heading" ? `h${b.level}` : "paragraph";
    // У таблицы, картинки и СПИСКА своего поля text нет: у списка текст живёт
    // в items. Без этой проверки адрес правки считался бы от undefined и падал.
    const raw =
      b.kind === "table" || b.kind === "image" || b.kind === "list"
        ? ""
        : resolve(type, (b as { text: string }).text, (b as { md: string }).md, it.anchor);
    return unbold ? stripBold(raw) : raw;
  };

  const liText = (it: Item, li: { text: string; md: string }) =>
    resolve("li", li.text, li.md, it.anchor);

  /** Блок без директивы — обычная раскладка по правилам системы. */
  const plainNodes = (it: Item, unbold: boolean, inCard = false): Node[] => {
    const b = it.b;
    switch (b.kind) {
      case "heading":
        return [
          {
            component: "Heading",
            level: `H${b.level}` as HeadingLevel,
            text: headingText(md(it, unbold)),
          },
        ];
      case "paragraph":
        // Body L — только проза страницы, вне карточек и прочих компонентов.
        // Внутри General Card, аккордеона и подобных текст на ступень мельче.
        return [{ component: "Text", size: inCard ? "M" : "L", text: md(it, unbold) }];
      case "quote":
        // Quote — только речь человека с именем. Блок «>» автора не несёт,
        // поэтому по правилу это Text · Phrase: фраза-врезка курсивом.
        return [{ component: "Text", size: "Phrase", text: md(it, unbold) }];
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

  const groupNodes = (g: Group): Node[] => {
    const { dir } = g;

    if (wantsDelete(dir))
      return [
        { component: "note", text: `убрано по директиве: ${g.items.length} блок(ов)` },
      ];

    const unbold = wantsUnbold(dir);
    const drop = labelsToDrop(dir);
    const items = drop.length
      ? g.items.filter((it) => !isDroppedLabel(md(it), drop))
      : g.items;

    if (!dir?.target) return items.flatMap((it) => plainNodes(it, unbold));

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
                : [{ component: "Text", size: "M", text: md(it, unbold) }],
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
        // Иконки лежат в директиве в том же порядке, что и блоки.
        const iconOf = (it: Item) =>
          dir.blocks.find((x) => x.snippet && md(it).startsWith(x.snippet.slice(0, 20)))
            ?.icon;

        for (const it of items) {
          const t = md(it, unbold);
          const lead = t.match(/^\s*\*\*(.+?)\*\*:?\s*/);
          const after = lead ? t.slice(lead[0].length) : t;
          /*
            Карточку начинает ЛИД — жирное начало, за которым идёт текст, либо
            заголовок. Блок целиком жирный («**Миф**», «**Пояснение**») — это
            служебный ярлык, а не заголовок карточки: он остаётся внутри
            текущей, иначе каждый ярлык плодил бы пустую карточку.
          */
          const startsCard =
            (lead && after.trim().length > 0) || it.b.kind === "heading";
          if (startsCard || !cards.length) {
            // Хвостовая пунктуация в заголовке не нужна: «**Пример.**» → «Пример».
            const title = lead
              ? lead[1].replace(/[.:;]+$/, "")
              : it.b.kind === "heading"
                ? headingText(t)
                : undefined;
            const rest = lead ? after : it.b.kind === "heading" ? "" : t;
            const icon = iconOf(it);
            cards.push({
              component: "General Card",
              orient: "Vertical",
              bgColor: bg,
              icon: mods.icon && icon ? icon : undefined,
              title,
              children: rest.trim()
                ? [{ component: "Text", size: "M", text: rest.trim() }]
                : [],
            });
          } else {
            const last = cards[cards.length - 1] as Extract<
              Node,
              { component: "General Card" }
            >;
            last.children.push(...plainNodes(it, unbold, true));
          }
        }
        return cards;
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
        const isExplainLabel = (t: string) =>
          /^[*_\s]*пояснени\p{L}*\s*:?[*_\s]*$/iu.test(t);
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
            q = headingText(md(it));
          } else if (q !== null) {
            // Тело аккордеона — внутри компонента: Body L там не используется.
            body.push(...plainNodes(it, unbold, true));
          } else {
            out.push(...plainNodes(it, unbold));
          }
        }
        flush();
        return out;
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
        return items.map((it) => ({
          component: "Text" as const,
          size: (["XL", "L", "M", "S", "Phrase"] as const).includes(mods.size as "L")
            ? (mods.size as TextSize)
            : "L",
          text: md(it, unbold),
        }));

      case "Heading":
        return items.map((it) => ({
          component: "Heading" as const,
          level: (["H2", "H3", "H4", "H5"] as const).includes(mods.level as "H2")
            ? (mods.level as HeadingLevel)
            : "H2",
          text: headingText(md(it, unbold)),
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
                : [{ component: "List Item", size: "L", type: marker, text: md(it, unbold) }],
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
          ...items.flatMap((it) => plainNodes(it, unbold)),
        ];
    }
  };

  const sectionGroups = sections.map((sec, i) => groupsOf(sec, i, directiveAt));
  const summary = sectionGroups.flat().find(isPageSummary);

  const children: (SectionNode | Node)[] = [];
  if (summary) children.push(...mergeLists(groupNodes(summary)));

  sections.forEach((sec, i) => {
    const kids: Node[] = [];
    for (const g of sectionGroups[i]) {
      if (g === summary) continue;
      const nodes = groupNodes(g);
      if (needsCard(g))
        kids.push({
          component: "Card Container",
          orientation: cardOrientation(g),
          children: nodes,
        });
      else kids.push(...nodes);
    }
    children.push({
      component: "Section Container",
      anchor: sec.anchor,
      children: mergeLists(kids),
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
