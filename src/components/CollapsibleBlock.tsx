import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// CollapsibleBlock (00 — дисциплина раскрытия) — одиночный «свёрнуто под клик»
// блок с самодостаточным заголовком (таблицы/каталоги, которые ищут точечно).
// Нативный <details>: находится Ctrl+F и печатается (print-CSS в globals.css).

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
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
      className={cn("group rounded-lg border", className)}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-left font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </summary>
      <div className="border-t p-4">{children}</div>
    </details>
  );
}
