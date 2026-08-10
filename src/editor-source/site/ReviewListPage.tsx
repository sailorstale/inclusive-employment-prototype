import * as React from "react";
import { Link } from "react-router-dom";
import { Check, MessageSquare, Search } from "lucide-react";
import { CommentsProvider, useComments } from "@/editor-source/CommentsProvider";
import type { Comment } from "@/editor-source/comments";
import { stripMarks } from "@/editor-source/richText";
import { routeTitles } from "@/data/nav";
import { Stat, FilterBtn } from "@/editor/adminUi";
import { cn } from "@/lib/utils";
import { appliedAllFor } from "./appliedComments";
import { commentState, type CommentState } from "./commentState";

/*
  ВСЕ ЗАМЕЧАНИЯ КЛИЕНТА В ОДНОМ СПИСКЕ.

  Раньше замечания было видно только внутри страницы, к которой они оставлены.
  Чтобы понять, что осталось сделать по сайту, приходилось открывать десять
  страниц подряд и читать панель на каждой. Спланировать работу по такому обзору
  нельзя, и страницы, за которые ещё не брались, ничем себя не выдавали: на
  седьмое августа замечания были разобраны на двух страницах, а на восьми
  лежали нетронутыми, и заметить это было неоткуда.

  Список ЖИВОЙ. Он читает те же данные с сервера, что и панель на странице, и
  отдельной копии не держит: клиент оставил замечание — оно появляется здесь при
  следующем открытии страницы, без всякого переноса руками.

  Ещё он показывает замечания, которых не видно нигде больше. Страницу могли
  убрать с сайта уже после того, как клиент про неё написал: адрес
  /general/legal/faq теперь ведёт на «Договор и оформление», а шесть замечаний к
  нему остались в данных. Открыть ту страницу и увидеть их невозможно —
  единственное место, где они показываются, это здесь.
*/

/** Строка списка: замечание вместе с посчитанным исходом. */
type Row = { rec: Comment; state: CommentState };

/** Страница со своими замечаниями. */
type PageGroup = {
  slug: string;
  title: string;
  /** Страницы с таким адресом на сайте нет — её убрали после замечаний. */
  gone: boolean;
  rows: Row[];
  counts: Record<CommentState, number>;
};

type Filter = "all" | CommentState;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "open", label: "В работе" },
  { key: "round", label: "Новый раунд" },
  { key: "skipped", label: "Не применяем" },
  { key: "closed", label: "Решено" },
  { key: "done", label: "Сделано" },
];

const BADGE: Record<CommentState, { label: string; cls: string }> = {
  open: {
    label: "в работе",
    cls: "bg-[color:var(--comment-tint)] text-[color:var(--comment-line)]",
  },
  round: {
    label: "новый раунд",
    cls: "bg-[color:var(--comment-round)] text-white",
  },
  skipped: {
    label: "не применяем",
    cls: "bg-[color:var(--comment-skipped)] text-white",
  },
  closed: {
    label: "решено",
    cls: "bg-[color:var(--comment-closed)] text-white",
  },
  done: {
    label: "сделано",
    cls: "bg-[color:var(--comment-applied)] text-white",
  },
};

const emptyCounts = (): Record<CommentState, number> => ({
  open: 0,
  round: 0,
  skipped: 0,
  closed: 0,
  done: 0,
});

const fmt = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString("ru-RU") : "";

/*
  СОРТИРОВКА. Порядок нужен разный, потому что и вопросы разные.

  «Сначала непроработанные» — рабочий порядок по умолчанию: сверху то, за что
  браться. Отвечает на вопрос «что делать дальше».

  «По порядку на сайте» — тот же порядок, в каком страницы стоят в меню.
  Отвечает на вопрос «как выглядит сайт целиком» и удобен, когда идёшь по нему
  подряд вместе с клиентом.

  «Больше всего замечаний» — сверху самые обсуждаемые страницы, независимо от
  того, разобраны они или нет. Отвечает на вопрос «где больше всего спорили».
*/
type PageOrder = "work" | "site" | "size";

