import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/*
  Figma: component set «List Item» (6384:4339), свойства Platform × Size × Type.
  8 вариантов; десктопных — 4 (Size L|M × Type Dot|Icon).

  Пункт списка. Маркер — либо точка (Dot), либо галочка (Icon).
  Нумерованного типа в системе НЕТ (см. «Чего в системе нет» в описании).

  Size задаёт кегль: L — 18/1.4, M — 16/1.3.
  Точка красится в text/secondary, текст — в text/primary.
*/

export type ListItemSize = "L" | "M";
export type ListItemType = "Dot" | "Icon";

type Props = {
  size?: ListItemSize;
  type?: ListItemType;
  children?: React.ReactNode;
  className?: string;
};

export function ListItem({
  size = "L",
  type = "Dot",
  children,
  className,
}: Props) {
  const textStyle = size === "L" ? "ds-body-l" : "ds-body-m";

  return (
    <li
      data-component={`List Item · ${size} · ${type}`}
      className={cn(
        "relative flex w-full list-none items-start gap-[var(--space-xs)] pt-[var(--space-2xs)]",
        type === "Icon" && "pr-[var(--space-l)]",
        className,
      )}
    >
      {type === "Dot" ? (
        <span
          aria-hidden
          className={cn(
            textStyle,
            "shrink-0 whitespace-nowrap text-[color:var(--text-secondary)]",
          )}
        >
          •
        </span>
      ) : (
        <span className="flex shrink-0 items-center pt-[var(--padding-3,3px)]">
          <Check aria-hidden className="size-5 text-[color:var(--text-primary)]" />
        </span>
      )}

      <span
        className={cn(
          textStyle,
          "min-w-0 flex-1 text-[color:var(--text-primary)]",
        )}
      >
        {children}
      </span>
    </li>
  );
}
