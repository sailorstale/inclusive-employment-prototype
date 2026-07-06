import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Базовый примитив бейджа. Семантические варианты-вердикты (ok/warn/bad)
// используют статусные токены как фон-плашку + бордер, текст — словом.
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold leading-normal transition-colors focus:outline-none",
  {
    variants: {
      tone: {
        neutral: "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border text-foreground",
        brand: "border-transparent bg-brand text-brand-foreground",
        ok: "border-[hsl(var(--ok)/0.4)] bg-[hsl(var(--ok)/0.12)] text-[hsl(var(--ok))]",
        warn: "border-[hsl(var(--warn)/0.4)] bg-[hsl(var(--warn)/0.12)] text-[hsl(var(--warn))]",
        bad: "border-[hsl(var(--bad)/0.4)] bg-[hsl(var(--bad)/0.12)] text-[hsl(var(--bad))]",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export { Badge, badgeVariants };
