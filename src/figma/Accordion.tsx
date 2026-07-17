import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/*
  Figma: component set «Accordion» (6138:43894), свойства Platform × State × Numbered.

  Свёрнутый блок «вопрос → ответ»: на экране видна строка-вопрос, ответ
  раскрывается по клику. Берут для FAQ и длинных оговорок — того, что читателю
  нужно не всё. НЕ берут для важного (условия, предупреждения): спрятанное
  под кликом большинство не откроет.

  Ставится только внутрь Card Container (как любой не-текстовый блок).
  Состояние State=Collapsed|Expanded в Figma — структурное: в свёрнутом
  Content Container→Slot физически нет. Здесь это локальный useState,
  стартовое значение — проп defaultOpen.

  Расхождения с Figma (честно):
  - В Figma иконка переключателя — плюс/минус (слой ошибочно назван
    «Icon / download»). По решению для прототипа берём ChevronDown с поворотом
    на 180° при раскрытии — привычнее и не требует двух иконок.
  - В Figma кнопка-переключатель — отдельный инстанс Button (Outline, Icon=Only).
    У нас кликабельна вся строка вопроса — значит переключатель не может быть
    вложенной <button> (кнопка в кнопке невалидна). Рисуем его как <span>
    с оформлением Button · Outline · S · Only; разработчику брать именно этот
    вариант Button.
  - Свойство Numbered в Figma имеет единственное значение «No» — не реализуем.
*/

type Props = {
  /** Текст вопроса — заголовок Desktop/H4. */
  question: React.ReactNode;
  /** Ответ. В Figma это Content Container → Slot: Text, List Container, Quote. */
  children?: React.ReactNode;
  /** Стартовое состояние. По умолчанию свёрнут, как State=Collapsed. */
  defaultOpen?: boolean;
  className?: string;
};

export function Accordion({
  question,
  children,
  defaultOpen = false,
  className,
}: Props) {
  const [open, setOpen] = React.useState(defaultOpen);
  const contentId = React.useId();

  return (
    <div
      data-component={`Accordion · ${open ? "Expanded" : "Collapsed"}`}
      className={cn(
        "w-full rounded-[var(--radius-l)] bg-[color:var(--card-bg-gray)] p-[var(--space-l)]",
        className,
      )}
    >
      {/* Question Header. Зазор вопрос–кнопка: 40 в свёрнутом, 24 в раскрытом. */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={open ? contentId : undefined}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center justify-between text-left",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--text-primary)] focus-visible:ring-offset-2",
          open ? "gap-[var(--space-l)]" : "gap-[var(--space-2xl)]",
        )}
      >
        <span className="ds-h4 text-[color:var(--text-primary)]">
          {question}
        </span>
        {/* Оформление Button · Outline · S · Only, но без вложенной <button>. */}
        <span
          className={cn(
            "flex size-[38px] shrink-0 items-center justify-center",
            "rounded-[var(--radius-xs)] border-2 border-[color:var(--action-outline-border)]",
            "bg-[color:var(--action-outline-bg)] text-[color:var(--action-outline-fg)]",
          )}
        >
          <ChevronDown
            aria-hidden="true"
            className={cn("size-4 transition-transform", open && "rotate-180")}
          />
        </span>
      </button>

      {/* Content Container → Slot. Своего зазора нет: верхний отступ приносит
          сам вложенный блок (Text pt-24, List Container pt-16). */}
      {open ? (
        <div id={contentId} className="w-full">
          {children}
        </div>
      ) : null}
    </div>
  );
}
