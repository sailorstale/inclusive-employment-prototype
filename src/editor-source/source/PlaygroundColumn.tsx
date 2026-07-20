import * as React from "react";
import { Trash2, Check, Eye, Undo2 } from "lucide-react";
import "@/figma/tokens.css";
import { renderInline } from "@/editor-source/richText";
import { DirectiveCard, type DirectiveDraft } from "./DirectiveCard";
import { ResultView } from "./ResultView";
import { iconByName } from "./iconForText";
import {
  useMdResolver,
  blockType,
  iconTextOf,
  type ResolveMd,
} from "./blockResolve";
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

// Где помним выбранный режим плейграунда между перезагрузками.
const MODE_KEY = "inclusion-source-playground-mode";

/** Переключатель режима плейграунда: разметка блоков ↔ результат. */
function ModeBtn({
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
      aria-pressed={active}
      className={[
        "rounded px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "bg-brand text-brand-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

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
  /** Директива блока, если она есть — чтобы пометить блок прямо в теле страницы. */
  directiveFor?: (b: SourceBlock, anchor?: string) => Directive | undefined;
};

export function PlaygroundColumn({
  sections,
  selected,
  onSelectedChange,
  onCreateDirective,
  scrollRef,
  directiveFor,
}: Props) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const resolve = useMdResolver();

  const [marquee, setMarquee] = React.useState<Box | null>(null);
  const [groupBox, setGroupBox] = React.useState<Box | null>(null);
  // «Блоки» — разметка (выделение рамкой); «Результат» — как выглядит с
  // применёнными директивами (статус «применена»/«проверена»).
  // Выбор запоминаем: иначе после каждой перезагрузки возвращались в «Блоки».
  const [mode, setModeState] = React.useState<"blocks" | "result">(() => {
    try {
      return localStorage.getItem(MODE_KEY) === "result" ? "result" : "blocks";
    } catch {
      return "blocks";
    }
  });
  // Скролл-контейнер нужен и наружу (синхрон колонок), и нам — держим свой ref
  // и прокидываем элемент в переданный.
  const boxRef = React.useRef<HTMLDivElement | null>(null);
  const setBoxRef = React.useCallback(
    (el: HTMLDivElement | null) => {
      boxRef.current = el;
      if (typeof scrollRef === "function") scrollRef(el);
      else if (scrollRef)
        (scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    },
    [scrollRef],
  );

  /*
    Начала секций в порядке следования — общая система координат для обоих
    режимов. В «Результате» секция — это Section Container; в «Блоках» такой
    обёртки нет, поэтому секцию представляет её первый блок (data-pk = «си:би»).
    Массив разрежённый: индекс = номер секции.
  */
  const sectionEls = React.useCallback((): HTMLElement[] => {
    const box = boxRef.current;
    if (!box) return [];
    if (mode === "result")
      return Array.from(
        box.querySelectorAll<HTMLElement>('[data-component="Section Container"]'),
      );
    const out: HTMLElement[] = [];
    box.querySelectorAll<HTMLElement>("[data-pk]").forEach((el) => {
      const [si, bi] = (el.dataset.pk || "").split(":");
      if (bi === "0") out[Number(si)] = el;
    });
    return out;
  }, [mode]);

  /*
    Переключение режима не должно терять место чтения. Высоты у «Блоков» и
    «Результата» разные (там карточки и аккордеоны), поэтому запоминаем не
    пиксели, а секцию + долю прокрутки внутри неё — и после смены режима
    восстанавливаем по той же секции.
  */
  const anchor = React.useRef<{ i: number; frac: number } | null>(null);

  /** Границы секции i в координатах содержимого контейнера. */
  const sectionSpan = (els: HTMLElement[], i: number, box: HTMLElement) => {
    const boxTop = box.getBoundingClientRect().top - box.scrollTop;
    const top = els[i].getBoundingClientRect().top - boxTop;
    const next = els.slice(i + 1).find(Boolean);
    const height = next
      ? next.getBoundingClientRect().top - boxTop - top
      : els[i].offsetHeight;
    return { top, height };
  };

  const setMode = (m: "blocks" | "result") => {
    const box = boxRef.current;
    const els = sectionEls();
    if (box && els.length) {
      // Верхняя секция, начало которой уже ушло за верхний край окна.
      let i = 0;
      for (let k = 0; k < els.length; k++)
        if (els[k] && sectionSpan(els, k, box).top <= box.scrollTop) i = k;
      const { top, height } = sectionSpan(els, i, box);
      anchor.current = {
        i,
        frac: height > 0 ? Math.min(1, Math.max(0, (box.scrollTop - top) / height)) : 0,
      };
    }
    setModeState(m);
    try {
      localStorage.setItem(MODE_KEY, m);
    } catch {
      /* приватный режим — просто не запомним */
    }
  };

  // Восстановление — до отрисовки кадра, чтобы не было видно прыжка.
  React.useLayoutEffect(() => {
    const a = anchor.current;
    anchor.current = null;
    const box = boxRef.current;
    if (!a || !box) return;
    const els = sectionEls();
    if (!els[a.i]) return;
    const { top, height } = sectionSpan(els, a.i, box);
    box.scrollTop = top + a.frac * height;
  }, [mode, sectionEls]);

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
        <div className="flex items-center gap-0.5 rounded-md border bg-background p-0.5">
          <ModeBtn active={mode === "blocks"} onClick={() => setMode("blocks")}>
            Блоки
          </ModeBtn>
          <ModeBtn active={mode === "result"} onClick={() => setMode("result")}>
            Результат
          </ModeBtn>
        </div>
      </div>

      <div
        ref={setBoxRef}
        onMouseDown={mode === "blocks" ? onMouseDown : undefined}
        className={[
          "relative min-h-0 flex-1 overflow-y-auto",
          mode === "blocks" ? "cursor-crosshair select-none" : "",
        ].join(" ")}
      >
        {mode === "result" ? (
          <ResultView
            sections={sections}
            directiveFor={directiveFor}
            resolve={resolve}
          />
        ) : (
        <div
          ref={contentRef}
          className="figma-scope relative mx-auto max-w-prose px-6 py-8"
        >
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
                const dir = directiveFor?.(b, sec.anchor);
                return (
                  <div
                    key={key}
                    data-pk={key}
                    className={[
                      "relative rounded-md border px-3 py-2 transition-colors",
                      on
                        ? "border-brand/60 bg-brand/10"
                        : dir
                          ? "border-brand/30 hover:border-brand/50"
                          : "border-transparent hover:border-border",
                    ].join(" ")}
                  >
                    {/* Левый акцент — блок уже размечен директивой. */}
                    {dir && (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-y-0 left-0 w-1 rounded-l-md bg-brand/70"
                      />
                    )}
                    {/* Шильдик — справа, поверх контента; тип блока + модификатор. */}
                    <span className="pointer-events-none absolute right-1.5 top-1.5 z-10 rounded bg-muted/90 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      {KIND_LABEL[b.kind]}
                      {blockModifier(b) ? ` · ${blockModifier(b)}` : ""}
                    </span>
                    <BlockPreview block={b} anchor={sec.anchor} resolve={resolve} />
                    {/* Метка директивы — во что превращаем + статус. */}
                    {dir && (
                      <div className="pointer-events-none mt-1.5 flex flex-wrap items-center gap-1">
                        <span className="inline-flex items-center gap-1 rounded bg-brand/15 px-1.5 py-0.5 text-[10px] font-medium text-brand">
                          → {dir.targetLabel ?? "директива"}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {STATUS_LABEL[dir.status]}
                        </span>
                      </div>
                    )}
                  </div>
                );
              }),
            )}
          </div>
        </div>
        )}

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
  onSetStatus,
  onEditComment,
}: {
  sections: Section[];
  selected: Set<string>;
  directives: Directive[];
  onSaveDraft: (draft: DirectiveDraft) => void;
  onDelete: (id: string) => void;
  onSetStatus: (id: string, status: Directive["status"]) => void;
  onEditComment: (id: string, comment: string) => void;
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
    // h-full обязателен: без него панель тянется по содержимому, overflow-y-auto
    // не срабатывает (нечего переполнять) и список директив просто обрезается
    // родителем. Тот же приём, что у соседней вкладки «Редактор».
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto p-4">
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
            <DirectiveCard
              count={picked.length}
              blockTexts={picked.map(({ block, anchor }) =>
                iconTextOf(block, anchor, resolve),
              )}
              onSave={onSaveDraft}
            />
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
              <DirectiveRow
                key={d.id}
                d={d}
                onDelete={onDelete}
                onSetStatus={onSetStatus}
                onEditComment={onEditComment}
              />
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

// Шаг статуса назад — на случай ошибочного клика (панель — единственная поверхность).
const PREV_STATUS: Record<Directive["status"], Directive["status"] | null> = {
  new: null,
  applied: "new",
  verified: "applied",
};

function DirectiveRow({
  d,
  onDelete,
  onSetStatus,
  onEditComment,
}: {
  d: Directive;
  onDelete: (id: string) => void;
  onSetStatus: (id: string, status: Directive["status"]) => void;
  onEditComment: (id: string, comment: string) => void;
}) {
  const prev = PREV_STATUS[d.status];
  // Комментарий можно дописывать и после сохранения — директива живёт и уточняется.
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(d.comment || "");
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
      {d.blocks.some((b) => b.icon) && (
        <div className="mt-1 flex flex-wrap gap-1.5">
          {d.blocks
            .filter((b) => b.icon)
            .map((b, i) => {
              const Icon = iconByName(b.icon);
              return (
                <Icon
                  key={i}
                  className="size-4 text-muted-foreground"
                  aria-label={b.snippet}
                />
              );
            })}
        </div>
      )}
      {editing ? (
        <div className="mt-1">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            autoFocus
            placeholder="Что уточнить в этой директиве"
            className="w-full resize-y rounded-md border bg-background px-2 py-1.5 text-sm"
          />
          <div className="mt-1 flex gap-1.5">
            <button
              type="button"
              onClick={() => {
                onEditComment(d.id, draft.trim());
                setEditing(false);
              }}
              className="rounded-md bg-brand px-2 py-1 text-xs font-medium text-brand-foreground hover:bg-brand/90"
            >
              Сохранить
            </button>
            <button
              type="button"
              onClick={() => {
                setDraft(d.comment || "");
                setEditing(false);
              }}
              className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="mt-1 block w-full rounded px-1 py-0.5 text-left text-sm hover:bg-muted/60"
        >
          {d.comment ? (
            <span className="text-foreground/80">{d.comment}</span>
          ) : (
            <span className="text-muted-foreground">+ комментарий</span>
          )}
        </button>
      )}

      {/* Статус: новая → применена → проверена. Разработчик отмечает по мере
          переноса в конструктор; шаг назад — на случай ошибки. */}
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {d.status === "new" && (
          <button
            type="button"
            onClick={() => onSetStatus(d.id, "applied")}
            className="inline-flex items-center gap-1 rounded-md bg-brand px-2 py-1 text-xs font-medium text-brand-foreground hover:bg-brand/90"
          >
            <Check className="size-3.5" /> Применена
          </button>
        )}
        {d.status === "applied" && (
          <button
            type="button"
            onClick={() => onSetStatus(d.id, "verified")}
            className="inline-flex items-center gap-1 rounded-md border border-brand/40 px-2 py-1 text-xs font-medium text-brand hover:bg-brand/10"
          >
            <Eye className="size-3.5" /> Проверена
          </button>
        )}
        {prev && (
          <button
            type="button"
            onClick={() => onSetStatus(d.id, prev)}
            aria-label="Вернуть статус на шаг назад"
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <Undo2 className="size-3.5" /> вернуть
          </button>
        )}
      </div>
    </li>
  );
}

