import * as React from "react";
import type { EditRecord, EditStatus, Variant } from "./types";
import { autoId, routeId } from "./ids";
import {
  deleteEdit,
  getMode,
  loadEdits,
  saveEdit,
  setStatusRemote,
} from "./store";

// Состояние редакторского режима. Правки теперь общие: грузятся и сохраняются
// через store (сервер, иначе localStorage). Память «режим редактора вкл/выкл» —
// по-прежнему локальная, это настройка конкретного экрана.

/** Контекст блока, который редактор открыл в инспекторе. */
export type BlockCtx = {
  id: string;
  original: string;
  page?: string | null;
  anchor?: string | null;
  blockType?: string | null;
  /** В блоке есть инлайн-разметка (ссылки, выделения) — правка её упростит. */
  hasMarkup?: boolean;
};

type EditorContextValue = {
  editorMode: boolean;
  setEditorMode: (v: boolean) => void;
  toggleEditorMode: () => void;

  /** Источник правок: сервер или локально (для индикатора). */
  storeMode: "server" | "local";
  loaded: boolean;

  /** id блока → сохранённая правка. */
  edits: Record<string, EditRecord>;
  applyVariant: (ctx: BlockCtx, variant: Variant) => void;
  applyCustom: (ctx: BlockCtx, text: string) => void;
  revert: (id: string) => void;
  setStatus: (id: string, status: EditStatus) => void;
  editedCount: number;

  /** Блок, открытый в инспекторе. */
  active: BlockCtx | null;
  openBlock: (ctx: BlockCtx) => void;
  closeInspector: () => void;

  /** Текст заголовка с учётом правки — чтобы оглавление/навигация прорастали. */
  headingTextOf: (page: string, original: string, anchor?: string) => string;

  /** Подпись раздела в навигации (крошки/меню) с учётом правки h1 страницы:
   *  если у страницы `path` правлен заголовок — возвращаем его, иначе fallback. */
  navLabel: (path: string, fallback: string) => string;

  /** Отметить, что блок с таким id отрисован (для поиска осиротевших правок). */
  markSeen: (id: string, page: string) => void;
  /** Статус правки: ok — блок на месте; orphan — блок не найден на (открытой)
   *  странице; unchecked — страницу ещё не открывали в этой сессии. */
  orphanStatus: (id: string, page: string) => "ok" | "orphan" | "unchecked";

  /** Сообщение-уведомление (например, об ошибке сохранения). */
  notice: string | null;
  dismissNotice: () => void;
};

const EditorContext = React.createContext<EditorContextValue | null>(null);

const MODE_KEY = "inclusion-editor-mode";

function readMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(MODE_KEY) === "1";
  } catch {
    return false;
  }
}

const PENDING_KEY = "inclusion-editor-pending";

/** Не дать пропасть неотправленной правке: складываем в localStorage. */
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

