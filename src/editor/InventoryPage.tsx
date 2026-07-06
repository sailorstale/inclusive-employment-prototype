import * as React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { routeTitles } from "@/data/nav";
import {
  TYPE_LABELS,
  typeLabel,
  trackOf,
  formatLabel,
  type InventoryBlock,
  type SemanticType,
} from "./inventory";
import { inventoryGenerated } from "./content/inventory.generated";
import { Stat, FilterBtn } from "./adminUi";

// Служебная страница «Инвентарь контента» (/inventory) — для унификации оформления.
// Группирует блоки по смысловому типу; в колонке «формат» виден разнобой
// компонентов (пример: где-то Callout, где-то Card, где-то абзац). Ссылка ведёт
// на страницу с блоком (к секции). НЕ использует Prose/ContentSection, чтобы сам
// дашборд не стал редактируемым.

type Track = "Все" | "Компании" | "НКО";

const routeLabel = (route: string) => routeTitles[route] ?? route;

export function InventoryPage() {
  const [track, setTrack] = React.useState<Track>("Все");
  const [component, setComponent] = React.useState<string>("Все");
  const [query, setQuery] = React.useState("");
  const [onlyMixed, setOnlyMixed] = React.useState(false);

  // Список компонентов для фильтра (по убыванию частоты).
  const components = React.useMemo(() => {
    const c = new Map<string, number>();
    for (const b of inventoryGenerated)
      c.set(b.component, (c.get(b.component) ?? 0) + 1);
    return [...c.entries()].sort((a, b) => b[1] - a[1]).map(([k]) => k);
  }, []);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return inventoryGenerated.filter((b) => {
      if (track !== "Все" && trackOf(b.route) !== track) return false;
      if (component !== "Все" && b.component !== component) return false;
      if (
        q &&
        !(
          b.snippet.toLowerCase().includes(q) ||
          (b.sectionTitle ?? "").toLowerCase().includes(q) ||
          routeLabel(b.route).toLowerCase().includes(q)
        )
      )
        return false;
      return true;
    });
  }, [track, component, query]);

  // Группировка по смысловому типу + разбор форматов внутри группы.
  const groups = React.useMemo(() => {
    const byType = new Map<SemanticType, InventoryBlock[]>();
    for (const b of filtered) {
      const t = b.semanticType;
      if (!byType.has(t)) byType.set(t, []);
      byType.get(t)!.push(b);
    }
    return TYPE_LABELS.filter(({ key }) => byType.has(key)).map(({ key }) => {
      const items = byType.get(key)!;
      const fmtCount = new Map<string, number>();
      for (const b of items) {
        const f = formatLabel(b);
        fmtCount.set(f, (fmtCount.get(f) ?? 0) + 1);
      }
      const formats = [...fmtCount.entries()].sort((a, b) => b[1] - a[1]);
      const majority = formats[0]?.[0];
      return { key, items, formats, mixed: formats.length > 1, majority };
    });
  }, [filtered]);

  const shown = onlyMixed ? groups.filter((g) => g.mixed) : groups;
  const mixedCount = groups.filter((g) => g.mixed).length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Инвентарь контента
        </h1>
        <p className="max-w-prose text-muted-foreground">
          Все содержательные блоки Компаний и НКО, сгруппированные по смысловому
          типу. В колонке «формат» видно, чем блок оформлен сейчас — так заметен
          разнобой (например, «пример» где-то во врезке, где-то в карточке,
          где-то просто абзацем). Ссылка ведёт на страницу с блоком.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <Stat label="блоков" value={filtered.length} />
        <Stat label="типов" value={groups.length} />
        <Stat label="с разнобоем" value={mixedCount} warn />
      </div>

      {/* Фильтры */}
      <div className="flex flex-wrap items-center gap-2">
        {(["Все", "Компании", "НКО"] as Track[]).map((t) => (
          <FilterBtn key={t} active={track === t} onClick={() => setTrack(t)}>
            {t}
          </FilterBtn>
        ))}
        <select
          value={component}
          onChange={(e) => setComponent(e.target.value)}
          className="rounded-md border bg-background px-2.5 py-1.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="Все">Компонент: все</option>
          {components.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-accent">
          <input
            type="checkbox"
            checked={onlyMixed}
            onChange={(e) => setOnlyMixed(e.target.checked)}
            className="accent-[hsl(var(--brand))]"
          />
          Только с разнобоем
        </label>
        <div className="relative ml-auto">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по тексту…"
            className="w-56 rounded-md border bg-background py-1.5 pl-8 pr-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="rounded-lg border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
          В этом фильтре пусто.
        </p>
      ) : (
        shown.map((g) => (
          <section key={g.key} className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 border-b pb-2">
              <h2 className="text-base font-semibold text-foreground">
                {typeLabel(g.key)}
              </h2>
              <span className="text-sm text-muted-foreground">
                {g.items.length}
              </span>
              {g.mixed ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--warn)/0.12)] px-2 py-0.5 text-xs font-medium text-[hsl(var(--warn))]">
                  <AlertTriangle className="h-3 w-3" /> разнобой
                </span>
              ) : null}
              <span className="ml-auto flex flex-wrap items-center gap-1.5">
                {g.formats.map(([f, n]) => (
                  <span
                    key={f}
                    className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {f} · {n}
                  </span>
                ))}
              </span>
            </div>

            <div className="divide-y rounded-lg border">
              {g.items.map((b, i) => {
                const outlier = g.mixed && formatLabel(b) !== g.majority;
                return (
                  <div
                    key={i}
                    className={cn(
                      "grid grid-cols-[10rem_minmax(0,1fr)_auto] items-start gap-3 px-3 py-2.5 text-sm",
                      outlier && "bg-[hsl(var(--warn)/0.06)]",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex w-fit items-center rounded-md px-2 py-0.5 font-mono text-xs",
                        outlier
                          ? "bg-[hsl(var(--warn)/0.15)] text-[hsl(var(--warn))]"
                          : "bg-muted text-muted-foreground",
                      )}
                      title={
                        outlier ? "Отличается от большинства в группе" : ""
                      }
                    >
                      {formatLabel(b)}
                    </span>
                    <span className="min-w-0 leading-snug text-foreground">
                      {b.snippet}
                    </span>
                    <Link
                      to={b.route}
                      state={
                        b.sectionAnchor
                          ? { anchor: b.sectionAnchor }
                          : undefined
                      }
                      className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs text-brand hover:underline"
                      title={
                        (routeLabel(b.route) || b.route) +
                        (b.sectionTitle ? " › " + b.sectionTitle : "")
                      }
                    >
                      {routeLabel(b.route)}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
