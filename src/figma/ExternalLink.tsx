import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { safeHref } from "@/editor/richText";

/*
  Figma: component set «External Link» (6898:4283), свойство Platform (берём Desktop).

  Внешняя ссылка внутри абзаца: слово плюс стрелка вправо-вверх. Стрелка честно
  предупреждает — клик уведёт с сайта. Берут для закона, реестра, сайта партнёра.
  НЕ берут для переходов внутри сайта и НЕ берут для пояснения термина — там
  Tooltip с пунктиром. Стрелка — единственное, что отличает внешнюю ссылку
  от внутренней, поэтому «для красоты» её ставить нельзя.

  Расхождения с Figma (честно):
  - На скриншоте ссылка подчёркнута пунктиром, но в структуре десктопного
    варианта границы нет. Сделано по структуре — без подчёркивания. Иначе
    внешняя ссылка стала бы неотличима от триггера Tooltip. Вопрос дизайнеру.
  - Состояний hover / focus / visited в Figma нет. Добавлен только видимый
    фокус — без него по клавиатуре не понять, где ты.

  Санитизация href — обязательное правило проекта (защита от javascript:).
  Переиспользуем safeHref из редакторского слоя. Если протокол не из белого
  списка — ссылку не рисуем вообще, остаётся обычный текст.
*/

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function ExternalLink({ href, children, className }: Props) {
  const safe = safeHref(href);

  const inner = (
    <>
      {children}
      <ArrowUpRight aria-hidden className="size-4 shrink-0" />
    </>
  );

  const shared = cn(
    "ds-body-l inline-flex items-center whitespace-nowrap align-baseline",
    "text-[color:var(--link-default)]",
    className,
  );

  if (!safe) {
    return (
      <span data-component="External Link" className={shared}>
        {inner}
      </span>
    );
  }

  return (
    <a
      data-component="External Link"
      href={safe}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        shared,
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--link-default)]",
      )}
    >
      {inner}
    </a>
  );
}
