import { createJsonStore } from "./jsonStore.js";

// Хранилище комментариев-пинов (Figma-стиль). Отдельный JSON-файл рядом с
// правками. Та же модель: общий, без авторизации, атомарная запись через очередь.

let counter = 0;
const store = createJsonStore("comments.json", "comments");
export const getAll = store.getAll;

export function create(data) {
  return store.enqueue((c) => {
    const now = new Date().toISOString();
    const id = `c_${Date.now().toString(36)}_${(counter++).toString(36)}`;
    const rec = {
      id,
      page: data.page ?? null,
      anchorText: data.anchorText ?? null,
      dx: Number(data.dx) || 0,
      dy: Number(data.dy) || 0,
      text: String(data.text || ""),
      author: data.author ?? null,
      resolved: false,
      createdAt: now,
      resolvedAt: null,
    };
    c[id] = rec;
    return rec;
  });
}

export function update(id, patch) {
  return store.enqueue((c) => {
    const rec = c[id];
    if (!rec) return null;
    if (typeof patch.text === "string") rec.text = patch.text;
    if (typeof patch.resolved === "boolean") {
      rec.resolved = patch.resolved;
      rec.resolvedAt = patch.resolved ? new Date().toISOString() : null;
    }
    return rec;
  });
}

export function remove(id) {
  return store.enqueue((c) => {
    delete c[id];
    return true;
  });
}
