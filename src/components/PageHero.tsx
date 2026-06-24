import * as React from "react";
import { cn } from "@/lib/utils";

// PageHero (00b §2.2) — единый баннер вверху страницы во всех обличьях:
// eyebrow (опц.) + H1 + лид + опц. слот (например, StatBlock для лендинга).
// Политика eyebrow (00b): показывать ТОЛЬКО если несёт новое измерение
// (тип подачи, жанр, «внешний ресурс») — не дублировать H1 и не повторять «Шаг N».

type PageHeroProps = {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  variant?: "landing" | "track-hub" | "section-hub" | "leaf" | "404";
  children?: React.ReactNode;
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  lead,
  variant = "leaf",
  children,
  className,
}: PageHeroProps) {
  const isLanding = variant === "landing";
  return (
    <header
      className={cn(
        "space-y-4",
        isLanding ? "py-4" : "",
        className
      )}
    >
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      <h1
        className={cn(
          "font-bold tracking-tight text-foreground",
          isLanding ? "text-4xl leading-tight md:text-5xl" : "text-4xl leading-tight"
        )}
      >
        {title}
      </h1>
      {lead ? (
        <div className="max-w-prose text-lg leading-relaxed text-muted-foreground">
          {lead}
        </div>
      ) : null}
      {children}
    </header>
  );
}
