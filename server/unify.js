import { createJsonStore } from "./jsonStore.js";

// Решения по унификации: какой подход выбран для типа контента. Один JSON-файл
// на томе (как правки/комментарии). Запись атомарная + очередь.

const store = createJsonStore("unify.json", "unify");
export const getAll = store.getAll;

export function setDecision(type, approach) {
  return store.enqueue((c) => {
    const rec = {
      type,
      approach: approach ?? null,
      decidedAt: new Date().toISOString(),
    };
    c[type] = rec;
    return rec;
  });
}

export function clearDecision(type) {
  return store.enqueue((c) => {
    delete c[type];
    return true;
  });
}
