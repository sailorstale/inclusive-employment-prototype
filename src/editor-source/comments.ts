// Аннотации блока: КОММЕНТАРИЙ и пометка УДАЛЕНИЯ. Одна запись на блок (id =
// адрес блока, как у правки). Живёт рядом с правками, но отдельным хранилищем
// (свой файл/ключ), чтобы не смешивать «что написать» и «что сказать/убрать».
// Слой доступа: сервер, иначе localStorage. Скоуп делит сайт и «Редактуру
// источника». Запись апсертится по id (как правки) — надёжно, без потерь.
import { apiFetch } from "./auth";
import type { Scope } from "./store";

export type Comment = {
  /** Адрес блока (autoId) — одна аннотация на блок. */
  id: string;
  page: string | null;
  blockType?: string | null;
  /** Снимок текста блока — чтобы в сводке было видно, о чём речь. */
  original?: string | null;
  /** Текст комментария («» если блок только помечен на удаление). */
  text: string;
  /** Мягкое удаление: блок остаётся, но помечен убранным (можно вернуть). */
  deleted: boolean;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
  /** Легаси-поле старых комментариев-пинов: текст блока-якоря. Новые записи его
   *  не пишут (привязка по id блока), но старые уже сохранённые — сохраняем и
   *  показываем как ссылку на блок, чтобы не потерять смысл правки. */
  anchorText?: string | null;
};

export type CommentInput = {
  id: string;
  page?: string | null;
  blockType?: string | null;
  original?: string | null;
  text?: string;
  deleted?: boolean;
  resolved?: boolean;
};

const API = { site: "/api", source: "/api/source" } as const;
const LOCAL_KEY = {
  site: "inclusion-comments-v2",
  source: "inclusion-source-comments-v2",
} as const;

const modes: Record<Scope, "server" | "local"> = { site: "local", source: "local" };
export const getCommentsMode = (scope: Scope = "site") => modes[scope];

function readLocal(scope: Scope): Record<string, Comment> {
  try {
    const raw = localStorage.getItem(LOCAL_KEY[scope]);
    const parsed = raw ? (JSON.parse(raw) as Record<string, Comment>) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeLocal(scope: Scope, map: Record<string, Comment>) {
  localStorage.setItem(LOCAL_KEY[scope], JSON.stringify(map));
}

export async function loadComments(scope: Scope = "site"): Promise<Comment[]> {
  try {
    const r = await apiFetch(`${API[scope]}/comments`);
    if (r.ok) {
      modes[scope] = "server";
      return (await r.json()) as Comment[];
    }
  } catch {
    /* нет сервера — локально */
  }
  modes[scope] = "local";
  return Object.values(readLocal(scope));
}

/** Создать/обновить аннотацию блока (апсерт по id). */
export async function saveComment(
  input: CommentInput,
  scope: Scope = "site"
): Promise<Comment> {
  if (modes[scope] === "server") {
    const r = await apiFetch(`${API[scope]}/comments/${encodeURIComponent(input.id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!r.ok) throw new Error(`Комментарий не сохранён: ${r.status}`);
    return (await r.json()) as Comment;
  }
  const map = readLocal(scope);
  const now = new Date().toISOString();
  const prev = map[input.id];
  const rec: Comment = {
    id: input.id,
    page: input.page ?? prev?.page ?? null,
    blockType: input.blockType ?? prev?.blockType ?? null,
    original: input.original ?? prev?.original ?? null,
    text: typeof input.text === "string" ? input.text : prev?.text ?? "",
    deleted: typeof input.deleted === "boolean" ? input.deleted : prev?.deleted ?? false,
    resolved: typeof input.resolved === "boolean" ? input.resolved : prev?.resolved ?? false,
    createdAt: prev?.createdAt ?? now,
    updatedAt: now,
  };
  map[rec.id] = rec;
  writeLocal(scope, map);
  return rec;
}

export async function deleteComment(id: string, scope: Scope = "site"): Promise<void> {
  if (modes[scope] === "server") {
    const r = await apiFetch(`${API[scope]}/comments/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!r.ok) throw new Error(`Удаление аннотации не удалось: ${r.status}`);
    return;
  }
  const map = readLocal(scope);
  delete map[id];
  writeLocal(scope, map);
}
