import * as React from "react";
import { Check, Trash2 } from "lucide-react";
import type { Comment } from "@/editor-source/comments";
import { cn } from "@/lib/utils";

/*
  ПАНЕЛЬ КОММЕНТАРИЕВ — третья колонка инструмента сверки.

  Раньше комментарий писали иначе: выделяли компонент, ловили кнопку в его углу,
  и поверх страницы открывалось окно. На небольшом экране окно закрывало ровно
  то место, о котором писали, а кнопку ещё надо было заметить. Теперь всё в
  колонке сбоку: выделил блок — форма уже открыта, писать можно сразу.

  Комментарий может держать несколько блоков: выделение множественное, и в
  запись уходят все выбранные адреса. Рамку такой группе рисует слой
  CommentFrames — одну общую, а не по рамке на блок.

  ПРИМЕНЁН — это «замечание уже учтено в прототипе». Храним признак в поле
  resolved: отдельного поля заводить не стали, у сервера набор полей
  фиксированный, а смысл тот же — разговор по этому блоку закончен.
*/

export type CommentGroup = {
  /** id записи в хранилище. */
  id: string;
  /** Адреса блоков, к которым относится комментарий. */
  paths: string[];
  rec: Comment;
};

export function PageComments({
  groups,
  picked,
  pickedAbout,
  author,
  activeId,
  onAdd,
  onDelete,
  onApplied,
  onGoTo,
  onClearPick,
}: {
  groups: CommentGroup[];
  /** Сколько блоков выделено сейчас. */
  picked: number;
  /** Снимок текста выделенного — чтобы было видно, о чём пишешь. */
  pickedAbout: string;
  /** Имя автора; пустое — сначала попросим представиться. */
  author: string;
  activeId: string | null;
  onAdd: (name: string, text: string) => void;
  onDelete: (id: string) => void;
  onApplied: (id: string, applied: boolean) => void;
  onGoTo: (id: string) => void;
  onClearPick: () => void;
}) {
  const [name, setName] = React.useState(author);
  const [text, setText] = React.useState("");

  // Имя приезжает из хранилища асинхронно — подхватываем, пока поле не трогали.
  React.useEffect(() => {
    if (author) setName(author);
  }, [author]);

  const canSend = picked > 0 && text.trim().length > 0 && name.trim().length > 0;
  const send = () => {
    if (!canSend) return;
    onAdd(name.trim(), text.trim());
    setText("");
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* ФОРМА — сверху, чтобы не искать её под списком. */}
      <div className="shrink-0 border-b p-3">
        {picked === 0 ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            Кликните по блоку страницы — форма откроется здесь. Нужно сказать про
            несколько блоков сразу — кликните по каждому, они выделятся вместе.
          </p>
        ) : (
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-medium text-foreground">
                {picked === 1 ? "Выделен 1 блок" : `Выделено блоков: ${picked}`}
              </span>
              <button
                type="button"
                onClick={onClearPick}
                className="ml-auto text-xs text-muted-foreground underline-offset-2 hover:underline"
              >
                снять
              </button>
            </div>
            {pickedAbout ? (
              <p className="line-clamp-2 text-xs italic text-muted-foreground">
                {pickedAbout}
              </p>
            ) : null}
            {!author && (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                className="w-full rounded-md border bg-background px-2 py-1 text-xs outline-none focus:border-ring"
              />
            )}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                // Enter отправляет, Shift+Enter переносит строку: комментарии
                // короткие, и лишний клик по кнопке на каждый из них — лишний.
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={3}
              placeholder="Что поправить?"
              className="w-full resize-y rounded-md border bg-background px-2 py-1.5 text-xs outline-none focus:border-ring"
            />
            <button
              type="button"
              onClick={send}
              disabled={!canSend}
              className="w-full rounded-md bg-primary px-2 py-1.5 text-xs font-medium text-primary-foreground transition-opacity disabled:opacity-40"
            >
              Оставить комментарий
            </button>
          </div>
        )}
      </div>

      {/* СПИСОК — все комментарии этой страницы. */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {groups.length === 0 ? (
          <p className="p-3 text-xs text-muted-foreground">
            На этой странице комментариев пока нет.
          </p>
        ) : (
          <ul className="divide-y">
            {groups.map((g) => {
              const applied = Boolean(g.rec.resolved);
              return (
                <li
                  key={g.id}
                  className={cn(
                    "space-y-1.5 p-3 text-xs",
                    g.id === activeId && "bg-accent/50",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onGoTo(g.id)}
                    className="block w-full text-left"
                  >
                    <span className="flex items-baseline gap-1.5">
                      <span className="font-medium text-foreground">
                        {g.rec.author || "без имени"}
                      </span>
                      {g.paths.length > 1 && (
                        <span className="text-muted-foreground">
                          · блоков: {g.paths.length}
                        </span>
                      )}
                      {applied && (
                        <span className="ml-auto shrink-0 rounded bg-[color:var(--comment-applied)] px-1 py-0.5 text-[10px] leading-none text-white">
                          применён
                        </span>
                      )}
                    </span>
                    <span className="mt-1 block whitespace-pre-wrap text-foreground">
                      {g.rec.text}
                    </span>
                    {g.rec.original ? (
                      <span className="mt-1 line-clamp-2 block italic text-muted-foreground">
                        {g.rec.original}
                      </span>
                    ) : null}
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onApplied(g.id, !applied)}
                      className={cn(
                        "flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] transition-colors",
                        applied
                          ? "border-[color:var(--comment-applied)] text-[color:var(--comment-applied)]"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Check className="size-3" aria-hidden />
                      {applied ? "Применён" : "Отметить применённым"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(g.id)}
                      aria-label="Удалить комментарий"
                      title="Удалить комментарий"
                      className="ml-auto rounded p-1 text-muted-foreground transition-colors hover:text-[hsl(var(--bad))]"
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