const PAGE_ORDERS: { key: PageOrder; label: string }[] = [
  { key: "work", label: "Сначала непроработанные" },
  { key: "site", label: "По порядку на сайте" },
  { key: "size", label: "Больше всего замечаний" },
];

/*
  Порядок замечаний внутри страницы. По умолчанию старые сверху — так читается
  история разговора. Обратный порядок нужен, когда клиент только что дописал
  новых и надо увидеть их первыми.
*/
type RowOrder = "old" | "new";

const ROW_ORDERS: { key: RowOrder; label: string }[] = [
  { key: "old", label: "Сначала старые" },
  { key: "new", label: "Сначала новые" },
];

/*
  Порядок страниц в меню сайта. Берём из того же списка названий, по которому
  список подписывает страницы: порядок ключей в нём и есть порядок сайта.
*/
const SITE_ORDER = Object.keys(routeTitles);
const siteIndex = (slug: string) => {
  const i = SITE_ORDER.indexOf(slug);
  // Страницы, которой в меню нет (её убрали), место в конце.
  return i < 0 ? SITE_ORDER.length : i;
};

const PAGE_SORT: Record<PageOrder, (a: PageGroup, b: PageGroup) => number> = {
  work: (a, b) => {
    const left = (g: PageGroup) => g.counts.round * 100 + g.counts.open;
    return left(b) - left(a) || b.rows.length - a.rows.length;
  },
  site: (a, b) => siteIndex(a.slug) - siteIndex(b.slug),
  size: (a, b) => b.rows.length - a.rows.length,
};

export function ReviewListPage() {
  /*
    Свой провайдер: список живёт вне инспектора страницы, а комментарии клиента
    лежат в отдельном потоке «review» — том же самом, что читает панель.
  */
  return (
    <CommentsProvider scope="review">
      <ReviewList />
    </CommentsProvider>
  );
}

