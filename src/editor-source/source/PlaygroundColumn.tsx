import * as React from "react";
import { Trash2 } from "lucide-react";
import { renderInline } from "@/editor-source/richText";
import { DirectiveCard, type DirectiveDraft } from "./DirectiveCard";
import { useMdResolver, blockType, type ResolveMd } from "./blockResolve";
import type { Directive } from "@/editor-source/directives";
import type { SourceBlock } from "@/editor-source/content/source.generated";

/*
  Плейграунд — вторая колонка инструмента «Редактура источника». Здесь контент
  раскладывается на наши компоненты. Первый модуль — ФУНДАМЕНТ ВЫДЕЛЕНИЯ: блоки
  выделяются рамкой мышью (как в Иллюстраторе), выделенное собирается в бокс.

  Выделение управляется СНАРУЖИ (из SourcePage), чтобы им пользовалась и правая
  панель («Разметка»): выделил тут → карточка-директива появляется там. Директиву
  «во что превратить + модификаторы + комментарий» вешаем следующим модулем.

  Ничего не сохраняет и текст не трогает. Ключ блока — позиционный (секция:индекс),
  стабильный id по хешу подключим, когда появятся директивы.
*/

export type Section = { anchor?: string; blocks: SourceBlock[] };

const KIND_LABEL: Record<SourceBlock["kind"], string> = {
  heading: "Заголовок",
  paragraph: "Абзац",
  quote: "Цитата",
  list: "Список",
  table: "Таблица",
  image: "Картинка",
};

// Модификатор блока для шильдика: у заголовка — уровень, у списка — тип.
function blockModifier(b: SourceBlock): string | null {
  if (b.kind === "heading") return `H${b.level}`;
  if (b.kind === "list") return b.ordered ? "нумер." : "маркир.";
  return null;
}

type Box = { top: number; left: number; width: number; height: number };

// Пересекаются ли два прямоугольника (в клиентских координатах).
function intersects(a: DOMRect, b: Box): boolean {
  return !(
    a.right < b.left ||
    a.left > b.left + b.width ||
    a.bottom < b.top ||
    a.top > b.top + b.height
  );
}

type Props = {
  sections: Section[];
  selected: Set<string>;
  onSelectedChange: (next: Set<string>) => void;
  /** Клик «Создать директиву» — переключить правую панель на «Разметку». */
  onCreateDirective: () => void;
  /** Внешний ref на скролл-область — для синхронизации скролла с колонкой 1. */
  scrollRef?: React.Ref<HTMLDivElement>;
};

