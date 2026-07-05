import * as React from "react";
import { ChevronDown, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Editable } from "@/editor/Editable";

// Disclosure (00 — дисциплина раскрытия) — вторичные блоки, которые МОЖНО
// сворачивать: FAQ, тренажёры «ситуация → разбор», возражения, длинные списки.
// КРИТИЧНО: на нативном <details>, чтобы свёрнутое находилось поиском по странице
// (Ctrl+F авто-раскрывает <details>) и печаталось (см. print-CSS в globals.css).
// Вердикты — ДАННЫЕ из источника (бейдж внутри), а не нормализуемый enum.
// Сверху — кнопка «Развернуть всё» (для печати и для тех, кому нужен весь текст).

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
  /** single — открыт один за раз; multiple — несколько (по умолчанию). */
  type?: "single" | "multiple";
  /** Показать кнопку «Развернуть всё» (по умолчанию да, если записей > 1). */
  showExpandAll?: boolean;
  className?: string;
};

function DetailRow({
  entry,
  open,
  onToggle,
}: {
  entry: DisclosureEntry;
  open: boolean;
  onToggle: (open: boolean) => void;
}) {
  return (
    <details
      open={open}
      onToggle={(e) => onToggle((e.currentTarget as HTMLDetailsElement).open)}
      className="border-b"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3 text-left text-sm font-medium text-foreground transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
        <span className="flex flex-1 items-center justify-between gap-3">
          <span>
            <Editable as="inline">{entry.trigger}</Editable>
          </span>
          {entry.badge ? <span className="shrink-0">{entry.badge}</span> : null}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </summary>
      <div className="max-w-prose space-y-2 pb-4 text-sm leading-relaxed text-foreground">
        <Editable as="inline">{entry.content}</Editable>
      </div>
    </details>
  );
}

export function Disclosure({
  entries,
  groups,
  type = "multiple",
  showExpandAll,
  className,
}: DisclosureProps) {
  const data: DisclosureGroup[] = groups ?? [{ entries: entries ?? [] }];
  const keys = data.flatMap((g, gi) => g.entries.map((_, ei) => `${gi}:${ei}`));
  const total = keys.length;

  const [openSet, setOpenSet] = React.useState<Set<string>>(new Set());

  const setOpen = (key: string, open: boolean) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (open) {
        if (type === "single") next.clear();
        next.add(key);
      } else {
        next.delete(key);
      }
      return next;
    });
  };

  const allOpen = total > 0 && openSet.size >= total;
  const toggleAll = () =>
    setOpenSet(allOpen ? new Set() : new Set(keys));

  const withExpandAll = showExpandAll ?? total > 1;

  return (
    <div data-component="Disclosure" className={cn("space-y-3", className)}>
      {withExpandAll ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={toggleAll}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-brand underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronsUpDown className="h-3.5 w-3.5" />
            {allOpen ? "Свернуть всё" : "Развернуть всё"}
          </button>
        </div>
      ) : null}

      {data.map((group, gi) => (
        <div key={gi} className="space-y-1">
          {group.label ? (
            <h3 className="text-base font-semibold text-foreground">
              <Editable as="inline">{group.label}</Editable>
            </h3>
          ) : null}
          <div className="border-t">
            {group.entries.map((entry, ei) => {
              const key = `${gi}:${ei}`;
              return (
                <DetailRow
                  key={key}
                  entry={entry}
                  open={openSet.has(key)}
                  onToggle={(open) => setOpen(key, open)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
