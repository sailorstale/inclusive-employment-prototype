import * as React from "react";
import { cn } from "@/lib/utils";

/*
  Figma: «Table of Contents» (6363:9071), живой инстанс — 6363:9072.
  Пункт — набор «TOC Item» (6363:8970, 10 вариантов).

  Оглавление текущей страницы в правой колонке: ссылки на заголовки материала,
  показывает, где читатель сейчас. Отвечает на вопрос «где я на этой странице».
  Не путать с SidebarMenu — тот про страницы сайта. Дублировать их не надо.

  Не берём, если на странице один-два заголовка: оглавление длиннее содержания
  бессмысленно.

  Ширину колонки (336, токен --toc-width) задаёт родитель — компонент w-full.
  Рабочая ширина списка 240 получается сама: 336 − 56 слева − 40 справа.

  Пункты ссылаются на якорь заголовка: у компонента Heading для этого есть
  проп id (<Heading level="H2" id="...">) — href={`#${id}`}.

  Открытые вопросы дизайнеру (из разбора):
  1) В живом инстансе 8 пунктов видимых и 6 спрятанных (всего 14) — похоже,
     пункты включают/выключают, а не добавляют. Жёсткий ли это потолок и что
     делать со страницей, где разделов больше — не зафиксировано.
  2) В живом инстансе Current стоит одновременно на пункте верхнего уровня
     и на вложенном — подсвечиваются оба. Логично, но правилом не записано.
  3) У Secondary задано скругление radius/sm 12, но заливки нет ни в одном
     состоянии — скругление ни на что не влияет. Похоже на задел на будущее.
*/

/** Уровень заголовка, на который ссылается пункт. H2 → Primary, H3 → Secondary. */
export type TocItemLevel = "H2" | "H3";

const LEVEL_NAME: Record<TocItemLevel, string> = {
  H2: "Primary",
  H3: "Secondary",
};

type TocProps = {
  /**
   * Заголовок блока. В Figma — «НА ЭТОЙ СТРАНИЦЕ».
   *
   * РАСХОЖДЕНИЕ С ЗАДАНИЕМ: в задании сказано ds-body-s (Regular 14).
   * В Figma заголовок 14 px Medium ЗАГЛАВНЫМИ, поэтому здесь ds-body-s-bold
   * (14/500) — это ровно Medium. Цвет text/secondary, как и в задании.
   */
  title?: React.ReactNode;
  /** Пункты — TOC Item. В Figma это слот «Vertical Container». */
  children?: React.ReactNode;
  className?: string;
};

export function TableOfContents({
  title = "На этой странице",
  children,
  className,
}: TocProps) {
  return (
    <nav
      data-component="TableOfContents"
      className={cn(
        // Внешние отступы: слева space/56, справа space/2xl 40, сверху space/3xl 48.
        "w-full pl-[var(--space-56)] pr-[var(--space-2xl)] pt-[var(--space-3xl)]",
        className,
      )}
    >
      <p className="ds-body-s-bold uppercase text-[color:var(--text-secondary)]">
        {title}
      </p>

      {/* Slot: «Vertical Container» — внутрь кладут только TOC Item. */}
      <ul className="flex list-none flex-col">{children}</ul>
    </nav>
  );
}

type ItemProps = {
  /** Якорь заголовка, например «#kak-nanimat». */
  href: string;
  children?: React.ReactNode;
  /** Текущий раздел: тёмный (action/ghost/fg) и Medium. */
  active?: boolean;
  level?: TocItemLevel;
  className?: string;
};

export function TocItem({
  href,
  children,
  active = false,
  level = "H2",
  className,
}: ItemProps) {
  // Primary — Body M 16/1.3, сверху space/m 16.
  // Secondary — Body S 14/1.3, слева space/m 16, сверху space/xs 8.
  const isPrimary = level === "H2";

  const textStyle = isPrimary
    ? active
      ? "ds-body-m-bold"
      : "ds-body-m"
    : active
      ? "ds-body-s-bold"
      : "ds-body-s";

  return (
    <li
      data-component={`TOC Item · ${LEVEL_NAME[level]} · ${
        active ? "Current" : "Default"
      }`}
      className="list-none"
    >
      <a
        href={href}
        aria-current={active ? "location" : undefined}
        className={cn(
          "block rounded-[var(--radius-sm)] pr-[var(--space-xs)] transition-colors",
          textStyle,
          isPrimary
            ? "pt-[var(--space-m)]"
            : "pl-[var(--space-m)] pt-[var(--space-xs)]",
          // ОСТОРОЖНО: в Figma hover — link/hover #3563db, но такого токена
          // в системе НЕТ (есть только link/default #2754ca). Берём link/default,
          // пока дизайнер не заведёт link/hover.
          active
            ? "text-[color:var(--action-ghost-fg)]"
            : "text-[color:var(--text-secondary)] hover:text-[color:var(--link-default)]",
          className,
        )}
      >
        {children}
      </a>
    </li>
  );
}
