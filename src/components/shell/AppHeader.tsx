import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Accessibility, Menu } from "lucide-react";
import { mainMenu, isMenuActive } from "@/data/nav";
import { cn } from "@/lib/utils";
import { SiteSearch } from "./SiteSearch";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNavDrawer } from "./MobileNavDrawer";

// AppHeader (00 — глобальная навигация) — бренд-лого → #/; на десктопе (lg+)
// главное меню из крупных разделов (Общая информация + ролевые треки + вход в
// редакторский раздел «Изменения», активный подсвечен); поиск; тема. До lg меню
// уходит в бургер → MobileNavDrawer. Темы М1–М4 — в боковом меню, не здесь.

export function AppHeader() {
  const { pathname } = useLocation();

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

        {/* Главное меню — крупные разделы (десктоп) */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {mainMenu.map((item) => {
            const cls =
              "whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

            // Внешняя ссылка (отдельное приложение-редактор) — обычный <a>,
            // открывается в новой вкладке; активного состояния у неё нет.
            if (item.external) {
              return (
                <a
                  key={item.path}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(cls, "text-foreground/80")}
                >
                  {item.label}
                </a>
              );
            }

            const active = isMenuActive(item.path, pathname);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(cls, active ? "text-brand" : "text-foreground/80")}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-1">
          <SiteSearch />
          <ThemeToggle />
        </div>
      </div>

      <MobileNavDrawer open={navOpen} onClose={closeNav} />
    </header>
  );
}
