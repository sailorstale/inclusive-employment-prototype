import * as React from "react";
import { cn } from "@/lib/utils";

// Example (унификация) — семантический блок «Пример»: иллюстрация, кейс или
// образец формулировки. В отличие от Blockquote у примера НЕТ говорящего,
// поэтому нет атрибуции (аватар · имя · должность · логотип) — именно её пустые
// заглушки и делали пример похожим на чью-то цитату. Ярлык «Пример», лёгкий фон
// и левый акцент выделяют блок из основного текста.
//
// Чистый контейнер: сам не оборачивает содержимое в Editable. Редактируемость
// даёт содержимое — блочные примеры кладут внутрь свои <Paragraph>/списки (они
// уже Editable), инлайн-текст оборачивают в <Paragraph>. text-sm задаёт
// «примерный» размер, как у прежней врезки-цитаты.

type ExampleProps = {
  /** Ярлык блока. Канон — «Пример»; можно переопределить или опустить (null). */
  label?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

export function Example({
  label = "Пример",
  children,
  className,
}: ExampleProps) {
  return (
    <div
      data-component="Example"
      className={cn(
        "max-w-prose space-y-3 rounded-r-md border-l-2 border-border bg-muted/40 py-3 pl-4 pr-4 text-sm",
        className
      )}
    >
      {label != null ? (
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
      ) : null}
      {children}
    </div>
  );
}
