import * as React from "react";
import {
  Accordion,
  CardContainer,
  SectionContainer,
  GeneralCard,
  Heading,
  Image,
  ListContainer,
  ListItem,
  PageSummary,
  Prompt,
  Quote,
  Table,
  TableCell,
  TableHeaderCell,
  TableRow,
  Text,
  Video,
  type GeneralCardBg,
} from "@/figma";
import { renderInline } from "@/editor-source/richText";
import { iconByName } from "./iconForText";
import { findSlug, mentionsYandex, useLogoIndex } from "./orgLogo";
import type { Directive } from "@/editor-source/directives";
import type { SourceBlock } from "@/editor-source/content/source.generated";
import type { Section } from "./PlaygroundColumn";
import type { ResolveMd } from "./blockResolve";

/*
  «Результат» — как контент выглядит, когда директивы применены. Это ЧИСТАЯ
  ФУНКЦИЯ от (блоки источника + директивы): ничего не генерится в файлы, ничего
  не переписывается. Поэтому откат бесплатный — вернул директиве статус «новая»,
  и блок снова рисуется как обычный текст.

  Участвуют только директивы со статусом «применена»/«проверена». Текст берётся
  через resolve (актуальная редакция) и ПЕРЕНОСИТСЯ как есть — переписывания нет.
  Единственные изменения текста — те, что заказчик попросил комментарием явно:
  «удалить» (блок не выводится) и «убрать жирный» (снимается **…**).
*/

type Item = { b: SourceBlock; anchor?: string };
type Group = { dir?: Directive; items: Item[] };

const isActive = (d?: Directive) =>
  !!d && (d.status === "applied" || d.status === "verified");

/*
  Инструкции из комментария, которые исполняются механически.

  ВАЖНО про удаление: правило намеренно СТРОГОЕ — только директива БЕЗ цели,
  чей комментарий и есть «удалить». Иначе фраза вроде «…упаковать в аккордеоны,
  удалить заголовок Пояснение» (где удалить надо кусок, а не всё) выбрасывала бы
  всю группу. Текст не должен пропадать из-за случайного совпадения слова.
*/
const wantsDelete = (d?: Directive) =>
  !!d && !d.target && /^\s*удали/i.test((d.comment || "").trim());
// ВНИМАНИЕ: во всех шаблонах ниже «хвост слова» — это \p{L} с флагом u, а НЕ \w.
// \w в JS — это [A-Za-z0-9_], кириллицу он не покрывает, поэтому «убра\w*\s+жирн»
// молча не совпадал с «Убрать жирный» и директива не исполнялась.
const wantsUnbold = (d?: Directive) =>
  !!d && /(убра|сня|без)\p{L}*\s+жирн/iu.test(d.comment || "");

/*
  Точечное удаление служебной подписи внутри директивы С целью: комментарий
  «…упаковать в аккордеоны. Удалить заголовок Пояснение» должен убрать блок-ярлык
  «Пояснение», а не всю группу (за группу целиком отвечает wantsDelete выше).

  Правило намеренно СТРОГОЕ вдвойне: из комментария берём слова после
  «удалить/убрать», а выбрасываем только блок, ВЕСЬ текст которого равен одному
  из них. Поэтому даже если в кандидаты попадёт лишнее слово, содержательный
  абзац пропасть не может — совпасть должен весь блок целиком.
*/
const SERVICE_WORD =
  /^(заголов\p{L}*|загловк\p{L}*|подпис\p{L}*|надпис\p{L}*|слов\p{L}*|строк\p{L}*|текст\p{L}*|блок\p{L}*|эти|все|всё)$/iu;

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

/** Блок целиком — служебный ярлык, названный в комментарии («**Пояснение**»). */
const isDroppedLabel = (raw: string, labels: string[]) => {
  const bare = raw.replace(/[*_]/g, "").replace(/:$/, "").trim().toLowerCase();
  return bare.length > 0 && labels.includes(bare);
};

