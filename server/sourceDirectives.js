import { createJsonStore } from "./jsonStore.js";

// Хранилище ДИРЕКТИВ раскладки на компоненты (инструмент «Редактура источника»,
// колонка «Плейграунд» → таб «Разметка»). Директива описывает: какие блоки, во
// что превратить, с какими модификаторами и с каким комментарием. ТЕКСТ здесь не
// хранится и не меняется — только ссылки на блоки (по стабильным id) и разметка.
// Отдельный файл source-directives.json, аддитивно рядом с правками источника.

const store = createJsonStore("source-directives.json", "source-directives");
export const getAll = store.getAll;

export function upsert(id, patch) {
  return store.enqueue((c) => {
    const now = new Date().toISOString();
    const prev = c[id];
    const rec = {
      id,
      module: patch.module ?? prev?.module ?? null,
      blocks: Array.isArray(patch.blocks) ? patch.blocks : prev?.blocks ?? [],
      target: patch.target ?? prev?.target ?? null,
      targetLabel: patch.targetLabel ?? prev?.targetLabel ?? null,
      modifiers: patch.modifiers ?? prev?.modifiers ?? {},
      comment: typeof patch.comment === "string" ? patch.comment : prev?.comment ?? "",
      status: prev?.status ?? "new",
      createdAt: prev?.createdAt ?? now,
      updatedAt: now,
    };
    c[id] = rec;
    return rec;
  });
}

export function remove(id) {
  return store.enqueue((c) => {
    delete c[id];
    return true;
  });
}

export function setStatus(id, status) {
  return store.enqueue((c) => {
    const rec = c[id];
    if (!rec) return null;
    rec.status = status;
    rec.updatedAt = new Date().toISOString();
    return rec;
  });
}
