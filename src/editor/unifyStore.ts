import { apiFetch } from "./auth";
import type { Approach } from "./unify";

// Доступ к решениям по унификации: сервер (/api/unify), иначе localStorage.
// Тот же приём, что у правок/комментариев.

export type UnifyDecision = {
  type: string;
  approach: Approach | null;
  decidedAt: string;
};

const LOCAL_KEY = "inclusion-unify-decisions-v1";

let mode: "server" | "local" = "local";
export const getUnifyMode = () => mode;

function readLocal(): Record<string, UnifyDecision> {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    const parsed = raw ? (JSON.parse(raw) as Record<string, UnifyDecision>) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeLocal(map: Record<string, UnifyDecision>) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(map));
}

function byType(list: UnifyDecision[]): Record<string, UnifyDecision> {
  const m: Record<string, UnifyDecision> = {};
  for (const d of list) m[d.type] = d;
  return m;
}

export async function loadDecisions(): Promise<Record<string, UnifyDecision>> {
  try {
    const r = await apiFetch("/api/unify");
    if (r.ok) {
      mode = "server";
      return byType((await r.json()) as UnifyDecision[]);
    }
  } catch {
    /* сервера нет — локально */
  }
  mode = "local";
  return readLocal();
}

export async function saveDecision(
  type: string,
  approach: Approach | null
): Promise<UnifyDecision> {
  if (mode === "server") {
    const r = await apiFetch(`/api/unify/${encodeURIComponent(type)}`, {
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
  if (mode === "server") {
    const r = await apiFetch(`/api/unify/${encodeURIComponent(type)}`, {
      method: "DELETE",
    });
    if (!r.ok) throw new Error(`Не удалось снять решение: ${r.status}`);
    return;
  }
  const m = readLocal();
  delete m[type];
  writeLocal(m);
}