const stripBold = (md: string) => md.replace(/\*\*(.+?)\*\*/g, "$1");

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
  ГЛАВНОЕ ПРАВИЛО РАСКЛАДКИ (КОМПОНЕНТЫ.md): в слот Section Container кладём
  ТОЛЬКО Heading и Text. Всё остальное — цитата, карточка, таблица, аккордеон,
  список, врезка — сначала заворачиваем в Card Container. Card Container
  обязателен даже для одного блока: это универсальный конверт для всего, что
  не проза, а не «обёртка для карточек».
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
  // List — это List Container, тоже не проза: в секцию напрямую не кладётся.
  "List",
]);

/** Page Summary живёт ВНЕ Section Container — один раз, в самом начале страницы. */
const isPageSummary = (g: Group) => g.dir?.target === "PageSummary";

function needsCard(g: Group): boolean {
  if (isPageSummary(g)) return false;
  if (g.dir?.target) return NON_PROSE.has(g.dir.target);
  const k = g.items[0]?.b.kind;
  // Блок-цитата без автора рисуется как Text · Phrase (см. PlainBlock), а Text
  // — проза и идёт в секцию напрямую. Конверт ему не нужен.
  return k === "table" || k === "image" || k === "list";
}

/*
  Ряд General Card собирается горизонтальным Card Container: две карточки по
  половине колонки бок о бок. Ориентацию несёт КОНВЕРТ, а не карточка.
*/
const cardOrientation = (g: Group) =>
  g.dir?.target === "GeneralCard" && g.dir.modifiers?.orient === "Horizontal"
    ? "Horizontal"
    : "Vertical";

export function ResultView({
  sections,
  directiveAt,
  resolve,
}: {
  sections: Section[];
  directiveAt?: (si: number, bi: number) => Directive | undefined;
  resolve: ResolveMd;
}) {
  /** Актуальная разметка блока (с правками), при необходимости без жирного. */
  const md = (it: Item, unbold = false): string => {
    const b = it.b;
    const type = b.kind === "heading" ? `h${b.level}` : "paragraph";
    const raw =
      b.kind === "table" || b.kind === "image"
        ? ""
        : resolve(type, (b as { text: string }).text, (b as { md: string }).md, it.anchor);
    return unbold ? stripBold(raw) : raw;
  };

  const sectionGroups = sections.map((sec, i) => groupsOf(sec, i, directiveAt));

  // Page Summary поднимаем над секциями: по правилу это вступление всей
  // страницы, а не блок раздела, в котором он оказался размечен.
  const summary = sectionGroups.flat().find(isPageSummary);

  const render = (g: Group, key: React.Key) => {
    const body = <GroupView group={g} md={md} resolve={resolve} />;
    return needsCard(g) ? (
      <CardContainer key={key} orientation={cardOrientation(g)}>
        {body}
      </CardContainer>
    ) : (
      <React.Fragment key={key}>{body}</React.Fragment>
    );
  };

  return (
    <div className="figma-scope mx-auto max-w-[var(--column-width)] px-6 pb-16">
      {summary && <GroupView group={summary} md={md} resolve={resolve} />}
      {sections.map((sec, i) => (
        <SectionContainer key={sec.anchor ?? `s-${i}`}>
          {sectionGroups[i]
            .filter((g) => g !== summary)
            .map((g, j) => render(g, j))}
        </SectionContainer>
      ))}
    </div>
  );
}

