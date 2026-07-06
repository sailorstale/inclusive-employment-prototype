import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, MessageCirclePlus, MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { routeTitles } from "@/data/nav";
import { useComments } from "./CommentsProvider";
import type { Comment } from "./comments";

// Панель «все комментарии» (в стиле Figma): сводный список пинов со всех
// страниц в одном месте. Клик по карточке — переход на страницу, скролл к пину
// и раскрытие его попапа (через focusId; сам прыжок делает CommentsLayer).

type Filter = "open" | "resolved" | "all";

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

const pageTitle = (page: string) => routeTitles[page] ?? page;

export function CommentsPanel() {
  const {
    comments,
    panelOpen,
    setPanelOpen,
    setAdding,
    setFocusId,
    toggleResolved,
    openCount,
  } = useComments();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [filter, setFilter] = React.useState<Filter>("open");

  // Esc закрывает панель.
  React.useEffect(() => {
    if (!panelOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanelOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panelOpen, setPanelOpen]);

  const shown = React.useMemo(
    () =>
      comments
        .filter((c) =>
          filter === "all" ? true : filter === "open" ? !c.resolved : c.resolved
        )
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [comments, filter]
  );

  // Группировка по странице; текущая страница — первой.
  const byPage = React.useMemo(() => {
    const m = new Map<string, Comment[]>();
    for (const c of shown) {
      if (!m.has(c.page)) m.set(c.page, []);
      m.get(c.page)!.push(c);
    }
    return [...m.entries()].sort(([a], [b]) => {
      if (a === pathname) return -1;
      if (b === pathname) return 1;
      return pageTitle(a).localeCompare(pageTitle(b), "ru");
    });
  }, [shown, pathname]);

  const jumpTo = (c: Comment) => {
    if (c.page !== pathname) navigate(c.page);
    setFocusId(c.id);
  };

  if (!panelOpen) return null;

  return (
    <aside
      data-comments-ui
      aria-label="Все комментарии"
      className="fixed inset-y-0 right-0 z-50 flex w-[min(21rem,92vw)] flex-col border-l bg-card text-card-foreground shadow-xl"
    >
      <header className="flex items-center gap-2 border-b px-4 py-3">
        <MessageCircle className="h-4 w-4 text-brand" />
        <h2 className="text-sm font-semibold">Комментарии</h2>
        {openCount > 0 ? (
          <span className="rounded-full bg-brand px-1.5 text-[11px] font-medium leading-4 text-brand-foreground">
            {openCount}
          </span>
        ) : null}
        <button
          type="button"
          onClick={() => setPanelOpen(false)}
          aria-label="Закрыть"
          className="ml-auto rounded-md p-1 text-muted-foreground hover:bg-accent"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="flex items-center gap-1.5 border-b px-4 py-2.5">
        <FilterBtn active={filter === "open"} onClick={() => setFilter("open")}>
          Открытые
        </FilterBtn>
        <FilterBtn
          active={filter === "resolved"}
          onClick={() => setFilter("resolved")}
        >
          Решённые
        </FilterBtn>
        <FilterBtn active={filter === "all"} onClick={() => setFilter("all")}>
          Все
        </FilterBtn>
        <button
          type="button"
          onClick={() => setAdding(true)}
          title="Оставить комментарий"
          aria-label="Оставить комментарий"
          className="ml-auto rounded-md p-1.5 text-brand hover:bg-[hsl(var(--brand)/0.1)]"
        >
          <MessageCirclePlus className="h-[18px] w-[18px]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        {shown.length === 0 ? (
          <p className="rounded-lg border bg-muted/30 px-3 py-6 text-center text-sm text-muted-foreground">
            {comments.length === 0
              ? "Пока нет комментариев. Нажмите + и кликните в любом месте страницы."
              : "В этом фильтре пусто."}
          </p>
        ) : (
          byPage.map(([page, items]) => (
            <section key={page} className="mb-4">
              <h3 className="mb-1.5 flex items-baseline gap-1.5 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <span className="truncate">{pageTitle(page)}</span>
                {page === pathname ? (
                  <span className="shrink-0 font-normal normal-case tracking-normal">
                    · вы здесь
                  </span>
                ) : null}
              </h3>
              <ul className="space-y-1.5">
                {items.map((c) => (
                  <li key={c.id}>
                    <CommentRow
                      comment={c}
                      onJump={() => jumpTo(c)}
                      onResolve={(v) => toggleResolved(c.id, v)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </aside>
  );
}

function CommentRow({
  comment,
  onJump,
  onResolve,
}: {
  comment: Comment;
  onJump: () => void;
  onResolve: (v: boolean) => void;
}) {
  return (
    <div
      className={cn(
        "group relative rounded-lg border bg-background p-2.5 transition-colors hover:border-[hsl(var(--brand)/0.4)]",
        comment.resolved && "opacity-60"
      )}
    >
      <button
        type="button"
        onClick={onJump}
        className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="mb-1 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>{fmt(comment.createdAt)}</span>
          {comment.resolved ? (
            <span className="text-[hsl(var(--ok))]">решён</span>
          ) : null}
        </span>
        <span className="line-clamp-3 text-sm leading-snug text-foreground">
          {comment.text}
        </span>
        {comment.anchorText ? (
          <span className="mt-1 line-clamp-1 text-[11px] text-muted-foreground">
            к блоку: «{comment.anchorText.slice(0, 80)}»
          </span>
        ) : null}
      </button>
      <button
        type="button"
        onClick={() => onResolve(!comment.resolved)}
        title={comment.resolved ? "Вернуть в открытые" : "Отметить решённым"}
        aria-label={comment.resolved ? "Вернуть в открытые" : "Отметить решённым"}
        className={cn(
          "absolute right-2 top-2 rounded-md p-1 transition-opacity focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          comment.resolved
            ? "text-[hsl(var(--ok))]"
            : "text-muted-foreground opacity-0 hover:bg-accent group-hover:opacity-100"
        )}
      >
        <Check className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function FilterBtn({
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
      className={cn(
        "rounded-md px-2 py-1 text-xs transition-colors",
        active
          ? "bg-[hsl(var(--brand)/0.1)] font-medium text-brand"
          : "text-muted-foreground hover:bg-accent"
      )}
    >
      {children}
    </button>
  );
}
