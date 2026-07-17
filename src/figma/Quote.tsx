import * as React from "react";
import { cn } from "@/lib/utils";

/*
  Figma: component set «Quote» (6369:11192), свойства Platform × Size (L | S).

  Карточка прямой речи: слова конкретного человека с именем и должностью.
  Нужна, чтобы подкрепить материал живым свидетельством. Для обезличенной
  выделенной мысли берите General Card, не Quote.

  Живёт в слоте Card Container (иногда через List Container — узел 0:592
  держит две Quote подряд). Своего верхнего отступа нет — воздух даёт контейнер.

  Size:
  - L (6122:8718) — на кремово-жёлтой подложке card/bg-yellow, скругление 24,
    паддинг 24, цитата курсивом 18. Акцентная врезка, которую нужно заметить.
  - S (6369:11193) — БЕЗ подложки, прямо на фоне страницы, цитата курсивом 16.
    Спокойная цитата в потоке, не перебивает чтение.

  ЧЕМ МЫ РАСХОДИМСЯ С FIGMA (честно):
  1) В строке авторства у Figma три графических элемента подряд: логотип-
     «таблетка» организации, круглый аватар и фото человека. Свойств «вкл/выкл»
     у них не видно, и непонятно, как быть с цитатой человека без компании.
     Пока это ОТКРЫТЫЙ ВОПРОС к дизайнеру, поэтому здесь они сделаны
     необязательными плейсхолдерами (кружок на card/bg-gray): проп avatars
     говорит, сколько кружков показать, 0 — ни одного.
  2) Точные отступы внутри Quote из Figma не выгружены (агент-разборщик упёрся
     в лимит запросов). Взяты по общей физике карточек: паддинг 24, промежуток
     до строки авторства 16 (space/m). Перепроверить при следующем проходе.
*/

export type QuoteSize = "L" | "S";

type Props = {
  size?: QuoteSize;
  /** Текст цитаты. Рисуется курсивом. */
  children?: React.ReactNode;
  /** Имя автора, стиль Body M Bold. */
  author?: string;
  /** Должность автора, стиль Body S, цвет text/secondary. */
  role?: string;
  /** Сколько кружков-плейсхолдеров показать в строке авторства (0–3). */
  avatars?: number;
  className?: string;
};

export function Quote({
  size = "L",
  children,
  author,
  role,
  avatars = 0,
  className,
}: Props) {
  const hasCredit = Boolean(author || role || avatars > 0);
  // Кружки-плейсхолдеры: не больше трёх, как в Figma, и не меньше нуля.
  const dots = Math.max(0, Math.min(3, Math.trunc(avatars)));

  return (
    <figure
      data-component={`Quote · ${size}`}
      className={cn(
        "w-full",
        size === "L" &&
          "rounded-[var(--radius-l)] bg-[color:var(--card-bg-yellow)] p-[var(--space-l)]",
        className,
      )}
    >
      <blockquote
        className={cn(
          size === "L" ? "ds-body-l-italic" : "ds-body-m-italic",
          "text-[color:var(--text-primary)]",
        )}
      >
        {children}
      </blockquote>

      {hasCredit ? (
        <figcaption
          className={cn(
            "flex flex-wrap items-center gap-[var(--space-xs)] pt-[var(--space-m)]",
          )}
        >
          {dots > 0 ? (
            <span className="flex items-center gap-[var(--space-2xs)]">
              {Array.from({ length: dots }, (_, i) => (
                <span
                  key={i}
                  aria-hidden
                  // Плейсхолдер вместо логотипа / аватара / фото — см. шапку файла.
                  className={cn(
                    "size-8 shrink-0 rounded-[var(--radius-100)]",
                    "bg-[color:var(--card-bg-gray)]",
                  )}
                />
              ))}
            </span>
          ) : null}

          {author ? (
            <span className="ds-body-m-bold text-[color:var(--text-primary)]">
              {author}
            </span>
          ) : null}

          {role ? (
            <span className="ds-body-s text-[color:var(--text-secondary)]">
              {role}
            </span>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
