import * as React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Card (00b §2.3) — универсальная карточка. Обязательный вариант `link` —
// смысловое различие (Правила верности §3.1): карточка-факт (none) ≠ навигационная
// (internal) ≠ ресурс (external) ≠ контакт (mailto). Не превращать факт в ссылку.

export type CardLink = "none" | "internal" | "external" | "mailto";

type CardProps = {
  link?: CardLink;
  to?: string;
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Иконка-метка слева сверху (media=icon). */
  icon?: React.ReactNode;
  /** Бейдж (тип материала / номер группы) — верхний правый угол. */
  badge?: React.ReactNode;
  /** Крупная метка-номер/буква (группы инвалидности I/II/III). */
  marker?: React.ReactNode;
  /** Доп. содержимое после описания (списки адаптаций и т.п.). */
  children?: React.ReactNode;
  /** Подвал-текст «Связанный материал» — НЕ ссылка (§3.8). */
  footer?: React.ReactNode;
  className?: string;
};

export function Card({
  link = "none",
  to,
  eyebrow,
  title,
  description,
  icon,
  badge,
  marker,
  children,
  footer,
  className,
}: CardProps) {
  const isLink = link !== "none" && to;
  const isExternal = link === "external";
  const isMail = link === "mailto";

  const base =
    "block rounded-lg border bg-card p-6 text-card-foreground transition-colors";
  const interactive = isLink
    ? "hover:border-ring hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    : "";

  const inner = (
    <>
      {(icon || badge || marker) && (
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {marker ? (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-lg font-bold text-secondary-foreground">
                {marker}
              </span>
            ) : null}
            {icon ? (
              <span className="text-muted-foreground [&_svg]:h-5 [&_svg]:w-5">
                {icon}
              </span>
            ) : null}
          </div>
          {badge ? <span>{badge}</span> : null}
        </div>
      )}
      {eyebrow ? (
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      {title ? (
        <h3 className="font-semibold leading-snug text-foreground">
          {title}
          {isExternal ? (
            <ArrowUpRight className="ml-1 inline-block h-4 w-4 align-text-top text-muted-foreground" />
          ) : null}
        </h3>
      ) : null}
      {description ? (
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {children}
      {footer ? (
        <p className="mt-3 border-t pt-3 text-[0.8125rem] text-muted-foreground">
          {footer}
        </p>
      ) : null}
    </>
  );

  if (isLink && isExternal) {
    return (
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(base, interactive, "group", className)}
      >
        {inner}
      </a>
    );
  }
  if (isLink && isMail) {
    return (
      <a href={to} className={cn(base, interactive, "group", className)}>
        {inner}
      </a>
    );
  }
  if (isLink) {
    return (
      <Link to={to!} className={cn(base, interactive, "group", className)}>
        {inner}
      </Link>
    );
  }
  return <div className={cn(base, className)}>{inner}</div>;
}

/** Сетка карточек-входов / фактов. cols — число колонок на десктопе. */
export function CardGrid({
  cols = 3,
  children,
  className,
}: {
  cols?: 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
}) {
  const colClass =
    cols === 2 ? "md:grid-cols-2" : cols === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
  return (
    <div className={cn("grid grid-cols-1 gap-4", colClass, className)}>
      {children}
    </div>
  );
}
