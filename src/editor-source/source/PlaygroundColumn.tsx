import * as React from "react";
import { renderInline } from "@/editor-source/richText";
import type { SourceBlock } from "@/editor-source/content/source.generated";

/*
  Плейграунд — вторая колонка инструмента «Редактура источника». Здесь контент
  раскладывается на наши компоненты. Первый модуль — только ФУНДАМЕНТ ВЫДЕЛЕНИЯ:
  блоки можно выделять рамкой мышью (как в Иллюстраторе), выделенное собирается
  в бокс, снизу — плашка действий. Директивную карточку («во что превратить +
  модификаторы + комментарий») вешаем следующим модулем.

  Ничего не сохраняет и текст не трогает: показывает те же блоки источника, что
  и средняя колонка, и даёт их выделять. Ключ блока — позиционный (секция:индекс),
  стабильный id по хешу подключим, когда появятся директивы.
*/

type Section = { anchor?: string; blocks: SourceBlock[] };

type Props = { sections: Section[] };

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

export function PlaygroundColumn({ sections }: Props) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  // Рамка в клиентских координатах — для отрисовки и проверки пересечений.
  const [marquee, setMarquee] = React.useState<Box | null>(null);
  // Рамка вокруг выделения в координатах контента (скроллится вместе с ним).
  const [groupBox, setGroupBox] = React.useState<Box | null>(null);

  // Состояние текущего перетаскивания (в ref, чтобы не гонять ре-рендеры).
  const drag = React.useRef<{
    x: number;
    y: number;
    additive: boolean;
    moved: boolean;
    base: Set<string>;
  } | null>(null);

  // Все блоки в DOM с их ключами — для проверки попадания в рамку.
  const blockEls = () =>
    Array.from(
      contentRef.current?.querySelectorAll<HTMLElement>("[data-pk]") ?? [],
    );

  const keysInRect = (rect: Box): string[] => {
    const hit: string[] = [];
    for (const el of blockEls()) {
      if (intersects(el.getBoundingClientRect(), rect)) {
        const k = el.dataset.pk;
        if (k) hit.push(k);
      }
    }
    return hit;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    drag.current = {
      x: e.clientX,
      y: e.clientY,
      additive: e.shiftKey,
      moved: false,
      base: new Set(selected),
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const onMove = (e: MouseEvent) => {
    const d = drag.current;
    if (!d) return;
    if (Math.abs(e.clientX - d.x) + Math.abs(e.clientY - d.y) > 4) d.moved = true;
    if (!d.moved) return;
    const rect: Box = {
      left: Math.min(d.x, e.clientX),
      top: Math.min(d.y, e.clientY),
      width: Math.abs(e.clientX - d.x),
      height: Math.abs(e.clientY - d.y),
    };
    setMarquee(rect);
    const hit = keysInRect(rect);
    setSelected(d.additive ? new Set([...d.base, ...hit]) : new Set(hit));
  };

  const onUp = (e: MouseEvent) => {
    const d = drag.current;
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
    drag.current = null;
    setMarquee(null);
    if (!d) return;
    // Не тащили — это клик: переключить блок под курсором либо снять выделение.
    if (!d.moved) {
      const point: Box = { left: e.clientX, top: e.clientY, width: 0, height: 0 };
      const [key] = keysInRect(point);
      if (key) {
        setSelected((prev) => {
          const next = d.additive ? new Set(prev) : new Set<string>();
          if (d.additive && prev.has(key)) next.delete(key);
          else next.add(key);
          return next;
        });
      } else if (!d.additive) {
        setSelected(new Set());
      }
    }
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
  }, [selected, sections]);

  const clear = () => setSelected(new Set());

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

      {/* Область выделения: mousedown по фону начинает рамку. */}
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        className="relative min-h-0 flex-1 cursor-crosshair select-none overflow-y-auto"
      >
        <div ref={contentRef} className="relative mx-auto max-w-prose px-6 py-8">
          {/* Бокс вокруг выделения (в координатах контента). */}
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
                    <BlockPreview block={b} />
                  </div>
                );
              }),
            )}
          </div>
        </div>

        {/* Рамка выделения — фикс. позиционирование в клиентских координатах. */}
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

      {/* Плашка действий над выделением. */}
      {selected.size > 0 && (
        <div className="flex items-center justify-between gap-3 border-t bg-background px-4 py-2">
          <span className="text-sm text-foreground">
            Выбрано блоков: <b>{selected.size}</b>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clear}
              className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              Сбросить
            </button>
            <button
              type="button"
              disabled
              title="Появится в следующем модуле"
              className="cursor-not-allowed rounded-md bg-brand/40 px-3 py-1.5 text-sm font-medium text-brand-foreground"
            >
              Создать директиву →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Компактный предпросмотр блока в плейграунде. */
function BlockPreview({ block }: { block: SourceBlock }) {
  switch (block.kind) {
    case "heading":
      return (
        <div className="font-semibold text-foreground">
          {renderInline(block.md)}
        </div>
      );
    case "paragraph":
    case "quote":
      return (
        <div className="text-sm leading-snug text-foreground">
          {renderInline(block.md)}
        </div>
      );
    case "list":
      return (
        <ul className="list-inside list-disc text-sm text-foreground">
          {block.items.slice(0, 4).map((it, i) => (
            <li key={i}>{renderInline(it.md)}</li>
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
