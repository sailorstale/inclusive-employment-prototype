import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

/*
  Figma: component «Card Button» (7005:5165), свойство Platform.

  Раньше это был вариант Text/Size=Button; теперь Card Button — самостоятельный
  компонент. Имя 1:1 с Figma.

  Способ поставить кнопку в поток текста, соблюдая ритм колонки: обёртка даёт
  верхний отступ (space/l 24) и слот под Button, сам ничего не рисует. Нижнего
  отступа нет.

  Только десктоп: мобильный вариант (Platform=Mobile) не реализован.
*/

type Props = {
  children?: React.ReactNode;
  className?: string;
};

export function CardButton({ children, className }: Props) {
  return (
    <div
      data-component="Card Button"
      className={cn(
        "flex w-full items-start justify-start pt-[var(--space-l)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Удобная обёртка: Card Button с уже вложенной кнопкой. */
export function CardButtonWithButton({
  children,
  ...rest
}: React.ComponentProps<typeof Button>) {
  return (
    <CardButton>
      <Button {...rest}>{children}</Button>
    </CardButton>
  );
}
