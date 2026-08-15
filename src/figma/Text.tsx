import * as React from "react";
import { cn } from "@/lib/utils";

/*
  Figma: component set «Text» (6112:44332), свойство Size.

  Абзац прозы. В Figma это не «стиль шрифта», а готовая строка контента:
  верхний отступ уже внутри компонента. Поэтому в потоке между Text-блоками
  свои промежутки НЕ добавляем — иначе отступ удвоится. Нижнего отступа нет
  ни у одного варианта: расстояние до следующего блока даёт сам следующий блок.

  Варианты Phrase и Button вынесены из Text в отдельные компоненты — Phrase.tsx
  и CardButton.tsx (так сделано в Figma). Здесь остаётся только проза.
*/

/*
  РАЗМЕРА XL БОЛЬШЕ НЕТ — решение дизайнера 15 августа 2026. До него первый
  абзац вступления на каждой странице приходил крупным и назывался лидом. Теперь
  вступление читается тем же кеглем, что и остальной текст, а вариант убран из
  набора, чтобы его нельзя было поставить снова.

  Стиль Body XXL остался в шкале (tokens.css): шкала — общий словарь с Figma, и
  выкидывать из неё ступень значило бы менять дизайн-систему, а не сайт.
*/
export type TextSize = "L" | "M" | "S";

const STYLE: Record<TextSize, string> = {
  L: "ds-body-l", // Desktop/Body L 18/1.4 — основной текст лонгрида
  M: "ds-body-m", // Desktop/Body M 16/1.3 — пояснения
  S: "ds-body-s", // Desktop/Body S 14/1.3 — сноски, подписи
};

// Верхний отступ зависит от размера — так задано в Figma.
const PAD_TOP: Record<TextSize, string> = {
  L: "pt-[var(--space-l)]", // 24
  M: "pt-[var(--space-m)]", // 16
  S: "pt-[var(--space-m)]", // 16
};

type Props = {
  size?: TextSize;
  children?: React.ReactNode;
  className?: string;
};

export function Text({ size = "L", children, className }: Props) {
  return (
    <div
      data-component={`Text · ${size}`}
      className={cn("w-full", PAD_TOP[size], className)}
    >
      <p className={cn(STYLE[size], "text-[color:var(--text-primary)]")}>
        {children}
      </p>
    </div>
  );
}
