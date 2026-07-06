import * as React from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { X, Search } from "lucide-react";
import { tracks, getTrack } from "@/data/nav";
import { searchPages } from "@/lib/search";
import { scrollToId } from "@/lib/scroll";
import { useToc } from "@/lib/toc";
import { cn } from "@/lib/utils";
import { TocLinks } from "../PageToc";
import { SidebarNav } from "./SidebarNav";

// MobileNavDrawer (00 — навигация на узком экране) — левый выезжающий drawer,
// закрывает дыру мобильной навигации: даёт быстрый доступ к ЛЮБОМУ разделу
// (поиск + треки + меню текущего трека) И к ЛЮБОЙ секции страницы («На этой
// странице»). Доступность: role=dialog/aria-modal, focus-trap, ESC, клик по
// оверлею, блокировка скролла, возврат фокуса (за фокус отвечает вызывающий —
// AppHeader фокусирует бургер в onClose). Только до lg (на lg+ — рейлы).
// Рендерится порталом в body: шапка с backdrop-filter иначе становится
// containing block для position:fixed и зажимает drawer в свою высоту.

const FOCUSABLE =
  'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';

export function MobileNavDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const track = getTrack(pathname);
  const { items } = useToc();
  const panelRef = React.useRef<HTMLDivElement>(null);
  const [query, setQuery] = React.useState("");
  const results = searchPages(query);

  // Сброс запроса при закрытии.
  React.useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  // Блокировка скролла фона + focus-trap + ESC + первичный фокус.
  React.useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;

    // Скролл-лок с компенсацией ширины полосы прокрутки (без сдвига вёрстки).
    const sw = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (sw > 0) document.body.style.paddingRight = `${sw}px`;

    const focusables = () =>
      panel
        ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
            (el) => el.offsetParent !== null,
          )
        : [];

    const raf = window.requestAnimationFrame(() => {
      const f = focusables();
      (f[0] ?? panel)?.focus();
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const f = focusables();
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      window.cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
    };
  }, [open, onClose]);

  if (!open) return null;

  // Любой переход из drawer закрывает его через onClose (→ возврат фокуса на
  // бургер, снятие скролл-лока), не полагаясь на смену маршрута (иначе переход
  // на текущую же страницу оставил бы drawer открытым).
  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  const globalLinkClass = (active: boolean) =>
    cn(
      "block rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      active
        ? "bg-accent font-medium text-brand"
        : "text-foreground/80 hover:bg-accent hover:text-foreground",
    );

  return createPortal(
    <div className="fixed inset-0 z-40 lg:hidden">
      {/* Оверлей — клик закрывает; для скринридера не озвучивается. */}
      <div
        className="absolute inset-0 bg-foreground/40 motion-safe:animate-in motion-safe:fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Панель */}
      <div
        ref={panelRef}
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Навигация по сайту"
        tabIndex={-1}
        className="absolute inset-y-0 left-0 z-50 flex w-[20rem] max-w-[85vw] flex-col border-r bg-background shadow-xl focus:outline-none motion-safe:animate-in motion-safe:slide-in-from-left"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b px-4">
          <span className="font-semibold text-foreground">Навигация</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть навигацию"
            className="-mr-1 rounded-md p-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-4 py-4">
          {/* 1. Поиск — самый быстрый путь к любому разделу по названию. */}
          <div>
            <label htmlFor="mnav-search" className="sr-only">
              Поиск по страницам
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="mnav-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && results[0]) go(results[0].path);
                }}
                placeholder="Поиск по страницам…"
                className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            {query.trim() ? (
              <ul className="mt-2 space-y-1">
                {results.length ? (
                  results.map((r) => (
                    <li key={r.path}>
                      <button
                        type="button"
                        onClick={() => go(r.path)}
                        className="block w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {r.title}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-sm text-muted-foreground">
                    Ничего не найдено
                  </li>
                )}
              </ul>
            ) : null}
          </div>

          {/* 2. На этой странице — переход к ЛЮБОЙ секции текущей страницы. */}
          {items.length >= 3 ? (
            <nav aria-label="На этой странице" className="border-t pt-5">
              <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                На этой странице
              </p>
              <TocLinks
                items={items}
                onSelect={(id) => {
                  // Сначала закрыть (снять скролл-лок), затем прокрутить — иначе
                  // переход к секции по заблокированному body не сработает.
                  onClose();
                  window.requestAnimationFrame(() => scrollToId(id));
                }}
              />
            </nav>
          ) : null}

          {/* 3. Разделы текущего трека (локальная навигация, «вы здесь»). */}
          {track ? (
            <div className="border-t pt-5">
              <SidebarNav track={track} onNavigate={onClose} />
            </div>
          ) : null}

          {/* 4. Все разделы сайта (глобальная навигация между треками). */}
          <nav aria-label="Разделы сайта" className="border-t pt-5">
            <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Разделы сайта
            </p>
            <div className="space-y-1">
              {tracks.map((t) => (
                <Link
                  key={t.track}
                  to={t.path}
                  onClick={onClose}
                  aria-current={track === t.track ? "page" : undefined}
                  className={globalLinkClass(track === t.track)}
                >
                  {t.label}
                </Link>
              ))}
              <Link
                to="/yandex-jobs"
                onClick={onClose}
                aria-current={pathname === "/yandex-jobs" ? "page" : undefined}
                className={globalLinkClass(pathname === "/yandex-jobs")}
              >
                Трудоустройство в Яндексе
              </Link>
              <Link
                to="/glossary"
                onClick={onClose}
                aria-current={pathname === "/glossary" ? "page" : undefined}
                className={globalLinkClass(pathname === "/glossary")}
              >
                Глоссарий
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </div>,
    document.body,
  );
}
