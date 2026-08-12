import * as React from "react";
import { Check, CornerDownRight, Trash2 } from "lucide-react";
import type { Comment } from "@/editor-source/comments";
import { cn } from "@/lib/utils";

/*
  ПАНЕЛЬ ЗАМЕЧАНИЙ К СПРАВОЧНИКУ — правая колонка страницы /bible.

  Устройство то же, что у панели замечаний к страницам сайта: выделил блок —
  форма уже открыта, писать можно сразу, всплывающих окон нет. Но список здесь
  проще: у замечания к документу нет ни метки «сделано» из журнала разбора, ни
  фильтров по состоянию. Замечание закрывается правкой самого справочника,
  поэтому исходов ровно два — открыто и решено.

  Имя автора спрашиваем один раз и запоминаем: разработчик приходит на боевой
  адрес, где паролей нет, и подписаться ему больше нечем.
*/

export type BibleCommentGroup = {
  rec: Comment;
  /** Адрес блока, к которому оставлено замечание. */
  path: string;
};

type Props = {
  /** Выбранный блок: к нему открыта форма. */
  selected: string | null;
  /** Снимок текста выбранного блока — показываем, о чём пишем. */
  selectedText: string | null;
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
  /** Клик по замечанию подводит документ к его блоку. */
  onGoTo: (path: string) => void;
  storeMode: "server" | "local";
};

const shorten = (s: string, n = 90) => (s.length > n ? `${s.slice(0, n)}…` : s);

const when = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
};

/* ─── Форма нового замечания ─────────────────────────────────────────────── */

function AddForm({
  selected,
  selectedText,
  author,
  onAuthor,
  onAdd,
}: Pick<Props, "selected" | "selectedText" | "author" | "onAuthor" | "onAdd">) {
  const [text, setText] = React.useState("");
  const [name, setName] = React.useState(author);

  // Сменили блок — форма чистая: чужой текст в новом месте только мешает.
  React.useEffect(() => setText(""), [selected]);

  if (!selected)
    return (
      <p className="rounded-md border border-dashed px-3 py-4 text-sm text-muted-foreground">
        Кликните по любому месту справочника слева — заголовку, абзацу, таблице
        или примеру, — и здесь откроется форма. Замечание привяжется именно к
        этому месту.
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
      {selectedText ? (
        <p className="text-xs leading-snug text-muted-foreground">
          О месте: «{shorten(selectedText)}»
        </p>
      ) : null}

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

  return (
    <li className={cn("space-y-2 rounded-md border p-3", closed && "opacity-60")}>
      <button
        type="button"
        onClick={() => onGoTo(group.path)}
        className="block w-full text-left text-xs text-muted-foreground hover:text-foreground"
      >
        {rec.original ? `«${shorten(rec.original, 70)}»` : "Место в документе"}
      </button>

      <p className="whitespace-pre-wrap text-sm leading-snug text-foreground">{rec.text}</p>

      <p className="text-[11px] text-muted-foreground">
        {rec.author || "без имени"} · {when(rec.createdAt)}
      </p>

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
            <Check className="size-3" aria-hidden /> {closed ? "Вернуть" : "Решено"}
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

  return (
    <aside className="flex flex-col gap-3 border-l bg-muted/20 p-3 md:min-h-0 md:overflow-y-auto">
      <header className="space-y-1">
        <h2 className="text-sm font-semibold">Замечания к справочнику</h2>
        <p className="text-xs text-muted-foreground">
          {storeMode === "server"
            ? "Замечания видят все: они лежат на общем сервере."
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
            Решённые ({closed.length})
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
