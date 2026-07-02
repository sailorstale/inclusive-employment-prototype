import * as React from "react";
import { useLocation } from "react-router-dom";
import { Check, MessageCircle, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { normalizeText } from "./ids";
import { useComments } from "./CommentsProvider";
import type { Comment } from "./comments";

// Слой комментариев-пинов поверх страницы. Гибридная привязка: пин цепляется к
// ближайшему текстовому блоку (по его тексту — переживает перевёрстку) со
// смещением dx/dy. Пины видны всем; режим «добавления» включается в шапке.

const BLOCK_SEL =
  "#main-content p, #main-content li, #main-content h1, #main-content h2, #main-content h3, #main-content h4";

function findAnchorEl(anchorText: string): HTMLElement | null {
  if (!anchorText) return null;
  const norm = normalizeText(anchorText);
  const els = document.querySelectorAll<HTMLElement>(BLOCK_SEL);
  for (const el of els) {
    if (normalizeText(el.textContent || "") === norm) return el;
  }
  return null;
}

function mainEl(): HTMLElement | null {
  return document.getElementById("main-content");
}

type Draft = { page: string; anchorText: string; dx: number; dy: number };

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

export function CommentsLayer() {
  const { pathname } = useLocation();
  const {
    comments,
    adding,
    setAdding,
    addComment,
    editComment,
    toggleResolved,
    removeComment,
  } = useComments();

  const [, force] = React.useReducer((n) => n + 1, 0);
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<Draft | null>(null);

  const pagePins = React.useMemo(
    () => comments.filter((c) => c.page === pathname),
    [comments, pathname]
  );

  // Перепозиционирование пинов при скролле/ресайзе.
  React.useEffect(() => {
    let frame = 0;
    const onMove = () => {
      if (!frame) frame = requestAnimationFrame(() => {
        frame = 0;
        force();
      });
    };
    window.addEventListener("scroll", onMove, { passive: true });
    window.addEventListener("resize", onMove);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onMove);
      window.removeEventListener("resize", onMove);
    };
  }, []);

  // Режим добавления: клик по странице ставит пин.
  React.useEffect(() => {
    if (!adding) return;
    document.body.style.cursor = "crosshair";
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const main = mainEl();
      // Комментируем только в области контента и не по самим элементам слоя.
      if (!main || !main.contains(t) || t.closest("[data-comments-ui]")) return;
      e.preventDefault();
      e.stopPropagation();
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      const block = el?.closest<HTMLElement>(BLOCK_SEL) ?? null;
      const anchor = block ?? mainEl();
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      setDraft({
        page: pathname,
        anchorText: block ? normalizeText(block.textContent || "").slice(0, 400) : "",
        dx: e.clientX - rect.left,
        dy: e.clientY - rect.top,
      });
      setOpenId("__draft__");
      setAdding(false);
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.body.style.cursor = "";
      document.removeEventListener("click", onClick, true);
    };
  }, [adding, pathname, setAdding]);

  const positionOf = (anchorText: string, dx: number, dy: number) => {
    const el = anchorText ? findAnchorEl(anchorText) : mainEl();
    const base = el ?? mainEl();
    if (!base) return null;
    const rect = base.getBoundingClientRect();
    return { left: rect.left + dx, top: rect.top + dy, lost: Boolean(anchorText) && !el };
  };

  return (
    <div
      data-comments-ui
      className="pointer-events-none fixed inset-0 z-40"
      aria-hidden={pagePins.length === 0 && !draft}
    >
      {adding ? (
        <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-brand px-3 py-1.5 text-xs font-medium text-brand-foreground shadow-md">
          Кликните в любом месте, чтобы оставить комментарий · Esc — отмена
        </div>
      ) : null}

      {pagePins.map((c) => {
        const pos = positionOf(c.anchorText, c.dx, c.dy);
        if (!pos) return null;
        return (
          <Pin
            key={c.id}
            comment={c}
            left={pos.left}
            top={pos.top}
            lost={pos.lost}
            open={openId === c.id}
            onToggle={() => setOpenId((id) => (id === c.id ? null : c.id))}
            onClose={() => setOpenId(null)}
            onSave={(text) => editComment(c.id, text)}
            onResolve={(v) => toggleResolved(c.id, v)}
            onDelete={() => {
              removeComment(c.id);
              setOpenId(null);
            }}
          />
        );
      })}

      {draft ? (
        <DraftPin
          position={positionOf(draft.anchorText, draft.dx, draft.dy)}
          onCancel={() => {
            setDraft(null);
            setOpenId(null);
          }}
          onSave={async (text) => {
            try {
              await addComment({ ...draft, text });
              setDraft(null);
              setOpenId(null);
            } catch {
              // не удалось сохранить — оставляем черновик открытым для повтора
            }
          }}
        />
      ) : null}
    </div>
  );
}