function GroupView({
  group,
  md,
  resolve,
}: {
  group: Group;
  md: (it: Item, unbold?: boolean) => string;
  resolve: ResolveMd;
}) {
  const { dir } = group;
  const logoIndex = useLogoIndex();

  // Комментарий «удалить» — блоки не выводим, но оставляем видимый след:
  // молча текст исчезать не должен, всегда понятно, что и почему убрано.
  if (wantsDelete(dir)) {
    return (
      <div className="ds-body-s py-2 text-[color:var(--text-secondary)]">
        — убрано по директиве: {group.items.length} блок(ов)
      </div>
    );
  }

  const unbold = wantsUnbold(dir);

  // «Удалить заголовок Пояснение» — выбрасываем блоки-ярлыки до сборки, чтобы
  // служебная подпись не попала ни в вопрос аккордеона, ни в тело карточки.
  const drop = labelsToDrop(dir);
  const items = drop.length
    ? group.items.filter((it) => !isDroppedLabel(md(it), drop))
    : group.items;

  // Без директивы (или директива без цели) — обычная раскладка блока.
  if (!dir?.target) {
    return (
      <>
        {items.map((it, i) => (
          <PlainBlock key={i} it={it} md={md} resolve={resolve} unbold={unbold} />
        ))}
      </>
    );
  }

  const mods = dir.modifiers || {};

  switch (dir.target) {
    case "PageSummary":
      return (
        <PageSummary>
          {items.map((it, i) =>
            it.b.kind === "list" ? (
              it.b.items.map((li, j) => (
                <ListItem key={`${i}-${j}`} size="L" type="Dot">
                  {renderInline(resolve("li", li.text, li.md, it.anchor))}
                </ListItem>
              ))
            ) : (
              <Text key={i} size="M">
                {renderInline(md(it, unbold))}
              </Text>
            ),
          )}
        </PageSummary>
      );

    case "GeneralCard": {
      // Заголовок карточки — ведущий **жирный** первого абзаца («**Пример:** …»).
      const first = items[0];
      const firstMd = first ? md(first) : "";
      const lead = firstMd.match(/^\s*\*\*(.+?)\*\*:?\s*/);
      // Хвостовая пунктуация в заголовке карточки не нужна: «**Пример.**» —
      // это подводка из текста, а в General Card это уже заголовок.
      const title = lead ? lead[1].replace(/[.:;]+$/, "") : undefined;
      const rest = lead ? firstMd.slice(lead[0].length) : firstMd;
      const IconCmp = first?.b && dir.blocks.find((x) => x.icon)?.icon;
      return (
        <GeneralCard
          title={title}
          bgColor={(mods.bg as GeneralCardBg) || "blue"}
          orient={mods.orient === "Horizontal" ? "Horizontal" : "Vertical"}
          iconNode={
            mods.icon && IconCmp
              ? React.createElement(iconByName(IconCmp))
              : undefined
          }
        >
          {rest.trim() && <Text size="M">{renderInline(rest)}</Text>}
          {items.slice(1).map((it, i) => (
            <PlainBlock key={i} it={it} md={md} resolve={resolve} unbold={unbold} inCard />
          ))}
        </GeneralCard>
      );
    }

    case "Accordion": {
      /*
        Новый аккордеон начинает заголовок ВЕРХНЕГО в этой группе уровня —
        обычно h3 с формулировкой мифа. Более мелкие заголовки («Кейс из
        практики», h4) — часть ответа, они уходят внутрь тела: иначе кусок
        объяснения отрывался в отдельный вопрос-ответ.
      */
      const topLevel = Math.min(
        ...items
          .filter((it) => it.b.kind === "heading")
          .map((it) => (it.b as { level: number }).level),
      );
      const out: React.ReactNode[] = [];
      let q: string | null = null;
      let body: Item[] = [];
      const flush = (key: number) => {
        if (q === null) return;
        out.push(
          <Accordion
            key={key}
            question={renderInline(q)}
            defaultOpen={mods.state === "Expanded"}
          >
            {body.map((it, i) => (
              <PlainBlock key={i} it={it} md={md} resolve={resolve} unbold={unbold} />
            ))}
          </Accordion>,
        );
        q = null;
        body = [];
      };
      items.forEach((it, i) => {
        const isTopHeading =
          it.b.kind === "heading" && (it.b as { level: number }).level === topLevel;
        if (isTopHeading) {
          flush(i);
          q = md(it);
        } else if (q !== null) {
          body.push(it);
        } else {
          out.push(
            <PlainBlock key={`p${i}`} it={it} md={md} resolve={resolve} unbold={unbold} />,
          );
        }
      });
      flush(items.length);
      return <>{out}</>;
    }

    case "Quote": {
      /*
        Вся группа — ОДНА цитата. Выделили несколько блоков и указали компонент,
        значит они должны быть УПАКОВАНЫ в него, а не разложены по отдельным
        карточкам (раньше выходило по цитате на каждый абзац речи).

        Разбираем строку авторства на три части: имя, должность, организация.
        Организацию берём ТОЛЬКО вплотную к строке авторства — ссылкой внутри
        неё или соседним блоком-ссылкой. Раньше годилась любая ссылка из
        выделения, и цитате Дарьи Дёминой (АШАН) доставался логотип ОРБИ из
        соседнего блока. Чего не нашли — не выдумываем, а помечаем маркером,
        чтобы не забыть дописать.
      */
      const LINK_RE = /\[([^\]]+)\]\((?:https?:)?\/\/[^)]+\)/;
      const stripEmph = (t: string) => t.replace(/^[*_]+|[*_]+$/g, "").trim();

      const parsed = items.map((it) => {
        const t = md(it).trim();
        // Ссылку в хвосте строки авторства отбрасываем перед проверкой, иначе
        // абзац перестаёт выглядеть курсивом целиком и имя теряется.
        const head = t.replace(new RegExp(`\\s*${LINK_RE.source}\\s*$`), "").trim();
        const bare = stripEmph(head);
        return {
          it,
          text: t,
          bare,
          isLinkOnly: it.b.kind === "paragraph" && LINK_RE.test(t) && !stripEmph(t.replace(LINK_RE, "")),
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

      // Организация: ссылка в самой строке авторства, иначе блок-ссылка вплотную.
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
        // Строки авторства нет вовсе — организацию всё равно берём, если в
        // выделении есть отдельный блок-ссылка: это она и есть.
        orgIdx = parsed.findIndex((p) => p.isLinkOnly);
        if (orgIdx >= 0) orgName = parsed[orgIdx].text.match(LINK_RE)![1].trim();
      }

      const yandex =
        Boolean(mods.yandex) || mentionsYandex([author ?? "", role ?? ""]);
      const org = yandex ? undefined : orgName;
      const logo = org ? findSlug(org, logoIndex) : undefined;

      // Речь — всё, кроме строки авторства и съеденного блока-ссылки.
      const speech = parsed.filter((_, i) => i !== ai && i !== orgIdx);

      // Чего не хватает в строке авторства — показываем явно, чтобы дописали.
      const missing = [
        !author && "имя",
        !role && "должность",
        !yandex && !org && "организация",
        org && !logo && `логотип «${org}» не найден в каталоге`,
      ].filter(Boolean) as string[];

      return (
        <>
          <Quote
            size={mods.size === "S" ? "S" : "L"}
            yandex={yandex}
            org={org}
            logo={logo}
            author={author}
            role={role}
          >
            {speech.map((p, i) => (
              <p key={i} className={i ? "mt-[var(--space-s)]" : undefined}>
                {renderInline(stripEmph(p.text))}
              </p>
            ))}
          </Quote>
          {missing.length > 0 && (
            <div className="ds-body-s pt-[var(--space-2xs)] text-[color:var(--text-secondary)]">
              ⚠ Дополнить авторство: {missing.join(", ")}
            </div>
          )}
        </>
      );
    }

    case "Text":
      return (
        <>
          {items.map((it, i) => (
            <Text
              key={i}
              size={
                (["XL", "L", "M", "S", "Phrase"] as const).includes(
                  mods.size as "L",
                )
                  ? (mods.size as "L")
                  : "L"
              }
            >
              {renderInline(md(it, unbold))}
            </Text>
          ))}
        </>
      );

    case "Heading":
      return (
        <>
          {items.map((it, i) => (
            <Heading
              key={i}
              level={
                (["H2", "H3", "H4", "H5"] as const).includes(mods.level as "H2")
                  ? (mods.level as "H2")
                  : "H2"
              }
            >
              {renderInline(md(it, unbold))}
            </Heading>
          ))}
        </>
      );

    case "List": {
      const marker =
        mods.marker === "Number" ? "Number" : mods.marker === "Icon" ? "Icon" : "Dot";
      return (
        <ListContainer as={marker === "Number" ? "ol" : "ul"}>
          {items.flatMap((it, i) =>
            it.b.kind === "list"
              ? it.b.items.map((li, j) => (
                  <ListItem key={`${i}-${j}`} size="L" type={marker}>
                    {renderInline(resolve("li", li.text, li.md, it.anchor))}
                  </ListItem>
                ))
              : [
                  <ListItem key={i} size="L" type={marker}>
                    {renderInline(md(it, unbold))}
                  </ListItem>,
                ],
          )}
        </ListContainer>
      );
    }

    case "Prompt": {
      // Первый блок — заголовок врезки, остальное — текст на копирование.
      const head = items[0] ? md(items[0]).replace(/\*\*/g, "") : "Заготовка";
      const body = items.slice(1).map((it) => md(it)).join("\n\n");
      return (
        <Prompt
          title={head}
          warning="Проверьте текст перед использованием — вслепую применять нельзя."
        >
          {body || head}
        </Prompt>
      );
    }

    default:
      // Цель, для которой отдельной сборки пока нет — рисуем как есть и говорим об этом.
      return (
        <>
          <div className="ds-body-s pt-2 text-[color:var(--text-secondary)]">
            {dir.targetLabel}: сборку добавлю отдельно
          </div>
          {items.map((it, i) => (
            <PlainBlock key={i} it={it} md={md} resolve={resolve} unbold={unbold} />
          ))}
        </>
      );
  }
}

