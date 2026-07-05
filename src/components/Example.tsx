import * as React from "react";
import { Callout } from "@/components/Callout";

// Example (унификация) — семантический блок «Пример»: иллюстрация, кейс или
// образец формулировки. Канонический вид на сайте — Callout · highlight с
// заголовком «Пример» (десятки таких примеров, см. КАНОН). Тонкая обёртка
// фиксирует этот вид — по образцу Warning над Callout · warning, — чтобы пример
// нельзя было случайно оформить как цитату: Blockquote всегда рисует подпись
// автора (аватар · имя · должность · логотип), а у примера говорящего нет.
//
// Заголовок по умолчанию «Пример»; можно уточнить («Пример. Как…») или опустить
// (title={null}) — тогда остаётся только характерная врезка со звёздочкой.

type ExampleProps = {
  /** Заголовок врезки. Канон — «Пример»; можно переопределить или опустить. */
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

export function Example({
  title = "Пример",
  children,
  className,
}: ExampleProps) {
  return (
    <Callout variant="highlight" title={title ?? undefined} className={className}>
      {children}
    </Callout>
  );
}
