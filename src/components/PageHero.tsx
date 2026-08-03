import * as React from "react";
import { cn } from "@/lib/utils";
import { Editable } from "@/editor/Editable";
import { usePageHeroSlot, heroTextOf, type HeroCover } from "@/lib/pageHero";

// PageHero (00b §2.2) — шапка страницы: eyebrow (опц.) + H1 + лид + опц. слот
// (например, StatBlock для лендинга).
// Политика eyebrow (00b): показывать ТОЛЬКО если несёт новое измерение
// (тип подачи, жанр, «внешний ресурс») — не дублировать H1 и не повторять «Шаг N».
//
// ГДЕ ЧТО РИСУЕТСЯ. Заголовок и eyebrow здесь НЕ рисуются: они уезжают в баннер
// с фото над контентом (оболочка, PageHeroBand) — H1 стоит поверх изображения
// во всю ширину экрана. В контентной колонке остаётся лид и вложенные блоки.
// Страницы от этого не меняются: разметка у них прежняя.

type PageHeroProps = {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  variant?: "landing" | "track-hub" | "section-hub" | "leaf" | "404";
  /** Фото для баннера. Обычно приходит из обложек страниц, не из разметки. */
  cover?: HeroCover;
  children?: React.ReactNode;
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  lead,
  variant = "leaf",
  cover,
  children,
  className,
}: PageHeroProps) {
  const { setData } = usePageHeroSlot();
  const size = variant === "landing" ? "landing" : "default";
  const key = [heroTextOf(title), heroTextOf(eyebrow), cover?.src, size].join(
    "§",
  );

  // useLayoutEffect — баннер получает заголовок до отрисовки, без скачка.
  React.useLayoutEffect(() => {
    setData({ title, eyebrow, cover, size });
    return () => setData(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Заголовка здесь нет — он в баннере. Остаётся лид и вложенные блоки.
  if (!lead && !children) return null;

  return (
    <header
      data-component="PageHero"
      className={cn("space-y-4", className)}
    >
      {lead ? (
        typeof lead === "string" ? (
          <Editable as="lead">{lead}</Editable>
        ) : (
          <div className="max-w-prose text-lg leading-relaxed text-foreground">
            {lead}
          </div>
        )
      ) : null}
      {children}
    </header>
  );
}
