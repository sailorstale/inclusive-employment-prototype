import * as React from "react";
import { cn } from "@/lib/utils";

/*
  «People» — ряд людей: держит несколько Person Card бок о бок. НАШЕ
  ДОПОЛНЕНИЕ к системе, в Figma компонента пока нет (см. КОМПОНЕНТЫ.md).

  Людей может быть сколько угодно, и в узкую колонку весь ряд не влезает.
  Поэтому это СЕТКА, а не ряд с переносом: колонки одинаковой ширины, сколько
  поместилось — столько и стоит в строке, остальные переходят ниже И ОСТАЮТСЯ
  ТОЙ ЖЕ ШИРИНЫ. Обычный ряд с переносом так не умеет: последний оставшийся
  портрет растягивался на всю колонку и выглядел вдвое крупнее соседей.

  Кладут как блок — в слот Block. Свой верхний отступ даёт сама сетка, как у
  Image и Video: он отделяет портреты от абзаца выше.
*/

type Props = {
  /** Person Card, по одной на человека. */
  children?: React.ReactNode;
  className?: string;
};

export function People({ children, className }: Props) {
  return (
    <div
      data-component="People"
      className={cn(
        "grid w-full items-start gap-[var(--space-l)]",
        "[grid-template-columns:repeat(auto-fit,minmax(140px,1fr))]",
        "pt-[var(--space-2xl)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
