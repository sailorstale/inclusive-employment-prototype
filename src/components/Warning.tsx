import * as React from "react";
import { Callout } from "@/components/Callout";

// Warning (унификация) — семантическая врезка «предупреждение / риск». Тонкая
// обёртка над Callout · warning: фиксирует канонический вид (янтарная врезка с
// треугольником), чтобы риск нельзя было случайно оформить другим вариантом.
// Заголовок опционален — канон «Важно», но не навязывается, чтобы миграция
// существующих врезок не меняла вид. Тело/заголовок редактируемы через Callout.

type WarningProps = {
  /** Заголовок врезки. Канон — «Важно»; можно переопределить или опустить. */
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

export function Warning({ title, children, className }: WarningProps) {
  return (
    <Callout variant="warning" title={title} className={className}>
      {children}
    </Callout>
  );
}
