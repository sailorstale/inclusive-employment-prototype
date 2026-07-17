import * as React from "react";
import { cn } from "@/lib/utils";

/*
  Figma: component set «Button» (набор из 144 вариантов), свойства Type × Size × Icon.

  Кнопка — действие: скачать, отправить, проверить. По описанию в Figma для
  простого перехода по ссылке кнопку брать не нужно — но компонента Link
  в системе нет (зафиксировано как пробел).

  Правила из описания в Figma: один Primary на смысловой блок; Outline —
  для опасных действий; подпись — глагол с объектом («Скачать шаблон»).

  ОСТОРОЖНО, расхождение в Figma: текстовое описание компонента говорит про
  5 типов (включая Accent) и 2 размера, а сам набор вариантов даёт 4 типа
  (Accent нет) и 3 размера. Здесь сделано по набору вариантов — он новее.
  Вопрос дизайнеру открыт.
*/

export type ButtonType = "Primary" | "Secondary" | "Outline" | "Ghost";
export type ButtonSize = "L" | "M" | "S";
export type ButtonIcon = "None" | "Left" | "Right" | "Only";

const TYPE_CLASS: Record<ButtonType, string> = {
  Primary:
    "bg-[color:var(--action-primary-bg)] text-[color:var(--action-primary-fg)]",
  Secondary:
    "bg-[color:var(--action-secondary-bg)] text-[color:var(--action-secondary-fg)]",
  Outline:
    "bg-[color:var(--action-outline-bg)] text-[color:var(--action-outline-fg)] border-2 border-[color:var(--action-outline-border)]",
  Ghost: "bg-transparent text-[color:var(--action-ghost-fg)]",
};

// Высоты уведены к масштабу прототипа (в Figma L 58 / M 45 / S 38 — крупнее).
const SIZE_CLASS: Record<ButtonSize, string> = {
  L: "h-11 px-5 rounded-[var(--radius-m)] ds-button-l",
  M: "h-10 px-4 rounded-[var(--radius-m)] ds-button-m",
  S: "h-9 px-3 rounded-[var(--radius-sm)] ds-button-s",
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
        disabled &&
          "cursor-not-allowed bg-[color:var(--action-primary-bg-disabled)] text-[color:var(--action-primary-fg-disabled)] border-transparent",
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
