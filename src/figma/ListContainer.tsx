import * as React from "react";
import { cn } from "@/lib/utils";

/*
  Figma: component set «List Container» (6838:6191).

  Название обманывает второй раз: это не «список», а вертикальный стек с шагом 8.
  Обычно в нём лежат List Item, но в живом шаблоне встречается List Container,
  внутри которого две Quote (узел 0:592) — то есть класть можно и другие блоки.

  Верхний отступ 16 (space/m) — третья ступень лестницы отступов:
  Section Container 56 → Card Container 32 → List Container 16.

  Вкладывается куда угодно: в Section Container, внутрь Card, Compare Card,
  Accordion. Ставим `as="ul"`, когда внутри действительно список пунктов —
  тогда разметка честная и читалка экрана прочтёт список списком.
*/

type Props = {
  children?: React.ReactNode;
  /** ul — список пунктов; ol — нумерованный список; div — произвольные блоки. */
  as?: "ul" | "ol" | "div";
  className?: string;
};

export function ListContainer({ children, as = "ul", className }: Props) {
  const Tag = as;

  return (
    <div
      data-component="List Container"
      className={cn("w-full pt-[var(--space-m)]", className)}
    >
      {/* Slot. counter-reset обнуляет нумерацию для List Item · Number внутри. */}
      <Tag className="flex w-full list-none flex-col gap-[var(--space-xs)] p-0 [counter-reset:ds-num]">
        {children}
      </Tag>
    </div>
  );
}
