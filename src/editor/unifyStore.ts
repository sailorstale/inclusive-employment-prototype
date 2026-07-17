import { createLocalMapStore } from "./localStore";
import type { Approach } from "./unify";

// Доступ к решениям по унификации: сервер (/api/unify), иначе localStorage.
// Тот же приём, что у правок/комментариев.

export type UnifyDecision = {
  type: string;
  approach: Approach | null;
  decidedAt: string;
};

const LOCAL_KEY = "inclusion-unify-decisions-v1";

const store = createLocalMapStore<UnifyDecision>(LOCAL_KEY);
export const getUnifyMode = store.getMode;
const readLocal = store.read;
const writeLocal = store.write;

function byType(list: UnifyDecision[]): Record<string, UnifyDecision> {
  const m: Record<string, UnifyDecision> = {};
  for (const d of list) m[d.type] = d;
  return m;
}

export async function loadDecisions(): Promise<Record<string, UnifyDecision>> {
  try {
    const r = await fetch("/api/unify");
    if (r.ok) {
      store.setMode("server");
      return byType((await r.json()) as UnifyDecision[]);
    }
  } catch {
    /* сервера нет — локально */
  }
  store.setMode("local");
  return readLocal();
}

export async function saveDecision(
  type: string,
  approach: Approach | null,
): Promise<UnifyDecision> {
  if (store.getMode() === "server") {
    const r = await fetch(`/api/unify/${encodeURIComponent(type)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approach }),
    });
    if (!r.ok) throw new Error(`Решение не сохранено: ${r.status}`);
    return (await r.json()) as UnifyDecision;
  }
  const m = readLocal();
  const rec: UnifyDecision = {
    type,
    approach,
    decidedAt: new Date().toISOString(),
  };
  m[type] = rec;
  writeLocal(m);
  return rec;
}

export async function clearDecision(type: string): Promise<void> {
  if (store.getMode() === "server") {
    const r = await fetch(`/api/unify/${encodeURIComponent(type)}`, {
      method: "DELETE",
    });
    if (!r.ok) throw new Error(`Не удалось снять решение: ${r.status}`);
    return;
  }
  const m = readLocal();
  delete m[type];
  writeLocal(m);
}