function ReviewList() {
  const { comments, loaded, toggleClosed } = useComments();
  const [filter, setFilter] = React.useState<Filter>("all");
  const [query, setQuery] = React.useState("");
  const [pageOrder, setPageOrder] = React.useState<PageOrder>("work");
  const [rowOrder, setRowOrder] = React.useState<RowOrder>("old");

  /* Замечание без текста — это пометка удаления блока, а не разговор. */
  const rows = React.useMemo<Row[]>(
    () =>
      comments
        .filter((c) => (c.text || "").trim())
        .map((rec) => ({ rec, state: commentState(rec) })),
    [comments],
  );

  const totals = React.useMemo(() => {
    const c = emptyCounts();
    for (const r of rows) c[r.state] += 1;
    return c;
  }, [rows]);

  /*
    Поиск по словам замечания — самый дешёвый способ собрать однотипное вместе.
    Замечания клиента короткие и повторяются: «убираем» встречается два с
    половиной десятка раз по всем страницам, «в формате Важное» — шесть раз
    подряд на одной. Набрал слово — увидел всю пачку и сделал её за один заход.

    Ищем и по имени автора, и по адресу страницы: спросить «что там по НКО»
    так же естественно, как «где я просил убрать».
  */
  const groups = React.useMemo<PageGroup[]>(() => {
    const q = query.trim().toLowerCase();
    const byPage = new Map<string, Row[]>();
    for (const r of rows) {
      if (filter !== "all" && r.state !== filter) continue;
      if (
        q &&
        !`${r.rec.text} ${r.rec.author ?? ""} ${r.rec.note ?? ""} ${r.rec.page ?? ""}`
          .toLowerCase()
          .includes(q)
      )
        continue;
      const slug = r.rec.page || "";
      const list = byPage.get(slug);
      if (list) list.push(r);
      else byPage.set(slug, [r]);
    }
    return [...byPage.entries()]
      .map(([slug, list]) => {
        const counts = emptyCounts();
        for (const r of list) counts[r.state] += 1;
        return {
          slug,
          title: routeTitles[slug] ?? slug ?? "без страницы",
          gone: !routeTitles[slug],
          rows: [...list].sort((a, b) => {
            const d = (a.rec.createdAt || "").localeCompare(b.rec.createdAt || "");
            return rowOrder === "old" ? d : -d;
          }),
          counts,
        };
      })
      .sort(PAGE_SORT[pageOrder]);
  }, [rows, filter, query, pageOrder, rowOrder]);

  const shown = groups.reduce((n, g) => n + g.rows.length, 0);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-foreground">Замечания клиента</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Все замечания по всему сайту в одном месте. Список читает те же данные,
        что и панель на странице, поэтому новые замечания появляются здесь сами.
        Нажмите на замечание — откроется его страница с подсвеченным блоком.
      </p>

      {!loaded ? (
        <p className="mt-8 text-sm text-muted-foreground">Загружаем замечания…</p>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap gap-2">
            <Stat label="всего" value={rows.length} />
            <Stat label="в работе" value={totals.open} warn />
            <Stat label="новый раунд" value={totals.round} bad />
            <Stat label="не применяем" value={totals.skipped} />
            <Stat label="решено" value={totals.closed} />
            <Stat label="сделано" value={totals.done} />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => (
              <FilterBtn
                key={f.key}
                active={filter === f.key}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
                <span className="ml-1.5 text-muted-foreground">
                  {f.key === "all" ? rows.length : totals[f.key]}
                </span>
              </FilterBtn>
            ))}
            <label className="relative ml-auto">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Найти по словам замечания"
                className="w-64 rounded-md border bg-background py-1.5 pl-8 pr-2 text-sm outline-none focus:border-ring"
              />
            </label>
          </div>

          {/*
            СОРТИРОВКА — отдельной строкой под фильтрами. Порядок страниц и
            порядок замечаний внутри страницы выбираются независимо: это разные
            вопросы, и связывать их одним переключателем было бы неудобно.
          */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <label className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Страницы:</span>
              <select
                value={pageOrder}
                onChange={(e) => setPageOrder(e.target.value as PageOrder)}
                className="rounded-md border bg-background px-2 py-1 text-sm outline-none focus:border-ring"
              >
                {PAGE_ORDERS.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Замечания:</span>
              <select
                value={rowOrder}
                onChange={(e) => setRowOrder(e.target.value as RowOrder)}
                className="rounded-md border bg-background px-2 py-1 text-sm outline-none focus:border-ring"
              >
                {ROW_ORDERS.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <span className="text-muted-foreground">
              показано замечаний: {shown}
            </span>
          </div>

          {shown === 0 ? (
            <p className="mt-10 text-sm text-muted-foreground">
              Под эти условия не подходит ни одно замечание.
            </p>
          ) : (
            <div className="mt-8 space-y-8">
              {groups.map((g) => (
                <PageBlock
                  key={g.slug || "no-page"}
                  group={g}
                  onClosed={toggleClosed}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PageBlock({
  group,
  onClosed,
}: {
  group: PageGroup;
  onClosed: (id: string, closed: boolean) => void;
}) {
  return (
    <section>
      <div className="flex flex-wrap items-baseline gap-2 border-b pb-2">
        <h2 className="text-base font-semibold text-foreground">{group.title}</h2>
        {group.gone ? (
          /*
            Страницу убрали с сайта уже после замечаний. Открыть её нельзя, и
            молчать об этом нельзя тоже: иначе непонятно, почему у замечания нет
            ссылки, и выглядит как поломка.
          */
          <span className="rounded bg-[hsl(var(--bad)/0.12)] px-1.5 py-0.5 text-[11px] text-[hsl(var(--bad))]">
            такой страницы на сайте больше нет
          </span>
        ) : (
          <Link
            to={group.slug}
            className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            {group.slug}
          </Link>
        )}
        <span className="ml-auto text-xs text-muted-foreground">
          замечаний: {group.rows.length}
        </span>
      </div>

      <ul className="divide-y">
        {group.rows.map(({ rec, state }) => (
          <li key={rec.id} className="py-3">
            <CommentRow
              rec={rec}
              state={state}
              gone={group.gone}
              onClosed={onClosed}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

function CommentRow({
  rec,
  state,
  gone,
  onClosed,
}: {
  rec: Comment;
  state: CommentState;
  /** Страницы нет — переходить некуда, показываем без ссылки. */
  gone: boolean;
  onClosed: (id: string, closed: boolean) => void;
}) {
  const badge = BADGE[state];
  const rounds = appliedAllFor(rec.id);
  const note = (rec.note || "").trim();
  const replies = rec.replies ?? [];

  const head = (
    <>
      <span className="flex flex-wrap items-baseline gap-2">
        <span className="text-sm font-medium text-foreground">
          {rec.author || "без имени"}
        </span>
        <span className="text-xs text-muted-foreground">{fmt(rec.createdAt)}</span>
        {replies.length > 0 && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageSquare className="size-3" aria-hidden />
            ответов: {replies.length}
          </span>
        )}
        <span
          className={cn(
            "ml-auto shrink-0 rounded px-1.5 py-0.5 text-[11px] leading-none",
            badge.cls,
          )}
        >
          {badge.label}
        </span>
      </span>
      <span className="mt-1 block whitespace-pre-wrap text-sm text-foreground">
        {rec.text}
      </span>
      {/* Снимок блока, о котором писали, — иначе короткое «убираем» ни о чём. */}
      {rec.original ? (
        <span className="mt-1 line-clamp-2 block text-xs italic text-muted-foreground">
          {stripMarks(rec.original)}
        </span>
      ) : null}
    </>
  );

  return (
    <div className="space-y-1.5">
      {gone ? (
        <div>{head}</div>
      ) : (
        /*
          Ссылка на страницу с опознавателем замечания: страница откроет панель
          и подведёт к нужному блоку сама (см. SiteInspector).
        */
        <Link
          to={`${rec.page}?c=${encodeURIComponent(rec.id)}`}
          className="block rounded-md transition-colors hover:bg-accent/50"
        >
          {head}
        </Link>
      )}

      {/* Что мы ответили клиенту — коротко, одной строкой на раунд. */}
      {rounds.map((r, i) => (
        <p
          key={r.date + i}
          className="rounded border border-[color:var(--comment-applied)]/40 bg-[color:var(--comment-applied-tint)] px-2 py-1 text-xs text-foreground"
        >
          {rounds.length > 1 ? `Раунд ${i + 1}. ` : ""}
          {r.what}
        </p>
      ))}

      {note && (
        <p className="rounded border border-[hsl(var(--warn)/0.4)] bg-[hsl(var(--warn)/0.08)] px-2 py-1 text-xs text-foreground">
          Решение дизайнера: {note}
        </p>
      )}

      {/* Последний ответ клиента — самое свежее, что он сказал по теме. */}
      {replies.length > 0 && (
        <p className="rounded border border-[color:var(--comment-round)]/40 bg-[color:var(--comment-round-tint)] px-2 py-1 text-xs text-foreground">
          {replies[replies.length - 1].author || "без имени"} ответил:{" "}
          {replies[replies.length - 1].text}
        </p>
      )}

      {/*
        «РЕШЕНО» прямо из общего списка — здесь и разбирают очередь, поэтому
        ходить ради одной кнопки на страницу незачем.

        У сделанного замечания кнопки нет: правка внесена и опубликована, спор
        закончен. У решённого кнопка возвращает его обратно в очередь.
      */}
      {state !== "done" && (
        <button
          type="button"
          onClick={() => onClosed(rec.id, state !== "closed")}
          title={
            state === "closed"
              ? "Вернуть замечание в очередь"
              : "Вопрос закрыт — убрать замечание из очереди"
          }
          className={cn(
            "flex items-center gap-1 rounded border px-2 py-0.5 text-xs transition-colors",
            state === "closed"
              ? "border-[color:var(--comment-closed)] text-[color:var(--comment-closed)]"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Check className="size-3.5" aria-hidden />
          {state === "closed" ? "Вернуть в очередь" : "Решено"}
        </button>
      )}
    </div>
  );
}
