import * as React from "react";
import type { Comment, CommentInput } from "./comments";
import {
  deleteComment,
  getCommentsMode,
  loadComments,
  saveComment,
} from "./comments";
import type { Scope } from "./store";

// Состояние аннотаций блоков: КОММЕНТАРИИ и пометки УДАЛЕНИЯ. Одна запись на блок
// (по его адресу). Живёт рядом с правками, грузится/сохраняется через comments.ts
// (сервер, иначе localStorage). Никаких плавающих пинов — всё внутри редслоя.

/** Куда вешаем аннотацию — минимум полей блока для записи. */
export type CommentTarget = {
  id: string;
  page?: string | null;
  blockType?: string | null;
  original?: string | null;
  author?: string | null;
};

type CommentsContextValue = {
  /** Список всех аннотаций (для сводки «Изменения»). */
  comments: Comment[];
  loaded: boolean;
  storeMode: "server" | "local";

  /** Аннотация конкретного блока (комментарий/удаление), если есть. */
  commentOf: (id: string) => Comment | undefined;
  /** Сохранить/очистить текст комментария у блока. */
  setComment: (target: CommentTarget, text: string) => void;
  /** Пометить блок удалённым / вернуть. */
  setDeleted: (target: CommentTarget, deleted: boolean) => void;
  /** Отметить комментарий решённым / открыть заново. */
  toggleResolved: (id: string, resolved: boolean) => void;
  /** Пометить «не применять» — этим замечанием занимается дизайнер сам. */
  toggleSkipped: (id: string, skipped: boolean) => void;
  /** Пометить «решено» / вернуть в очередь. Наша рабочая пометка, не «сделано». */
  toggleClosed: (id: string, closed: boolean) => void;
  /*
    Решение дизайнера поверх замечания клиента: что именно с ним делать. Пустая
    строка стирает приписку, саму запись при этом не трогаем — замечание
    клиента остаётся.
  */
  setNote: (id: string, note: string) => void;
  /*
    Ответ на замечание — реплика второго раунда. Клиент прочитал, что мы
    сделали, и говорит, что всё равно не то. Реплика уходит одна и дописывается
    в конец ветки на сервере, а не заменяет весь список.
  */
  addReply: (id: string, author: string, text: string) => void;

  /** Открытых комментариев (с текстом, не решённых). */
  openCount: number;
  /** Блоков, помеченных на удаление. */
  deletedCount: number;

  /** Сообщение об ошибке сохранения (для тоста). */
  notice: string | null;
  dismissNotice: () => void;
};

const CommentsContext = React.createContext<CommentsContextValue | null>(null);

const PENDING_KEY = "inclusion-comments-pending";

/** Не дать пропасть неотправленной аннотации: складываем в localStorage. */
function stashPending(input: unknown) {
  try {
    const raw = window.localStorage.getItem(PENDING_KEY);
    const arr = raw ? (JSON.parse(raw) as unknown[]) : [];
    arr.push({ at: new Date().toISOString(), input });
    window.localStorage.setItem(PENDING_KEY, JSON.stringify(arr.slice(-50)));
  } catch {
    /* ignore */
  }
}

const SAVE_ERR =
  "Не удалось сохранить на сервер — отложено локально. Проверьте соединение и повторите.";

