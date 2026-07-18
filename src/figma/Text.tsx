import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

/*
  Figma: component set «Text» (6112:44332), свойство Size.

  Абзац прозы. В Figma это не «стиль шрифта», а готовая строка контента:
  верхний отступ уже внутри компонента. Поэтому в потоке между Text-блоками
  свои промежутки НЕ добавляем — иначе отступ удвоится. Нижнего отступа нет
  ни у одного варианта: расстояние до следующего блока даёт сам следующий блок.

  Size=Phrase (6958:4978) — акцентная фраза-врезка: италик Body L с вертикальной
  чертой слева. Это НЕ Quote (автора нет) — выделенная мысль или инструкция
  прямо в потоке текста. Отбита справа большим паддингом, чтобы строка не
  тянулась во всю колонку.
*/

export type TextSize = "XL" | "L" | "M" | "S" | "Phrase" | "Button";

type ProseSize = "XL" | "L" | "M" | "S";

const STYLE: Record<ProseSize, string> = {
  XL: "ds-body-xxl", // Desktop/Body XXL 28/1.3 — лид страницы
  L: "ds-body-l", // Desktop/Body L 18/1.4 — основной текст лонгрида
  M: "ds-body-m", // Desktop/Body M 16/1.3 — пояснения
  S: "ds-body-s", // Desktop/Body S 14/1.3 — сноски, подписи
};

// Верхний отступ зависит от размера — так задано в Figma.
const PAD_TOP: Record<TextSize, string> = {
  XL: "pt-[var(--space-2xl)]", // 40
  L: "pt-[var(--space-l)]", // 24
  M: "pt-[var(--space-m)]", // 16
  S: "pt-[var(--space-m)]", // 16
  Phrase: "pt-[var(--space-l)]", // 24
  Button: "pt-[var(--space-l)]", // 24
};

type Props = {
  size?: TextSize;
  children?: React.ReactNode;
  className?: string;
};

export function Text({ size = "L", children, className }: Props) {
  // Size=Phrase — фраза-врезка с вертикальной чертой слева. Структура своя
  // (не абзац), поэтому отдельная ветка.
  if (size === "Phrase") {
    return (
      <div
        data-component="Text · Phrase"
        className={cn("flex w-full items-center", PAD_TOP.Phrase, className)}
      >
        <div className="flex-1 border-l border-[color:var(--border-divider)] pl-[var(--space-m)] pr-[var(--space-4xl)]">
          <p className="ds-body-l-italic text-[color:var(--text-primary)]">
            {children}
          </p>
        </div>
      </div>
    );
  }

  // Size=Button — исключение в Figma: свойство «размер» подменяет содержимое
  // на кнопку. Это штатный способ поставить кнопку в поток текста.
  if (size === "Button") {
    return (
      <div
        data-component="Text · Button"
        className={cn("flex w-full justify-start", PAD_TOP.Button, className)}
      >
        {children}
      </div>
    );
  }

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

// Удобная обёртка: Text/Button с уже вложенной кнопкой.
export function TextButton({
  children,
  ...rest
}: React.ComponentProps<typeof Button>) {
  return (
    <Text size="Button">
      <Button {...rest}>{children}</Button>
    </Text>
  );
}
