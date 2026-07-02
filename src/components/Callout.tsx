import * as React from "react";
import {
  Info,
  ClipboardList,
  TriangleAlert,
  Hammer,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Editable } from "@/editor/Editable";

// Callout (00b §2.6) — редакционная врезка, закрытый список 5 вариантов.
// Не затаскивать сюда факт-крючок (→ StatBlock), цитаты (→ Blockquote), полки.

export type CalloutVariant =
  | "info"
  | "briefing"
  | "warning"
  | "wip"
  | "highlight";

const config: Record<
  CalloutVariant,
  { icon: React.ElementType; box: string; iconColor: string }
> = {
  info: {
    icon: Info,
    box: "border-border bg-muted/50",
    iconColor: "text-muted-foreground",
  },
  briefing: {
    icon: ClipboardList,
    box: "border-border bg-secondary/60",
    iconColor: "text-foreground",
  },
  warning: {
    icon: TriangleAlert,
    box: "border-[hsl(var(--warn)/0.4)] bg-[hsl(var(--warn)/0.10)]",
    iconColor: "text-[hsl(var(--warn))]",
  },
  wip: {
    icon: Hammer,
    box: "border-dashed border-border bg-muted/40",
    iconColor: "text-muted-foreground",
  },
  highlight: {
    icon: Sparkles,
    box: "border-[hsl(var(--brand)/0.4)] bg-[hsl(var(--brand)/0.07)]",
    iconColor: "text-brand",
  },
};

type CalloutProps = {
  variant?: CalloutVariant;
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** Скрыть иконку (например, для чисто текстовой пометки). */
  hideIcon?: boolean;
  className?: string;
};

export function Callout({
  variant = "info",
  title,
  children,
  hideIcon,
  className,
}: CalloutProps) {
  const { icon: Icon, box, iconColor } = config[variant];
  return (
    <div
      data-component="Callout"
      className={cn(
        "max-w-prose rounded-lg border p-4 text-sm leading-relaxed",
        box,
        className
      )}
    >
      <div className="flex gap-3">
        {!hideIcon && (
          <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", iconColor)} />
        )}
        <div className="min-w-0 space-y-2">
          {title ? (
            <div className="font-semibold text-foreground">
              <Editable as="inline">{title}</Editable>
            </div>
          ) : null}
          {children ? <div className="space-y-2">{children}</div> : null}
        </div>
      </div>
    </div>
  );
}
