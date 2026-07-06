import * as React from "react";
import { cn } from "@/lib/utils";

// Мелкие элементы админ-экранов редактора (дашборд «Изменения», инвентарь,
// панель комментариев): счётчик-плашка и кнопка-фильтр. Раньше копировались
// по нескольким файлам.

export function Stat({
  label,
  value,
  bad,
  warn,
}: {
  label: string;
  value: number;
  /** Подсветить число «плохим» цветом, если оно > 0 (напр. откаты). */
  bad?: boolean;
  /** Подсветить число «предупреждающим» цветом, если оно > 0. */
  warn?: boolean;
}) {
  return (
    <div className="rounded-md bg-muted/60 px-3 py-1.5">
      <span
        className={cn(
          "text-base font-semibold",
          bad && value > 0 && "text-[hsl(var(--bad))]",
          warn && value > 0 && "text-[hsl(var(--warn))]",
        )}
      >
        {value}
      </span>
      <span className="ml-1.5 text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export function FilterBtn({
  active,
  onClick,
  size = "default",
  children,
}: {
  active: boolean;
  onClick: () => void;
  /** «sm» — компактный безрамочный вариант (панель комментариев). */
  size?: "default" | "sm";
  children: React.ReactNode;
}) {
  const sm = size === "sm";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md transition-colors",
        sm ? "px-2 py-1 text-xs" : "border px-3 py-1.5 text-sm",
        active
          ? sm
            ? "bg-[hsl(var(--brand)/0.1)] font-medium text-brand"
            : "border-[hsl(var(--brand)/0.5)] bg-[hsl(var(--brand)/0.1)] font-medium text-brand"
          : "text-muted-foreground hover:bg-accent",
      )}
    >
      {children}
    </button>
  );
}
