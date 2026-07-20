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

  СТРОКА АВТОРСТВА (решение заказчика). Логотип + имя + должность:
  1) упомянута организация/фонд → её логотип, ПРЯМОУГОЛЬНЫЙ (пропы org + logo);
  2) упомянут Яндекс → логотип Яндекса, КРУГЛЫЙ (проп yandex);
  3) аватар/фото человека (проп photo, по умолчанию есть).
  Имя и должность показываются ВСЕГДА.

  ФАЙЛЫ ЛОГОТИПОВ: public/figma/logos/<слаг>.svg (Яндекс — yandex.svg).
  Пока логотипы не выгружены из Figma, рисуется плейсхолдер той же формы —
  прямоугольник для организации, круг «Я» для Яндекса. Как только файл появится,
  он подхватится сам, без правок кода (и наоборот: если файла нет — плейсхолдер).
*/

export type QuoteSize = "L" | "S";

/**
 * Логотип в строке авторства. Берёт файл public/figma/logos/<slug>.svg;
 * если файла ещё нет (или слаг не задан) — рисует плейсхолдер той же формы.
 * round — форма Яндекса (круг), иначе прямоугольник организации.
 */
function LogoMark({
  slug,
  title,
  round = false,
  fallback,
}: {
  slug?: string;
  title?: string;
  round?: boolean;
  fallback: React.ReactNode;
}) {
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => setFailed(false), [slug]);

  if (!slug || failed) return <>{fallback}</>;

  return (
    <img
      src={`${import.meta.env.BASE_URL}figma/logos/${slug}.svg`}
      alt=""
      aria-hidden
      title={title}
      onError={() => setFailed(true)}
      className={cn(
        "shrink-0 object-contain",
        round ? "size-8 rounded-full" : "h-8 w-16",
      )}
    />
  );
}

// Сколько строк видно под катом до «Далее». В Figma обрезка ~5 строк.
const CUT_LINES = 5;

type Props = {
  size?: QuoteSize;
  /** Текст цитаты. Рисуется курсивом. */
  children?: React.ReactNode;
  /** Имя автора, стиль Body M Bold. Показывается всегда. */
  author?: string;
  /** Должность автора, стиль Body S. Показывается всегда. */
  role?: string;
  /** Организация/фонд автора — её логотип слева (прямоугольный). Скрыта при yandex. */
  org?: string;
  /** Слаг файла логотипа организации: public/figma/logos/<logo>.svg. */
  logo?: string;
  /** Автор — из Яндекса: круглый логотип Яндекса вместо логотипа организации. */
  yandex?: boolean;
  /** Показать аватар-плейсхолдер человека. По умолчанию да. */
  photo?: boolean;
  /** «Кат»: обрезать длинную цитату до пяти строк со ссылкой «Далее». */
  cut?: boolean;
  className?: string;
};

export function Quote({
  size = "L",
  children,
  author,
  role,
  org,
  logo,
  yandex = false,
  photo = true,
  cut = true,
  className,
}: Props) {
  const hasCredit = Boolean(author || role || org || yandex);

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
        <figcaption className="flex flex-wrap items-center gap-[var(--space-xs)] pt-[var(--space-m)]">
          {/* Аффилиация: круглый логотип Яндекса ИЛИ прямоугольный логотип организации. */}
          {yandex ? (
            <LogoMark
              slug="yandex"
              title="Яндекс"
              round
              fallback={
                <span
                  aria-hidden
                  title="Яндекс"
                  className="ds-body-m-bold flex size-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--text-primary)] text-[color:var(--text-inverse-primary)]"
                >
                  Я
                </span>
              }
            />
          ) : org ? (
            <LogoMark
              slug={logo}
              title={org}
              fallback={
                <span
                  aria-hidden
                  title={org}
                  className="h-8 w-16 shrink-0 rounded-[var(--radius-m)] bg-[color:var(--card-bg-gray)]"
                />
              }
            />
          ) : null}

          {photo ? (
            <span
              aria-hidden
              // Плейсхолдер фото человека.
              className="size-8 shrink-0 rounded-[var(--radius-100)] bg-[color:var(--card-bg-gray)]"
            />
          ) : null}

          <span className="flex min-w-0 flex-col">
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
          </span>
        </figcaption>
      ) : null}
    </figure>
  );
}
