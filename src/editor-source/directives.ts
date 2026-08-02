import { apiFetch } from "./auth";

// Слой доступа к ДИРЕКТИВАМ раскладки (плейграунд → «Разметка»). Как и правки:
// пробуем сервер (/api/source/directives), иначе localStorage. Директива — это
// разметка «какие блоки → во что + модификаторы + комментарий». Текст блоков
// здесь не хранится и не меняется: только ссылки на блоки по стабильным id.

export type DirectiveBlock = {
  id: string;
  kind: string;
  snippet: string;
  /** Имя иконки Lucide, подобранной по тексту (для General Card с иконкой). */
  icon?: string;
};
export type DirectiveStatus = "new" | "applied" | "verified";
/** Кто завёл директиву: дизайнер (по умолчанию) или Claude — предложением. */
export type DirectiveOrigin = "designer" | "claude";
/** Судьба предложения: ждёт решения дизайнера → принято или отклонено. */
export type DirectiveReview = "proposed" | "accepted" | "rejected";

export type Directive = {
  id: string;
  module: string;
  blocks: DirectiveBlock[];
  target: string | null;
  targetLabel: string | null;
  modifiers: Record<string, string | boolean>;
  comment: string;
  status: DirectiveStatus;
  /** Нет поля — завёл дизайнер (так у всех директив до появления предложений). */
  origin?: DirectiveOrigin;
  /** Только у предложений Claude. Отклонённое в раскладку не идёт. */
  review?: DirectiveReview;
  /*
    Зачем предложена директива — человеческим языком, для дизайнера. Отдельно от
    комментария намеренно: комментарий читает РАСКЛАДКА, и объяснение в нём
    превратилось бы в заметку «комментарий не разобран».
  */
  note?: string;
  /** Выключена: остаётся в списке и держит свои блоки, но не применяется. */
  off?: boolean;
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

/** Поля, которые меняются точечно, не трогая разметку директивы. */
export type DirectivePatch = {
  status?: DirectiveStatus;
  review?: DirectiveReview;
  off?: boolean;
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
  const prev = m[input.id];
  const rec: Directive = {
    // Служебные поля (кто завёл, решение, выключение) переживают правку разметки.
    ...prev,
    ...input,
    status: prev?.status ?? "new",
    createdAt: prev?.createdAt ?? now,
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

/*
  Точечная правка служебных полей: статус переноса, решение по предложению,
  выключение. Разметку (блоки, цель, модификаторы, комментарий) не трогает —
  для неё saveDirective.
*/
export async function patchDirective(
  id: string,
  patch: DirectivePatch,
): Promise<Directive | null> {
  if (mode === "server") {
    const r = await apiFetch(`${API}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!r.ok) throw new Error(`Правка директивы не удалась: ${r.status}`);
    return (await r.json()) as Directive;
  }
  const m = readLocal();
  const prev = m[id];
  if (!prev) return null;
  // Иммутабельно: запись пересобираем, а не мутируем на месте.
  const rec: Directive = { ...prev, ...patch, updatedAt: new Date().toISOString() };
  m[id] = rec;
  writeLocal(m);
  return rec;
}

export const setDirectiveStatus = (id: string, status: DirectiveStatus) =>
  patchDirective(id, { status });