/** Заголовки и пункты списка — однострочные: переносы строк → пробел. */
function sanitizeText(blockType: string | null | undefined, text: string): string {
  if (blockType && /^(h[1-4]|li)$/.test(blockType)) {
    return text.replace(/\s*\n+\s*/g, " ").trim();
  }
  return text;
}

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [editorMode, setEditorModeState] = React.useState<boolean>(readMode);
  const [edits, setEdits] = React.useState<Record<string, EditRecord>>({});
  const [storeMode, setStoreMode] = React.useState<"server" | "local">("local");
  const [loaded, setLoaded] = React.useState(false);
  const [active, setActive] = React.useState<BlockCtx | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);

  // Первичная загрузка правок.
  React.useEffect(() => {
    let alive = true;
    loadEdits().then((map) => {
      if (!alive) return;
      setEdits(map);
      setStoreMode(getMode());
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(MODE_KEY, editorMode ? "1" : "0");
    } catch {
      /* настройка не критична — молча пропускаем (например, quota/private mode) */
    }
  }, [editorMode]);

  const setEditorMode = React.useCallback((v: boolean) => {
    setEditorModeState(v);
    if (!v) setActive(null);
  }, []);

  const toggleEditorMode = React.useCallback(
    () => setEditorMode(!editorMode),
    [editorMode, setEditorMode]
  );

  const openBlock = React.useCallback((ctx: BlockCtx) => setActive(ctx), []);
  const closeInspector = React.useCallback(() => setActive(null), []);

  const SAVE_ERR =
    "Не удалось сохранить на сервер — правка отложена локально. Проверьте соединение и повторите.";

  const applyVariant = React.useCallback((ctx: BlockCtx, variant: Variant) => {
    const input = {
      id: ctx.id,
      page: ctx.page,
      anchor: ctx.anchor,
      blockType: ctx.blockType,
      original: ctx.original,
      kind: "variant" as const,
      variantKey: variant.key,
      text: variant.text,
    };
    saveEdit(input)
      .then((rec) => setEdits((prev) => ({ ...prev, [ctx.id]: rec })))
      .catch(() => {
        stashPending(input);
        setNotice(SAVE_ERR);
      });
  }, []);

  const applyCustom = React.useCallback((ctx: BlockCtx, text: string) => {
    const input = {
      id: ctx.id,
      page: ctx.page,
      anchor: ctx.anchor,
      blockType: ctx.blockType,
      original: ctx.original,
      kind: "custom" as const,
      text: sanitizeText(ctx.blockType, text),
    };
    saveEdit(input)
      .then((rec) => setEdits((prev) => ({ ...prev, [ctx.id]: rec })))
      .catch(() => {
        stashPending(input);
        setNotice(SAVE_ERR);
      });
  }, []);

  const revert = React.useCallback(
    (id: string) => {
      const rec = edits[id];
      // Уже внесённую/проверенную правку не удаляем молча — помечаем «запрошен
      // откат», чтобы разработчик вернул оригинал и в боевом сайте.
      if (rec && (rec.status === "applied" || rec.status === "verified")) {
        setStatusRemote(id, "rollback")
          .then((updated) => {
            if (updated) setEdits((prev) => ({ ...prev, [id]: updated }));
          })
          .catch(() =>
            setNotice("Не удалось запросить откат — сервер недоступен.")
          );
        return;
      }
      deleteEdit(id)
        .then(() =>
          setEdits((prev) => {
            if (!(id in prev)) return prev;
            const next = { ...prev };
            delete next[id];
            return next;
          })
        )
        .catch(() => setNotice("Не удалось вернуть оригинал — сервер недоступен."));
    },
    [edits]
  );

  const setStatus = React.useCallback((id: string, status: EditStatus) => {
    setStatusRemote(id, status)
      .then((rec) => {
        if (rec) setEdits((prev) => ({ ...prev, [id]: rec }));
      })
      .catch(() => setNotice("Не удалось изменить статус — сервер недоступен."));
  }, []);

  const dismissNotice = React.useCallback(() => setNotice(null), []);

  const headingTextOf = React.useCallback(
    (page: string, original: string, anchor = "") => {
      for (const k of ["h2", "h3", "h4", "h1"]) {
        const rec = edits[autoId(page, k, original, anchor)];
        if (rec) return rec.text;
      }
      return original;
    },
    [edits]
  );

  const navLabel = React.useCallback(
    (path: string, fallback: string) => {
      const rec = edits[routeId(path)];
      if (rec && rec.text.trim() && rec.status !== "rollback") return rec.text;
      return fallback;
    },
    [edits]
  );

  // Отслеживаем отрисованные id блоков и посещённые страницы — чтобы дашборд мог
  // показать «осиротевшие» правки (id больше не встречается на своей странице).
  const seenIdsRef = React.useRef<Set<string>>(new Set());
  const visitedPagesRef = React.useRef<Set<string>>(new Set());
  const markSeen = React.useCallback((id: string, page: string) => {
    seenIdsRef.current.add(id);
    if (page) visitedPagesRef.current.add(page);
  }, []);
  const orphanStatus = React.useCallback(
    (id: string, page: string): "ok" | "orphan" | "unchecked" => {
      if (!page || !visitedPagesRef.current.has(page)) return "unchecked";
      return seenIdsRef.current.has(id) ? "ok" : "orphan";
    },
    []
  );

  const editedCount = Object.keys(edits).length;

  const value = React.useMemo<EditorContextValue>(
    () => ({
      editorMode,
      setEditorMode,
      toggleEditorMode,
      storeMode,
      loaded,
      edits,
      applyVariant,
      applyCustom,
      revert,
      setStatus,
      editedCount,
      active,
      openBlock,
      closeInspector,
      headingTextOf,
      navLabel,
      markSeen,
      orphanStatus,
      notice,
      dismissNotice,
    }),
    [
      editorMode,
      setEditorMode,
      toggleEditorMode,
      storeMode,
      loaded,
      edits,
      applyVariant,
      applyCustom,
      revert,
      setStatus,
      editedCount,
      active,
      openBlock,
      closeInspector,
      headingTextOf,
      navLabel,
      markSeen,
      orphanStatus,
      notice,
      dismissNotice,
    ]
  );

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export function useEditor() {
  const ctx = React.useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
}
