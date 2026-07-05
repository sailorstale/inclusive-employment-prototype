import * as React from "react";
import { cn } from "@/lib/utils";
import { Paragraph } from "./Prose";
import { Editable } from "@/editor/Editable";
import { AnchorScope } from "@/editor/AnchorContext";

// ContentSection (00b §2.2) — несущая рамка смыслового раздела:
// заголовок с якорем (цель оглавления) + опц. вводный абзац + вложенные блоки.
// Вводный абзац (lead) набирается ОБЫЧНЫМ стилем абзаца: крупный лид-стиль
// зарезервирован за началом страницы (PageHero).

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
  const headingClass =
    level === "h2"
      ? "text-2xl font-semibold tracking-tight"
      : level === "h3"
      ? "text-xl font-semibold tracking-tight"
      : "text-base font-semibold";

  // Вертикальный ритм: между h2-секциями 48px задаёт space-y-12 в макете.
  // Вложенные подсекции живут внутри space-y-4 родителя (16px) — этого мало,
  // подзаголовок сливается с абзацами. Даём им отдельную ступень сверху
  // (h3 — 32px, h4 — 24px); important перебивает space-y родителя.
  const topGap = level === "h3" ? "!mt-8" : level === "h4" ? "!mt-6" : "";

  return (
    <section
      id={anchor}
      data-anchor={anchor}
      data-component="ContentSection"
      className={cn("space-y-4", topGap, className)}
    >
      <AnchorScope anchor={anchor}>
        {title ? (
          <Editable
            as={level}
            className={cn("scroll-mt-20 text-foreground", headingClass)}
          >
            {title}
          </Editable>
        ) : null}
        {lead ? <Paragraph>{lead}</Paragraph> : null}
        {children}
      </AnchorScope>
    </section>
  );
}
