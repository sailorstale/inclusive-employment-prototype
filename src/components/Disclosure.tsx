import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { cn } from "@/lib/utils";

// Disclosure (00b §2.7) — все раскрывающиеся блоки: FAQ, тренажёры
// «ситуация → варианты с вердиктами», «возражения», кризис, «11 ошибок».
// Вердикты — ДАННЫЕ из источника (бейдж внутри), не нормализуемый enum (§3.2).

export type DisclosureEntry = {
  /** Заголовок-триггер (виден сразу, без клика). */
  trigger: React.ReactNode;
  /** Опц. бейдж рядом с заголовком (вердикт / тип). */
  badge?: React.ReactNode;
  /** Раскрываемый разбор. */
  content: React.ReactNode;
};

export type DisclosureGroup = {
  label?: React.ReactNode;
  entries: DisclosureEntry[];
};

type DisclosureProps = {
  /** Плоский список ситуаций. */
  entries?: DisclosureEntry[];
  /** Сгруппированный список (для «11 ошибок» по этапам и т.п.). */
  groups?: DisclosureGroup[];
  /** single — открыт один за раз; multiple — несколько. */
  type?: "single" | "multiple";
  className?: string;
};

function renderItems(entries: DisclosureEntry[], keyPrefix: string) {
  return entries.map((entry, i) => (
    <AccordionItem key={`${keyPrefix}-${i}`} value={`${keyPrefix}-${i}`}>
      <AccordionTrigger>
        <span className="flex flex-1 items-center justify-between gap-3">
          <span>{entry.trigger}</span>
          {entry.badge ? <span className="shrink-0">{entry.badge}</span> : null}
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="max-w-prose space-y-2 leading-relaxed text-muted-foreground">
          {entry.content}
        </div>
      </AccordionContent>
    </AccordionItem>
  ));
}

export function Disclosure({
  entries,
  groups,
  type = "multiple",
  className,
}: DisclosureProps) {
  // Radix Accordion требует разные типы пропов под single/multiple.
  const accordionProps =
    type === "single"
      ? ({ type: "single" as const, collapsible: true })
      : ({ type: "multiple" as const });

  if (groups) {
    return (
      <div className={cn("space-y-6", className)}>
        {groups.map((group, gi) => (
          <div key={gi} className="space-y-1">
            {group.label ? (
              <h3 className="text-base font-semibold text-foreground">
                {group.label}
              </h3>
            ) : null}
            <Accordion {...accordionProps} className="border-t">
              {renderItems(group.entries, `g${gi}`)}
            </Accordion>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Accordion {...accordionProps} className={cn("border-t", className)}>
      {renderItems(entries ?? [], "e")}
    </Accordion>
  );
}
