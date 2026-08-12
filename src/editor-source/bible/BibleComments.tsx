import * as React from "react";
import { Check, CornerDownRight, Trash2, X } from "lucide-react";
import type { Comment } from "@/editor-source/comments";
import { cn } from "@/lib/utils";
import { answeredCount, appliedFor, type AppliedBible } from "./appliedBible";

/*
  ПАНЕЛЬ ЗАМЕЧАНИЙ К СПРАВОЧНИКУ — правая колонка страницы /bible.

  Устройство то же, что у панели замечаний к страницам сайта: выделил место —
  форма уже открыта, писать можно сразу, всплывающих окон нет. Выделение
  множественное: одно замечание нередко относится к нескольким кускам подряд,
  например к правилу и примеру под ним.

  УЧТЕНО — это «замечание уже внесено в справочник». Признак берётся из журнала
  разбора (appliedBible.ts), который лежит в коде рядом с самой правкой, а не из
  данных разработчика. Так метка зажигается ровно тогда, когда правка выходит на
  боевой стенд, и вместе с ней панель показывает, что именно сделали.

  ВТОРОЙ РАУНД. Учтённое замечание — не конец разговора: разработчик читает наш
  разбор и может ответить прямо здесь. Пока его ответ без нашей правки,
  замечание снова считается открытым и стоит в очереди работы.
*/

export type BibleCommentGroup = {
  rec: Comment;
  /** Адреса блоков, к которым оставлено замечание. */
  paths: string[];
};

type Props = {
  /** Выделенные блоки: к ним открыта форма. */
  picked: string[];
  /** Снимки текста выделенных блоков — показываем, о чём пишем. */
  pickedTexts: string[];
  onClearPicked: () => void;
  groups: BibleCommentGroup[];
  author: string;
  onAuthor: (name: string) => void;
  /*
    Имя уходит вместе с текстом, а не берётся из состояния родителя: когда
    человек подписывается впервые, состояние обновится только к следующему
    отрисовыванию, и замечание успело бы уехать без подписи.
  */
  onAdd: (text: string, author: string) => void;
  onReply: (id: string, text: string) => void;
  onToggleClosed: (id: string, closed: boolean) => void;
  onDelete: (id: string) => void;
  /** Клик по замечанию подводит документ к его блокам. */
  onGoTo: (paths: string[]) => void;
  storeMode: "server" | "local";
};

const shorten = (s: string, n = 80) => (s.length > n ? `${s.slice(0, n)}…` : s);

const when = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
};

/*
  СОСТОЯНИЕ ЗАМЕЧАНИЯ. Их три, и они не пересекаются.

  «Учтено» — есть запись в журнале разбора, и она отвечает всем репликам
  разработчика. «Новый раунд» — запись есть, но после неё разработчик написал
  ещё, и правка нужна снова. «В работе» — записи нет.
*/
type State = "applied" | "round" | "open";

function stateOf(rec: Comment): State {
  const done = appliedFor(rec.id);
  if (!done.length) return "open";
  return (rec.replies?.length ?? 0) > answeredCount(rec.id) ? "round" : "applied";
}

const STATE_LABEL: Record<State, string> = {
  applied: "учтено",
  round: "новый раунд",
  open: "в работе",
};

const STATE_CLASS: Record<State, string> = {
  applied: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  round: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  open: "bg-muted text-muted-foreground",
};

/* ─── Форма нового замечания ─────────────────────────────────────────────── */

