import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

// PersonaCard (00b §2.3) — карточка-портрет с раскрываемым «Краткое саммари».
// Владелец «шести историй» — только этот компонент (прогрессивное раскрытие).

type PersonaCardProps = {
  name: React.ReactNode;
  role?: React.ReactNode;
  /** Видимое сразу описание/портрет. */
  description?: React.ReactNode;
  /** Заголовок раскрываемого блока (по умолчанию «Краткое саммари»). */
  summaryLabel?: React.ReactNode;
  /** Раскрываемое содержимое. */
  summary?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

export function PersonaCard({
  name,
  role,
  description,
  summaryLabel = "Краткое саммари",
  summary,
  children,
  className,
}: PersonaCardProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-6", className)}>
      <h3 className="font-semibold leading-snug text-foreground">{name}</h3>
      {role ? (
        <p className="mt-0.5 text-sm text-muted-foreground">{role}</p>
      ) : null}
      {description ? (
        <div className="mt-2 text-sm leading-relaxed text-foreground">
          {description}
        </div>
      ) : null}
      {children}
      {summary ? (
        <Collapsible className="mt-3 border-t pt-3">
          <CollapsibleTrigger className="group flex w-full items-center justify-between gap-2 text-left text-sm font-medium text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm">
            {summaryLabel}
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="pt-3 text-sm leading-relaxed text-muted-foreground">
              {summary}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ) : null}
    </div>
  );
}
