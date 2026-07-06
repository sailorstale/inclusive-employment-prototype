import type { EditRecord, EditStatus } from "./types";
import { apiFetch } from "./auth";
import { createLocalMapStore } from "./localStore";

// Слой доступа к правкам: пробует сервер (/api/edits), а если его нет
// (быстрый просмотр через vite без бэкенда, статика без сервера) — уходит в
// localStorage. Один и тот же интерфейс в обоих режимах, провайдер о различии
// не знает.

const LOCAL_KEY = "inclusion-editor-edits-v2";

const store = createLocalMapStore<EditRecord>(LOCAL_KEY);
export const getMode = store.getMode;
const readLocal = store.read;
const writeLocal = store.write;

function byId(list: EditRecord[]): Record<string, EditRecord> {
  const m: Record<string, EditRecord> = {};
  for (const e of list) m[e.id] = e;
  return m;
}

export async function loadEdits(): Promise<Record<string, EditRecord>> {
  try {
    const r = await apiFetch("/api/edits");
    if (r.ok) {
      store.setMode("server");
      return byId((await r.json()) as EditRecord[]);
    }
  } catch {
    /* сервера нет — работаем локально */
  }
  store.setMode("local");
  return readLocal();
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

export async function saveEdit(input: EditInput): Promise<EditRecord> {
  if (store.getMode() === "server") {
    const r = await apiFetch(`/api/edits/${encodeURIComponent(input.id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!r.ok) throw new Error(`Сохранение не удалось: ${r.status}`);
    return (await r.json()) as EditRecord;
  }
  const m = readLocal();
  const rec: EditRecord = {
    ...input,
    variantKey: input.variantKey ?? null,
    status: "new",
    editedAt: new Date().toISOString(),
    appliedAt: null,
    verifiedAt: null,
  };
  m[input.id] = rec;
  writeLocal(m);
  return rec;
}

export async function deleteEdit(id: string): Promise<void> {
  if (store.getMode() === "server") {
    const r = await apiFetch(`/api/edits/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!r.ok) throw new Error(`Удаление не удалось: ${r.status}`);
    return;
  }
  const m = readLocal();
  delete m[id];
  writeLocal(m);
}

export async function setStatusRemote(
  id: string,
  status: EditStatus
): Promise<EditRecord | null> {
  if (store.getMode() === "server") {
    const r = await apiFetch(`/api/edits/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!r.ok) throw new Error(`Смена статуса не удалась: ${r.status}`);
    return (await r.json()) as EditRecord;
  }
  const m = readLocal();
  const rec = m[id];
  if (!rec) return null;
  const now = new Date().toISOString();
  rec.status = status;
  rec.appliedAt =
    status === "applied" ? now : status === "verified" ? rec.appliedAt || now : null;
  rec.verifiedAt = status === "verified" ? now : null;
  m[id] = rec;
  writeLocal(m);
  return rec;
}
