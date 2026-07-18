import { apiFetch } from "./auth";

// Слой доступа к ДИРЕКТИВАМ раскладки (плейграунд → «Разметка»). Как и правки:
// пробуем сервер (/api/source/directives), иначе localStorage. Директива — это
// разметка «какие блоки → во что + модификаторы + комментарий». Текст блоков
// здесь не хранится и не меняется: только ссылки на блоки по стабильным id.

export type DirectiveBlock = { id: string; kind: string; snippet: string };
export type DirectiveStatus = "new" | "applied" | "verified";

export type Directive = {
  id: string;
  module: string;
  blocks: DirectiveBlock[];
  target: string | null;
  targetLabel: string | null;
  modifiers: Record<string, string | boolean>;
  comment: string;
  status: DirectiveStatus;
  createdAt: string;
  updatedAt?: string;
};

/** Что уходит на сохранение (без серверных статуса/дат). */
export type DirectiveInput = {
  id: string;
  module: string;
  blocks: DirectiveBlock[];
  target: string | null;
  targetLabel: string | null;
  modifiers: Record<string, string | boolean>;
  comment: string;
};

const API = "/api/source/directives";
const LOCAL_KEY = "inclusion-source-directives-v1";

let mode: "server" | "local" = "local";
export const getMode = () => mode;

export function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `d-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
}

function readLocal(): Record<string, Directive> {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    const parsed = raw ? (JSON.parse(raw) as Record<string, Directive>) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeLocal(map: Record<string, Directive>) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(map));
}

export async function loadDirectives(): Promise<Directive[]> {
  try {
    const r = await apiFetch(`${API}`);
    if (r.ok) {
      mode = "server";
      const obj = (await r.json()) as Record<string, Directive>;
      return Object.values(obj);
    }
  } catch {
    /* сервера нет — работаем локально */
  }
  mode = "local";
  return Object.values(readLocal());
}

export async function saveDirective(input: DirectiveInput): Promise<Directive> {
  if (mode === "server") {
    const r = await apiFetch(`${API}/${encodeURIComponent(input.id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!r.ok) throw new Error(`Сохранение директивы не удалось: ${r.status}`);
    return (await r.json()) as Directive;
  }
  const m = readLocal();
  const now = new Date().toISOString();
  const rec: Directive = {
    ...input,
    status: m[input.id]?.status ?? "new",
    createdAt: m[input.id]?.createdAt ?? now,
    updatedAt: now,
  };
  m[input.id] = rec;
  writeLocal(m);
  return rec;
}

export async function deleteDirective(id: string): Promise<void> {
  if (mode === "server") {
    const r = await apiFetch(`${API}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!r.ok) throw new Error(`Удаление директивы не удалось: ${r.status}`);
    return;
  }
  const m = readLocal();
  delete m[id];
  writeLocal(m);
}

export async function setDirectiveStatus(
  id: string,
  status: DirectiveStatus,
): Promise<Directive | null> {
  if (mode === "server") {
    const r = await apiFetch(`${API}/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!r.ok) throw new Error(`Смена статуса не удалась: ${r.status}`);
    return (await r.json()) as Directive;
  }
  const m = readLocal();
  const rec = m[id];
  if (!rec) return null;
  rec.status = status;
  rec.updatedAt = new Date().toISOString();
  m[id] = rec;
  writeLocal(m);
  return rec;
}