function AddForm({
  picked,
  pickedTexts,
  onClearPicked,
  author,
  onAuthor,
  onAdd,
}: Pick<Props, "picked" | "pickedTexts" | "onClearPicked" | "author" | "onAuthor" | "onAdd">) {
  const [text, setText] = React.useState("");
  const [name, setName] = React.useState(author);
  const key = picked.join("+");

  // Сменили выделение — форма чистая: чужой текст в новом месте только мешает.
  React.useEffect(() => setText(""), [key]);

  if (!picked.length)
    return (
      <p className="rounded-md border border-dashed px-3 py-4 text-sm leading-snug text-muted-foreground">
        Кликните по любому месту справочника слева — заголовку, абзацу, таблице
        или примеру, — и здесь откроется форма. Чтобы написать одно замечание
        сразу к нескольким местам, добавьте их кликом с зажатым Shift.
      </p>
    );

  const send = () => {
    if (!text.trim()) return;
    const who = (name || author).trim();
    if (who && who !== author) onAuthor(who);
    onAdd(text.trim(), who);
    setText("");
  };

  return (
    <div className="space-y-2 rounded-md border bg-muted/30 p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium">
          {picked.length === 1 ? "Выделено одно место" : `Выделено мест: ${picked.length}`}
        </p>
        <button
          type="button"
          onClick={onClearPicked}
          className="inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] text-muted-foreground hover:text-foreground"
        >
          <X className="size-3" aria-hidden /> снять
        </button>
      </div>

      <ul className="space-y-1">
        {pickedTexts.map((t, i) => (
          <li key={i} className="text-xs leading-snug text-muted-foreground">
            «{shorten(t)}»
          </li>
        ))}
      </ul>

      {!author ? (
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Как вас зовут"
          className="w-full rounded border bg-background px-2 py-1.5 text-sm"
        />
      ) : null}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
          }
        }}
        rows={3}
        placeholder="Что не так или что непонятно"
        className="w-full resize-y rounded border bg-background px-2 py-1.5 text-sm"
      />

      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground">
          Enter — отправить, Shift+Enter — перенос строки
        </span>
        <button
          type="button"
          onClick={send}
          disabled={!text.trim()}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50"
        >
          Оставить замечание
        </button>
      </div>
    </div>
  );
}

/* ─── Разбор: что мы по замечанию сделали ────────────────────────────────── */

function AppliedNote({ rec }: { rec: AppliedBible }) {
  return (
    <div className="space-y-1 rounded-md border border-emerald-200 bg-emerald-50/60 p-2 dark:border-emerald-900 dark:bg-emerald-950/30">
      <p className="text-xs font-medium text-emerald-900 dark:text-emerald-200">
        {rec.what}
      </p>
      <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80">
        Тронули: {rec.where} · {rec.date}
      </p>
      <p className="text-[11px] leading-snug text-muted-foreground">
        Было: «{shorten(rec.before, 100)}»
      </p>
      <p className="text-[11px] leading-snug text-muted-foreground">
        {rec.after ? `Стало: «${shorten(rec.after, 100)}»` : "Стало: этого куска в справочнике больше нет."}
      </p>
    </div>
  );
}

/* ─── Одно замечание в списке ────────────────────────────────────────────── */

