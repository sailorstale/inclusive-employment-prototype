import * as React from "react";
import { cn } from "@/lib/utils";
import { Editable } from "@/editor/Editable";
import { AppHeader } from "./AppHeader";
import type { HeroCover } from "@/lib/pageHero";

/*
  PageHeroBand — баннер вверху страницы во всю ширину экрана: фото-подложка,
  поверх неё главное меню сайта и заголовок страницы H1 внизу слева. Контент
  идёт следом и наезжает на низ баннера (см. Layout / SiteInspector).

  Схема повторяет макет из Figma (компонент Hero, 6342:4287): высота 344,
  наезд контента 80. Заголовок отделён от контентной колонки — H1 на странице
  ровно один и живёт здесь.

  Фото берём из обложек страниц (editor-source/site/covers.ts). Пока обложек
  нет — на месте фото тёмная плашка с подписью «Фото»: тёмная, чтобы белый
  заголовок и меню читались одинаково и с фото, и без него.
*/

type Props = {
  /** Заголовок страницы — единственный h1. Пустой — баннер сжимается до полосы меню. */
  title?: React.ReactNode;
  eyebrow?: React.ReactNode;
  cover?: HeroCover;
  /** Лендинг — баннер выше. */
  size?: "default" | "landing";
  /** Оборачивать H1 в редакторский слой (на сайте — да, в инспекторе источника — нет). */
  editable?: boolean;
  className?: string;
};

export function PageHeroBand({
  title,
  eyebrow,
  cover,
  size = "default",
  editable = false,
  className,
}: Props) {
  const hasTitle = Boolean(title);
  const titleClass = cn(
    "max-w-[60rem] font-bold tracking-tight text-white",
    size === "landing" ? "text-5xl leading-tight" : "text-4xl leading-tight",
  );

  return (
    <div
      data-component="PageHero"
      className={cn(
        "relative isolate flex w-full flex-col overflow-hidden bg-neutral-800",
        hasTitle
          ? size === "landing"
            ? "min-h-[26rem]"
            : "min-h-[21.5rem]"
          : "min-h-[7rem]",
        className,
      )}
    >
      <HeroBackdrop cover={cover} />

      {/* Меню — не липкая полоса, а часть баннера: лежит поверх фото. */}
      <AppHeader variant="overlay" />

      {hasTitle ? (
        // pb-28 — воздух под заголовком: 80 px наезда контента + запас.
        <div className="mx-auto mt-auto w-full max-w-7xl px-6 pb-28 pt-10">
          {eyebrow ? (
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/70">
              {eyebrow}
            </p>
          ) : null}
          {editable ? (
            <Editable as="h1" className={titleClass}>
              {title}
            </Editable>
          ) : (
            <h1 className={titleClass}>{title}</h1>
          )}
        </div>
      ) : null}
    </div>
  );
}

/** Фото-подложка. Нет обложки — тёмная плашка с подписью, как в макете. */
function HeroBackdrop({ cover }: { cover?: HeroCover }) {
  if (cover?.src) {
    return (
      <>
        {/*
          Подписи нет намеренно: картинка декоративная, смысл несёт заголовок
          поверх неё. Пустой alt — это и есть «читать не надо» для скринридера.
        */}
        <img
          src={cover.src}
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        {/* Затемнение: без него белый заголовок теряется на светлом фото. */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-black/40" />
      </>
    );
  }
  return (
    <div
      aria-hidden
      className="absolute inset-0 -z-10 flex items-center justify-end px-8 text-sm text-white/40"
    >
      Фото
    </div>
  );
}
