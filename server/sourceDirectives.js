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
      // Служебные поля живут отдельно от разметки: правка цели или комментария
      // не должна стирать «кто завёл», решение по предложению и выключение.
      origin: patch.origin ?? prev?.origin,
      review: patch.review ?? prev?.review,
      note: patch.note ?? prev?.note,
      off: typeof patch.off === "boolean" ? patch.off : prev?.off,
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

/*
  Точечная правка служебных полей: статус переноса (new|applied|verified),
  решение по предложению (proposed|accepted|rejected) и выключение. Разметку не
  трогает — она приходит через upsert.
*/
export function patch(id, fields) {
  return store.enqueue((c) => {
    const prev = c[id];
    if (!prev) return null;
    const rec = { ...prev, ...fields, updatedAt: new Date().toISOString() };
    c[id] = rec;
    return rec;
  });
}

export const setStatus = (id, status) => patch(id, { status });
