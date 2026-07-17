import * as React from "react";
import { cn } from "@/lib/utils";

/*
  Figma: component set «Card Container» (6517:2765), свойства Platform × Orientation.

  Самый недооценённый компонент системы. Название обманывает: это НЕ «обёртка
  для карточек», а универсальный конверт для любого блока, который не является
  прозой. В живом шаблоне 8 Card Container из 8 держат внутри: цитаты, карточки,
  таблицу, пары сравнения, аккордеоны, квизы, врезки Prompt и одиночную кнопку.

  Правило: Heading и Text → прямо в Section Container.
           Всё остальное → сначала Card Container, потом внутрь него.

  Orientation:
  - Vertical — блоки друг под другом (столбиком).
  - Horizontal — блоки в ряд с переносом. Так собираются ряды карточек:
    две Card по 380 + промежуток 8 = ширина колонки 768.

  Верхний отступ 32 (space/xl), промежуток между детьми 8 (space/xs).
*/

export type CardContainerOrientation = "Vertical" | "Horizontal";

type Props = {
  orientation?: CardContainerOrientation;
  children?: React.ReactNode;
  className?: string;
};

export function CardContainer({
  orientation = "Vertical",
  children,
  className,
}: Props) {
  return (
    <div
      data-component={`Card Container · ${orientation}`}
      className={cn("w-full pt-[var(--space-xl)]", className)}
    >
      {/* Slot */}
      <div
        className={cn(
          "flex w-full gap-[var(--space-xs)]",
          orientation === "Vertical"
            ? "flex-col"
            : "flex-row flex-wrap items-stretch",
        )}
      >
        {children}
      </div>
    </div>
  );
}
