import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// StepNav (00 — последовательная навигация для пошаговых страниц) — внизу
// страницы: карточки «← Назад / Далее →» С НАЗВАНИЕМ соседнего шага. Прыжки
// между шагами разрешены (это чтение, не форма); их роль выполняет и боковое меню.

type StepLink = { label: string; to: string };

export function StepNav({
  prev,
  next,
}: {
  prev?: StepLink;
  next?: StepLink;
}) {
  const cardBase =
    "group flex flex-1 flex-col gap-1 rounded-lg border p-4 transition-colors hover:border-ring hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  return (
    <nav
      aria-label="Навигация по шагам"
      data-component="StepNav"
      className="mt-4"
    >
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
