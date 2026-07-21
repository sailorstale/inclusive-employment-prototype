import * as React from "react";
import { cn } from "@/lib/utils";

/*
  Figma: component set «Phrase» (7005:5149), свойства Platform × Size (L | M).

  Раньше это был вариант Text/Size=Phrase; теперь Phrase — самостоятельный
  компонент с собственным модификатором Size. Имя 1:1 с Figma.

  Акцентная фраза-врезка: курсив с вертикальной чертой слева. Это НЕ Quote
  (автора нет) — выделенная мысль или инструкция прямо в потоке текста.
  Своего нижнего отступа нет: расстояние до следующего блока даёт он сам.

  Size (десктоп):
  - L (6958:4978) — Body L Italic 18/1.4. Отбита справа большим паддингом
    (space/4xl 64), чтобы строка не тянулась во всю колонку. Верхний отступ 24.
  - M (7005:5153) — Body M Italic 16/1.3. Отступы слева-справа равные
    (space/m 16), строка компактнее. Верхний отступ 16.

  Только десктоп: мобильные варианты (Platform=Mobile) не реализованы.
*/

export type PhraseSize = "L" | "M";

type Props = {
  size?: PhraseSize;
  children?: React.ReactNode;
  className?: string;
};

export function Phrase({ size = "L", children, className }: Props) {
  return (
    <div
      data-component={`Phrase · ${size}`}
      className={cn(
        "flex w-full items-center",
        size === "M" ? "pt-[var(--space-m)]" : "pt-[var(--space-l)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex-1 border-l border-[color:var(--border-divider)]",
          // L — асимметрично: большой правый отступ. M — равные отступы.
          size === "M"
            ? "px-[var(--space-m)]"
            : "pl-[var(--space-m)] pr-[var(--space-4xl)]",
        )}
      >
        <p
          className={cn(
            size === "M" ? "ds-body-m-italic" : "ds-body-l-italic",
            "text-[color:var(--text-primary)]",
          )}
        >
          {children}
        </p>
      </div>
    </div>
  );
}