export function CommentsProvider({
  children,
  scope = "site",
}: {
  children: React.ReactNode;
  /** Скоуп: сайт или обособленный инструмент «Редактура источника». */
  scope?: Scope;
}) {
  const [comments, setComments] = React.useState<Record<string, Comment>>({});
  const [loaded, setLoaded] = React.useState(false);
  const [storeMode, setStoreMode] = React.useState<"server" | "local">("local");
  const [notice, setNotice] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    loadComments(scope).then((list) => {
      if (!alive) return;
      const map: Record<string, Comment> = {};
      for (const c of list) map[c.id] = c;
      setComments(map);
      setStoreMode(getCommentsMode(scope));
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, [scope]);

  const commentOf = React.useCallback(
    (id: string) => comments[id],
    [comments]
  );

  // Апсерт с оптимистичным обновлением и страховкой при ошибке сети.
  const save = React.useCallback(
    (input: CommentInput) => {
      saveComment(input, scope)
        .then((rec) => setComments((prev) => ({ ...prev, [rec.id]: rec })))
        .catch(() => {
          stashPending(input);
          setNotice(SAVE_ERR);
        });
    },
    [scope]
  );

  const remove = React.useCallback(
    (id: string) => {
      deleteComment(id, scope)
        .then(() =>
          setComments((prev) => {
            if (!(id in prev)) return prev;
            const next = { ...prev };
            delete next[id];
            return next;
          })
        )
        .catch(() => setNotice("Не удалось убрать аннотацию — сервер недоступен."));
    },
    [scope]
  );

  const setComment = React.useCallback(
    (target: CommentTarget, text: string) => {
      const trimmed = text.trim();
      const prev = comments[target.id];
      // Пусто и блок не помечен удалённым — аннотации больше нет, убираем запись.
      if (!trimmed && !prev?.deleted) {
        if (prev) remove(target.id);
        return;
      }
      save({
        id: target.id,
        page: target.page,
        blockType: target.blockType,
        original: target.original,
        author: target.author,
        text: trimmed,
        // Правка текста комментария снова «открывает» его.
        resolved: trimmed ? false : prev?.resolved ?? false,
      });
    },
    [comments, save, remove]
  );

  const setDeleted = React.useCallback(
    (target: CommentTarget, deleted: boolean) => {
      const prev = comments[target.id];
      // Возврат из удалённых и нет комментария — записи больше не нужно.
      if (!deleted && !(prev?.text || "").trim()) {
        if (prev) remove(target.id);
        return;
      }
      save({
        id: target.id,
        page: target.page,
        blockType: target.blockType,
        original: target.original,
        deleted,
      });
    },
    [comments, save, remove]
  );

  const toggleResolved = React.useCallback(
    (id: string, resolved: boolean) => {
      const prev = comments[id];
      if (!prev) return;
      save({ id, resolved });
    },
    [comments, save]
  );

  const toggleSkipped = React.useCallback(
    (id: string, skipped: boolean) => {
      const prev = comments[id];
      if (!prev) return;
      save({ id, skipped });
    },
    [comments, save]
  );

  /*
    «РЕШЕНО» — вопрос по замечанию закрыт, из очереди оно уходит.

    Ставя «решено», снимаем «не применяем»: это была пометка «дизайнер разберёт
    сам», а разбор теперь закончен, и держать оба признака разом бессмысленно.

    Поле resolved не трогаем НИКОГДА. Оно зажигает у клиента метку «сделано», а
    она должна загораться только после публикации правки — иначе клиент увидит
    «сделано» на странице, которая не изменилась.
  */
  const toggleClosed = React.useCallback(
    (id: string, closed: boolean) => {
      if (!comments[id]) return;
      save({ id, closed, ...(closed ? { skipped: false } : null) });
    },
    [comments, save]
  );

  /*
    Приписка дизайнера. Записи без замечания клиента не бывает: приписка всегда
    поверх чужих слов, поэтому если записи нет — писать некуда.

    НАПИСАЛИ РЕШЕНИЕ — СНИМАЕМ «НЕ ПРИМЕНЯТЬ». Эта пометка значит «мы к замечанию
    не прикасаемся, дизайнер разберёт сам». Написанное решение и есть разбор:
    замечание возвращается в работу, теперь уже с понятным заданием. Иначе
    задание висело бы в списке помеченным как «не трогаем», и до него никто бы
    не дошёл.
  */
  const setNote = React.useCallback(
    (id: string, note: string) => {
      if (!comments[id]) return;
      const trimmed = note.trim();
      save({ id, note: trimmed, ...(trimmed ? { skipped: false } : null) });
    },
    [comments, save],
  );

  /*
    ОТВЕТ НА ЗАМЕЧАНИЕ. Отвечать можно только на существующую запись: реплика
    всегда продолжает чей-то разговор, поэтому в пустоту её писать некуда.

    Ни `resolved`, ни `skipped` ответ не трогает. Это данные клиента и решение
    дизайнера, а вопрос «сделано или нет» решает журнал разбора в коде: метка
    должна меняться тогда, когда страница действительно изменилась, а не когда
    об этом зашёл разговор.
  */
  const addReply = React.useCallback(
    (id: string, author: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !comments[id]) return;
      save({ id, reply: { author: author.trim(), text: trimmed } });
    },
    [comments, save],
  );

  const dismissNotice = React.useCallback(() => setNotice(null), []);

  const list = React.useMemo(() => Object.values(comments), [comments]);
  const openCount = React.useMemo(
    () => list.filter((c) => c.text.trim() && !c.resolved).length,
    [list]
  );
  const deletedCount = React.useMemo(
    () => list.filter((c) => c.deleted).length,
    [list]
  );

  const value = React.useMemo<CommentsContextValue>(
    () => ({
      comments: list,
      loaded,
      storeMode,
      commentOf,
      setComment,
      setDeleted,
      toggleResolved,
      toggleSkipped,
      toggleClosed,
      setNote,
      addReply,
      openCount,
      deletedCount,
      notice,
      dismissNotice,
    }),
    [
      list,
      loaded,
      storeMode,
      commentOf,
      setComment,
      setDeleted,
      toggleResolved,
      toggleSkipped,
      toggleClosed,
      setNote,
      addReply,
      openCount,
      deletedCount,
      notice,
      dismissNotice,
    ]
  );

  return (
    <CommentsContext.Provider value={value}>{children}</CommentsContext.Provider>
  );
}

export function useComments() {
  const ctx = React.useContext(CommentsContext);
  if (!ctx) throw new Error("useComments must be used within CommentsProvider");
  return ctx;
}
