import * as React from "react";
import { useLocation } from "react-router-dom";
import { renderInline } from "@/editor-source/richText";
import { autoId } from "@/editor-source/ids";
import { useEditor } from "@/editor-source/EditorProvider";
import type { SourceBlock } from "@/editor-source/content/source.generated";

/*
  Резолвер редакции: возвращает АКТУАЛЬНЫЙ текст блока — с внесённой правкой,
  если она есть (и не откат), иначе оригинал. Повторяет ту же подстановку, что
  делает Editable в первой колонке, — чтобы плейграунд показывал ту же редакцию,
  что «Наша редакция», а не сырой исходник. id блока считается так же:
  autoId(страница, тип, текст, раздел).
*/
type ResolveMd = (
  type: string,
  text: string,
  md: string,
  anchor?: string,
) => string;

function useMdResolver(): ResolveMd {
  const { edits } = useEditor();
  const { pathname } = useLocation();
  return React.useCallback(
    (type, text, md, anchor) => {
      const rec = edits[autoId(pathname, type, text, anchor)];
      if (rec && rec.text.trim() && rec.status !== "rollback") return rec.text;
      return md;
    },
    [edits, pathname],
  );
}

// Тип блока в адресе (id): как в Editable — цитата адресуется как paragraph.
function blockType(b: SourceBlock): string {
  return b.kind === "heading" ? `h${b.level}` : "paragraph";
}

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
};

export function PlaygroundColumn({
  sections,
  selected,
  onSelectedChange,
  onCreateDirective,
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
    <div className="flex min-h-0 flex-col">
      <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          Плейграунд · раскладка на компоненты
        </span>
        <span className="text-xs text-muted-foreground">
          Рамкой выделите блоки
        </span>
      </div>

      <div
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
                      "rounded-md border px-3 py-2 transition-colors",
                      on
                        ? "border-brand/60 bg-brand/10"
                        : "border-transparent hover:border-border",
                    ].join(" ")}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        {KIND_LABEL[b.kind]}
                      </span>
                    </div>
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
        <div className="flex items-center justify-between gap-3 border-t bg-background px-4 py-2">
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
}: {
  sections: Section[];
  selected: Set<string>;
}) {
  const resolve = useMdResolver();
  const picked: { block: SourceBlock; anchor?: string }[] = [];
  sections.forEach((sec, si) =>
    sec.blocks.forEach((b, bi) => {
      if (selected.has(`${si}:${bi}`)) picked.push({ block: b, anchor: sec.anchor });
    }),
  );

  if (picked.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
        Выделите блоки в плейграунде рамкой — здесь появится карточка-директива.
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-col overflow-y-auto p-4">
      <div className="text-sm font-medium text-foreground">
        Выбрано блоков: {picked.length}
      </div>
      <ul className="mt-3 space-y-1">
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
      <div className="mt-4 rounded-md border border-dashed bg-muted/30 p-3 text-xs text-muted-foreground">
        Здесь появится карточка-директива: во что превратить · модификаторы ·
        комментарий. Это следующий модуль.
      </div>
    </div>
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
