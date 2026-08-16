import * as React from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Search } from "lucide-react";
import type { Comment } from "@/editor-source/comments";
import { stripMarks } from "@/editor-source/richText";
import { routeTitles } from "@/data/nav";
import { cn } from "@/lib/utils";
import { commentState, isClosed, type CommentState } from "./commentState";
import {
  countFilters,
  matchesFilter,
  FilterChips,
  type CommentFilter,
} from "./commentFilters";

/*
  ВСЕ ЗАМЕЧАНИЯ САЙТА ПРЯМО В ПАНЕЛИ.

  Панель показывает замечания одной страницы — той, что открыта. Пока работаешь
  по странице, это ровно то, что нужно. А вот когда ищешь конкретное замечание
  («где-то клиент просил убрать заголовок «пример»») или разбираешь однотипные
  подряд по всему сайту, страничный список мешает: надо помнить, на какой
  странице что лежит, и открывать их по очереди.

  Поэтому у панели два состояния. «Эта страница» — обычная работа. «Все
  комментарии» — весь сайт одним списком, с поиском по словам замечания.
  Нажатие на замечание чужой страницы открывает ту страницу и подводит к
  нужному блоку: адрес несёт опознаватель замечания, а встречает его инспектор
  (см. SiteInspector, переход по ссылке из общего списка).

  Отдельная страница /review никуда не делась и остаётся местом, где замечания
  планируют: там широкая раскладка, сортировки и решения дизайнера. Здесь —
  быстрый поиск и переход, не уходя из инструмента.
*/

/** Страница со своими замечаниями. */
type PageGroup = {
  slug: string;
  title: string;
  /** Страницы с таким адресом на сайте больше нет — переходить некуда. */
  gone: boolean;
  rows: Comment[];
};

const BADGE: Record<CommentState, { label: string; cls: string }> = {
  open: {
    label: "в работе",
    cls: "bg-[color:var(--comment-tint)] text-[color:var(--comment-line)]",
  },
  round: { label: "новый раунд", cls: "bg-[color:var(--comment-round)] text-white" },
  skipped: { label: "не применяем", cls: "bg-[color:var(--comment-skipped)] text-white" },
  done: { label: "сделано", cls: "bg-[color:var(--comment-applied)] text-white" },
};

/*
  Порядок страниц — тот же, в каком они стоят в меню сайта: список названий
  перечисляет их сверху вниз. Идти по замечаниям в порядке сайта естественнее,
  чем в порядке, в каком клиент их писал.
*/
const SITE_ORDER = Object.keys(routeTitles);
const siteIndex = (slug: string) => {
  const i = SITE_ORDER.indexOf(slug);
  // Страницы, которой в меню нет (её убрали), место в конце.
  return i < 0 ? SITE_ORDER.length : i;
};

