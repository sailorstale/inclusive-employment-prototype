import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

// Блок «свёрнуто под клик» с самодостаточным заголовком-триггером
// (таблицы и второстепенные каталоги, которые ищут точечно — см. хаб 10).

export function CollapsibleBlock({
  title,
  defaultOpen = false,
  children,
  className,
}: {
  title: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Collapsible
      defaultOpen={defaultOpen}
      className={cn("rounded-lg border", className)}
    >
      <CollapsibleTrigger className="group flex w-full items-center justify-between gap-3 px-4 py-3 text-left font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset">
        {title}
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="border-t p-4">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}