function CommentCard({
  group,
  author,
  onReply,
  onToggleClosed,
  onDelete,
  onGoTo,
}: {
  group: BibleCommentGroup;
} & Pick<Props, "author" | "onReply" | "onToggleClosed" | "onDelete" | "onGoTo">) {
  const [reply, setReply] = React.useState("");
  const [replying, setReplying] = React.useState(false);
  const { rec } = group;
  const replies = rec.replies ?? [];
  const closed = !!rec.closed;
  const state = stateOf(rec);
  const applied = appliedFor(rec.id);

  return (
    <li className={cn("space-y-2 rounded-md border p-3", closed && "opacity-60")}>
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => onGoTo(group.paths)}
          className="block flex-1 text-left text-xs text-muted-foreground hover:text-foreground"
        >
          {rec.original ? `«${shorten(rec.original, 60)}»` : "Место в справочнике"}
          {group.paths.length > 1 ? ` и ещё ${group.paths.length - 1}` : ""}
        </button>
        <span
          className={cn(
            "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
            STATE_CLASS[state],
          )}
        >
          {STATE_LABEL[state]}
        </span>
      </div>

      <p className="whitespace-pre-wrap text-sm leading-snug text-foreground">{rec.text}</p>

      <p className="text-[11px] text-muted-foreground">
        {rec.author || "без имени"} · {when(rec.createdAt)}
      </p>

      {applied.map((a, i) => (
        <AppliedNote key={i} rec={a} />
      ))}

      {replies.length ? (
        <ul className="space-y-1.5 border-l-2 pl-3">
          {replies.map((r, i) => (
            <li key={i} className="text-sm leading-snug">
              <span className="text-[11px] text-muted-foreground">
                {r.author || "без имени"} · {when(r.at)}
              </span>
              <p className="whitespace-pre-wrap text-foreground/90">{r.text}</p>
            </li>
          ))}
        </ul>
      ) : null}

      {replying ? (
        <div className="space-y-1.5">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={2}
            autoFocus
            placeholder="Ответ"
            className="w-full resize-y rounded border bg-background px-2 py-1.5 text-sm"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                if (!reply.trim()) return;
                onReply(rec.id, reply.trim());
                setReply("");
                setReplying(false);
              }}
              className="rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground"
            >
              Ответить
            </button>
            <button
              type="button"
              onClick={() => setReplying(false)}
              className="rounded-md border px-2.5 py-1 text-xs"
            >
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setReplying(true)}
            className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-foreground/80 hover:text-foreground"
          >
            <CornerDownRight className="size-3" aria-hidden /> Ответить
          </button>
          <button
            type="button"
            onClick={() => onToggleClosed(rec.id, !closed)}
            className={cn(
              "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs",
              closed ? "bg-muted text-foreground" : "text-foreground/80 hover:text-foreground",
            )}
          >
            <Check className="size-3" aria-hidden /> {closed ? "Вернуть" : "Убрать из списка"}
          </button>
          {/* Автор может убрать своё замечание: чужие не трогаем. */}
          {author && rec.author === author ? (
            <button
              type="button"
              onClick={() => onDelete(rec.id)}
              className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-foreground/60 hover:text-destructive"
            >
              <Trash2 className="size-3" aria-hidden /> Удалить
            </button>
          ) : null}
        </div>
      )}
    </li>
  );
}

/* ─── Панель целиком ─────────────────────────────────────────────────────── */

export function BibleComments(props: Props) {
  const { groups, storeMode } = props;
  const open = groups.filter((g) => !g.rec.closed);
  const closed = groups.filter((g) => g.rec.closed);
  const waiting = open.filter((g) => stateOf(g.rec) !== "applied").length;

  return (
    <aside className="flex flex-col gap-3 border-l bg-muted/20 p-3 md:min-h-0 md:overflow-y-auto">
      <header className="space-y-1">
        <h2 className="text-sm font-semibold">
          Замечания к справочнику
          {waiting ? (
            <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-medium text-amber-900 dark:bg-amber-950 dark:text-amber-200">
              ждут правки: {waiting}
            </span>
          ) : null}
        </h2>
        <p className="text-xs leading-snug text-muted-foreground">
          {storeMode === "server"
            ? "Замечания видят все: они лежат на общем сервере. Метка «учтено» загорается, когда правка вышла на стенд."
            : "Сервер не отвечает, замечания сохраняются только в этом браузере."}
        </p>
      </header>

      <AddForm {...props} />

      {open.length ? (
        <ul className="space-y-2">
          {open.map((g) => (
            <CommentCard key={g.rec.id} group={g} {...props} />
          ))}
        </ul>
      ) : (
        <p className="px-1 text-xs text-muted-foreground">Открытых замечаний нет.</p>
      )}

      {closed.length ? (
        <details className="space-y-2">
          <summary className="cursor-pointer text-xs text-muted-foreground">
            Убранные из списка ({closed.length})
          </summary>
          <ul className="mt-2 space-y-2">
            {closed.map((g) => (
              <CommentCard key={g.rec.id} group={g} {...props} />
            ))}
          </ul>
        </details>
      ) : null}
    </aside>
  );
}
