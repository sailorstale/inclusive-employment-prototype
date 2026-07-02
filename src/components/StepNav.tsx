import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// StepNav (00 — последовательная навигация для пошаговых страниц) — внизу каждого
// шага: «← назад / далее →» С НАЗВАНИЕМ шага + индикатор «Шаг N из 6» с подсветкой
// текущего. Прыжки между шагами разрешены (это чтение, не форма) — их роль
// выполняет и боковое меню, поэтому точки-индикатор не обязаны быть ссылками.

type StepLink = { label: string; to: string };

export function StepNav({
  prev,
  next,
  current,
  total = 6,
}: {
  prev?: StepLink;
  next?: StepLink;
  /** Номер текущего шага (1…total) — включает индикатор «Шаг N из total». */
  current?: number;
  total?: number;
}) {
  const cardBase =
    "group flex flex-1 flex-col gap-1 rounded-lg border p-4 transition-colors hover:border-ring hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  return (
    <nav
      aria-label="Навигация по шагам"
      data-component="StepNav"
      className="mt-4 space-y-4"
    >
      {current ? (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">
            Шаг {current} из {total}
          </span>
          <span className="flex flex-1 gap-1.5" aria-hidden="true">
            {Array.from({ length: total }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full",
                  i + 1 === current
                    ? "bg-brand"
                    : i + 1 < current
                    ? "bg-brand/40"
                    : "bg-border"
                )}
              />
            ))}
          </span>
        </div>
      ) : null}

      <div className="flex gap-4">
        {prev ? (
          <Link to={prev.to} className={cn(cardBase, "items-start text-left")}>
            <span className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> Назад
            </span>
            <span className="font-medium text-foreground">{prev.label}</span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {next ? (
          <Link to={next.to} className={cn(cardBase, "items-end text-right")}>
            <span className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Далее <ArrowRight className="h-3.5 w-3.5" />
            </span>
            <span className="font-medium text-foreground">{next.label}</span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </nav>
  );
}
