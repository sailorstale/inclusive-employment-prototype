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
