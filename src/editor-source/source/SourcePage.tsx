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
  // Сохранённые директивы (все модули; для текущего фильтруем при показе).
  const [directives, setDirectives] = React.useState<Directive[]>([]);
  const [err, setErr] = React.useState<string | null>(null);

  const { pathname } = useLocation();
  const resolve = useMdResolver();

  // Скролл-области колонок 1 (наша копия) и 2 (плейграунд) — для синхронного
  // скролла: удобно быстро сверять, не «слетел» ли контент между ними.
  const copyScrollRef = React.useRef<HTMLDivElement>(null);
  const playScrollRef = React.useRef<HTMLDivElement>(null);

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

  // Синхронный скролл колонок 1 и 2 (пропорционально высоте) — удобно быстро
  // сверять, не «слетел» ли контент. Отражённое событие гасим флагом «следующий
  // скролл у этой колонки — наш, программный»: ставим его, только когда реально
  // двигаем, поэтому ровно одно событие и гасится (без таймеров/rAF).
  React.useEffect(() => {
    const c1 = copyScrollRef.current;
    const c2 = playScrollRef.current;
    if (!c1 || !c2) return;
    const skip = { c1: false, c2: false };
    const mirror = (
      from: HTMLElement,
      to: HTMLElement,
      lockTo: "c1" | "c2",
    ) => {
      const max = from.scrollHeight - from.clientHeight;
      const ratio = max > 0 ? from.scrollTop / max : 0;
      const target = ratio * (to.scrollHeight - to.clientHeight);
      if (Math.abs(to.scrollTop - target) > 1) {
        skip[lockTo] = true;
        to.scrollTop = target;
      }
    };
    const onC1 = () => {
      if (skip.c1) return void (skip.c1 = false);
      mirror(c1, c2, "c2");
    };
    const onC2 = () => {
      if (skip.c2) return void (skip.c2 = false);
      mirror(c2, c1, "c1");
    };
    c1.addEventListener("scroll", onC1, { passive: true });
    c2.addEventListener("scroll", onC2, { passive: true });
    return () => {
      c1.removeEventListener("scroll", onC1);
      c2.removeEventListener("scroll", onC2);
    };
  }, [moduleId]);

  // Карта «стабильный id блока → директива» для текущего модуля — чтобы плейграунд
  // помечал блоки, у которых уже есть директива. Первая директива на блок (если их
  // несколько — маловероятно, но берём верхнюю). Хук — до ранних return.
  const directiveFor = React.useMemo(() => {
    const map = new Map<string, Directive>();
    for (const d of directives) {
      if (d.module !== moduleId) continue;
      for (const b of d.blocks) if (!map.has(b.id)) map.set(b.id, d);
    }
    return (b: SourceBlock, anchor?: string) =>
      map.get(blockRefId(b, pathname, anchor));
  }, [directives, moduleId, pathname]);

  if (!moduleId) return <Navigate to="/source/m1" replace />;
  if (!meta) {
    return (
      <p className="p-6 text-muted-foreground">Модуль «{moduleId}» не найден.</p>
    );
  }

  const sections = blocks ? toSections(blocks) : [];
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
        <div className="shrink-0 border-b bg-muted/40 px-6 py-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Наша редакция · источник для сайта
          </span>
        </div>
        <div
          ref={copyScrollRef}
          className="mx-auto min-h-0 w-full max-w-prose flex-1 space-y-6 overflow-y-auto px-6 py-8"
        >
          {/* Заголовок модуля рендерится в самом потоке блоков (как в доке) —
              отдельную «шапку» не рисуем, чтобы не дублировать и не «переносить». */}
          {blocks === null ? (
            <p className="text-muted-foreground">Загрузка модуля…</p>
          ) : (
            sections.map((sec, i) => (
              <section
                key={sec.anchor ?? `intro-${i}`}
                id={sec.anchor}
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
          scrollRef={playScrollRef}
          directiveFor={directiveFor}
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
