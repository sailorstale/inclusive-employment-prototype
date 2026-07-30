import * as React from "react";
import { cn } from "@/lib/utils";

/*
  Figma: component set 6838:6191 — там он пока называется «List Container»,
  переименование в «Stack» согласовано с разработчиком и ждёт правки в макете.

  Стек, а не список: вертикальная стопка с равным шагом 8. Обычно в нём лежат
  List Item, но в живом шаблоне встречается стек, внутри которого две Quote
  (узел 0:592) — класть можно и другие блоки. Старое имя это скрывало, потому
  его и меняем.

  Верхний отступ 16 (space/m) — третья ступень лестницы отступов:
  Section Container 56 → Block 32 → Stack 16.

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

export function Stack({ children, as = "ul", className }: Props) {
  const Tag = as;

  return (
    <div
      data-component="Stack"
      className={cn("w-full pt-[var(--space-m)]", className)}
    >
      {/* Slot. counter-reset обнуляет нумерацию для List Item · Number внутри. */}
      <Tag className="flex w-full list-none flex-col gap-[var(--space-xs)] p-0 [counter-reset:ds-num]">
        {children}
      </Tag>
    </div>
  );
}
