import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { AssetLink } from "@/lib/assetLink";

/*
  Figma: component set «Quote» (6369:11192), свойства Platform × Size (L | S).

  Карточка прямой речи: слова конкретного человека с именем и должностью.
  Нужна, чтобы подкрепить материал живым свидетельством. Для обезличенной
  выделенной мысли берите General Card, не Quote.

  Живёт в слоте Block (иногда через Stack — узел 0:592
  держит две Quote подряд). Своего верхнего отступа нет — воздух даёт контейнер.

  Size:
  - L (6122:8718) — на кремово-жёлтой подложке card/bg-yellow, скругление 24,
    паддинг 24, цитата курсивом 18. Акцентная врезка, которую нужно заметить.
  - S (6369:11193) — на БЕЛОЙ подложке, цитата курсивом 16. Живёт внутри
    аккордеона: без своей подложки сквозь неё просвечивал бы тонированный фон
    аккордеона, и цитата переставала бы читаться как отдельный блок. Оформление
    (скругление, паддинг) то же, что у L и у белой карточки рядом.

  «Кат» (проп cut, по умолчанию включён): длинная цитата обрезается до пяти
  строк с многоточием, под ней — строка «Далее ⌄», раскрывающая остальное.
  Так задано в Figma для обоих размеров. Если цитата короткая и в пять строк
  укладывается — «Далее» не мешает: текст просто не обрезается.

  СТРОКА АВТОРСТВА (решение заказчика). Логотип + имя + должность:
  1) упомянута организация/фонд → её логотип, ПРЯМОУГОЛЬНЫЙ (пропы org + logo);
  2) упомянут Яндекс → логотип Яндекса, КРУГЛЫЙ (проп yandex);
  3) аватар/фото человека (проп photo, по умолчанию есть).
  Имя и должность показываются ВСЕГДА.

  ФАЙЛЫ ЛОГОТИПОВ: public/figma/logos/<слаг>.png (577 логотипов фондов
  и партнёров, выгружены из Figma; каталог соответствий «название → слаг» —
  там же в _index.json). Знак Яндекса файлом не нужен — рисуем сами: белая «Я»
  в фирменном красном круге (--logo-yandex).
  Если файла по слагу нет (или слаг не задан) — рисуется плейсхолдер той же
  формы: прямоугольник для организации, круг «Я» для Яндекса.
*/

export type QuoteSize = "L" | "S";

/**
 * Логотип в строке авторства. Берёт файл public/figma/logos/<slug>.png;
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

  // Слаг без расширения → .png (логотипы выгружены в PNG); с расширением —
  // берём как есть, чтобы можно было положить и .svg.
  const file = slug.includes(".") ? slug : `${slug}.png`;

  const src = `${import.meta.env.BASE_URL}figma/logos/${file}`;
  return (
    /*
      Логотип кликабелен: разработчик забирает файл себе одним нажатием
      (см. assetLink.tsx). Размер на экране — 80 × 40, файл вдвое больше.
    */
    <AssetLink src={src} title={title} className="shrink-0">
      <img
        src={src}
        alt=""
        aria-hidden
        onError={() => setFailed(true)}
        className={cn(
          "shrink-0 object-contain",
          // Организация — плашка-«таблетка» (логотипы выгружены на белом фоне),
          // Яндекс — круг.
          round ? "size-10 rounded-full" : "h-10 w-20 rounded-[var(--radius-xs)]",
        )}
      />
    </AssetLink>
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
  /* Должность. Принимает и готовую разметку: в подписи бывает ссылка на сайт
     фонда, названного в должности. */
  role?: React.ReactNode;
  /** Организация/фонд автора — её логотип слева (прямоугольный). Скрыта при yandex. */
  org?: string;
  /** Слаг файла логотипа организации: public/figma/logos/<logo>.png (см. _index.json). */
  logo?: string;
  /** Автор — из Яндекса: круглый логотип Яндекса вместо логотипа организации. */
  yandex?: boolean;
  /** Показать аватар-плейсхолдер человека. По умолчанию да. */
  photo?: boolean;
  /** Фото автора (URL). Если задано — рисуется вместо серого плейсхолдера. */
  photoSrc?: string;
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
  photoSrc,
  cut = true,
  className,
}: Props) {
  const hasCredit = Boolean(author || role || org || yandex);

  const [expanded, setExpanded] = React.useState(false);
  // «Далее» показываем только если текст реально не влез в пять строк —
  // короткую цитату кат не трогает.
  const [overflows, setOverflows] = React.useState(false);
  const quoteRef = React.useRef<HTMLQuoteElement>(null);

  /*
    Замер ПЕРЕИГРЫВАЕТСЯ при изменении ширины. Разовый замер врал: первый кадр
    цитата успевает поймать ещё не разложенную (узкую) колонку, короткий текст
    в ней переносится на десяток строк — и «Далее» оставалось висеть под
    однострочной цитатой навсегда. ResizeObserver закрывает и загрузку шрифта,
    и смену размера окна, и раскрытие аккордеона.
  */
  React.useLayoutEffect(() => {
    const el = quoteRef.current;
    if (!cut || !el) {
      setOverflows(false);
      return;
    }
    const measure = () => {
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
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cut, children, size]);

  const clamped = cut && !expanded;
  const showToggle = cut && (overflows || expanded);

  return (
    <figure
      data-component={`Quote · ${size}`}
      className={cn(
        "w-full rounded-[var(--radius-l)] p-[var(--space-l)]",
        /*
          Подложка есть у обоих размеров, различается цветом: L — кремовая
          (акцент), S — белая. Белая нужна потому, что S живёт внутри
          аккордеона: без своей подложки сквозь цитату просвечивал бы
          тонированный фон, и она переставала читаться как отдельный блок.
          Оформление то же, что у белой карточки рядом, — чтобы не выбивалась.
        */
        size === "L"
          ? "bg-[color:var(--card-bg-yellow)]"
          : "bg-[color:var(--card-bg-white)]",
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
                  // Знак Яндекса рисуем сами: белая «Я» в фирменном красном круге
                  // (--logo-yandex). Файла логотипа в наборе нет и не нужен.
                  className="ds-body-m-bold flex size-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--logo-yandex)] text-[color:var(--text-inverse-primary)]"
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

          {photoSrc ? (
            // Настоящее фото автора: квадрат, обрезанный в круг.
            <AssetLink src={photoSrc} title={author || "фото автора"} className="shrink-0">
              <img
                src={photoSrc}
                alt={author ? `Фото: ${author}` : ""}
                className="size-10 shrink-0 rounded-[var(--radius-100)] object-cover"
                loading="lazy"
              />
            </AssetLink>
          ) : photo ? (
            <span
              aria-hidden
              // Плейсхолдер, пока фото автора нет.
              className="size-10 shrink-0 rounded-[var(--radius-100)] bg-[color:var(--card-bg-gray)]"
            />
          ) : null}

          <span className="flex min-w-0 flex-col">
            {/*
              Цитата бывает не от человека, а ОТ ОРГАНИЗАЦИИ («ОРБИ, фонд
              борьбы с инсультом»): в источнике на месте авторства стоит только
              название фонда. Тогда подписью работает оно — иначе от цитаты
              остаётся один логотип, и кто это сказал, читателю неоткуда узнать.
            */}
            {author || org ? (
              <span className="ds-body-m-bold text-[color:var(--text-primary)]">
                {author || org}
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
