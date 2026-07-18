import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/*
  Figma: component set «List Item» (6384:4339), свойства Platform × Size × Type.

  Пункт списка. Маркер — точка (Dot), галочка (Icon) или номер (Number).

  Number добавлен в Figma: номер считает CSS-счётчик (см. ds-num в tokens.css),
  сброс — на List Container. Нумеровать руками не нужно: несколько Number-пунктов
  подряд получат 1, 2, 3… сами.

  Size задаёт кегль: L — 18/1.4, M — 16/1.3.
  Точка и номер красятся в text/secondary, текст — в text/primary.

  Тип Icon по умолчанию — галочка (обычный «пункт выполнен / входит в список»),
  но иконку можно заменить пропом iconNode на другую из Lucide, когда точка не
  подходит по смыслу (например, минус для исключений).
*/

export type ListItemSize = "L" | "M";
export type ListItemType = "Dot" | "Icon" | "Number";

type Props = {
  size?: ListItemSize;
  type?: ListItemType;
  /** Иконка для type=Icon. По умолчанию галочка. Любая из lucide-react. */
  iconNode?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

export function ListItem({
  size = "L",
  type = "Dot",
  iconNode,
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
        // Каждый номерной пункт увеличивает счётчик; печать номера — в ds-num.
        type === "Number" && "[counter-increment:ds-num]",
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
      ) : type === "Number" ? (
        <span
          aria-hidden
          className={cn(
            textStyle,
            "ds-num shrink-0 whitespace-nowrap tabular-nums text-[color:var(--text-secondary)]",
          )}
        />
      ) : (
        <span
          aria-hidden
          className="flex shrink-0 items-center pt-[var(--padding-3,3px)] text-[color:var(--text-primary)] [&>svg]:size-5"
        >
          {iconNode ?? <Check className="size-5" />}
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
