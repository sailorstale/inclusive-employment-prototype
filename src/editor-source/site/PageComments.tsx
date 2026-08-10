import * as React from "react";
import { Ban, Check, CornerDownRight, Pencil, Trash2 } from "lucide-react";
import type { Comment, CommentReply } from "@/editor-source/comments";
import { stripMarks } from "@/editor-source/richText";
import { appliedAllFor } from "./appliedComments";
import { commentState, isClosed, type CommentState } from "./commentState";
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

  ВТОРОЙ РАУНД. Сделанное замечание — не конец разговора: клиент читает наш
  разбор и может ответить прямо здесь, под ним. Ответы копятся веткой, и по
  такому замечанию мы правим ещё раз. Пока ответ клиента без нашей правки,
  замечание горит как «новый раунд» и стоит в очереди работы, а не теряется
  среди двух десятков сделанных.
*/

export type CommentGroup = {
  /** id записи в хранилище. */
  id: string;
  /** Адреса блоков на СЕГОДНЯШНЕЙ странице (могли быть починены по тексту). */
  paths: string[];
  rec: Comment;
};

/*
  ФИЛЬТР СПИСКА. На странице замечания разного возраста лежат вперемешку:
  сделанные, отложенные и те, за которые ещё браться. Кнопки сверху оставляют в
  списке одну группу — например только «не применяем», чтобы разобрать их
  подряд, или наоборот убрать их с глаз и видеть очередь работы.
*/
/*
  «Решено» стоит в том же ряду, но означает другое: не исход, а «убрано с глаз».
  Все остальные группы показывают только актуальное — убранное в них не мешает.
*/
type CommentFilter = "all" | CommentState | "closed";