export function PlaygroundColumn({
  sections,
  selected,
  onSelectedChange,
  onCreateDirective,
  scrollRef,
}: Props) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const resolve = useMdResolver();

  const [marquee, setMarquee] = React.useState<Box | null>(null);
  const [groupBox, setGroupBox] = React.useState<Box | null>(null);

  // Текущее выделение в ref — чтобы обработчики видели свежее значение.
  const selRef = React.useRef(selected);
  selRef.current = selected;

  const drag = React.useRef<{
    x: number;
    y: number;
    additive: boolean;
    moved: boolean;
    base: Set<string>;
  } | null>(null);

  const blockEls = React.useCallback(
    () =>
      Array.from(
        contentRef.current?.querySelectorAll<HTMLElement>("[data-pk]") ?? [],
      ),
    [],
  );

  const keysInRect = React.useCallback(
    (rect: Box): string[] => {
      const hit: string[] = [];
      for (const el of blockEls()) {
        if (intersects(el.getBoundingClientRect(), rect)) {
          const k = el.dataset.pk;
          if (k) hit.push(k);
        }
      }
      return hit;
    },
    [blockEls],
  );

  const onMove = React.useCallback(
    (e: MouseEvent) => {
      const d = drag.current;
      if (!d) return;
      if (Math.abs(e.clientX - d.x) + Math.abs(e.clientY - d.y) > 4)
        d.moved = true;
      if (!d.moved) return;
      const rect: Box = {
        left: Math.min(d.x, e.clientX),
        top: Math.min(d.y, e.clientY),
        width: Math.abs(e.clientX - d.x),
        height: Math.abs(e.clientY - d.y),
      };
      setMarquee(rect);
      const hit = keysInRect(rect);
      onSelectedChange(d.additive ? new Set([...d.base, ...hit]) : new Set(hit));
    },
    [keysInRect, onSelectedChange],
  );

  const onUp = React.useCallback(
    (e: MouseEvent) => {
      const d = drag.current;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      drag.current = null;
      setMarquee(null);
      if (!d) return;
      // Не тащили — клик: переключить блок под курсором либо снять выделение.
      if (!d.moved) {
        const point: Box = {
          left: e.clientX,
          top: e.clientY,
          width: 0,
          height: 0,
        };
        const [key] = keysInRect(point);
        const cur = selRef.current;
        if (key) {
          const next = d.additive ? new Set(cur) : new Set<string>();
          if (d.additive && cur.has(key)) next.delete(key);
          else next.add(key);
          onSelectedChange(next);
        } else if (!d.additive) {
          onSelectedChange(new Set());
        }
      }
    },
    [onMove, keysInRect, onSelectedChange],
  );

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    drag.current = {
      x: e.clientX,
      y: e.clientY,
      additive: e.shiftKey,
      moved: false,
      base: new Set(selRef.current),
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // Бокс вокруг выделения — в координатах контента, чтобы скроллился с ним.
  React.useLayoutEffect(() => {
    const wrap = contentRef.current;
    if (!wrap || selected.size === 0) {
      setGroupBox(null);
      return;
    }
    const wr = wrap.getBoundingClientRect();
    let top = Infinity,
      left = Infinity,
      right = -Infinity,
      bottom = -Infinity;
    for (const el of blockEls()) {
      if (!el.dataset.pk || !selected.has(el.dataset.pk)) continue;
      const r = el.getBoundingClientRect();
      top = Math.min(top, r.top - wr.top + wrap.scrollTop);
      left = Math.min(left, r.left - wr.left + wrap.scrollLeft);
      right = Math.max(right, r.right - wr.left + wrap.scrollLeft);
      bottom = Math.max(bottom, r.bottom - wr.top + wrap.scrollTop);
    }
    if (top === Infinity) setGroupBox(null);
    else setGroupBox({ top, left, width: right - left, height: bottom - top });
  }, [selected, sections, blockEls]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b bg-muted/40 px-4 py-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          Плейграунд · раскладка на компоненты
        </span>
        <span className="text-xs text-muted-foreground">
          Рамкой выделите блоки
        </span>
      </div>

      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        className="relative min-h-0 flex-1 cursor-crosshair select-none overflow-y-auto"
      >
        <div ref={contentRef} className="relative mx-auto max-w-prose px-6 py-8">
          {groupBox && (
            <div
              aria-hidden
              className="pointer-events-none absolute z-10 rounded-md border-2 border-brand/70 bg-brand/5"
              style={{
                top: groupBox.top - 6,
                left: groupBox.left - 6,
                width: groupBox.width + 12,
                height: groupBox.height + 12,
              }}
            />
          )}

          <div className="space-y-2">
            {sections.map((sec, si) =>
              sec.blocks.map((b, bi) => {
                const key = `${si}:${bi}`;
                const on = selected.has(key);
                return (
                  <div
                    key={key}
                    data-pk={key}
                    className={[
                      "relative rounded-md border px-3 py-2 transition-colors",
                      on
                        ? "border-brand/60 bg-brand/10"
                        : "border-transparent hover:border-border",
                    ].join(" ")}
                  >
                    {/* Шильдик — справа, поверх контента; тип блока + модификатор. */}
                    <span className="pointer-events-none absolute right-1.5 top-1.5 z-10 rounded bg-muted/90 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      {KIND_LABEL[b.kind]}
                      {blockModifier(b) ? ` · ${blockModifier(b)}` : ""}
                    </span>
                    <BlockPreview block={b} anchor={sec.anchor} resolve={resolve} />
                  </div>
                );
              }),
            )}
          </div>
        </div>

        {marquee && (
          <div
            aria-hidden
            className="pointer-events-none fixed z-50 border border-brand bg-brand/10"
            style={{
              top: marquee.top,
              left: marquee.left,
              width: marquee.width,
              height: marquee.height,
            }}
          />
        )}
      </div>

      {selected.size > 0 && (
        <div className="flex shrink-0 items-center justify-between gap-3 border-t bg-background px-4 py-2">
          <span className="text-sm text-foreground">
            Выбрано блоков: <b>{selected.size}</b>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSelectedChange(new Set())}
              className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              Сбросить
            </button>
            <button
              type="button"
              onClick={onCreateDirective}
              className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-brand-foreground hover:bg-brand/90"
            >
              Создать директиву →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/*
  Правая вкладка «Разметка» — новый инструмент. Первый модуль: показывает, что
  сейчас выделено в плейграунде. Сама карточка-директива (во что превратить +
  модификаторы + комментарий) — следующий модуль, здесь её место.
*/
export function MarkupPanel({
  sections,
  selected,
  directives,
  onSaveDraft,
  onDelete,
}: {
  sections: Section[];
  selected: Set<string>;
  directives: Directive[];
  onSaveDraft: (draft: DirectiveDraft) => void;
  onDelete: (id: string) => void;
}) {
  const resolve = useMdResolver();
  const picked: { block: SourceBlock; anchor?: string }[] = [];
  sections.forEach((sec, si) =>
    sec.blocks.forEach((b, bi) => {
      if (selected.has(`${si}:${bi}`))
        picked.push({ block: b, anchor: sec.anchor });
    }),
  );

  return (
    <div className="flex min-h-0 flex-col gap-4 overflow-y-auto p-4">
      {picked.length > 0 ? (
        <div>
          <div className="text-sm font-medium text-foreground">
            Выбрано блоков: {picked.length}
          </div>
          <ul className="mt-2 space-y-1">
            {picked.map(({ block: b, anchor }, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide">
                  {KIND_LABEL[b.kind]}
                </span>
                <span className="truncate">
                  {b.kind === "list"
                    ? `${b.items.length} пунктов`
                    : b.kind === "table"
                      ? `${b.rows.length} строк`
                      : b.kind === "image"
                        ? b.alt || "картинка"
                        : resolve(blockType(b), b.text, b.text, anchor)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <DirectiveCard count={picked.length} onSave={onSaveDraft} />
          </div>
        </div>
      ) : (
        <div className="rounded-md border border-dashed bg-muted/30 p-4 text-center text-xs text-muted-foreground">
          Выделите блоки в плейграунде рамкой — здесь появится карточка-директива.
        </div>
      )}

      {directives.length > 0 && (
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Сохранённые директивы · {directives.length}
          </div>
          <ul className="mt-2 space-y-2">
            {directives.map((d) => (
              <DirectiveRow key={d.id} d={d} onDelete={onDelete} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const STATUS_LABEL: Record<Directive["status"], string> = {
  new: "новая",
  applied: "применена",
  verified: "проверена",
};

function DirectiveRow({
  d,
  onDelete,
}: {
  d: Directive;
  onDelete: (id: string) => void;
}) {
  const mods = Object.entries(d.modifiers)
    .filter(([, v]) => v !== false && v !== "" && v != null)
    .map(([k, v]) => (v === true ? k : `${k}: ${v}`))
    .join(" · ");

  return (
    <li className="rounded-md border bg-card p-2.5 text-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="font-medium text-foreground">
            {d.targetLabel ?? "Комментарий"}
          </span>
          <span className="ml-2 text-xs text-muted-foreground">
            {d.blocks.length} блок(ов) · {STATUS_LABEL[d.status]}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onDelete(d.id)}
          aria-label="Удалить директиву"
          className="shrink-0 text-muted-foreground hover:text-[hsl(var(--bad))]"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
      {mods && <div className="mt-0.5 text-xs text-muted-foreground">{mods}</div>}
      {d.comment && (
        <div className="mt-1 text-sm text-foreground/80">{d.comment}</div>
      )}
    </li>
  );
}

/** Компактный предпросмотр блока в плейграунде — с учётом внесённых правок. */
function BlockPreview({
  block,
  anchor,
  resolve,
}: {
  block: SourceBlock;
  anchor?: string;
  resolve: ResolveMd;
}) {
  switch (block.kind) {
    case "heading":
      return (
        <div className="font-semibold text-foreground">
          {renderInline(
            resolve(`h${block.level}`, block.text, block.md, anchor),
          )}
        </div>
      );
    case "paragraph":
    case "quote":
      return (
        <div className="text-sm leading-snug text-foreground">
          {renderInline(resolve("paragraph", block.text, block.md, anchor))}
        </div>
      );
    case "list":
      return (
        <ul className="list-inside list-disc text-sm text-foreground">
          {block.items.slice(0, 4).map((it, i) => (
            <li key={i}>{renderInline(resolve("li", it.text, it.md, anchor))}</li>
          ))}
          {block.items.length > 4 && (
            <li className="list-none text-muted-foreground">…</li>
          )}
        </ul>
      );
    case "table":
      return (
        <div className="text-sm text-muted-foreground">
          Таблица · {block.rows.length} строк
        </div>
      );
    case "image":
      return (
        <div className="text-sm text-muted-foreground">
          Картинка{block.alt ? ` · ${block.alt}` : ""}
        </div>
      );
  }
}
