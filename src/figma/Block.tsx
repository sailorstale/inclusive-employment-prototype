import * as React from "react";
import { cn } from "@/lib/utils";

/*
  Figma: component set 6517:2765, свойства Platform × Orientation — там он пока
  называется «Card Container», переименование в «Block» согласовано с
  разработчиком и ждёт правки в макете.

  Самый недооценённый компонент системы. Старое имя обманывало: это НЕ «обёртка
  для карточек», а универсальный конверт для любого блока, который не является
  прозой. В живом шаблоне 8 Block из 8 держат внутри: цитаты, карточки,
  таблицу, пары сравнения, аккордеоны, квизы, врезки Prompt и одиночную кнопку.

  Правило: Heading и Text → прямо в Section Container.
           Всё остальное → сначала Block, потом внутрь него.

  Orientation:
  - Vertical — блоки друг под другом (столбиком).
  - Horizontal — блоки в ряд с переносом. Так собираются ряды карточек:
    две Card по 380 + промежуток 8 = ширина колонки 768.

  Верхний отступ 32 (space/xl), промежуток между детьми 8 (space/xs).
*/

export type BlockOrientation = "Vertical" | "Horizontal";

type Props = {
  orientation?: BlockOrientation;
  children?: React.ReactNode;
  className?: string;
};

export function Block({
  orientation = "Vertical",
  children,
  className,
}: Props) {
  return (
    <div
      data-component={`Block · ${orientation}`}
      className={cn("w-full pt-[var(--space-xl)]", className)}
    >
      {/* Slot */}
      <div
        className={cn(
          "flex w-full gap-[var(--space-xs)]",
          orientation === "Vertical"
            ? "flex-col"
            : // Ряд карточек: каждая занимает ПОЛОВИНУ колонки, третья переносится
              // на следующую строку. Без этого дети остаются w-full, и «ряд»
              // раскладывался бы в столбик — каждая карточка на своей строке.
              // Растягивать не даём: нечётная последняя карточка должна остаться
              // половиной, а не разъезжаться на всю колонку.
              [
                "flex-row flex-wrap items-stretch",
                "[&>*]:min-w-0 [&>*]:grow-0",
                "[&>*]:basis-[calc((100%-var(--space-xs))/2)]",
                /*
                  В инструменте сверки между конвертом и блоком стоит обёртка
                  выбора с display:contents. Своего бокса у неё нет, поэтому
                  правило «половина колонки» до блока не доходило, и ряд
                  раскладывался в столбик — ровно там, где нужен ряд. Сайт
                  всегда рисуется внутри инструмента, значит горизонтальный
                  конверт не работал нигде. Повторяем правило на уровень глубже.
                */
                "[&>.ds-pick>*]:min-w-0 [&>.ds-pick>*]:grow-0",
                "[&>.ds-pick>*]:basis-[calc((100%-var(--space-xs))/2)]",
              ].join(" "),
        )}
      >
        {children}
      </div>
    </div>
  );
}
