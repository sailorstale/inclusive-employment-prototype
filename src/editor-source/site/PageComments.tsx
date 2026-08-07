import * as React from "react";
import { Ban, Trash2 } from "lucide-react";
import type { Comment } from "@/editor-source/comments";
import { stripMarks } from "@/editor-source/richText";
import { appliedFor } from "./appliedComments";
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

  СДЕЛАНО — это «замечание уже учтено в прототипе». Признак берётся из журнала
  разбора (appliedComments.ts), который лежит в коде рядом с самой правкой, а не
  из данных клиента. Так метка зажигается ровно тогда, когда правка выходит на
  боевой стенд, и вместе с ней панель показывает, ЧТО сделали, как было и как
  стало. Старое серверное поле resolved тоже уважаем: им помечены замечания,
  разобранные до появления журнала.
*/

export type CommentGroup = {
  /** id записи в хранилище. */
  id: string;
  /** Адреса блоков на СЕГОДНЯШНЕЙ странице (могли быть починены по тексту). */
  paths: string[];
  rec: Comment;
};

export function PageComments({
  groups,
  placed,
  homes,
  picked,
  pickedAbout,
  author,
  activeId,
  onAdd,
  onDelete,
  onSkipped,
  onGoTo,
  onClearPick,
}: {
  groups: CommentGroup[];
  /*
    id замечаний, которые удалось поставить на страницу. Чего здесь нет — у того
    блок не нашёлся: его переписали или убрали.
  */
  placed: Set<string>;
  /*
    Куда переехал блок ненайденного замечания. Страницы перекраивали, и часть
    абзацев уехала на соседние — тогда замечание не потеряно, просто живёт
    теперь на другой странице.
  */
  homes: Record<string, { slug: string; title: string }>;
  /** Сколько блоков выделено сейчас. */
  picked: number;
  /** Снимок текста выделенного — чтобы было видно, о чём пишешь. */
  pickedAbout: string;
  /** Имя автора; пустое — сначала попросим представиться. */
  author: string;
  activeId: string | null;
  onAdd: (name: string, text: string) => void;
  onDelete: (id: string) => void;
  onSkipped: (id: string, skipped: boolean) => void;
  onGoTo: (id: string) => void;
  onClearPick: () => void;
}) {
  const [name, setName] = React.useState(author);
  const [text, setText] = React.useState("");

  // Имя приезжает из хранилища асинхронно — подхватываем, пока поле не трогали.
  React.useEffect(() => {
    if (author) setName(author);
  }, [author]);

  /*
    Выделили на странице блок с комментарием — подводим к его карточке список.
    «nearest» вместо «center»: если карточка и так на виду, список не дёргается.
  */
  const activeRef = React.useRef<HTMLLIElement | null>(null);
  React.useEffect(() => {
    if (activeId) activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [activeId]);

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
            несколько блоков сразу — кликайте по ним с зажатым Shift.
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
            {/* Подсказку про Shift держим на виду, пока блок выделен один:
                иначе про множественное выделение просто не узнают. */}
            {picked === 1 && (
              <p className="text-[11px] leading-snug text-muted-foreground">
                Shift + клик — добавить ещё блок к этому же комментарию.
              </p>
            )}
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
              const done = appliedFor(g.id);
              const applied = Boolean(done) || Boolean(g.rec.resolved);
              const skipped = Boolean(g.rec.skipped);
              return (
                <li
                  key={g.id}
                  ref={g.id === activeId ? activeRef : undefined}
                  className={cn(
                    "space-y-1.5 border-l-2 p-3 text-xs transition-colors",
                    g.id === activeId
                      ? "border-l-[color:var(--comment-line)] bg-accent/60"
                      : "border-l-transparent",
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
                      {/*
                        Метку «сделано» ставим не кнопкой, а записью в журнале
                        разбора — она уезжает тем же коммитом, что и сама
                        правка. Здесь метка только показывается.
                      */}
                      {applied && (
                        <span className="ml-auto shrink-0 rounded bg-[color:var(--comment-applied)] px-1 py-0.5 text-[10px] leading-none text-white">
                          сделано
                        </span>
                      )}
                      {skipped && !applied && (
                        <span className="ml-auto shrink-0 rounded bg-[color:var(--comment-skipped)] px-1 py-0.5 text-[10px] leading-none text-white">
                          не применяем
                        </span>
                      )}
                    </span>
                    <span className="mt-1 block whitespace-pre-wrap text-foreground">
                      {g.rec.text}
                    </span>
                    {/*
                      Замечание оставили на другой странице, а блок с тех пор
                      переехал сюда. Пометка нужна, иначе непонятно, откуда оно
                      здесь взялось.

                      У разобранного замечания её не показываем: блока обычно
                      уже нет, поиск по тексту ловит первое похожее место, и
                      пометка сообщала бы о переезде, которого не было.
                    */}
                    {!done && g.rec.page && homes[g.id] && g.rec.page !== homes[g.id].slug && (
                      <span className="mt-1 block text-[11px] text-[color:var(--comment-line)]">
                        Оставлено на другой странице — блок переехал сюда
                      </span>
                    )}
                    {!placed.has(g.id) && !done && (
                      /*
                        Блок не нашёлся, и объяснения этому у нас нет. Молчать
                        нельзя — иначе замечание висит в списке без рамки, и
                        непонятно, к чему оно относилось.

                        Когда запись в журнале есть, эта строка не нужна: блок
                        пропал не сам по себе, а потому что мы его убрали, и
                        ниже про это сказано спокойными словами.
                      */
                      <span className="mt-1 block text-[11px] text-[hsl(var(--bad))]">
                        Блок не найден — текст переписали или убрали
                      </span>
                    )}
                    {done ? (
                      /*
                        ОТВЕТ НА ЗАМЕЧАНИЕ: что сделали и как страница выглядела
                        до и после. Пустое «стало» значит, что блок убран, — так
                        и пишем, вместо пустой строки.
                      */
                      <span className="mt-2 block rounded border border-[color:var(--comment-applied)]/40 bg-[color:var(--comment-applied-tint)] p-2">
                        <span className="block text-foreground">{done.what}</span>
                        <span className="mt-1.5 block text-[11px] text-muted-foreground">
                          Было
                        </span>
                        <span className="block text-foreground/80">{done.before}</span>
                        <span className="mt-1.5 block text-[11px] text-muted-foreground">
                          Стало
                        </span>
                        <span className="block text-foreground/80">
                          {done.after || "Блока на этой странице больше нет."}
                        </span>
                      </span>
                    ) : g.rec.original ? (
                      /*
                        Метки снимаем и здесь, а не только при записи: девять
                        комментариев клиента сохранились до этой починки, и в их
                        снимках служебные символы уже лежат.
                      */
                      <span className="mt-1 line-clamp-2 block italic text-muted-foreground">
                        {stripMarks(g.rec.original)}
                      </span>
                    ) : null}
                  </button>
                  <div className="flex items-center gap-1">
                    {/*
                      «Не применять» — единственная кнопка статуса. Ею дизайнер
                      говорит: этим замечанием займусь сам, его ещё надо обсудить
                      с клиентом. Мы такие комментарии не трогаем.

                      У сделанного замечания кнопки нет: спорить о том, браться
                      ли за правку, поздно — она уже внесена.
                    */}
                    {!done && (
                    <button
                      type="button"
                      onClick={() => onSkipped(g.id, !skipped)}
                      title={
                        skipped
                          ? "Вернуть замечание в работу"
                          : "Мы это замечание не трогаем — вы разбираете его сами"
                      }
                      className={cn(
                        "flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] transition-colors",
                        skipped
                          ? "border-[color:var(--comment-skipped)] text-[color:var(--comment-skipped)]"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Ban className="size-3" aria-hidden />
                      {skipped ? "Вернуть в работу" : "Не применять"}
                    </button>
                    )}
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
