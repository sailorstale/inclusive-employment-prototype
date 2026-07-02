import { cn } from "@/lib/utils";
import { scrollToId, anchorId } from "@/lib/scroll";

// TableOfContents (00b §2.1) — список ссылок-якорей на секции той же страницы.
// Маршрут не меняется → клик прокручивает к секции программно.

export type TocItem = { label: string; anchor: string };

export function TableOfContents({
  items,
  className,
}: {
  items: TocItem[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Содержание страницы"
      data-component="TableOfContents"
      className={cn(
        "rounded-lg border bg-muted/30 p-5",
        className
      )}
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        На этой странице
      </p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.anchor}>
            <button
              type="button"
              onClick={() => scrollToId(anchorId(item.anchor))}
              className="text-left text-sm text-brand underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
