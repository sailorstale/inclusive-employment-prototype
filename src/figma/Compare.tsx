import * as React from "react";
import { cn } from "@/lib/utils";

/*
  Figma: component «Compare» (6898:4200), свойство Platform.

  Пара сравнения «за/против» целиком: держит две Compare Card. На десктопе они
  стоят В РЯД, бок о бок (каждая занимает половину, gap 8), и НЕ переносятся
  одна под другую — это и есть смысл компонента. На мобильном — столбиком.

  Раньше пару собирали руками через Card Container · Horizontal, и при узкой
  колонке половинки переносились встык. Compare убирает это: половины всегда
  рядом.

  Кладут как блок — в слот Card Container (свой верхний отступ даёт контейнер).
  Внутрь — ровно две Compare Card (positive и negative).
*/

type Props = {
  /** Ровно две Compare Card. */
  children?: React.ReactNode;
  className?: string;
};

export function Compare({ children, className }: Props) {
  return (
    <div
      data-component="Compare"
      // Ряд с равными половинами; items-stretch — обе карточки одной высоты.
      className={cn(
        "flex w-full items-stretch gap-[var(--space-xs)]",
        className,
      )}
    >
      {React.Children.map(children, (child) =>
        child == null ? null : (
          // Обёртка flex-1 min-w-0 — половина ужимается под колонку, не переносясь.
          <div className="flex min-w-0 flex-1">{child}</div>
        ),
      )}
    </div>
  );
}
