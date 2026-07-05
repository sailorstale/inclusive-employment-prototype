import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

// PromoBanner (00b §2.8) — акцентная врезка-призыв: заголовок + текст + кнопка.
// Одиночный внешний CTA без обёртки — это просто Button asChild (см. CtaButton).

type PromoBannerProps = {
  title: React.ReactNode;
  text?: React.ReactNode;
  ctaLabel: React.ReactNode;
  to: string;
  emphasis?: "brand-fill" | "secondary";
  className?: string;
};

export function PromoBanner({
  title,
  text,
  ctaLabel,
  to,
  emphasis = "brand-fill",
  className,
}: PromoBannerProps) {
  const isExternal = /^https?:\/\//.test(to);
  const fill = emphasis === "brand-fill";
  return (
    <div
      data-component="PromoBanner"
      className={cn(
        "flex flex-col items-start gap-4 rounded-lg border p-6 md:flex-row md:items-center md:justify-between",
        fill
          ? "border-[hsl(var(--brand)/0.4)] bg-[hsl(var(--brand)/0.07)]"
          : "bg-secondary/50",
        className
      )}
    >
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {text ? (
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
            {text}
          </p>
        ) : null}
      </div>
      <Button asChild variant={fill ? "brand" : "secondary"} className="shrink-0">
        {isExternal ? (
          <a href={to} target="_blank" rel="noopener noreferrer">
            {ctaLabel}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        ) : (
          <Link to={to}>{ctaLabel}</Link>
        )}
      </Button>
    </div>
  );
}

/** Одиночный внешний CTA-кнопка-ссылка («Начать курс ↗») без обёртки-карточки. */
export function CtaButton({
  label,
  to,
  variant = "brand",
}: {
  label: React.ReactNode;
  to: string;
  variant?: "brand" | "default" | "outline" | "secondary";
}) {
  const isExternal = /^https?:\/\//.test(to);
  return (
    <Button asChild variant={variant}>
      {isExternal ? (
        <a href={to} target="_blank" rel="noopener noreferrer">
          {label}
          <ArrowUpRight className="h-4 w-4" />
        </a>
      ) : (
        <Link to={to}>{label}</Link>
      )}
    </Button>
  );
}
