import * as React from "react";
import { ChevronDown } from "lucide-react";
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

  «Кат» (проп cut, по умолчанию включён): длинная цитата обрезается до пяти
  строк с многоточием, под ней — строка «Далее ⌄», раскрывающая остальное.
  Так задано в Figma для обоих размеров. Если цитата короткая и в пять строк
  укладывается — «Далее» не мешает: текст просто не обрезается.

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

// Сколько строк видно под катом до «Далее». В Figma обрезка ~5 строк.
const CUT_LINES = 5;

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
  /** «Кат»: обрезать длинную цитату до пяти строк со ссылкой «Далее». */
  cut?: boolean;
  className?: string;
};

export function Quote({
  size = "L",
  children,
  author,
  role,
  avatars = 0,
  cut = true,
  className,
}: Props) {
  const hasCredit = Boolean(author || role || avatars > 0);
  // Кружки-плейсхолдеры: не больше трёх, как в Figma, и не меньше нуля.
  const dots = Math.max(0, Math.min(3, Math.trunc(avatars)));

  const [expanded, setExpanded] = React.useState(false);
  // «Далее» показываем только если текст реально не влез в пять строк —
  // короткую цитату кат не трогает.
  const [overflows, setOverflows] = React.useState(false);
  const quoteRef = React.useRef<HTMLQuoteElement>(null);

  React.useLayoutEffect(() => {
    const el = quoteRef.current;
    if (!cut || !el) {
      setOverflows(false);
      return;
    }
    // line-clamp (-webkit-box) схлопывает scrollHeight до высоты обрезки,
    // поэтому натуральную высоту меряем, временно сняв обрезку.
    const prev = el.style.cssText;
    el.style.display = "block";
    el.style.webkitLineClamp = "unset";
    const natural = el.scrollHeight;
    el.style.cssText = prev;
    const cs = getComputedStyle(el);
    const lineHeight =
      parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5;
    setOverflows(natural > lineHeight * CUT_LINES + 1);
  }, [cut, children, size]);

  const clamped = cut && !expanded;
  const showToggle = cut && (overflows || expanded);

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
        ref={quoteRef}
        className={cn(
          size === "L" ? "ds-body-l-italic" : "ds-body-m-italic",
          "text-[color:var(--text-primary)]",
          // Кат: обрезаем до пяти строк (line-clamp-5 сам ставит overflow).
          clamped && "line-clamp-5",
        )}
      >
        {children}
      </blockquote>

      {showToggle ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className={cn(
            "mt-[var(--space-2xs)] inline-flex items-center gap-[var(--space-3xs)]",
            "ds-body-m-bold text-[color:var(--text-primary)]",
          )}
          aria-expanded={expanded}
        >
          {expanded ? "Свернуть" : "Далее"}
          <ChevronDown
            className={cn(
              "size-5 transition-transform",
              expanded && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      ) : null}

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
