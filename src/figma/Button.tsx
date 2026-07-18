import * as React from "react";
import { cn } from "@/lib/utils";

/*
  Figma: component set «Button» из раздела Controls (6010:79000), свойства
  Type × Size × State × Icon.

  Кнопка — действие: скачать, отправить, проверить. Для перехода по ссылке
  кнопку не берут — но компонента Link в системе нет (зафиксировано как пробел).

  Правила из описания в Figma: один Primary на смысловой блок; подпись — глагол
  с объектом («Скачать шаблон»); Outline — для действий с низкой нагрузкой.

  НЕ ЛЕГАСИ. Текстовое описание в Figma ведёт на старую shadcn-кнопку
  (src/components/ui/button.tsx) и обещает 5-й тип Accent (жёлтый Яндекс) — это
  наследие старого сайта, его НЕ берём. Актуальный набор вариантов: 4 типа без
  Accent, нейтральный тёмно-синий Primary #1b1f2d, состояния hover/disabled.
  Значения — в tokens.css (action/*).

  State в Figma (Default/Hover/Disabled) здесь — это CSS-псевдоклассы
  (:hover, :disabled), а не проп: так работает живая кнопка.
*/

export type ButtonType = "Primary" | "Secondary" | "Outline" | "Ghost";
export type ButtonSize = "L" | "M" | "S";
export type ButtonIcon = "None" | "Left" | "Right" | "Only";

// Фон/текст + наведение. Disabled вынесен отдельно (свой на каждый тип).
const TYPE_CLASS: Record<ButtonType, string> = {
  Primary:
    "bg-[color:var(--action-primary-bg)] text-[color:var(--action-primary-fg)] hover:bg-[color:var(--action-primary-bg-hover)]",
  Secondary:
    "bg-[color:var(--action-secondary-bg)] text-[color:var(--action-secondary-fg)] hover:bg-[color:var(--action-secondary-bg-hover)]",
  Outline:
    "bg-[color:var(--action-outline-bg)] text-[color:var(--action-outline-fg)] border border-[color:var(--action-outline-border)] hover:bg-[color:var(--action-outline-bg-hover)]",
  Ghost:
    "bg-transparent text-[color:var(--action-ghost-fg)] hover:bg-[color:var(--action-ghost-bg-hover)]",
};

const DISABLED_CLASS: Record<ButtonType, string> = {
  Primary:
    "disabled:bg-[color:var(--action-primary-bg-disabled)] disabled:text-[color:var(--action-primary-fg-disabled)]",
  Secondary:
    "disabled:bg-[color:var(--action-secondary-bg-disabled)] disabled:text-[color:var(--action-secondary-fg-disabled)]",
  Outline:
    "disabled:text-[color:var(--action-outline-fg-disabled)] disabled:border-[color:var(--control-border-disabled)]",
  Ghost: "disabled:text-[color:var(--action-ghost-fg-disabled)]",
};

// Высоты уведены к масштабу прототипа (в Figma L 61 / S 55 — крупнее).
// Скругление — radius/l, чтобы кнопка читалась как DS, а не как боксовое легаси.
const SIZE_CLASS: Record<ButtonSize, string> = {
  L: "h-11 px-5 rounded-[var(--radius-l)] ds-button-l",
  M: "h-10 px-4 rounded-[var(--radius-l)] ds-button-m",
  S: "h-9 px-3 rounded-[var(--radius-m)] ds-button-s",
};

const ICON_SIZE: Record<ButtonSize, string> = {
  L: "size-5",
  M: "size-4",
  S: "size-4",
};

type Props = {
  type?: ButtonType;
  size?: ButtonSize;
  icon?: ButtonIcon;
  /** Иконка из lucide-react — коллекция Icon/* в Figma Lucide-совместима. */
  iconNode?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  /** Подпись для варианта Icon=Only, где текста на кнопке нет. */
  "aria-label"?: string;
};

export function Button({
  type = "Primary",
  size = "M",
  icon = "None",
  iconNode,
  children,
  className,
  disabled,
  onClick,
  ...rest
}: Props) {
  const iconEl = iconNode ? (
    <span className={cn("flex shrink-0 items-center", ICON_SIZE[size])}>
      {iconNode}
    </span>
  ) : null;

  return (
    <button
      type="button"
      data-component={`Button · ${type} · ${size}`}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-[var(--space-xs)] transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--text-primary)] focus-visible:ring-offset-2",
        TYPE_CLASS[type],
        SIZE_CLASS[size],
        icon === "Only" && "aspect-square px-0",
        // Выключенная: свой набор цветов на каждый тип (вариант disabled: в
        // Tailwind идёт после hover: и сам гасит наведение).
        disabled && "cursor-not-allowed",
        disabled && DISABLED_CLASS[type],
        className,
      )}
      {...rest}
    >
      {(icon === "Left" || icon === "Only") && iconEl}
      {icon !== "Only" && children}
      {icon === "Right" && iconEl}
    </button>
  );
}
