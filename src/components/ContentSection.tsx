import * as React from "react";
import { cn } from "@/lib/utils";
import { Lead } from "./Prose";

// ContentSection (00b §2.2) — несущая рамка смыслового раздела:
// заголовок с якорем (цель оглавления) + опц. лид + вложенные блоки.

type ContentSectionProps = {
  /** id-якорь для оглавления / прямых ссылок. */
  anchor?: string;
  title?: React.ReactNode;
  level?: "h2" | "h3" | "h4";
  lead?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

export function ContentSection({
  anchor,
  title,
  level = "h2",
  lead,
  children,
  className,
}: ContentSectionProps) {
  const Heading = level;
  const headingClass =
    level === "h2"
      ? "text-2xl font-semibold tracking-tight"
      : level === "h3"
      ? "text-xl font-semibold"
      : "text-base font-semibold";

  return (
    <section id={anchor} data-anchor={anchor} className={cn("space-y-4", className)}>
      {title ? (
        <Heading className={cn("scroll-mt-20 text-foreground", headingClass)}>
          {title}
        </Heading>
      ) : null}
      {lead ? <Lead>{lead}</Lead> : null}
      {children}
    </section>
  );
}
