import * as React from "react";
import { cn } from "@/lib/utils";
import { SmartLink } from "./SmartLink";
import { Editable } from "@/editor/Editable";

// Blockquote (00b §2.6) — цитата-кейс или именная цитата: текст + атрибуция
// (+ опц. «Подробнее»). Отдельно от Callout — это голос/источник, а не врезка.

type BlockquoteProps = {
  children: React.ReactNode;
  /** Атрибуция (курсивом под цитатой). */
  attribution?: React.ReactNode;
  /** Пояснение к атрибуции (мелким приглушённым). */
  note?: React.ReactNode;
  /** Ссылка «Подробнее». */
  moreTo?: string;
  moreLabel?: React.ReactNode;
  className?: string;
};

export function Blockquote({
  children,
  attribution,
  note,
  moreTo,
  moreLabel = "Подробнее",
  className,
}: BlockquoteProps) {
  return (
    <figure
      data-component="Blockquote"
      className={cn(
        "max-w-prose border-l-2 border-brand pl-5",
        className
      )}
    >
      <blockquote className="text-base leading-relaxed text-foreground">
        <Editable as="inline">{children}</Editable>
      </blockquote>
      {(attribution || note || moreTo) && (
        <figcaption className="mt-2 space-y-0.5 text-sm text-muted-foreground">
          {attribution ? (
            <div className="italic">
              <Editable as="inline">{attribution}</Editable>
            </div>
          ) : null}
          {note ? <div className="text-[0.8125rem]">{note}</div> : null}
          {moreTo ? (
            <div>
              <SmartLink to={moreTo}>{moreLabel}</SmartLink>
            </div>
          ) : null}
        </figcaption>
      )}
    </figure>
  );
}
