import { Link, useLocation } from "react-router-dom";
import { Accessibility } from "lucide-react";
import { mainMenu, isMenuActive } from "@/data/nav";
import { cn } from "@/lib/utils";
import { SiteSearch } from "./SiteSearch";

// AppHeader (00 — глобальная навигация) — бренд-лого → #/; главное меню из
// крупных разделов (Общая информация + ролевые треки + вход в редакторский
// раздел, активный подсвечен); поиск; тема. Прототип десктопный: мобильного
// меню/бургера нет, главное меню показывается всегда. Темы М1–М4 — в боковом
// меню, не здесь.
//
// Два вида: "bar" — привычная липкая полоса (служебные страницы редактора);
// "overlay" — прозрачная шапка внутри баннера с фото (PageHeroBand), тогда она
// едет вместе со страницей, а не липнет к верху.

export function AppHeader({
  variant = "bar",
}: {
  variant?: "bar" | "overlay";
}) {
  const { pathname } = useLocation();
  const onDark = variant === "overlay";

  return (
    <header
      className={cn(
        onDark
          ? "relative z-20 w-full"
          : "sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6">
        {/* Бренд */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground">
            Я
          </span>
          <Accessibility
            className={cn("h-5 w-5", onDark ? "text-white" : "text-brand")}
          />
          <span
            className={cn(
              "font-semibold leading-tight",
              onDark && "text-white",
            )}
          >
            Инклюзия в Яндексе
          </span>
        </Link>

        {/* Главное меню — крупные разделы */}
        <nav className="flex items-center gap-0.5">
          {mainMenu.map((item) => {
            const cls = cn(
              "whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2",
              onDark
                ? "hover:bg-white/15 hover:text-white focus-visible:ring-white"
                : "hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring",
            );

            // Внешняя ссылка (отдельное приложение-редактор) — обычный <a>,
            // открывается в новой вкладке; активного состояния у неё нет.
            if (item.external) {
              return (
                <a
                  key={item.path}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    cls,
                    onDark ? "text-white/80" : "text-foreground/80",
                  )}
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
                className={cn(
                  cls,
                  onDark
                    ? active
                      ? "bg-white/15 text-white"
                      : "text-white/80"
                    : active
                      ? "text-brand"
                      : "text-foreground/80",
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-1">
          <SiteSearch onDark={onDark} />
        </div>
      </div>
    </header>
  );
}
