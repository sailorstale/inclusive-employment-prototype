import * as React from "react";
import { Tag } from "lucide-react";
import { cn } from "@/lib/utils";

// Тумблер «Шильдики компонентов» — показывает/прячет маленькие шильдики с именами
// компонентов в колонке контента (подсказка разработчику + параллель с Figma).
// Состояние — класс .tags-on на <html>, запоминается в localStorage. По умолчанию
// включено (это макет для передачи). Сам стиль шильдика — в globals.css.

const KEY = "show-component-tags";

export function ComponentTagsToggle() {
  const [on, setOn] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem(KEY) !== "0"; // по умолчанию включено
    } catch {
      return true;
    }
  });

  React.useEffect(() => {
    document.documentElement.classList.toggle("tags-on", on);
    try {
      localStorage.setItem(KEY, on ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [on]);

  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      aria-pressed={on}
      title={
        on ? "Скрыть названия компонентов" : "Показать названия компонентов"
      }
      className={cn(
        "fixed bottom-4 left-1/2 z-40 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background print:hidden",
        on
          ? "border-transparent bg-brand text-brand-foreground"
          : "border-border bg-background text-muted-foreground hover:text-foreground",
      )}
    >
      <Tag className="h-3.5 w-3.5" />
      Компоненты
    </button>
  );
}
