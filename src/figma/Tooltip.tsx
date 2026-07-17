import * as React from "react";
import { cn } from "@/lib/utils";

/*
  Figma: два отдельных набора, оба названы «Tooltip»:
  - триггер — слово в тексте (6010:79285), свойство Size = L | S;
  - пузырь-подсказка (6010:79267), свойство Platform = Desktop | Mobile.
  В Figma они не связаны — пара живёт только в голове дизайнера. Здесь
  собираем её в один компонент: children — триггер, content — текст пузыря.

  Правило-светофор сайта, соблюдать буквально:
  пунктир = пояснение, остаёшься на странице; стрелка = уходишь на чужой сайт
  (см. External Link). Триггер — не ссылка, перехода нет.
  Термин помечают один раз — при первом упоминании, иначе абзац станет решетом.
  В подсказку НЕ кладут важное: её не видно на телефоне и при печати.

  Наши дополнения (в Figma этого нет — открытые вопросы дизайнеру):
  - состояний hover/focus у триггера нет ни одного, хотя весь смысл компонента
    в реакции на наведение. Показываем пузырь по hover И по focus (клавиатура);
  - направления появления и хвостика-указателя в Figma нет. Ставим пузырь над
    словом по центру; поведение у краёв экрана не решено.
  Расхождение: разбор Figma даёт фон пузыря #1b1f2d (neutral/900), но такого
  токена в системе нет — берём ближайший существующий neutral/800.
  Ширина пузыря 300 — единственное место, где ширина в Figma жёсткая.
*/

export type TooltipTriggerSize = "L" | "S";

type Props = {
  /** Слово или короткое словосочетание в тексте. Не переносится на две строки. */
  children: React.ReactNode;
  /** Определение термина — Desktop/Body S в пузыре. */
  content: React.ReactNode;
  /** Заголовок-термин в пузыре — Desktop/Body M Bold. Необязателен. */
  title?: React.ReactNode;
  /** Size триггера: L — кегль основного абзаца (18), S — для мелкого текста. */
  size?: TooltipTriggerSize;
  className?: string;
};

export function Tooltip({
  children,
  content,
  title,
  size = "L",
  className,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const bubbleId = React.useId();

  return (
    // Обёртка — наша: в Figma её нет, она нужна только чтобы позиционировать пузырь.
    <span className="relative inline-block">
      <button
        type="button"
        data-component={`Tooltip · ${size}`}
        aria-describedby={open ? bubbleId : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className={cn(
          size === "L" ? "ds-body-l" : "ds-body-s",
          "inline whitespace-nowrap text-[color:var(--link-default)]",
          "border-b border-dashed border-[color:var(--link-default)] pb-[var(--space-2xs)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--link-default)]",
          className,
        )}
      >
        {children}
      </button>

      {open ? (
        <span
          id={bubbleId}
          role="tooltip"
          data-component="Tooltip"
          className={cn(
            "absolute bottom-[calc(100%+var(--space-xs))] left-1/2 z-10 -translate-x-1/2",
            "flex w-[300px] flex-col gap-[var(--space-xs)]",
            "rounded-[var(--radius-m)] bg-[color:var(--neutral-800)] p-[var(--space-m)]",
          )}
        >
          {title ? (
            <span className="ds-body-m-bold text-[color:var(--text-inverse-primary)]">
              {title}
            </span>
          ) : null}
          <span className="ds-body-s text-[color:var(--text-inverse-secondary)]">
            {content}
          </span>
        </span>
      ) : null}
    </span>
  );
}
