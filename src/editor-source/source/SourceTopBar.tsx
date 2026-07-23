import { NavLink, Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { sourceModulesMeta } from "@/editor-source/content/source.generated";

// Шапка инструмента «Редактура источника» — намеренно НЕ похожа на сайт:
// слева название инструмента, по центру табы модулей, справа тема. Тумблер
// режима редактора и комментарии — в плавающем доке (EditorDock), как на сайте.
export function SourceTopBar() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-14 items-center gap-4 px-4">
        <div className="flex shrink-0 items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background">
            <FileText className="h-4 w-4" />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Редактура источника</div>
            <div className="text-[11px] text-muted-foreground">
              дословный курс ↔ наша редакция
            </div>
          </div>
        </div>

        <nav
          aria-label="Модули"
          className="flex flex-1 items-center gap-1 overflow-x-auto"
        >
          {sourceModulesMeta.map((m) => (
            <NavLink
              key={m.id}
              to={`/source/${m.id}`}
              title={m.title ? `Модуль ${m.num}. ${m.title}` : `Модуль ${m.num}`}
              className={({ isActive }) =>
                cn(
                  "shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "bg-[hsl(var(--brand)/0.12)] text-brand"
                    : "text-foreground/70 hover:bg-accent hover:text-accent-foreground"
                )
              }
            >
              Модуль {m.num}
            </NavLink>
          ))}

          {/* Эталон формата для разработчика — отделён от модулей чертой:
              это не часть курса, а тестовая страница. */}
          <span aria-hidden className="mx-1 h-5 w-px shrink-0 bg-border" />
          <NavLink
            to="/source/sample"
            title="Образец: все компоненты и JSON к ним"
            className={({ isActive }) =>
              cn(
                "shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-[hsl(var(--brand)/0.12)] text-brand"
                  : "text-foreground/70 hover:bg-accent hover:text-accent-foreground"
              )
            }
          >
            Образец
          </NavLink>
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          <Link
            to="/"
            className="hidden rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:block"
          >
            ← К сайту
          </Link>
        </div>
      </div>
    </header>
  );
}