const FILTERS: { key: CommentFilter; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "open", label: "В работе" },
  { key: "round", label: "Новый раунд" },
  { key: "skipped", label: "Не применяем" },
  { key: "closed", label: "Решено" },
  { key: "done", label: "Сделано" },
];

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
  onClosed,
  onNote,
  onReply,
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
  /** Пометить «решено» — вопрос закрыт, из очереди замечание уходит. */
  onClosed: (id: string, closed: boolean) => void;
  /** Сохранить решение дизайнера поверх замечания. Пусто — стереть его. */
  onNote: (id: string, note: string) => void;
  /** Дописать ответ в ветку под замечанием — начать следующий раунд. */
  onReply: (id: string, author: string, text: string) => void;
  onGoTo: (id: string) => void;
  onClearPick: () => void;
}) {
  const [name, setName] = React.useState(author);
  const [text, setText] = React.useState("");
  const [filter, setFilter] = React.useState<CommentFilter>("all");

  const counts = React.useMemo(() => {
    const c = { all: 0, open: 0, round: 0, skipped: 0, closed: 0, done: 0 };
    for (const g of groups) {
      if (isClosed(g.rec)) c.closed += 1;
      else {
        c.all += 1;
        c[commentState(g.rec)] += 1;
      }
    }
    return c;
  }, [groups]);

  const shown = React.useMemo(
    () =>
      groups.filter((g) =>
        filter === "closed"
          ? isClosed(g.rec)
          : !isClosed(g.rec) && (filter === "all" || commentState(g.rec) === filter),
      ),
    [groups, filter],
  );

  /*
    Кликнули на странице по блоку, чей комментарий фильтр сейчас прячет, —
    возвращаем список к «Всем». Иначе клик выглядел бы сломанным: рамка на
    странице подсветилась, а карточки в списке нет.
  */
  React.useEffect(() => {
    if (!activeId) return;
    const hidden =
      groups.some((g) => g.id === activeId) && !shown.some((g) => g.id === activeId);
    if (hidden) setFilter("all");
  }, [activeId, groups, shown]);

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

      {/*
        ФИЛЬТР. Показываем, только когда группировать есть что: на странице с
        тремя одинаковыми замечаниями кнопки были бы лишним шумом.
      */}
      {groups.length > 0 && groups.length > counts.open && (
        <div className="flex shrink-0 flex-wrap gap-1 border-b px-3 py-2">
          {FILTERS.map((f) => {
            const n = counts[f.key];
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
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
      )}

      {/* СПИСОК — комментарии этой страницы. */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {groups.length === 0 ? (
          <p className="p-3 text-xs text-muted-foreground">
            На этой странице комментариев пока нет.
          </p>
        ) : shown.length === 0 ? (
          <p className="p-3 text-xs text-muted-foreground">
            В этой группе комментариев нет.
          </p>
        ) : (
          <ul className="divide-y">
            {shown.map((g) => {
              /* Раунды разбора по порядку: первый сверху, следующие под ним. */
              const rounds = appliedAllFor(g.id);
              const done = rounds.length > 0;
              const state = commentState(g.rec);
              const skipped = Boolean(g.rec.skipped);
              const closed = Boolean(g.rec.closed);
              const replies = g.rec.replies ?? [];
              const note = (g.rec.note || "").trim();
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
                      {state === "done" && (
                        <span className="ml-auto shrink-0 rounded bg-[color:var(--comment-applied)] px-1 py-0.5 text-[10px] leading-none text-white">
                          сделано
                        </span>
                      )}
                      {/*
                        Клиент ответил на наш разбор, а правки под этот ответ ещё
                        нет. Метка нужна, чтобы такое замечание не потерялось
                        среди сделанных: разговор по нему продолжается.
                      */}
                      {state === "round" && (
                        <span className="ml-auto shrink-0 rounded bg-[color:var(--comment-round)] px-1 py-0.5 text-[10px] leading-none text-white">
                          новый раунд
                        </span>
                      )}
                      {state === "skipped" && (
                        <span className="ml-auto shrink-0 rounded bg-[color:var(--comment-skipped)] px-1 py-0.5 text-[10px] leading-none text-white">
                          не применяем
                        </span>
                      )}
                      {/*
                        Решение дизайнера уже написано, а правка ещё не внесена.
                        Это и есть очередь работы: по таким замечаниям понятно,
                        что делать, и можно браться не переспрашивая.
                      */}
                      {note && state === "open" && (
                        <span className="ml-auto shrink-0 rounded bg-[hsl(var(--warn))] px-1 py-0.5 text-[10px] leading-none text-white">
                          к правке
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

                        Раундов может быть несколько: клиент ответил, мы правили
                        ещё раз. Показываем их все по порядку — историю правок
                        клиент должен видеть целиком.
                      */
                      rounds.map((r, i) => (
                        <span
                          key={r.date + i}
                          className="mt-2 block rounded border border-[color:var(--comment-applied)]/40 bg-[color:var(--comment-applied-tint)] p-2"
                        >
                          {rounds.length > 1 && (
                            <span className="mb-1 block text-[11px] text-muted-foreground">
                              Раунд {i + 1} · {r.date}
                            </span>
                          )}
                          <span className="block text-foreground">{r.what}</span>
                          <span className="mt-1.5 block text-[11px] text-muted-foreground">
                            Было
                          </span>
                          <span className="block text-foreground/80">{r.before}</span>
                          <span className="mt-1.5 block text-[11px] text-muted-foreground">
                            Стало
                          </span>
                          <span className="block text-foreground/80">
                            {r.after || "Блока на этой странице больше нет."}
                          </span>
                        </span>
                      ))
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
                  {/*
                    ВЕТКА ОТВЕТОВ — продолжение разговора по этому замечанию.
                    Вне кнопки перехода к блоку по той же причине, что и
                    решение дизайнера: поле ввода внутри кнопки не работает.
                  */}
                  <ReplyThread
                    replies={replies}
                    author={author}
                    /* После нашей правки отвечать зовём прямо: разбор прочитан,
                       и клиент должен видеть, что слово снова за ним. */
                    invite={state === "done"}
                    onSend={(who, t) => onReply(g.id, who, t)}
                  />
                  {/*
                    РЕШЕНИЕ ДИЗАЙНЕРА — вне кнопки перехода к блоку: внутрь
                    кнопки поле ввода класть нельзя, клик по нему уводил бы
                    страницу вместо того, чтобы поставить курсор.
                  */}
                  <NoteEditor
                    note={note}
                    onSave={(t) => onNote(g.id, t)}
                  />
                  <div className="flex items-center gap-1">
                    {/*
                      «РЕШЕНО» — убрать замечание с глаз. Есть у КАЖДОГО, включая
                      разобранные: список чистят и от них тоже, когда разговор по
                      ним закончен.

                      Исход замечания кнопка не меняет. Зелёная метка «сделано»
                      остаётся на месте — её даёт запись в журнале разбора, и
                      клиент по-прежнему видит, что страница изменилась.
                    */}
                    <button
                        type="button"
                        onClick={() => onClosed(g.id, !closed)}
                        title={
                          closed
                            ? "Вернуть замечание в очередь"
                            : "Вопрос закрыт — убрать замечание из очереди"
                        }
                        className={cn(
                          "flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] transition-colors",
                          closed
                            ? "border-[color:var(--comment-closed)] text-[color:var(--comment-closed)]"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <Check className="size-3" aria-hidden />
                        {closed ? "Вернуть в очередь" : "Решено"}
                      </button>
                    {/*
                      «Не применять» — другой исход: замечание разбирает дизайнер
                      сам, его ещё надо обсудить с клиентом. Мы такие комментарии
                      не трогаем.

                      У сделанного и у решённого кнопки нет: спорить о том,
                      браться ли за правку, поздно.
                    */}
                    {!done && !closed && (
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

/*
  ВЕТКА ОТВЕТОВ ПОД ЗАМЕЧАНИЕМ — второй раунд правок.

  Мы разобрали замечание и написали в панели, что сделали. Клиент это читает и
  вполне может не согласиться: «поправили, но всё равно тяжело читается». Раньше
  сказать об этом было негде — оставалось завести новое замечание, оторванное от
  старого разговора, и разбираться заново, о чём вообще речь.

  Теперь ответ дописывается сюда же, под замечание. Разговор виден целиком: что
  просили, что мы сделали, что клиент ответил. Пока ответ без нашей правки,
  замечание горит меткой «новый раунд» и стоит в очереди работы.

  Отвечать можно на любое замечание, не только на сделанное. Разница только в
  зазывании: после нашего разбора кнопку показываем сразу, в остальных случаях
  она скромная ссылка — там разговор обычно и так продолжается правкой.
*/
function ReplyThread({
  replies,
  author,
  invite,
  onSend,
}: {
  replies: CommentReply[];
  /** Имя из хранилища; пустое — сначала попросим представиться. */
  author: string;
  /** Звать отвечать заметной кнопкой, а не ссылкой. */
  invite: boolean;
  onSend: (author: string, text: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState(author);
  const [text, setText] = React.useState("");

  // Имя приезжает из хранилища асинхронно — как в форме нового комментария.
  React.useEffect(() => {
    if (author) setName(author);
  }, [author]);

  const canSend = text.trim().length > 0 && name.trim().length > 0;
  const send = () => {
    if (!canSend) return;
    onSend(name.trim(), text.trim());
    setText("");
    setOpen(false);
  };

  return (
    <div className="space-y-1.5">
      {replies.map((r, i) => (
        <div
          key={r.at + i}
          className="rounded border border-[color:var(--comment-round)]/40 bg-[color:var(--comment-round-tint)] p-2"
        >
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] font-medium text-[color:var(--comment-round)]">
              {r.author || "без имени"} ответил
            </span>
            <span className="text-[11px] text-muted-foreground">
              {r.at.slice(0, 10)}
            </span>
          </div>
          <p className="mt-1 whitespace-pre-wrap text-foreground">{r.text}</p>
        </div>
      ))}

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "flex items-center gap-1 text-[11px] underline-offset-2",
            invite
              ? "rounded border border-[color:var(--comment-round)] px-1.5 py-0.5 text-[color:var(--comment-round)]"
              : "text-muted-foreground hover:text-foreground hover:underline",
          )}
        >
          <CornerDownRight className="size-3" aria-hidden />
          {replies.length ? "Ответить ещё" : "Ответить"}
        </button>
      ) : (
        <div className="space-y-1.5">
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
              // Enter отправляет, Shift+Enter переносит строку — как в форме выше.
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
              if (e.key === "Escape") {
                setText("");
                setOpen(false);
              }
            }}
            autoFocus
            rows={3}
            placeholder="Что не так? Что поправить ещё?"
            className="w-full resize-y rounded-md border bg-background px-2 py-1.5 text-xs outline-none focus:border-ring"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={send}
              disabled={!canSend}
              className="rounded-md bg-primary px-2 py-1 text-[11px] font-medium text-primary-foreground transition-opacity disabled:opacity-40"
            >
              Отправить
            </button>
            <button
              type="button"
              onClick={() => {
                setText("");
                setOpen(false);
              }}
              className="text-[11px] text-muted-foreground underline-offset-2 hover:underline"
            >
              отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/*
  РЕШЕНИЕ ДИЗАЙНЕРА поверх замечания клиента.

  Клиент пишет, что его смущает, и не обязан знать, как это чинить: «убираем
  заголовок «пример», можем пометить примеры каким-то рисунком?» Дизайнер тут же
  приписывает, что делать: «сделать карточкой «Пример» с картинкой, как
  остальные». Правку вносим по приписке, а не по догадке о том, чего клиент
  хотел, — и переспрашивать в чате не нужно.

  Слова клиента приписка не трогает: она лежит отдельным полем и отдельным
  блоком, и в панели всегда видно, где чьи слова.
*/
function NoteEditor({
  note,
  onSave,
}: {
  note: string;
  onSave: (note: string) => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(note);

  // Приписку могли изменить не здесь (перезагрузка, соседняя вкладка).
  React.useEffect(() => {
    if (!editing) setDraft(note);
  }, [note, editing]);

  if (!editing) {
    if (!note)
      return (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-[11px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          + решение дизайнера
        </button>
      );
    return (
      <div className="rounded border border-[hsl(var(--warn)/0.4)] bg-[hsl(var(--warn)/0.08)] p-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[11px] font-medium text-[hsl(var(--warn))]">
            Решение дизайнера
          </span>
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Изменить решение"
            title="Изменить решение"
            className="ml-auto rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Pencil className="size-3" aria-hidden />
          </button>
        </div>
        <p className="mt-1 whitespace-pre-wrap text-foreground">{note}</p>
      </div>
    );
  }

  const save = () => {
    onSave(draft);
    setEditing(false);
  };

  return (
    <div className="space-y-1.5">
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          // Enter сохраняет, Shift+Enter переносит строку — как в форме выше.
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            save();
          }
          if (e.key === "Escape") {
            setDraft(note);
            setEditing(false);
          }
        }}
        autoFocus
        rows={3}
        placeholder="Что делаем по этому замечанию?"
        className="w-full resize-y rounded-md border bg-background px-2 py-1.5 text-xs outline-none focus:border-ring"
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={save}
          className="rounded-md bg-primary px-2 py-1 text-[11px] font-medium text-primary-foreground"
        >
          Сохранить
        </button>
        <button
          type="button"
          onClick={() => {
            setDraft(note);
            setEditing(false);
          }}
          className="text-[11px] text-muted-foreground underline-offset-2 hover:underline"
        >
          отмена
        </button>
      </div>
    </div>
  );
}
