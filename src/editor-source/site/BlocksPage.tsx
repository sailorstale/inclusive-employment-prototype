import * as React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Stat, FilterBtn } from "@/editor/adminUi";
import {
  buildBlockIndex,
  buildDocLinks,
  BLOCK_KINDS,
  KIND_LABEL,
  type BlockKind,
  type BlockRef,
  type DocPlace,
} from "./blockIndex";

/*
  КАРТА БЛОКОВ (/blocks) — меню по всем карточкам, квизам, цитатам, заготовкам,
  таблицам, видео и картинкам сайта.

  Зачем: однотипные блоки разбросаны по двадцати семи страницам, и разнобой в
  оформлении виден, только когда они лежат рядом. Отсюда можно перейти к любому
  блоку — ссылка ведёт на страницу, прокручивает прямо к нему и подсвечивает
  его вспышкой.

  Страница служебная, поэтому собрана из простых элементов админ-экранов
  (те же плашки и фильтры, что в «Инвентаре»), а не из компонентов сайта.

  ВТОРОЙ ВИД — «ЯНДЕКС ДИСК». Дополнительные материалы переехали с гугл-доков
  на Диск заказчика, и адреса на сайте подменяются на лету (см. yandexDisk).
  Проверить такую подмену иначе как обойдя двадцать девять страниц было бы
  нечем, поэтому здесь список всех переехавших документов: название, рабочая
  ссылка на новый адрес и страницы, где документ открывается.

  Список считается по СОБРАННОМУ САЙТУ, поэтому он же служит проверкой: пустая
  строка «на сайте не стоит» значит, что документа на страницах нет.
*/

export function BlocksPage() {
  const [all, setAll] = React.useState<BlockRef[] | null>(null);
  const [err, setErr] = React.useState<string | null>(null);
  const [kind, setKind] = React.useState<BlockKind | "Все">("Все");
  const [query, setQuery] = React.useState("");
  const [vid, setVid] = React.useState<"blocks" | "docs">("blocks");
  const [docs, setDocs] = React.useState<DocPlace[] | null>(null);

  React.useEffect(() => {
    let alive = true;
    buildBlockIndex()
      .then((rows) => alive && setAll(rows))
      .catch((e) => alive && setErr(String(e)));
    buildDocLinks()
      .then((rows) => alive && setDocs(rows))
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
          Все карточки, квизы, цитаты, заготовки «Скопировать», таблицы, видео и
          картинки сайта в одном списке. Ссылка ведёт на страницу, прокручивает
          прямо к блоку и подсвечивает его.
        </p>
      </header>

      {/* Счётчики показывают ВСЕГО, а не отфильтрованное: иначе первая плашка
          менялась вместе с фильтром и читалась как общее число. Сколько сейчас
          в списке — видно в заголовке группы. */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterBtn active={vid === "blocks"} onClick={() => setVid("blocks")}>
          Блоки сайта
        </FilterBtn>
        <FilterBtn active={vid === "docs"} onClick={() => setVid("docs")}>
          Яндекс Диск
        </FilterBtn>
      </div>

      {vid === "docs" ? (
        <DocsList docs={docs} />
      ) : (
        <>
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
                <li key={`${b.slug}-${b.path}-${i}`}>
                  <Link
                    to={b.slug}
                    state={{ block: b.path, anchor: b.anchor || undefined }}
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
        </>
      )}
    </div>
  );
}

/*
  СПИСОК ПЕРЕЕХАВШИХ ДОКУМЕНТОВ. Каждая строка — рабочая ссылка на новый адрес
  и страницы, где документ открывается на сайте.

  Страницы считаются по собранному сайту, поэтому «на сайте не стоит» — это не
  недосмотр списка, а факт: такого документа на страницах нет. У шести
  материалов так и есть, разбор каждого лежит в «Сверка ссылок на доп
  материалы.md» в корне репозитория.
*/
function DocsList({ docs }: { docs: DocPlace[] | null }) {
  if (!docs)
    return <p className="text-muted-foreground">Считаем страницы сайта…</p>;

  const naSajte = docs.filter((d) => d.pages.length);
  const bez = docs.filter((d) => !d.pages.length);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Stat label="документов в таблице" value={docs.length} />
        <Stat label="стоят на сайте" value={naSajte.length} />
        <Stat label="на сайт не вышли" value={bez.length} />
      </div>

      <p className="max-w-prose text-sm text-muted-foreground">
        Дополнительные материалы переехали с Гугл-доков на Яндекс Диск
        заказчика. Адреса подменяются при сборке страницы, сам текст не
        меняется. Ссылка открывает новый адрес в отдельной вкладке.
      </p>

      {[
        { title: "Стоят на сайте", items: naSajte },
        { title: "На сайт не вышли", items: bez },
      ]
        .filter((g) => g.items.length)
        .map((g) => (
          <div key={g.title} className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">
              {g.title}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                · {g.items.length}
              </span>
            </h2>
            <ul className="divide-y rounded-md border">
              {g.items.map((d) => (
                <li
                  key={`${d.docId}-${d.href}`}
                  className="flex items-start gap-3 px-3 py-2.5"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-foreground">{d.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {d.pages.length
                        ? d.pages.map((p) => p.title).join(" · ")
                        : "на сайте не стоит"}
                    </span>
                  </span>
                  <a
                    href={d.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs font-medium text-brand transition-colors hover:underline"
                  >
                    Открыть <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
    </section>
  );
}
