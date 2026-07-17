import * as React from "react";
import { cn } from "@/lib/utils";

/*
  Figma: component set «Heading» (6112:44676), свойство Heading = H2 | H3 | H4 | H5.

  Заголовок раздела внутри страницы. H1 в наборе НЕТ — главный заголовок
  страницы живёт в Hero и отдельным компонентом не ставится.

  Важно про отступы (так в Figma): у H2 верхнего отступа нет вовсе — воздух
  перед крупным разделом даёт Section Container своим паддингом 56. У H3–H5
  верхний отступ 24 свой. Нижних отступов нет ни у кого.
*/

export type HeadingLevel = "H2" | "H3" | "H4" | "H5";

const STYLE: Record<HeadingLevel, string> = {
  H2: "ds-h2", // 40/1.0
  H3: "ds-h3", // 26/1.05
  H4: "ds-h4", // 22/1.1
  H5: "ds-h5", // 20/1.1
};

const PAD_TOP: Record<HeadingLevel, string> = {
  H2: "pt-0",
  H3: "pt-[var(--space-l)]",
  H4: "pt-[var(--space-l)]",
  H5: "pt-[var(--space-l)]",
};

type Props = {
  level?: HeadingLevel;
  children?: React.ReactNode;
  /** Якорь для оглавления (TableOfContents ссылается на него). */
  id?: string;
  className?: string;
};

export function Heading({ level = "H2", children, id, className }: Props) {
  const Tag = level.toLowerCase() as "h2" | "h3" | "h4" | "h5";

  return (
    <div
      data-component={`Heading · ${level}`}
      className={cn("w-full", PAD_TOP[level], className)}
    >
      <Tag
        id={id}
        className={cn(
          STYLE[level],
          "scroll-mt-24 text-[color:var(--text-primary)]",
        )}
      >
        {children}
      </Tag>
    </div>
  );
}
