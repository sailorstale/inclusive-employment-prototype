import * as React from "react";
import { useParams, useLocation, Navigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { Paragraph, BulletList, OrderedList } from "@/editor-source/Prose";
import { Editable } from "@/editor-source/Editable";
import { AnchorScope } from "@/editor/AnchorContext";
import { renderInline } from "@/editor-source/richText";
import { EditorInspector } from "@/editor-source/EditorInspector";
import {
  PlaygroundColumn,
  MarkupPanel,
} from "@/editor-source/source/PlaygroundColumn";
import {
  useMdResolver,
  blockRefId,
  blockSnippet,
  iconTextOf,
} from "@/editor-source/source/blockResolve";
import { iconForText } from "@/editor-source/source/iconForText";
import { docToExport, type Doc } from "@/editor-source/source/contentTree";
import { useContentDoc } from "@/editor-source/source/ResultView";
import type { DirectiveDraft } from "@/editor-source/source/DirectiveCard";
import {
  loadDirectives,
  saveDirective,
  deleteDirective,
  setDirectiveStatus,
  newId,
  type Directive,
  type DirectiveBlock,
} from "@/editor-source/directives";
import {
  sourceModulesMeta,
  moduleLoaders,
  type SourceBlock,
  type SourceModuleMeta,
} from "@/editor-source/content/source.generated";

// Колонку с Google-доком пока прячем (по исходнику у нас консистентность).
// Вернуть — поменять на true: раскладка снова станет четырёхколоночной.
const SHOW_DOC: boolean = false;

// Страница модуля в инструменте «Редактура источника»: две колонки —
// СЛЕВА реальный клиентский Google-док (iframe, чтобы клиент видел свой файл),
// СПРАВА наш источник из .md, где каждый блок редактируется инспектором.
// Блоки грузятся лениво (свой чанк на модуль).

const headingClass = (level: 2 | 3 | 4) =>
  level === 2
    ? "scroll-mt-4 pt-2 text-xl font-semibold tracking-tight text-foreground"
    : level === 3
      ? "scroll-mt-4 text-lg font-semibold tracking-tight text-foreground"
      : "scroll-mt-4 text-base font-semibold text-foreground";

function BlockView({ block }: { block: SourceBlock }) {
  switch (block.kind) {
    case "heading":
      return (
        <Editable as={`h${block.level}`} className={headingClass(block.level)}>
          {renderInline(block.md)}
        </Editable>
      );
    case "paragraph": {
      const p = <Paragraph>{renderInline(block.md)}</Paragraph>;
      // Выделение цветом из дока (пастельный фон, тёмный текст — читаемо в обеих темах).
      return block.hl ? (
        <div
          className="-mx-3 rounded-md px-3 py-2"
          style={{ backgroundColor: block.hl, color: "#1f2937" }}
        >
          {p}
        </div>
      ) : (
        p
      );
    }
    case "quote": {
      const q = (
        <blockquote className="max-w-prose border-l-2 border-border pl-4 italic text-muted-foreground">
          <Editable as="paragraph">{renderInline(block.md)}</Editable>
        </blockquote>
      );
      return block.hl ? (
        <div
          className="-mx-3 rounded-md px-3 py-2"
          style={{ backgroundColor: block.hl, color: "#1f2937" }}
        >
          {q}
        </div>
      ) : (
        q
      );
    }
    case "image":
      return (
        <figure className="my-2">
          <img
            src={block.src}
            alt={block.alt || ""}
            loading="lazy"
            className="h-auto max-w-full rounded-md border"
          />
        </figure>
      );
    case "list": {
      const List = block.ordered ? OrderedList : BulletList;
      return (
        <List>
          {block.items.map((it, i) => (
            <li key={i}>{renderInline(it.md)}</li>
          ))}
        </List>
      );
    }
    case "table":
      return (
        <div className="max-w-full overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            {block.header.some((c) => c) && (
              <thead>
                <tr>
                  {block.header.map((c, i) => (
                    <th
                      key={i}
                      className="border border-border bg-muted/50 px-3 py-2 text-left align-top font-semibold text-foreground"
                    >
                      {renderInline(c)}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {block.rows.map((r, ri) => (
                <tr key={ri}>
                  {r.map((c, ci) => (
                    <td
                      key={ci}
                      className="border border-border px-3 py-2 align-top leading-relaxed"
                    >
                      {renderInline(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

/*
  ОБЩАЯ СИСТЕМА КООРДИНАТ ДЛЯ КОЛОНОК — секции.

  У начала каждой секции стоит data-sec с её номером: в тексте, в JSON и в
  раскладке (режим «Блоки»). В режиме «Результат» секцию рисует компонент
  дизайн-системы: служебного data-sec у него нет и заводить не станем — берём
  Section Container по порядку следования, он на каждую секцию ровно один.

  Массив разрежённый: индекс = номер секции.
*/
function secEls(box: HTMLElement): HTMLElement[] {
  const out: HTMLElement[] = [];
  box.querySelectorAll<HTMLElement>("[data-sec]").forEach((el) => {
    out[Number(el.dataset.sec)] = el;
  });
  if (out.length) return out;
  box
    .querySelectorAll<HTMLElement>('[data-component="Section Container"]')
    .forEach((el, i) => {
      out[i] = el;
    });
  return out;
}

/** Границы секции i в координатах содержимого контейнера. */
function secSpan(els: HTMLElement[], i: number, box: HTMLElement) {
  const boxTop = box.getBoundingClientRect().top - box.scrollTop;
  const top = els[i].getBoundingClientRect().top - boxTop;
  const next = els.slice(i + 1).find(Boolean);
  // У последней секции конца нет — тянем до конца содержимого. Брать
  // offsetHeight нельзя: в режиме «Блоки» якорь — лишь ПЕРВЫЙ блок секции.
  const height = next
    ? next.getBoundingClientRect().top - boxTop - top
    : box.scrollHeight - top;
  return { top, height };
}

/*
  Куда прокрутить `to`, чтобы он показывал то же место документа, что и `from`:
  та же секция и та же доля прокрутки ВНУТРИ неё. null — двигать не нужно.

  Пропорция по высоте тут не годится: секция, которая на странице занимает
  экран, в JSON тянется на полторы сотни строк, и колонки разъезжаются.
*/
function syncTarget(from: HTMLElement, to: HTMLElement): number | null {
  const fe = secEls(from);
  const te = secEls(to);
  let target: number;
  if (fe.length && te.length) {
    // Верхняя секция, начало которой уже ушло за верхний край окна.
    let i = 0;
    for (let k = 0; k < fe.length; k++)
      if (fe[k] && secSpan(fe, k, from).top <= from.scrollTop + 1) i = k;
    while (i >= 0 && !te[i]) i -= 1; // в другой колонке секции может не быть
    if (i < 0) return null;
    const f = secSpan(fe, i, from);
    const frac =
      f.height > 0
        ? Math.min(1, Math.max(0, (from.scrollTop - f.top) / f.height))
        : 0;
    const t = secSpan(te, i, to);
    target = t.top + frac * t.height;
  } else {
    // Якорей ещё нет (модуль грузится) — пропорциональное поведение как раньше.
    const max = from.scrollHeight - from.clientHeight;
    target =
      (max > 0 ? from.scrollTop / max : 0) * (to.scrollHeight - to.clientHeight);
  }
  return Math.max(0, Math.min(target, to.scrollHeight - to.clientHeight));
}

// Разбивка на секции по h2 — каждая получает id-якорь и AnchorScope (адрес
// блока учитывает раздел: одинаковый текст в разных разделах не путается).
type Section = { anchor?: string; blocks: SourceBlock[] };
function toSections(blocks: SourceBlock[]): Section[] {
  const sections: Section[] = [];
  let cur: Section = { blocks: [] };
  for (const b of blocks) {
    if (b.kind === "heading" && b.level === 2) {
      if (cur.blocks.length) sections.push(cur);
      cur = { anchor: b.anchor, blocks: [b] };
    } else {
      cur.blocks.push(b);
    }
  }
  if (cur.blocks.length) sections.push(cur);
  return sections;
}

/** Левая колонка: реальный клиентский Google-док во фрейме. */
function DocFrame({ meta }: { meta: SourceModuleMeta }) {
  if (!meta.docId) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
        Для этого модуля не задан Google-док.
      </div>
    );
  }
  const preview = `https://docs.google.com/document/d/${meta.docId}/preview`;
  const open = `https://docs.google.com/document/d/${meta.docId}/edit`;
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b bg-muted/40 px-3 py-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          Оригинал · Google-док клиента
        </span>
        <a
          href={open}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-brand hover:underline"
        >
          Открыть в Google <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <iframe
        key={meta.docId}
        title={`Google-док: Модуль ${meta.num}`}
        src={preview}
        className="min-h-0 flex-1 w-full bg-white"
      />
    </div>
  );
}

export function SourcePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const meta: SourceModuleMeta | undefined = sourceModulesMeta.find(
    (m) => m.id === moduleId
  );

  const [blocks, setBlocks] = React.useState<SourceBlock[] | null>(null);
  // Выделение блоков в плейграунде живёт здесь — им пользуется и правая панель.
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  // Правая колонка: таб «Редактор» (правки текста) или «Разметка» (новый инструмент).
  const [rightTab, setRightTab] = React.useState<"editor" | "markup">("editor");
  // Левая колонка: текст источника или тот же контент в виде JSON для разработчика.
  const [leftTab, setLeftTab] = React.useState<"text" | "json">("text");
  // Сохранённые директивы (все модули; для текущего фильтруем при показе).
  const [directives, setDirectives] = React.useState<Directive[]>([]);
  const [err, setErr] = React.useState<string | null>(null);

  const { pathname } = useLocation();
  const resolve = useMdResolver();

  /*
    Скролл-области колонок 1 (наша копия) и 2 (плейграунд) — для синхронного
    скролла: удобно быстро сверять, не «слетел» ли контент между ними.

    Держим их СОСТОЯНИЕМ, а не ref: плейграунд пересоздаёт свой контейнер при
    смене режима «Блоки ↔ Результат», и эффект, повесивший слушатель один раз,
    оставался бы на отсоединённом узле — синхрон молча переставал работать.
    Со state эффект переподключается на новый элемент сам.
  */
  const [copyBox, setCopyBox] = React.useState<HTMLDivElement | null>(null);
  const [playBox, setPlayBox] = React.useState<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!moduleId || !moduleLoaders[moduleId]) return;
    let alive = true;
    setBlocks(null);
    setSelected(new Set()); // при смене модуля выделение сбрасываем
    moduleLoaders[moduleId]().then((m) => {
      if (alive) setBlocks(m.blocks);
    });
    return () => {
      alive = false;
    };
  }, [moduleId]);

  // Директивы грузим один раз (общие для всех модулей).
  React.useEffect(() => {
    let alive = true;
    loadDirectives().then((d) => {
      if (alive) setDirectives(d);
    });
    return () => {
      alive = false;
    };
  }, []);

  /*
    Синхронный скролл колонок 1 и 2 — ПО СЕКЦИЯМ, а не по проценту высоты.

    Пропорция работала, пока слева был текст: высоты примерно совпадали. С JSON
    она разъезжается — секция, которая на странице занимает экран, в JSON тянется
    на полторы сотни строк, и к середине модуля колонки смотрят на разные места.

    Поэтому держим общую систему координат: у начала каждой секции во всех трёх
    представлениях (текст, JSON, раскладка) стоит data-sec с её номером. Берём
    верхнюю видимую секцию и долю прокрутки ВНУТРИ неё — и ставим другую колонку
    на ту же секцию с той же долей.

    Отражённое событие гасим флагом «следующий скролл у этой колонки — наш,
    программный»: ставим его, только когда реально двигаем, поэтому ровно одно
    событие и гасится (без таймеров/rAF).
  */
  React.useEffect(() => {
    const c1 = copyBox;
    const c2 = playBox;
    if (!c1 || !c2) return;

    const skip = { c1: false, c2: false };
    const align = (from: HTMLElement, to: HTMLElement, lockTo: "c1" | "c2") => {
      const target = syncTarget(from, to);
      if (target === null) return;
      if (Math.abs(to.scrollTop - target) > 1) {
        skip[lockTo] = true;
        to.scrollTop = target;
      }
    };

    const onC1 = () => {
      if (skip.c1) return void (skip.c1 = false);
      align(c1, c2, "c2");
    };
    const onC2 = () => {
      if (skip.c2) return void (skip.c2 = false);
      align(c2, c1, "c1");
    };
    c1.addEventListener("scroll", onC1, { passive: true });
    c2.addEventListener("scroll", onC2, { passive: true });
    return () => {
      c1.removeEventListener("scroll", onC1);
      c2.removeEventListener("scroll", onC2);
    };
  }, [copyBox, playBox]);

  /*
    Директива → КОНКРЕТНЫЕ блоки документа, по позиции, а не по тексту.

    Почему не по тексту: id блока считается от его текста и якоря раздела, а
    повторяющиеся строки («**Миф**», «**Пояснение**») стоят в каждом из девяти
    мифов ОДНОГО раздела — id у них совпадает. Если отдавать такой блок «первой
    попавшейся» директиве, группа рвётся: заголовок остаётся в одной группе,
    хвост мифа — в другой, и аккордеон собирается пустым, с одним вопросом.

    Поэтому директиву прикладываем к документу целиком: ищем непрерывный
    участок, где подряд идущие id совпадают с её списком блоков. Уникальные
    соседи (заголовок мифа, его абзацы) однозначно пришпиливают участок к
    нужному месту. Занятые позиции помечаем, чтобы две директивы не
    претендовали на одни и те же блоки.

    Два прохода: сначала директивы с ЕДИНСТВЕННЫМ возможным местом (их не с чем
    перепутать), потом остальные — жадно, в первое свободное. Так директива из
    одного повторяющегося блока (шесть «**Почему это важно**») не отбирает
    место у той, которой деваться некуда.
  */
  const directiveAt = React.useMemo(() => {
    const flat: { key: string; id: string }[] = [];
    toSections(blocks ?? []).forEach((sec, si) =>
      sec.blocks.forEach((b, bi) =>
        flat.push({ key: `${si}:${bi}`, id: blockRefId(b, pathname, sec.anchor) }),
      ),
    );

    const mine = directives.filter((d) => d.module === moduleId && d.blocks.length);
    const taken = new Set<number>();
    const map = new Map<string, Directive>();

    /** Позиции, с которых список id директивы ложится на документ подряд. */
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
      const free = at.find((p) =>
        d.blocks.every((_, k) => !taken.has(p + k)),
      );
      if (free !== undefined) place(d, free);
    }

    return (si: number, bi: number) => map.get(`${si}:${bi}`);
  }, [directives, moduleId, pathname, blocks]);

  // Секции и дерево контента считаем ДО ранних return: это хуки.
  const sections = React.useMemo(
    () => (blocks ? toSections(blocks) : []),
    [blocks],
  );
  /*
    ОДНО дерево на страницу: им рисуется «Результат» во второй колонке, из него
    же JSON в первой и выгрузка файлом. Превью и то, что уедет разработчику,
    физически не могут разъехаться.
  */
  const doc = useContentDoc(moduleId ?? "", sections, resolve, directiveAt);

  /*
    Смена «Текст ↔ JSON» не должна терять место чтения. Высоты у текста и у
    JSON разные, поэтому сохранять пиксели бессмысленно: подтягиваем левую
    колонку к правой по секциям — плейграунд тут опорный. Так после
    переключения обе колонки снова показывают один и тот же кусок документа.
  */
  React.useLayoutEffect(() => {
    const c1 = copyBox;
    const c2 = playBox;
    if (!c1 || !c2) return;
    const target = syncTarget(c2, c1);
    if (target !== null) c1.scrollTop = target;
  }, [leftTab, copyBox, playBox]);

  if (!moduleId) return <Navigate to="/source/m1" replace />;
  if (!meta) {
    return (
      <p className="p-6 text-muted-foreground">Модуль «{moduleId}» не найден.</p>
    );
  }

  const moduleDirectives = directives.filter((d) => d.module === moduleId);

  // Собрать ссылки на выделенные блоки (стабильный id + тип + подпись). Текст в
  // директиве не хранится — только id-ссылки, снипет лишь для показа.
  const buildBlocks = (withIcon: boolean): DirectiveBlock[] => {
    const out: DirectiveBlock[] = [];
    sections.forEach((sec, si) =>
      sec.blocks.forEach((b, bi) => {
        if (!selected.has(`${si}:${bi}`)) return;
        const block: DirectiveBlock = {
          id: blockRefId(b, pathname, sec.anchor),
          kind: b.kind,
          snippet: blockSnippet(b, resolve, sec.anchor),
        };
        // General Card с иконкой — подбираем релевантную иконку по тексту блока.
        if (withIcon)
          block.icon = iconForText(iconTextOf(b, sec.anchor, resolve)).name;
        out.push(block);
      }),
    );
    return out;
  };

  const handleSaveDraft = async (draft: DirectiveDraft) => {
    const withIcon =
      draft.target === "GeneralCard" && Boolean(draft.modifiers.icon);
    const blocksRef = buildBlocks(withIcon);
    if (blocksRef.length === 0) return;
    try {
      const saved = await saveDirective({
        id: newId(),
        module: moduleId,
        blocks: blocksRef,
        target: draft.target,
        targetLabel: draft.targetLabel,
        modifiers: draft.modifiers,
        comment: draft.comment,
      });
      setDirectives((prev) => [...prev.filter((x) => x.id !== saved.id), saved]);
      setSelected(new Set());
      setErr(null);
    } catch {
      setErr("Не удалось сохранить директиву — сервер недоступен.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDirective(id);
      setDirectives((prev) => prev.filter((x) => x.id !== id));
      setErr(null);
    } catch {
      setErr("Не удалось удалить директиву — сервер недоступен.");
    }
  };

  const handleSetStatus = async (id: string, status: Directive["status"]) => {
    try {
      const saved = await setDirectiveStatus(id, status);
      if (saved)
        setDirectives((prev) => prev.map((x) => (x.id === id ? saved : x)));
      setErr(null);
    } catch {
      setErr("Не удалось сменить статус директивы — сервер недоступен.");
    }
  };

  // Комментарий можно дописывать и после сохранения — директива уточняется,
  // остальные поля (блоки, цель, модификаторы, статус) остаются как были.
  const handleEditComment = async (id: string, comment: string) => {
    const d = directives.find((x) => x.id === id);
    if (!d) return;
    try {
      const saved = await saveDirective({
        id: d.id,
        module: d.module,
        blocks: d.blocks,
        target: d.target,
        targetLabel: d.targetLabel,
        modifiers: d.modifiers,
        comment,
      });
      setDirectives((prev) => prev.map((x) => (x.id === id ? saved : x)));
      setErr(null);
    } catch {
      setErr("Не удалось сохранить комментарий — сервер недоступен.");
    }
  };

  const gridCols = SHOW_DOC
    ? "xl:grid-cols-[1fr_1fr_1fr_minmax(360px,400px)]"
    : "xl:grid-cols-[1fr_1fr_minmax(360px,400px)]";

  return (
    <div className={`grid h-full min-h-0 grid-cols-1 md:grid-cols-2 ${gridCols}`}>
      {/* Google-док клиента — пока скрыт (SHOW_DOC). */}
      {SHOW_DOC && (
        <div className="hidden min-h-0 border-r md:block">
          <DocFrame meta={meta} />
        </div>
      )}

      {/* Первая колонка — наша копия источника (эталон, читаем) */}
      <div className="flex min-h-0 flex-col overflow-hidden border-r">
        <div className="flex shrink-0 items-center justify-between gap-2 border-b bg-muted/40 px-6 py-1.5">
          <span className="truncate text-xs font-medium text-muted-foreground">
            {leftTab === "text"
              ? "Наша редакция · источник для сайта"
              : "JSON для разработчика"}
          </span>
          <div className="flex shrink-0 items-center gap-1">
            {/* Скачивание — рядом с самим JSON: смотрим и забираем в одном месте. */}
            {leftTab === "json" && (
              <button
                type="button"
                onClick={() =>
                  downloadJson(`content-${moduleId}.json`, docToExport(doc))
                }
                className="rounded-md border bg-background px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Скачать
              </button>
            )}
            <div className="flex items-center gap-0.5 rounded-md border bg-background p-0.5">
              <TabBtn active={leftTab === "text"} onClick={() => setLeftTab("text")}>
                Текст
              </TabBtn>
              <TabBtn active={leftTab === "json"} onClick={() => setLeftTab("json")}>
                JSON
              </TabBtn>
            </div>
          </div>
        </div>
        <div
          ref={setCopyBox}
          className="mx-auto min-h-0 w-full max-w-prose flex-1 space-y-6 overflow-y-auto px-6 py-8"
        >
          {/* Заголовок модуля рендерится в самом потоке блоков (как в доке) —
              отдельную «шапку» не рисуем, чтобы не дублировать и не «переносить». */}
          {blocks === null ? (
            <p className="text-muted-foreground">Загрузка модуля…</p>
          ) : leftTab === "json" ? (
            <JsonView doc={doc} />
          ) : (
            sections.map((sec, i) => (
              <section
                key={sec.anchor ?? `intro-${i}`}
                id={sec.anchor}
                data-sec={i}
                className="space-y-4"
              >
                <AnchorScope anchor={sec.anchor}>
                  {sec.blocks.map((b, j) => (
                    <BlockView key={j} block={b} />
                  ))}
                </AnchorScope>
              </section>
            ))
          )}
        </div>
      </div>

      {/* Вторая колонка — плейграунд (раскладка на компоненты) */}
      <div className="hidden min-h-0 overflow-hidden border-r md:block">
        <PlaygroundColumn
          sections={sections}
          selected={selected}
          onSelectedChange={setSelected}
          onCreateDirective={() => setRightTab("markup")}
          scrollRef={setPlayBox}
          directiveAt={directiveAt}
          moduleId={moduleId}
          doc={doc}
        />
      </div>

      {/* Третья колонка — панель с табами: старый редактор + новый инструмент */}
      <div className="hidden min-h-0 flex-col overflow-hidden xl:flex">
        <div className="flex shrink-0 items-center gap-1 border-b bg-muted/40 px-2 py-1.5">
          <TabBtn active={rightTab === "editor"} onClick={() => setRightTab("editor")}>
            Редактор
          </TabBtn>
          <TabBtn active={rightTab === "markup"} onClick={() => setRightTab("markup")}>
            Разметка
          </TabBtn>
        </div>
        {err && (
          <div className="shrink-0 border-b bg-[hsl(var(--bad)/0.1)] px-3 py-1.5 text-xs text-[hsl(var(--bad))]">
            {err}
          </div>
        )}
        <div className="min-h-0 flex-1">
          {rightTab === "editor" ? (
            <EditorInspector docked />
          ) : (
            <MarkupPanel
              sections={sections}
              selected={selected}
              directives={moduleDirectives}
              onSaveDraft={handleSaveDraft}
              onDelete={handleDelete}
              onSetStatus={handleSetStatus}
              onEditComment={handleEditComment}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-md px-3 py-1 text-sm font-medium transition-colors",
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/*
  ПОДСВЕТКА JSON. Простыню в 85 тысяч знаков одним цветом читать невозможно,
  поэтому раскрашиваем. Свой мини-разборщик вместо библиотеки: формат тут
  заведомо валидный — его сделал JSON.stringify, — и хватает одного шаблона на
  четыре вида токенов.

  Тема в приложении одна, светлая, поэтому и цвета одни — без парных
  вариантов под тёмную.
*/
const JSON_TOKEN =
  /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;

const TOKEN_CLASS = {
  key: "text-sky-700",
  string: "text-emerald-700",
  literal: "text-purple-700",
  number: "text-amber-700",
};

function highlightJson(src: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  JSON_TOKEN.lastIndex = 0;
  while ((m = JSON_TOKEN.exec(src))) {
    if (m.index > last) out.push(src.slice(last, m.index));
    const [full, str, colon, literal, num] = m;
    const cls = str
      ? colon
        ? TOKEN_CLASS.key
        : TOKEN_CLASS.string
      : literal
        ? TOKEN_CLASS.literal
        : num
          ? TOKEN_CLASS.number
          : "";
    out.push(
      <span key={key++} className={cls}>
        {full}
      </span>,
    );
    last = m.index + full.length;
  }
  if (last < src.length) out.push(src.slice(last));
  return out;
}

/*
  JSON ровно того вида, что уедет разработчику: та же функция выгрузки, что и у
  кнопки «Скачать». Смотреть можно рядом с текстом, не скачивая файл.

  Печатаем не одной простынёй, а посекционно: каждая секция получает свой
  data-sec — тот же якорь, что у текста и у раскладки. Без него синхронный
  скролл мог быть только пропорциональным, а высоты JSON и страницы не совпадают
  (у секции с таблицей текста на экран, а JSON на сотню строк), и колонки
  разъезжались. Собранная строка посимвольно равна JSON.stringify(…, null, 2) —
  то есть ровно тому, что скачивается файлом.
*/
function JsonView({ doc }: { doc: Doc }) {
  // Разбор тяжёлый (десятки тысяч знаков) — считаем только при смене дерева.
  const { head, secs, tail } = React.useMemo(() => {
    const ex = docToExport(doc) as {
      module: string;
      children: { component?: string }[];
    };
    // Секция печатается с отступом 2, внутри "children" — ещё 2: итого 4.
    const indent = (s: string) => s.replace(/^/gm, "    ");
    const children = ex.children ?? [];
    /*
      Нумеруем ТОЛЬКО Section Container: перед секциями в дереве может лежать
      Page Summary, и если считать якорь по индексу в children, все секции
      уедут на одну позицию относительно текста и раскладки.
    */
    let n = -1;
    return {
      head: `{\n  "module": ${JSON.stringify(ex.module)},\n  "children": [\n`,
      secs: children.map((c) => {
        const isSection = c?.component === "Section Container";
        if (isSection) n += 1;
        return { text: indent(JSON.stringify(c, null, 2)), sec: isSection ? n : undefined };
      }),
      tail: children.length ? "\n  ]\n}" : "  ]\n}",
    };
  }, [doc]);

  return (
    <pre className="whitespace-pre-wrap break-words font-mono text-[13px] leading-[1.65] text-muted-foreground">
      {highlightJson(head)}
      {secs.map((s, i) => (
        <span key={i} data-sec={s.sec}>
          {highlightJson(s.text)}
          {i < secs.length - 1 ? ",\n" : ""}
        </span>
      ))}
      {highlightJson(tail)}
    </pre>
  );
}

/** Скачивание JSON файлом — выгрузка для разработчика. */
function downloadJson(name: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