export function AllComments({
  comments,
  page,
  activeId,
  onGoTo,
}: {
  /** Все замечания сайта — тот же поток, что читает панель страницы. */
  comments: Comment[];
  /** Адрес открытой страницы: её замечания открываются без перехода. */
  page: string;
  activeId: string | null;
  /** Подвести открытую страницу к блоку замечания. */
  onGoTo: (id: string) => void;
}) {
  const [filter, setFilter] = React.useState<CommentFilter>("all");
  const [query, setQuery] = React.useState("");

  /* Замечание без текста — это пометка удаления блока, а не разговор. */
  const rows = React.useMemo(
    () => comments.filter((c) => (c.text || "").trim()),
    [comments],
  );

  const counts = React.useMemo(() => countFilters(rows), [rows]);

  /*
    Поиск по словам замечания — самый дешёвый способ собрать однотипное вместе.
    Замечания клиента короткие и повторяются: «убираем» встречается два с
    половиной десятка раз по всем страницам. Набрал слово — увидел всю пачку.

    Ищем и по имени автора, и по адресу страницы: спросить «что там по НКО» так
    же естественно, как «где я просил убрать».
  */
  const groups = React.useMemo<PageGroup[]>(() => {
    const q = query.trim().toLowerCase();
    const byPage = new Map<string, Comment[]>();
    for (const rec of rows) {
      if (!matchesFilter(rec, filter)) continue;
      if (
        q &&
        !`${rec.text} ${rec.author ?? ""} ${rec.note ?? ""} ${rec.page ?? ""} ${
          routeTitles[rec.page ?? ""] ?? ""
        }`
          .toLowerCase()
          .includes(q)
      )
        continue;
      const slug = rec.page || "";
      const list = byPage.get(slug);
      if (list) list.push(rec);
      else byPage.set(slug, [rec]);
    }
    return [...byPage.entries()]
      .map(([slug, list]) => ({
        slug,
        title: routeTitles[slug] ?? slug ?? "без страницы",
        gone: !routeTitles[slug],
        rows: [...list].sort((a, b) =>
          (a.createdAt || "").localeCompare(b.createdAt || ""),
        ),
      }))
      .sort((a, b) => siteIndex(a.slug) - siteIndex(b.slug));
  }, [rows, filter, query]);

  const shown = groups.reduce((n, g) => n + g.rows.length, 0);

  /*
    Выбранное замечание подводим к глазам — как в списке страницы. «nearest»
    вместо «center»: если карточка и так на виду, список не дёргается.
  */
  const activeRef = React.useRef<HTMLLIElement | null>(null);
  React.useEffect(() => {
    if (activeId) activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [activeId, groups]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b p-3">
        <label className="relative block">
          <Search
            className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Найти по словам замечания"
            className="w-full rounded-md border bg-background py-1 pl-7 pr-2 text-xs outline-none focus:border-ring"
          />
        </label>
        {/*
          Сколько замечаний осталось после поиска. Цифры на кнопках-группах
          считают весь сайт и от слова в поиске не меняются — без этой строки
          выходило бы, что в группе тридцать четыре замечания, а видно два.
        */}
        {query.trim() && (
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            найдено: {shown}
          </p>
        )}
      </div>

      <FilterChips filter={filter} counts={counts} onPick={setFilter} />

      <div className="min-h-0 flex-1 overflow-y-auto">
        {shown === 0 ? (
          <p className="p-3 text-xs text-muted-foreground">
            {query.trim()
              ? "По этим словам замечаний не нашлось."
              : "В этой группе замечаний нет."}
          </p>
        ) : (
          groups.map((g) => (
            <section key={g.slug || "no-page"}>
              {/*
                Название страницы прилипает к верху списка: замечаний по сайту
                несколько сотен, и без этой строки на середине прокрутки
                непонятно, о какой странице сейчас речь.
              */}
              <h3 className="sticky top-0 z-10 flex items-baseline gap-1.5 border-y bg-muted/95 px-3 py-1.5 backdrop-blur">
                <span className="truncate text-[11px] font-semibold text-foreground">
                  {g.title}
                </span>
                {g.slug === page && (
                  <span className="shrink-0 text-[10px] text-muted-foreground">
                    эта страница
                  </span>
                )}
                {g.gone && (
                  <span className="shrink-0 text-[10px] text-[hsl(var(--bad))]">
                    страницы нет
                  </span>
                )}
                <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
                  {g.rows.length}
                </span>
              </h3>
              <ul className="divide-y">
                {g.rows.map((rec) => (
                  <li
                    key={rec.id}
                    ref={rec.id === activeId ? activeRef : undefined}
                    className={cn(
                      "border-l-2 transition-colors",
                      rec.id === activeId
                        ? "border-l-[color:var(--comment-line)] bg-accent/60"
                        : "border-l-transparent",
                    )}
                  >
                    <CommentCard
                      rec={rec}
                      here={g.slug === page}
                      gone={g.gone}
                      onGoTo={onGoTo}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}

/*
  ОДНО ЗАМЕЧАНИЕ В ОБЩЕМ СПИСКЕ.

  Замечание своей страницы открываем на месте — страница уже перед глазами,
  уводить с неё некуда. Чужое замечание открывает свою страницу: адрес несёт
  опознаватель, а подводит к блоку сам инспектор.

  Страницу могли убрать с сайта уже после замечания. Тогда переходить некуда, и
  молчать об этом нельзя: иначе выглядит как поломка ссылки.
*/
function CommentCard({
  rec,
  here,
  gone,
  onGoTo,
}: {
  rec: Comment;
  /** Замечание открытой страницы. */
  here: boolean;
  gone: boolean;
  onGoTo: (id: string) => void;
}) {
  const badge = BADGE[commentState(rec)];
  const closed = isClosed(rec);
  const replies = rec.replies ?? [];
  const note = (rec.note || "").trim();

  const body = (
    <>
      <span className="flex items-baseline gap-1.5">
        <span className="truncate font-medium text-foreground">
          {rec.author || "без имени"}
        </span>
        {replies.length > 0 && (
          <span className="flex shrink-0 items-center gap-0.5 text-[11px] text-muted-foreground">
            <MessageSquare className="size-3" aria-hidden />
            {replies.length}
          </span>
        )}
        <span
          className={cn(
            "ml-auto shrink-0 rounded px-1 py-0.5 text-[10px] leading-none",
            badge.cls,
          )}
        >
          {badge.label}
        </span>
      </span>
      <span className="mt-1 block whitespace-pre-wrap text-foreground">{rec.text}</span>
      {/* Снимок блока, о котором писали, — иначе короткое «убираем» ни о чём. */}
      {rec.original ? (
        <span className="mt-1 line-clamp-2 block italic text-muted-foreground">
          {stripMarks(rec.original)}
        </span>
      ) : null}
      {note && (
        <span className="mt-1 block rounded border border-[hsl(var(--warn)/0.4)] bg-[hsl(var(--warn)/0.08)] px-1.5 py-1 text-[11px] text-foreground">
          Решение дизайнера: {note}
        </span>
      )}
      {closed && (
        <span className="mt-1 block text-[11px] text-[color:var(--comment-closed)]">
          убрано в «Решено»
        </span>
      )}
    </>
  );

  const cls = "block w-full p-3 text-left text-xs";

  if (gone)
    return (
      <div className={cls}>
        {body}
        <span className="mt-1 block text-[11px] text-[hsl(var(--bad))]">
          Такой страницы на сайте больше нет — перейти к блоку нельзя.
        </span>
      </div>
    );

  if (here)
    return (
      <button type="button" onClick={() => onGoTo(rec.id)} className={cls}>
        {body}
      </button>
    );

  return (
    <Link
      to={`${rec.page}?c=${encodeURIComponent(rec.id)}`}
      title="Открыть страницу замечания и подвести к блоку"
      className={cn(cls, "transition-colors hover:bg-accent/50")}
    >
      {body}
    </Link>
  );
}
