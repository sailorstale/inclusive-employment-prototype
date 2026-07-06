import * as React from "react";
import type { Comment, CommentInput } from "./comments";
import {
  createComment,
  deleteComment,
  getCommentsMode,
  loadComments,
  updateComment,
} from "./comments";

// Состояние слоя комментариев: список пинов (общий, с сервера/локально), режим
// добавления (когда клик по странице ставит новую точку), панель со сводным
// списком (в стиле Figma) и «прыжок к пину» из неё.

type CommentsContextValue = {
  comments: Comment[];
  loaded: boolean;
  storeMode: "server" | "local";

  /** Режим «поставить комментарий»: клик по странице создаёт пин. */
  adding: boolean;
  setAdding: (v: boolean) => void;
  toggleAdding: () => void;

  /** Панель со сводным списком всех комментариев. */
  panelOpen: boolean;
  setPanelOpen: (v: boolean) => void;
  togglePanel: () => void;

  /** id пина, к которому нужно проскроллить и раскрыть (переход из панели). */
  focusId: string | null;
  setFocusId: (id: string | null) => void;

  addComment: (input: CommentInput) => Promise<Comment>;
  editComment: (id: string, text: string) => void;
  toggleResolved: (id: string, resolved: boolean) => void;
  removeComment: (id: string) => void;

  openCount: number;
};

const CommentsContext = React.createContext<CommentsContextValue | null>(null);

export function CommentsProvider({ children }: { children: React.ReactNode }) {
  const [comments, setComments] = React.useState<Record<string, Comment>>({});
  const [loaded, setLoaded] = React.useState(false);
  const [storeMode, setStoreMode] = React.useState<"server" | "local">("local");
  const [adding, setAddingState] = React.useState(false);
  const [panelOpen, setPanelOpenState] = React.useState(false);
  const [focusId, setFocusId] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    loadComments().then((list) => {
      if (!alive) return;
      const map: Record<string, Comment> = {};
      for (const c of list) map[c.id] = c;
      setComments(map);
      setStoreMode(getCommentsMode());
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Режим добавления и панель не живут одновременно: прицел поверх открытой
  // панели сбивает с толку, поэтому включение одного закрывает другое.
  const setAdding = React.useCallback((v: boolean) => {
    setAddingState(v);
    if (v) setPanelOpenState(false);
  }, []);
  const toggleAdding = React.useCallback(() => {
    setAddingState((v) => {
      if (!v) setPanelOpenState(false);
      return !v;
    });
  }, []);

  const setPanelOpen = React.useCallback((v: boolean) => {
    setPanelOpenState(v);
    if (v) setAddingState(false);
  }, []);
  const togglePanel = React.useCallback(() => {
    setPanelOpenState((v) => {
      if (!v) setAddingState(false);
      return !v;
    });
  }, []);

  const addComment = React.useCallback(async (input: CommentInput) => {
    const rec = await createComment(input);
    setComments((prev) => ({ ...prev, [rec.id]: rec }));
    return rec;
  }, []);

  const editComment = React.useCallback((id: string, text: string) => {
    updateComment(id, { text })
      .then((rec) => {
        if (rec) setComments((prev) => ({ ...prev, [id]: rec }));
      })
      .catch(() => {});
  }, []);

  const toggleResolved = React.useCallback((id: string, resolved: boolean) => {
    updateComment(id, { resolved })
      .then((rec) => {
        if (rec) setComments((prev) => ({ ...prev, [id]: rec }));
      })
      .catch(() => {});
  }, []);

  const removeComment = React.useCallback((id: string) => {
    deleteComment(id)
      .then(() =>
        setComments((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        })
      )
      .catch(() => {});
  }, []);

  const list = React.useMemo(() => Object.values(comments), [comments]);
  const openCount = React.useMemo(
    () => list.filter((c) => !c.resolved).length,
    [list]
  );

  const value = React.useMemo<CommentsContextValue>(
    () => ({
      comments: list,
      loaded,
      storeMode,
      adding,
      setAdding,
      toggleAdding,
      panelOpen,
      setPanelOpen,
      togglePanel,
      focusId,
      setFocusId,
      addComment,
      editComment,
      toggleResolved,
      removeComment,
      openCount,
    }),
    [
      list,
      loaded,
      storeMode,
      adding,
      setAdding,
      toggleAdding,
      panelOpen,
      setPanelOpen,
      togglePanel,
      focusId,
      addComment,
      editComment,
      toggleResolved,
      removeComment,
      openCount,
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
