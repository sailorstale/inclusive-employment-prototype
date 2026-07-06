import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Accessibility, Menu } from "lucide-react";
import { tracks, getTrack } from "@/data/nav";
import { cn } from "@/lib/utils";
import { SiteSearch } from "./SiteSearch";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNavDrawer } from "./MobileNavDrawer";

// AppHeader (00 — глобальная навигация) — бренд-лого → #/; на десктопе (lg+)
// меню из 3 ролевых треков (активный подсвечен) + «Трудоустройство в Яндексе»;
// поиск; тема. До lg главное и локальное меню уходят в бургер → MobileNavDrawer.

export function AppHeader() {
  const { pathname } = useLocation();
  const activeTrack = getTrack(pathname);
  const yandexActive = pathname === "/yandex-jobs";

  const [navOpen, setNavOpen] = React.useState(false);
  const burgerRef = React.useRef<HTMLButtonElement>(null);

  // Закрывать меню при смене маршрута.
  React.useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  // Закрывать меню при переходе на десктоп (иначе скрытый drawer оставит
  // блокировку скролла, а навигация уже в рейлах).
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (mq.matches) setNavOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const closeNav = React.useCallback(() => {
    setNavOpen(false);
    burgerRef.current?.focus();
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-6 sm:gap-6">
        {/* Бургер — мобильная/планшетная навигация (до lg) */}
        <button
          ref={burgerRef}
          type="button"
          onClick={() => setNavOpen(true)}
          aria-label="Открыть навигацию"
          aria-expanded={navOpen}
          aria-controls={navOpen ? "mobile-nav" : undefined}
          className="-ml-1 rounded-md p-2.5 text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Бренд */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground">
            Я
          </span>
          <Accessibility className="h-5 w-5 text-brand" />
          <span className="font-semibold leading-tight">
            Инклюзия в Яндексе
          </span>
        </Link>

        {/* Главное меню — три трека (десктоп) */}
        <nav className="hidden items-center gap-1 lg:flex">
          {tracks.map((t) => (
            <Link
              key={t.track}
              to={t.path}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                activeTrack === t.track ? "text-brand" : "text-foreground/80",
              )}
              aria-current={activeTrack === t.track ? "page" : undefined}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-1">
          {/* Глобальная сквозная ссылка */}
          <Link
            to="/yandex-jobs"
            className={cn(
              "hidden rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:block",
              yandexActive ? "text-brand" : "text-foreground/80",
            )}
            aria-current={yandexActive ? "page" : undefined}
          >
            Трудоустройство в Яндексе
          </Link>
          <SiteSearch />
          <ThemeToggle />
        </div>
      </div>

      <MobileNavDrawer open={navOpen} onClose={closeNav} />
    </header>
  );
}
