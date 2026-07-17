// Комментарии-пины: тип и слой доступа (сервер, иначе localStorage — как у правок).
import { createLocalMapStore } from "./localStore";

export type Comment = {
  id: string;
  page: string;
  /** Текст ближайшего блока — якорь, по нему пин находит место после перевёрстки. */
  anchorText: string;
  /** Смещение точки от левого-верхнего угла блока-якоря (px на момент постановки). */
  dx: number;
  dy: number;
  text: string;
  author?: string | null;
  resolved: boolean;
  createdAt: string;
  resolvedAt?: string | null;
};

export type CommentInput = {
  page: string;
  anchorText: string;
  dx: number;
  dy: number;
  text: string;
  author?: string | null;
};

const LOCAL_KEY = "inclusion-comments-v1";

const store = createLocalMapStore<Comment>(LOCAL_KEY);
export const getCommentsMode = store.getMode;
const readLocal = store.read;
const writeLocal = store.write;

function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return "c_" + Date.now().toString(36);
  }
}

export async function loadComments(): Promise<Comment[]> {
  try {
    const r = await fetch("/api/comments");
    if (r.ok) {
      store.setMode("server");
      return (await r.json()) as Comment[];
    }
  } catch {
    /* нет сервера — локально */
  }
  store.setMode("local");
  return Object.values(readLocal());
}

export async function createComment(input: CommentInput): Promise<Comment> {
  if (store.getMode() === "server") {
    const r = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!r.ok) throw new Error(`Комментарий не сохранён: ${r.status}`);
    return (await r.json()) as Comment;
  }
  const map = readLocal();
  const rec: Comment = {
    id: newId(),
    ...input,
    resolved: false,
    createdAt: new Date().toISOString(),
    resolvedAt: null,
  };
  map[rec.id] = rec;
  writeLocal(map);
  return rec;
}

export async function updateComment(
  id: string,
  patch: { text?: string; resolved?: boolean },
): Promise<Comment | null> {
  if (store.getMode() === "server") {
    const r = await fetch(`/api/comments/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!r.ok) throw new Error(`Комментарий не обновлён: ${r.status}`);
    return (await r.json()) as Comment;
  }
  const map = readLocal();
  const rec = map[id];
  if (!rec) return null;
  if (typeof patch.text === "string") rec.text = patch.text;
  if (typeof patch.resolved === "boolean") {
    rec.resolved = patch.resolved;
    rec.resolvedAt = patch.resolved ? new Date().toISOString() : null;
  }
  map[id] = rec;
  writeLocal(map);
  return rec;
}

export async function deleteComment(id: string): Promise<void> {
  if (store.getMode() === "server") {
    const r = await fetch(`/api/comments/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!r.ok) throw new Error(`Комментарий не удалён: ${r.status}`);
    return;
  }
  const map = readLocal();
  delete map[id];
  writeLocal(map);
}
