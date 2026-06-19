import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { SmartLink } from "./SmartLink";

// «Prose» (00b §2.2) — вся авторская проза и списки. Один компонент,
// различия — вариантами: paragraph / lead / list / checklist / link-list / footnote.

/** Колонка прозы с ограничением ширины ~72ch. */
export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("max-w-prose space-y-4", className)}>{children}</div>
  );
}

export function Lead({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "max-w-prose text-lg leading-relaxed text-muted-foreground",
        className
      )}
    >
      {children}
    </p>
  );
}

export function Paragraph({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("leading-relaxed text-foreground", className)}>
      {children}
    </p>
  );
}

export function Footnote({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "max-w-prose text-[0.8125rem] leading-relaxed text-muted-foreground",
        className
      )}
    >
      {children}
    </p>
  );
}

export function BulletList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "max-w-prose list-disc space-y-2 pl-5 leading-relaxed marker:text-muted-foreground",
        className
      )}
    >
      {children}
    </ul>
  );
}

export function OrderedList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ol
      className={cn(
        "max-w-prose list-decimal space-y-2 pl-5 leading-relaxed marker:text-muted-foreground",
        className
      )}
    >
      {children}
    </ol>
  );
}

/** Чек-лист самопроверки: маркер-галочка вместо буллета. */
export function Checklist({
  items,
  className,
}: {
  items: React.ReactNode[];
  className?: string;
}) {
  return (
    <ul className={cn("max-w-prose space-y-2.5", className)}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 leading-relaxed">
          <Check className="mt-1 h-4 w-4 shrink-0 text-[hsl(var(--ok))]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export type LinkListItem = {
  to: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  /** Пункт без ссылки (просто текст) — например, канал без указанного адреса. */
  noLink?: boolean;
};

/** Список «ссылка + пояснение после тире» (блоки «Связанные разделы», каталоги). */
export function LinkList({
  items,
  ordered,
  className,
}: {
  items: LinkListItem[];
  ordered?: boolean;
  className?: string;
}) {
  const ListTag = ordered ? "ol" : "ul";
  return (
    <ListTag
      className={cn(
        "max-w-prose space-y-2.5 leading-relaxed",
        ordered ? "list-decimal pl-5 marker:text-muted-foreground" : "",
        className
      )}
    >
      {items.map((item, i) => (
        <li key={i} className={ordered ? "" : "flex"}>
          {!ordered && <span className="mr-2 text-muted-foreground">•</span>}
          <span>
            {item.noLink ? (
              <span className="font-medium">{item.label}</span>
            ) : (
              <SmartLink to={item.to} className="font-medium">
                {item.label}
              </SmartLink>
            )}
            {item.description ? (
              <>
                {" — "}
                <span className="text-muted-foreground">
                  {item.description}
                </span>
              </>
            ) : null}
          </span>
        </li>
      ))}
    </ListTag>
  );
}
