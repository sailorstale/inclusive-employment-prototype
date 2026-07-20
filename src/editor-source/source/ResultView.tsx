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
import { findSlug, mentionsYandex, orgFromText, useLogoIndex } from "./orgLogo";
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
  directiveFor?: (b: SourceBlock, anchor?: string) => Directive | undefined,
): Group[] {
  const groups: Group[] = [];
  let cur: Group | null = null;
  for (const b of sec.blocks) {
    const d = directiveFor?.(b, sec.anchor);
    const active = isActive(d) ? d : undefined;
    if (active && cur?.dir?.id === active.id) {
      cur.items.push({ b, anchor: sec.anchor });
    } else {
      cur = { dir: active, items: [{ b, anchor: sec.anchor }] };
      groups.push(cur);
    }
  }
  return groups;
}

/*
  По правилу раскладки: Heading и Text ложатся прямо в Section Container, всё
  остальное — через Card Container. От этого же зависит воздух между блоками.
*/
const NON_PROSE = new Set([
  "PageSummary",
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

function needsCard(g: Group): boolean {
  if (g.dir?.target) return NON_PROSE.has(g.dir.target);
  const k = g.items[0]?.b.kind;
  return k === "quote" || k === "table" || k === "image";
}

export function ResultView({
  sections,
  directiveFor,
  resolve,
}: {
  sections: Section[];
  directiveFor?: (b: SourceBlock, anchor?: string) => Directive | undefined;
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

  return (
    <div className="figma-scope mx-auto max-w-[var(--column-width)] px-6 pb-16">
      {sections.map((sec, i) => (
        <SectionContainer key={sec.anchor ?? `s-${i}`}>
          {groupsOf(sec, directiveFor).map((g, j) => {
            const body = <GroupView group={g} md={md} resolve={resolve} />;
            // Не-проза живёт в Card Container — он же даёт нужный воздух.
            return needsCard(g) ? (
              <CardContainer key={j}>{body}</CardContainer>
            ) : (
              <React.Fragment key={j}>{body}</React.Fragment>
            );
          })}
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
      const title = lead ? lead[1].replace(/:$/, "") : undefined;
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
      // Каждый заголовок начинает новый аккордеон; блоки до первого — как есть.
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
        if (it.b.kind === "heading") {
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
      // Строка вида «**Имя, должность**» — авторство; блоки-цитаты — сама речь.
      let author: string | undefined;
      let role: string | undefined;
      // Полный текст строки авторства — в нём может стоять ссылка на фонд,
      // по которой ниже подбирается логотип.
      let creditLine: string | undefined;
      const rest: Item[] = [];
      const quotes: Item[] = [];
      for (const it of items) {
        const t = md(it).trim();
        // Ссылка на организацию часто дописана в конец строки авторства
        // («*Имя, должность* [Фонд «Действуй!»](…)»). Для распознавания автора
        // её отбрасываем, иначе абзац перестаёт выглядеть как курсив целиком
        // и имя теряется.
        const head = t.replace(/\s*\[[^\]]+\]\((?:https?:)?\/\/[^)]+\)\s*$/, "").trim();
        const bare = head.replace(/^[*_]+|[*_]+$/g, "");
        const looksAuthor =
          it.b.kind === "paragraph" &&
          /^[*_]{1,2}.+[*_]{1,2}$/.test(head) &&
          bare.includes(",");
        if (it.b.kind === "quote") quotes.push(it);
        else if (looksAuthor && !author) {
          const [name, ...restRole] = bare.split(",");
          author = name.trim();
          role = restRole.join(",").trim() || undefined;
          creditLine = t;
        } else rest.push(it);
      }
      const body = quotes.length ? quotes : rest;

      /*
        Логотип прорастает из самого источника: организацию ищем в строке
        авторства и в блоках, не попавших в речь (там лежит ссылка на фонд).
        Сама речь в поиск не идёт — среди названий фондов много обычных слов
        («Вера», «Жизнь»), и на них прилетал бы чужой логотип.
      */
      const creditTexts = [
        ...(creditLine ? [creditLine] : []),
        ...(author || role ? [`${author ?? ""} ${role ?? ""}`] : []),
        ...rest.map((it) => md(it)),
      ];
      const yandex = Boolean(mods.yandex) || mentionsYandex(creditTexts);
      const org = yandex ? undefined : orgFromText(creditTexts);
      const logo = org ? findSlug(org, logoIndex) : undefined;

      return (
        <>
          {body.map((it, i) => (
            <Quote
              key={i}
              size={mods.size === "S" ? "S" : "L"}
              yandex={i === 0 ? yandex : false}
              org={i === 0 ? org : undefined}
              logo={i === 0 ? logo : undefined}
              author={i === 0 ? author : undefined}
              role={i === 0 ? role : undefined}
            >
              {renderInline(md(it).replace(/^[*_]+|[*_]+$/g, ""))}
            </Quote>
          ))}
          {quotes.length
            ? rest.map((it, i) => (
                <PlainBlock key={`r${i}`} it={it} md={md} resolve={resolve} unbold={unbold} />
              ))
            : null}
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
      return <Quote size="S">{renderInline(md(it, unbold))}</Quote>;
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
