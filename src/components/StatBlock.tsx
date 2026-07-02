import * as React from "react";
import { cn } from "@/lib/utils";
import { Editable } from "@/editor/Editable";

// StatBlock (00b §2.5) — крупное число + подпись. Факт-крючок лендинга
// и «Яндекс в цифрах». Факт-крючок принадлежит ТОЛЬКО StatBlock (не Callout).

export type Stat = { value: React.ReactNode; label: React.ReactNode };

export function StatBlock({
  stats,
  context = "stats-section",
  className,
}: {
  stats: Stat[];
  context?: "hero-hook" | "stats-section";
  className?: string;
}) {
  const cols =
    stats.length >= 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : stats.length === 3
      ? "sm:grid-cols-3"
      : "sm:grid-cols-2";
  return (
    <div
      data-component="StatBlock"
      className={cn(
        "grid grid-cols-1 gap-4",
        cols,
        context === "hero-hook" && "mt-2",
        className
      )}
    >
      {stats.map((s, i) => (
        <div key={i} className="rounded-lg border bg-card p-5">
          <div className="text-3xl font-bold tracking-tight text-brand">
            <Editable as="inline">{s.value}</Editable>
          </div>
          <div className="mt-1 text-sm leading-relaxed text-muted-foreground">
            <Editable as="inline">{s.label}</Editable>
          </div>
        </div>
      ))}
    </div>
  );
}
