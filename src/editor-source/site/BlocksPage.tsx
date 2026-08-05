import * as React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Stat, FilterBtn } from "@/editor/adminUi";
import {
  buildBlockIndex,
  BLOCK_KINDS,
  KIND_LABEL,
  type BlockKind,
  type BlockRef,
} from "./blockIndex";

/*
  КАРТА БЛОКОВ (/blocks) — меню по всем карточкам, квизам, цитатам, заготовкам,
  видео и картинкам сайта.

  Зачем: однотипные блоки разбросаны по двадцати семи страницам, и разнобой в
  оформлении виден, только когда они лежат рядом. Отсюда можно перейти к любому
  блоку — ссылка ведёт на страницу и прокручивает к ближайшему заголовку.

  Страница служебная, поэтому собрана из простых элементов админ-экранов
  (те же плашки и фильтры, что в «Инвентаре»), а не из компонентов сайта.
*/

export function BlocksPage() {
  const [all, setAll] = React.useState<BlockRef[] | null>(null);
  const [err, setErr] = React.useState<string | null>(null);
  const [kind, setKind] = React.useState<BlockKind | "Все">("Все");
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    let alive = true;
    buildBlockIndex()
      .then((rows) => alive && setAll(rows))
      .catch((e) => alive && setErr(String(e)));
    return () => {
      alive = false;
    };
  }, []);

  const counts = React.useMemo(() => {
    const c = new Map<BlockKind, number>();
    for (const b of all ?? []) c.set(b.kind, (c.get(b.kind) ?? 0) + 1);
    return c;
  }, [all]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return (all ?? []).filter((b) => {
      if (kind !== "Все" && b.kind !== kind) return false;
      if (!q) return true;
      return (
        b.label.toLowerCase().includes(q) ||
        b.page.toLowerCase().includes(q) ||
        b.section.toLowerCase().includes(q)
      );
    });
  }, [all, kind, query]);

  // Внутри выбранного типа группируем по страницам — так список читается.
  const groups = React.useMemo(() => {
    const byKind = new Map<BlockKind, BlockRef[]>();
    for (const b of filtered) {
      if (!byKind.has(b.kind)) byKind.set(b.kind, []);
      byKind.get(b.kind)!.push(b);
    }
    return BLOCK_KINDS.filter((k) => byKind.has(k)).map((k) => ({
      kind: k,
      items: byKind.get(k)!,
    }));
  }, [filtered]);

  if (err)
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-[hsl(var(--bad))]">
        Не удалось собрать карту блоков: {err}
      </div>
    );

  if (!all)
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-muted-foreground">
        Собираем страницы сайта…
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Карта блоков
        </h1>
        <p className="max-w-prose text-muted-foreground">
          Все карточки, квизы, цитаты, заготовки «Скопировать», видео и картинки
          сайта в одном списке. Ссылка ведёт на страницу и прокручивает к
          ближайшему заголовку над блоком.
        </p>
      </header>

      {/* Счётчики показывают ВСЕГО, а не отфильтрованное: иначе первая плашка
          менялась вместе с фильтром и читалась как общее число. Сколько сейчас
          в списке — видно в заголовке группы. */}
      <div className="flex flex-wrap items-center gap-2">
        <Stat label="блоков всего" value={all.length} />
        {BLOCK_KINDS.map((k) => (
          <Stat key={k} label={KIND_LABEL[k].toLowerCase()} value={counts.get(k) ?? 0} />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterBtn active={kind === "Все"} onClick={() => setKind("Все")}>
          Все
        </FilterBtn>
        {BLOCK_KINDS.map((k) => (
          <FilterBtn key={k} active={kind === k} onClick={() => setKind(k)}>
            {KIND_LABEL[k]}
          </FilterBtn>
        ))}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по подписи, странице, разделу"
          className="min-w-[16rem] flex-1 rounded-md border bg-background px-2.5 py-1.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {groups.length === 0 ? (
        <p className="text-muted-foreground">Ничего не нашлось.</p>
      ) : (
        groups.map(({ kind: k, items }) => (
          <section key={k} className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">
              {KIND_LABEL[k]}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                · {items.length}
              </span>
            </h2>
            <ul className="divide-y rounded-md border">
              {items.map((b, i) => (
                <li key={`${b.slug}-${b.anchor}-${i}`}>
                  <Link
                    to={b.slug}
                    state={b.anchor ? { anchor: b.anchor } : undefined}
                    className="group flex items-start gap-3 px-3 py-2.5 hover:bg-muted/50"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-foreground">
                        {b.label || <span className="text-muted-foreground">без подписи</span>}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {b.page}
                        {b.section ? ` · ${b.section}` : ""}
                      </span>
                    </span>
                    <ArrowRight className="mt-0.5 size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
