import { cn } from "@/lib/utils";

/*
  Общая начинка контролов-полей из раздела Controls в Figma: Input, Dropdown,
  Textarea, Search. Три состояния совпадают у всех — Default, Disabled, Error, —
  поэтому вид рамки/фона/текста собран здесь в одном месте.

  Высоты у прототипа сжаты относительно Figma (Desktop 61 → 48): проверяем
  структуру и логику, а не пиксельную высоту.
*/

export type ControlState = "Default" | "Disabled" | "Error";

/** Классы поля под заданное состояние. extra — размеры/паддинги конкретного контрола. */
export function fieldClasses(state: ControlState, extra?: string) {
  return cn(
    "w-full bg-[color:var(--control-bg)] text-[color:var(--control-fg)]",
    "rounded-[var(--radius-l)] border ds-body-l",
    "placeholder:text-[color:var(--control-fg-placeholder)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--text-primary)]",
    state === "Default" && "border-[color:var(--control-border)]",
    state === "Error" && "border-[color:var(--control-border-error)]",
    state === "Disabled" &&
      "cursor-not-allowed border-[color:var(--control-border-disabled)] bg-[color:var(--control-bg-disabled)] text-[color:var(--control-fg-disabled)]",
    extra,
  );
}
