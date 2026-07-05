import * as React from "react";
import { User, Building2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SmartLink } from "./SmartLink";
import { Editable } from "@/editor/Editable";

// Blockquote (00b §2.6) — цитата-кейс или именная цитата: текст + атрибуция.
// Атрибуция — структурный контейнер: аватар · имя · должность · логотип
// организации. Изображения и структурные поля заполняются позже; пока пустые
// слоты показываются заглушками (честно про пробелы, как ImagePlaceholder).
// Длинная цитата сворачивается до clampLines строк с кнопкой «Далее».

type BlockquoteProps = {
  children: React.ReactNode;
  /** Подпись одной строкой (legacy — «Имя, должность»). Показывается в поле
   *  имени, если не заданы authorName/authorRole. Остаётся редактируемой. */
  attribution?: React.ReactNode;
  /** Имя автора цитаты. */
  authorName?: React.ReactNode;
  /** Должность / роль автора. */
  authorRole?: React.ReactNode;
  /** URL аватарки (пока не задан — показываем заглушку). */
  avatar?: string;
  /** URL логотипа организации (пока не задан — показываем заглушку). */
  orgLogo?: string;
  /** Пояснение к атрибуции (мелким приглушённым). */
  note?: React.ReactNode;
  /** Ссылка «Подробнее». */
  moreTo?: string;
  moreLabel?: React.ReactNode;
  /** До скольких строк сворачивать длинную цитату (кнопка «Далее»). */
  clampLines?: number;
  className?: string;
};

/** Круглый слот под аватарку: фото, если есть, иначе пунктирная заглушка. */
function AvatarSlot({ src }: { src?: string }) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        className="h-11 w-11 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <div
      aria-hidden
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-dashed bg-muted/30 text-muted-foreground"
    >
      <User className="h-5 w-5" />
    </div>
  );
}

/** Слот под логотип организации: картинка, если есть, иначе заглушка. */
function LogoSlot({ src }: { src?: string }) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        className="h-9 max-w-[6rem] shrink-0 object-contain"
      />
    );
  }
  return (
    <div
      aria-hidden
      className="flex h-9 w-16 shrink-0 items-center justify-center rounded-md border border-dashed bg-muted/30 text-muted-foreground"
    >
      <Building2 className="h-4 w-4" />
    </div>
  );
}

const placeholder = (label: string) => (
  <span className="italic text-muted-foreground/60">{label}</span>
);

export function Blockquote({
  children,
  attribution,
  authorName,
  authorRole,
  avatar,
  orgLogo,
  note,
  moreTo,
  moreLabel = "Подробнее",
  clampLines = 6,
  className,
}: BlockquoteProps) {
  // Имя: структурное authorName → legacy attribution → заглушка.
  const nameContent = authorName ?? attribution;
  // Должность показываем структурно; заглушку — только если нет ни имени, ни
  // legacy-подписи (в attribution должность обычно уже внутри строки).
  const roleContent =
    authorRole ?? (nameContent == null ? placeholder("Должность") : null);

  // Сворачивание длинной цитаты. «Далее» показываем, только если текст реально
  // не влезает в clampLines строк (меряем по факту, а не на глаз).
  const quoteRef = React.useRef<HTMLQuoteElement>(null);
  const [expanded, setExpanded] = React.useState(false);
  const [overflowing, setOverflowing] = React.useState(false);

  React.useLayoutEffect(() => {
    // В раскрытом виде не пересчитываем (клэмпа нет — переполнение «пропало» бы,
    // и кнопка «Свернуть» исчезла бы). Сохраняем прошлое значение.
    if (expanded) return;
    const el = quoteRef.current;
    if (!el) return;
    const measure = () =>
      setOverflowing(el.scrollHeight - el.clientHeight > 1);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children, expanded, clampLines]);

  const clampStyle: React.CSSProperties | undefined =
    expanded
      ? undefined
      : {
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: clampLines,
          overflow: "hidden",
        };

  return (
    <figure
      data-component="Blockquote"
      className={cn("max-w-prose border-l-2 border-brand pl-5", className)}
    >
      <blockquote
        ref={quoteRef}
        style={clampStyle}
        className="text-sm leading-relaxed text-foreground"
      >
        <Editable as="inline">{children}</Editable>
      </blockquote>

      {overflowing ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-1.5 inline-flex items-center gap-1 rounded-sm text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {expanded ? "Свернуть" : "Далее"}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              expanded && "rotate-180"
            )}
          />
        </button>
      ) : null}

      <figcaption className="mt-3 space-y-2 text-sm">
        {/* Атрибуция: аватар · имя/должность · логотип. Заполним позже. */}
        <div className="flex items-center gap-3">
          <AvatarSlot src={avatar} />
          <div className="min-w-0 flex-1">
            <div className="font-medium text-foreground">
              {nameContent != null ? (
                <Editable as="inline">{nameContent}</Editable>
              ) : (
                placeholder("Имя")
              )}
            </div>
            {roleContent ? (
              <div className="text-muted-foreground">{roleContent}</div>
            ) : null}
          </div>
          <div className="ml-auto pl-3">
            <LogoSlot src={orgLogo} />
          </div>
        </div>
        {note ? (
          <div className="text-[0.8125rem] text-muted-foreground">{note}</div>
        ) : null}
        {moreTo ? (
          <div>
            <SmartLink to={moreTo}>{moreLabel}</SmartLink>
          </div>
        ) : null}
      </figcaption>
    </figure>
  );
}
