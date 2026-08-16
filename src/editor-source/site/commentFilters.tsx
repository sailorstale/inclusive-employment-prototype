import * as React from "react";
import type { Comment } from "@/editor-source/comments";
import { commentState, isClosed, type CommentState } from "./commentState";
import { cn } from "@/lib/utils";

/*
  ГРУППЫ СПИСКА ЗАМЕЧАНИЙ — одни и те же в панели страницы и в списке по всему
  сайту.

  На странице замечания разного возраста лежат вперемешку: сделанные, отложенные
  и те, за которые ещё браться. Кнопки сверху оставляют в списке одну группу —
  например только «не применяем», чтобы разобрать их подряд.

  «Решено» стоит в том же ряду, но означает другое: не исход, а «убрано с глаз».
  Все остальные группы показывают только актуальное — убранное в них не мешает.

  Правило отбора и подсчёт лежат здесь, а не в каждом списке отдельно: разойдись
  они, и один список считал бы убранное замечание сделанным, а другой — нет.
*/
export type CommentFilter = "all" | CommentState | "closed";

export const COMMENT_FILTERS: { key: CommentFilter; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "open", label: "В работе" },
  { key: "round", label: "Новый раунд" },
  { key: "skipped", label: "Не применяем" },
  { key: "closed", label: "Решено" },
  { key: "done", label: "Сделано" },
];

/** Показываем ли замечание в выбранной группе. */
export function matchesFilter(rec: Comment, filter: CommentFilter): boolean {
  if (filter === "closed") return isClosed(rec);
  if (isClosed(rec)) return false;
  return filter === "all" || commentState(rec) === filter;
}

export type CommentCounts = Record<CommentFilter, number>;

/*
  Сколько замечаний в каждой группе. Убранное с глаз считаем отдельно и в исходы
  не подмешиваем: «в работе 33» должно значить тридцать три дела, а не тридцать
  три минус спрятанные.
*/
export function countFilters(recs: Comment[]): CommentCounts {
  const c: CommentCounts = { all: 0, open: 0, round: 0, skipped: 0, closed: 0, done: 0 };
  for (const rec of recs) {
    if (isClosed(rec)) c.closed += 1;
    else {
      c.all += 1;
      c[commentState(rec)] += 1;
    }
  }
  return c;
}

/*
  Ряд кнопок-групп. Мелкий: обе колонки, где он стоит, узкие — семнадцать
  символов в строке, и обычные кнопки заняли бы весь экран.
*/
export function FilterChips({
  filter,
  counts,
  onPick,
}: {
  filter: CommentFilter;
  counts: CommentCounts;
  onPick: (filter: CommentFilter) => void;
}) {
  return (
    <div className="flex shrink-0 flex-wrap gap-1 border-b px-3 py-2">
      {COMMENT_FILTERS.map((f) => {
        const n = counts[f.key];
        const active = filter === f.key;
        return (
          <button
            key={f.key}
            type="button"
            onClick={() => onPick(f.key)}
            disabled={n === 0}
            aria-pressed={active}
            className={cn(
              "rounded border px-1.5 py-0.5 text-[11px] transition-colors disabled:opacity-40",
              active
                ? "border-foreground bg-accent text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
            <span className="ml-1 text-muted-foreground">{n}</span>
          </button>
        );
      })}
    </div>
  );
}
