import * as React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

// CompareColumns (00b §2.5) — парное противопоставление в две панели:
// «Сохраняется / Отменяется», «можно / нельзя», «Адаптация / Гиперопека», «Было / Стало».

type Column = {
  title: React.ReactNode;
  tone?: "neutral" | "good" | "bad";
  items?: React.ReactNode[];
  children?: React.ReactNode;
};

export function CompareColumns({
  left,
  right,
  className,
}: {
  left: Column;
  right: Column;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 md:grid-cols-2", className)}>
      <ComparePanel col={left} />
      <ComparePanel col={right} />
    </div>
  );
}

function ComparePanel({ col }: { col: Column }) {
  const toneRing =
    col.tone === "good"
      ? "border-[hsl(var(--ok)/0.4)]"
      : col.tone === "bad"
      ? "border-[hsl(var(--bad)/0.4)]"
      : "border-border";
  const Marker =
    col.tone === "good" ? Check : col.tone === "bad" ? X : null;
  const markerColor =
    col.tone === "good"
      ? "text-[hsl(var(--ok))]"
      : col.tone === "bad"
      ? "text-[hsl(var(--bad))]"
      : "text-muted-foreground";

  return (
    <div className={cn("rounded-lg border bg-card p-5", toneRing)}>
      <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
        {Marker ? <Marker className={cn("h-4 w-4", markerColor)} /> : null}
        {col.title}
      </h3>
      {col.items ? (
        <ul className="space-y-2 text-sm leading-relaxed">
          {col.items.map((it, i) => (
            <li key={i} className="flex gap-2">
              {Marker ? (
                <Marker className={cn("mt-1 h-4 w-4 shrink-0", markerColor)} />
              ) : (
                <span className="mt-1 text-muted-foreground">•</span>
              )}
              <span>{it}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {col.children}
    </div>
  );
}