/*
  Компактный предпросмотр блока — теми же типографскими стилями DS, что у наших
  компонентов (ds-h2/h3/h4, ds-body-l …, внутри figma-scope). Так в плейграунде
  видна реальная иерархия: H2 крупнее H3, цитата курсивом и т.д. С учётом правок.
*/
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
        <div className={`ds-h${block.level} text-[color:var(--text-primary)]`}>
          {renderInline(
            resolve(`h${block.level}`, block.text, block.md, anchor),
          )}
        </div>
      );
    case "paragraph":
      return (
        <div className="ds-body-l text-[color:var(--text-primary)]">
          {renderInline(resolve("paragraph", block.text, block.md, anchor))}
        </div>
      );
    case "quote":
      return (
        <div className="ds-body-l-italic text-[color:var(--text-primary)]">
          {renderInline(resolve("paragraph", block.text, block.md, anchor))}
        </div>
      );
    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List
          className={`ds-body-l list-inside text-[color:var(--text-primary)] ${
            block.ordered ? "list-decimal" : "list-disc"
          }`}
        >
          {block.items.slice(0, 4).map((it, i) => (
            <li key={i}>{renderInline(resolve("li", it.text, it.md, anchor))}</li>
          ))}
          {block.items.length > 4 && (
            <li className="list-none text-[color:var(--text-secondary)]">…</li>
          )}
        </List>
      );
    }
    case "table":
      return (
        <div className="max-w-full overflow-x-auto">
          <table className="w-full border-collapse">
            {block.header.some((c) => c) && (
              <thead>
                <tr>
                  {block.header.map((c, i) => (
                    <th
                      key={i}
                      className="ds-body-s-bold border border-border bg-muted/50 px-2 py-1 text-left align-top text-[color:var(--text-primary)]"
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
                      className="ds-body-s border border-border px-2 py-1 align-top text-[color:var(--text-primary)]"
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
    case "image":
      return <ImagePreview src={block.src} alt={block.alt} />;
  }
}

/*
  Картинка источника. Медиа из Google-доков пока не выгружены (папки
  /source-media нет), поэтому на ошибке загрузки показываем честный плейсхолдер,
  а не битую иконку. Выгрузят медиа — картинки появятся сами, без правок кода.
  draggable=false: нативный drag картинки иначе перебивает выделение рамкой.
*/
function ImagePreview({ src, alt }: { src: string; alt?: string }) {
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => setFailed(false), [src]);

  if (failed)
    return (
      <div className="ds-body-s rounded-md border border-dashed px-2 py-3 text-center text-[color:var(--text-secondary)]">
        Картинка не выгружена{alt ? ` · ${alt}` : ""}
      </div>
    );

  return (
    <img
      src={src}
      alt={alt || ""}
      loading="lazy"
      draggable={false}
      onError={() => setFailed(true)}
      className="h-auto max-w-full rounded-md border"
    />
  );
}
