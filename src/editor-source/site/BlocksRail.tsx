import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { scrollToBlock, scrollToBlockPath, flashBlockPath } from "@/lib/scroll";
import {
  buildBlockIndex,
  BLOCK_KINDS,
  KIND_LABEL,
  type BlockKind,
  type BlockRef,
} from "./blockIndex";

/*
  ПАНЕЛЬ БЛОКОВ — та же карта блоков, что на /blocks, но сбоку и поверх сайта:
  включил и ходишь по карточкам, квизам и цитатам, не уходя со страницы.

  Живёт в общей обвязке (Layout), поэтому переживает переход между страницами:
  нажали пункт — страница сменилась, панель осталась открытой на том же месте
  списка.

  Список считается ОДИН раз на всю сессию: сборка всех двадцати семи страниц
  занимает несколько секунд, и делать её на каждое открытие панели нельзя.
  Поэтому обещание живёт в модуле, а не в состоянии компонента.
*/

let cached: Promise<BlockRef[]> | null = null;
const loadOnce = () => (cached ??= buildBlockIndex());

const OPEN_KEY = "blocks-rail-open";

export function BlocksRail() {
  const [open, setOpen] = React.useState(
    () => localStorage.getItem(OPEN_KEY) === "1",
  );
  const [all, setAll] = React.useState<BlockRef[] | null>(null);
  const [kind, setKind] = React.useState<BlockKind | "Все">("Все");
  const [query, setQuery] = React.useState("");
  const { pathname } = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    localStorage.setItem(OPEN_KEY, open ? "1" : "0");
    if (open && !all) loadOnce().then(setAll);
  }, [open, all]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return (all ?? []).filter((b) => {
      if (kind !== "Все" && b.kind !== kind) return false;
      if (!q) return true;
      return (
        b.label.toLowerCase().includes(q) ||
        b.page.toLowerCase().includes(q) ||
        b.section.toLowerCase().includes(q)
      );
    });
  }, [all, kind, query]);

  // Внутри списка держим порядок сайта, но страницу называем один раз —
  // иначе подпись повторяется у каждого блока и список нечитаем.
  const rows = React.useMemo(() => {
    const out: (
      | { head: true; page: string; slug: string }
      | { head: false; block: BlockRef }
    )[] = [];
    let last = "";
    for (const b of filtered) {
      if (b.slug !== last) {
        out.push({ head: true, page: b.page, slug: b.slug });
        last = b.slug;
      }
      out.push({ head: false, block: b });
    }
    return out;
  }, [filtered]);

  /*
    Переход: если мы уже на нужной странице, просто прокручиваем — к самому
    блоку и с вспышкой, чтобы среди соседних карточек было видно, о какой речь.
    Блока на странице не нашлось — садимся на заголовок над ним.
  */
  const go = (b: BlockRef) => {
    if (b.slug === pathname) {
      if (scrollToBlockPath(b.path)) flashBlockPath(b.path);
      else if (b.anchor) scrollToBlock(b.anchor);
      return;
    }
    navigate(b.slug, { state: { block: b.path, anchor: b.anchor || undefined } });
  };

  if (!open)
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Карта блоков"
        className={cn(
          "fixed right-0 top-1/2 z-[60] -translate-y-1/2 rounded-l-lg border border-r-0 bg-card/95 px-2 py-3 shadow-md backdrop-blur",
          "flex flex-col items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground",
        )}
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="text-[11px] font-medium [writing-mode:vertical-rl]">
          Блоки
        </span>
      </button>
    );

  return (
    <aside className="fixed right-0 top-0 z-[60] flex h-screen w-[22rem] flex-col border-l bg-card shadow-xl">
      <header className="flex items-center gap-2 border-b px-3 py-2.5">
        <LayoutGrid className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-semibold text-foreground">Карта блоков</span>
        <span className="text-xs text-muted-foreground">
          {all ? filtered.length : ""}
        </span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Закрыть панель"
          title="Закрыть панель"
          className="ml-auto rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="space-y-2 border-b px-3 py-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по подписи и разделу"
          className="w-full rounded-md border bg-background px-2 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <div className="flex flex-wrap gap-1">
          {(["Все", ...BLOCK_KINDS] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={cn(
                "rounded-md px-2 py-1 text-[11px] transition-colors",
                kind === k
                  ? "bg-[hsl(var(--brand)/0.1)] font-medium text-brand"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {k === "Все" ? "Все" : KIND_LABEL[k]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {!all ? (
          <p className="p-3 text-xs text-muted-foreground">Собираем страницы…</p>
        ) : rows.length === 0 ? (
          <p className="p-3 text-xs text-muted-foreground">Ничего не нашлось.</p>
        ) : (
          <ul className="space-y-0.5">
            {rows.map((r, i) =>
              r.head ? (
                <li
                  key={`h${i}`}
                  className="flex items-baseline gap-1.5 px-2 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  <span className="truncate">{r.page}</span>
                  {r.slug === pathname ? (
                    <span className="shrink-0 font-normal normal-case tracking-normal text-foreground/50">
                      эта страница
                    </span>
                  ) : null}
                </li>
              ) : (
                <li key={`b${i}`}>
                  <button
                    type="button"
                    onClick={() => go(r.block)}
                    className={cn(
                      "w-full rounded-md px-2 py-1.5 text-left text-xs leading-snug transition-colors hover:bg-accent",
                      r.block.slug === pathname
                        ? "text-foreground"
                        : "text-foreground/75",
                    )}
                  >
                    <span className="line-clamp-2">
                      {r.block.label || "без подписи"}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                      {KIND_LABEL[r.block.kind]}
                      {r.block.section ? ` · ${r.block.section}` : ""}
                    </span>
                  </button>
                </li>
              ),
            )}
          </ul>
        )}
      </div>
    </aside>
  );
}
