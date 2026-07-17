import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/*
  Figma: «Sidebar Menu» (6181:8435), живая сборка в шаблоне — 6798:4171 (26 пунктов).
  Пункт — набор «Sidebar Menu Item» (1426:42658, 25 вариантов).

  Меню всего сайта в левой колонке: разделы и страницы. Отвечает на вопрос
  «где я на сайте». Не путать с TableOfContents — тот про заголовки внутри
  одной страницы. Пункты сайдбара = страницы, пункты оглавления = заголовки.

  Вложенность здесь ВИЗУАЛЬНАЯ, а не структурная: в Figma все 26 пунктов лежат
  плоским списком, друг в друга не вложены, уровень задаётся каждому пункту
  вручную. Здесь так же — плоский список, уровень пропом level.

  Иерархия передаётся только отступом слева и начертанием: ни линий, ни рамок.

  Ширину колонки (336, токен --sidebar-width) задаёт родитель — компонент w-full.
  Ширина пункта 264 получается сама: 336 − 24 слева − 48 справа.

  Открытые вопросы дизайнеру (из разбора):
  1) Свойство уровня в Figma названо «Tu» — почти наверняка опечатка от «Type»
     (у соседних компонентов это свойство называется Type).
  2) Живая сборка 6798:4171 — не инстанс компонента, а обычный фрейм с пунктами.
     Меню собирают руками каждый раз. Компонент 6181:8435 (336×543) вдвое короче
     живой сборки (990) — возможно, устарел.
  3) Раскрытие/сворачивание в макете статично: у одних разделов шеврон есть,
     у других нет, и по картинке не понять, какой раздел свёрнут. Здесь шеврон —
     просто украшение (проп icon), ничего не раскрывает.
  4) Сдвиг между уровнями всего 4–8 px — иерархия читается слабо.
*/

/**
 * Уровень пункта: 0 — раздел (Tu=Primary), 1 — страница (Tu=Secondary),
 * 2 — подстраница (Tu=Tertiary).
 *
 * В задании были заявлены только уровни 0 и 1. Уровень 2 добавлен потому, что
 * в Figma у набора реально три уровня (Primary | Secondary | Tertiary).
 * Для 0 и 1 поведение ровно такое, как в задании.
 */
export type SidebarMenuItemLevel = 0 | 1 | 2;

const LEVEL_NAME: Record<SidebarMenuItemLevel, string> = {
  0: "Primary",
  1: "Secondary",
  2: "Tertiary",
};

// Отступ слева по уровням: 20 (space/ml) → 24 (space/l) → 40 (space/2xl).
const LEVEL_PAD_LEFT: Record<SidebarMenuItemLevel, string> = {
  0: "pl-[var(--space-ml)]",
  1: "pl-[var(--space-l)]",
  2: "pl-[var(--space-2xl)]",
};

// Раздел — Medium, страницы — Regular. Кегль везде Body M 16/1.3.
const LEVEL_TEXT: Record<SidebarMenuItemLevel, string> = {
  0: "ds-body-m-bold",
  1: "ds-body-m",
  2: "ds-body-m",
};

type MenuProps = {
  /** Пункты — Sidebar Menu Item. Слота в Figma нет, наполняется набором пунктов. */
  children?: React.ReactNode;
  /** Подпись для навигации — на экране не видна, у блока нет заголовка. */
  label?: string;
  className?: string;
};

export function SidebarMenu({
  children,
  label = "Разделы сайта",
  className,
}: MenuProps) {
  return (
    <nav
      data-component="SidebarMenu"
      aria-label={label}
      className={cn(
        // Блок: слева space/l 24, справа space/3xl 48, сверху space/3xl 48.
        "w-full pl-[var(--space-l)] pr-[var(--space-3xl)] pt-[var(--space-3xl)]",
        className,
      )}
    >
      {/* Пункты идут подряд, без разделителей и без промежутка — так в Figma. */}
      <ul className="flex list-none flex-col">{children}</ul>
    </nav>
  );
}

type ItemProps = {
  children?: React.ReactNode;
  /** Текущая страница: бледная плашка action/secondary/bg, текст остаётся тёмным. */
  active?: boolean;
  level?: SidebarMenuItemLevel;
  /** Шеврон справа (Figma: Icon=Yes|No). У Tu=Tertiary варианта с иконкой нет. */
  icon?: boolean;
  href?: string;
  className?: string;
};

export function SidebarMenuItem({
  children,
  active = false,
  level = 0,
  icon = false,
  href,
  className,
}: ItemProps) {
  const inner = (
    <>
      <span className={cn(LEVEL_TEXT[level], "min-w-0 flex-1")}>{children}</span>
      {icon ? <ChevronDown aria-hidden className="size-5 shrink-0" /> : null}
    </>
  );

  const classes = cn(
    // Пункт: сверху/снизу 6, справа space/ml 20, скругление radius/sm 12.
    // Токена на 6 px в системе нет — значение прямое, через фолбэк.
    "flex w-full items-center gap-[var(--space-xs)] rounded-[var(--radius-sm)]",
    "py-[var(--padding-6,6px)] pr-[var(--space-ml)]",
    LEVEL_PAD_LEFT[level],
    // State=Default — тёмно-серый текст. State=Hover — синий.
    // ОСТОРОЖНО: в Figma hover — link/hover #3563db, но такого токена в системе
    // НЕТ (есть только link/default #2754ca). Берём link/default, пока дизайнер
    // не заведёт link/hover.
    active
      ? "bg-[color:var(--action-secondary-bg)] text-[color:var(--action-secondary-fg)]"
      : "text-[color:var(--action-secondary-fg)] hover:text-[color:var(--link-default)]",
    className,
  );

  return (
    <li
      data-component={`Sidebar Menu Item · ${LEVEL_NAME[level]} · ${
        active ? "Current" : "Default"
      }`}
      className="list-none"
    >
      {href ? (
        <a href={href} aria-current={active ? "page" : undefined} className={classes}>
          {inner}
        </a>
      ) : (
        <span className={classes}>{inner}</span>
      )}
    </li>
  );
}
