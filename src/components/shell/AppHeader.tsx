import { Link, useLocation } from "react-router-dom";
import { Accessibility } from "lucide-react";
import { tracks, getTrack } from "@/data/nav";
import { cn } from "@/lib/utils";
import { SiteSearch } from "./SiteSearch";
import { ThemeToggle } from "./ThemeToggle";

// AppHeader (00b §2.1) — бренд-лого → #/; главное меню из 3 ролевых треков
// (активный подсвечен); глобальная ссылка «Трудоустройство в Яндексе»;
// поиск; переключатель темы. Три трека — плоские ссылки, не NavigationMenu.

export function AppHeader() {
  const { pathname } = useLocation();
  const activeTrack = getTrack(pathname);
  const yandexActive = pathname === "/yandex-jobs";

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6">
        {/* Бренд */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground">
            Я
          </span>
          <Accessibility className="h-5 w-5 text-brand" />
          <span className="font-semibold leading-tight">Инклюзия в Яндексе</span>
        </Link>

        {/* Главное меню — три трека */}
        <nav className="hidden items-center gap-1 md:flex">
          {tracks.map((t) => (
            <Link
              key={t.track}
              to={t.path}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                activeTrack === t.track
                  ? "text-brand"
                  : "text-foreground/80"
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
              yandexActive ? "text-brand" : "text-foreground/80"
            )}
            aria-current={yandexActive ? "page" : undefined}
          >
            Трудоустройство в Яндексе
          </Link>
          <SiteSearch />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
