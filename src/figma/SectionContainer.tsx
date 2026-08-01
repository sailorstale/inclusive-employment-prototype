import * as React from "react";
import { cn } from "@/lib/utils";

/*
  Figma: component set «Section Container» (6659:4013).

  Каркас смыслового раздела страницы. Внутри — один слот, куда содержимое
  раздела складывается подряд. Сам ничего не рисует: ни фона, ни рамки.
  Его работа — отбить раздел сверху (паддинг 56) и держать ширину колонки.

  Правило раскладки (проверено по живому шаблону):
  прямо в слот секции кладём ТОЛЬКО Heading и Text. Всё остальное —
  цитаты, карточки, таблицы, аккордеоны, квизы, врезки и даже одиночную
  кнопку — сначала заворачиваем в Block.

  Дети идут встык: свой верхний отступ несёт каждый блок сам.
*/

type Props = {
  children?: React.ReactNode;
  className?: string;
  /** Якорь секции — для оглавления «На этой странице» и скролла к секции. */
  id?: string;
};

export function SectionContainer({ children, className, id }: Props) {
  return (
    <section
      id={id}
      data-component="Section Container"
      className={cn("w-full pt-[var(--space-56)]", id && "scroll-mt-20", className)}
    >
      {/* Slot — дети встык, без gap: отступы у детей свои */}
      <div className="flex w-full flex-col">{children}</div>
    </section>
  );
}