function PinDot({
  resolved,
  lost,
  onClick,
}: {
  resolved?: boolean;
  lost?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-comments-ui
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full rounded-bl-sm border-2 border-white shadow-md transition-transform hover:scale-110",
        resolved
          ? "bg-[hsl(var(--ok))] text-white"
          : "bg-brand text-brand-foreground",
        lost && "opacity-50"
      )}
      title={lost ? "Текст блока изменился — пин примерно здесь" : undefined}
      aria-label="Комментарий"
    >
      {resolved ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <MessageCircle className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

function Pin({
  comment,
  left,
  top,
  lost,
  open,
  onToggle,
  onClose,
  onSave,
  onResolve,
  onDelete,
}: {
  comment: Comment;
  left: number;
  top: number;
  lost: boolean;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onSave: (text: string) => void;
  onResolve: (v: boolean) => void;
  onDelete: () => void;
}) {
  const [text, setText] = React.useState(comment.text);
  React.useEffect(() => setText(comment.text), [comment.text, open]);

  return (
    <div className="absolute" style={{ left, top }}>
      <PinDot resolved={comment.resolved} lost={lost} onClick={onToggle} />
      {open ? (
        <Popover onClose={onClose} flipX={left + 330 > window.innerWidth}>
          <div className="mb-2 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{fmt(comment.createdAt)}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                data-comments-ui
                onClick={() => onResolve(!comment.resolved)}
                className={cn(
                  "rounded-md px-2 py-0.5 text-[11px] font-medium",
                  comment.resolved
                    ? "bg-[hsl(var(--ok)/0.15)] text-[hsl(var(--ok))]"
                    : "hover:bg-accent"
                )}
              >
                {comment.resolved ? "Решён" : "Отметить решённым"}
              </button>
              <button
                type="button"
                data-comments-ui
                onClick={onDelete}
                aria-label="Удалить"
                className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-[hsl(var(--bad))]"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <textarea
            data-comments-ui
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full resize-y rounded-md border bg-background px-2.5 py-1.5 text-sm leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {text !== comment.text ? (
            <button
              type="button"
              data-comments-ui
              onClick={() => onSave(text)}
              className="mt-2 w-full rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-brand-foreground hover:bg-[hsl(var(--brand)/0.9)]"
            >
              Сохранить
            </button>
          ) : null}
        </Popover>
      ) : null}
    </div>
  );
}

function DraftPin({
  position,
  onCancel,
  onSave,
}: {
  position: { left: number; top: number } | null;
  onCancel: () => void;
  onSave: (text: string) => void;
}) {
  const [text, setText] = React.useState("");
  const ref = React.useRef<HTMLTextAreaElement>(null);
  React.useEffect(() => {
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  if (!position) return null;
  return (
    <div className="absolute" style={{ left: position.left, top: position.top }}>
      <PinDot onClick={() => {}} />
      <Popover onClose={onCancel} flipX={position.left + 330 > window.innerWidth}>
        <textarea
          ref={ref}
          data-comments-ui
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Ваш комментарий…"
          className="w-full resize-y rounded-md border bg-background px-2.5 py-1.5 text-sm leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            data-comments-ui
            disabled={!text.trim()}
            onClick={() => onSave(text.trim())}
            className="flex-1 rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-brand-foreground hover:bg-[hsl(var(--brand)/0.9)] disabled:opacity-40"
          >
            Добавить
          </button>
          <button
            type="button"
            data-comments-ui
            onClick={onCancel}
            className="rounded-md border px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent"
          >
            Отмена
          </button>
        </div>
      </Popover>
    </div>
  );
}

function Popover({
  children,
  onClose,
  flipX,
}: {
  children: React.ReactNode;
  onClose: () => void;
  flipX?: boolean;
}) {
  // Раскрываемся в сторону, где есть место, чтобы окошко не уезжало за край.
  return (
    <div
      data-comments-ui
      style={flipX ? { right: 36 } : { left: 36 }}
      className="pointer-events-auto absolute top-0 w-[min(18rem,86vw)] rounded-lg border bg-card p-3 text-card-foreground shadow-xl"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Закрыть"
        className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground hover:bg-accent"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      {children}
    </div>
  );
}
