import type { EditRecord, EditStatus } from "@/editor/types";
import { apiFetch } from "./auth";

// Слой доступа к правкам: пробует сервер, иначе localStorage (быстрый просмотр
// без бэкенда). Один интерфейс в обоих режимах. Скоуп разделяет данные: сайт и
// обособленный инструмент «Редактура источника» ходят в РАЗНЫЕ эндпоинты/ключи
// и держат независимый режим (сервер/локально), чтобы не влиять друг на друга.

export type Scope = "site" | "source";

const API = { site: "/api", source: "/api/source" } as const;
const LOCAL_KEY = {
  site: "inclusion-editor-edits-v2",
  source: "inclusion-source-edits-v2",
} as const;

const modes: Record<Scope, "server" | "local"> = { site: "local", source: "local" };
export const getMode = (scope: Scope = "site") => modes[scope];

function readLocal(scope: Scope): Record<string, EditRecord> {
  try {
    const raw = localStorage.getItem(LOCAL_KEY[scope]);
    const parsed = raw ? (JSON.parse(raw) as Record<string, EditRecord>) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeLocal(scope: Scope, map: Record<string, EditRecord>) {
  localStorage.setItem(LOCAL_KEY[scope], JSON.stringify(map));
}

function byId(list: EditRecord[]): Record<string, EditRecord> {
  const m: Record<string, EditRecord> = {};
  for (const e of list) m[e.id] = e;
  return m;
}

export async function loadEdits(
  scope: Scope = "site"
): Promise<Record<string, EditRecord>> {
  try {
    const r = await apiFetch(`${API[scope]}/edits`);
    if (r.ok) {
      modes[scope] = "server";
      return byId((await r.json()) as EditRecord[]);
    }
  } catch {
    /* сервера нет — работаем локально */
  }
  modes[scope] = "local";
  return readLocal(scope);
}

/** Тело, которое редактор отправляет на сохранение (без серверных полей-дат). */
export type EditInput = {
  id: string;
  page?: string | null;
  anchor?: string | null;
  file?: string | null;
  blockType?: string | null;
  kind: EditRecord["kind"];
  variantKey?: EditRecord["variantKey"];
  text: string;
  original?: string | null;
};

export async function saveEdit(
  input: EditInput,
  scope: Scope = "site"
): Promise<EditRecord> {
  if (modes[scope] === "server") {
    const r = await apiFetch(`${API[scope]}/edits/${encodeURIComponent(input.id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!r.ok) throw new Error(`Сохранение не удалось: ${r.status}`);
    return (await r.json()) as EditRecord;
  }
  const m = readLocal(scope);
  const rec: EditRecord = {
    ...input,
    variantKey: input.variantKey ?? null,
    status: "new",
    editedAt: new Date().toISOString(),
    appliedAt: null,
    verifiedAt: null,
  };
  m[input.id] = rec;
  writeLocal(scope, m);
  return rec;
}

export async function deleteEdit(id: string, scope: Scope = "site"): Promise<void> {
  if (modes[scope] === "server") {
    const r = await apiFetch(`${API[scope]}/edits/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!r.ok) throw new Error(`Удаление не удалось: ${r.status}`);
    return;
  }
  const m = readLocal(scope);
  delete m[id];
  writeLocal(scope, m);
}

export async function setStatusRemote(
  id: string,
  status: EditStatus,
  scope: Scope = "site"
): Promise<EditRecord | null> {
  if (modes[scope] === "server") {
    const r = await apiFetch(`${API[scope]}/edits/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!r.ok) throw new Error(`Смена статуса не удалась: ${r.status}`);
    return (await r.json()) as EditRecord;
  }
  const m = readLocal(scope);
  const rec = m[id];
  if (!rec) return null;
  const now = new Date().toISOString();
  rec.status = status;
  rec.appliedAt =
    status === "applied" ? now : status === "verified" ? rec.appliedAt || now : null;
  rec.verifiedAt = status === "verified" ? now : null;
  m[id] = rec;
  writeLocal(scope, m);
  return rec;
}