/** Блок без директивы — обычная раскладка в стилях DS. */
function PlainBlock({
  it,
  md,
  resolve,
  unbold,
  inCard,
}: {
  it: Item;
  md: (it: Item, unbold?: boolean) => string;
  resolve: ResolveMd;
  unbold?: boolean;
  inCard?: boolean;
}) {
  const b = it.b;
  switch (b.kind) {
    case "heading":
      return (
        <Heading level={`H${b.level}` as "H2"}>
          {renderInline(md(it, unbold))}
        </Heading>
      );
    case "paragraph":
      return <Text size={inCard ? "M" : "L"}>{renderInline(md(it, unbold))}</Text>;
    case "quote":
      // Quote — только реальная речь человека с именем и должностью. Блок «>»
      // из источника автора не несёт, поэтому по правилу это Text · Phrase:
      // акцентная фраза-врезка курсивом с чертой слева.
      return <Text size="Phrase">{renderInline(md(it, unbold))}</Text>;
    case "list":
      return (
        <ListContainer as={b.ordered ? "ol" : "ul"}>
          {b.items.map((li, j) => (
            <ListItem key={j} size="L" type={b.ordered ? "Number" : "Dot"}>
              {renderInline(resolve("li", li.text, li.md, it.anchor))}
            </ListItem>
          ))}
        </ListContainer>
      );
    case "table":
      return (
        <Table>
          {b.header.some(Boolean) && (
            <TableRow header>
              {b.header.map((c, i) => (
                <TableHeaderCell key={i}>{renderInline(c)}</TableHeaderCell>
              ))}
            </TableRow>
          )}
          {b.rows.map((r, ri) => (
            <TableRow key={ri}>
              {r.map((c, ci) => (
                <TableCell key={ci}>{renderInline(c)}</TableCell>
              ))}
            </TableRow>
          ))}
        </Table>
      );
    case "image":
      return b.src ? <Image src={b.src} alt={b.alt} /> : <Video />;
  }
}
