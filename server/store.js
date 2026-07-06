import { createJsonStore } from "./jsonStore.js";

// Хранилище правок редактора — один JSON-файл на диске сервиса.
// Для нескольких человек и пары сотен правок этого с запасом. Запись
// сериализована (очередь), пишем атомарно (tmp + rename), чтобы не побить файл.
// На Railway DATA_DIR указывает на примонтированный том, чтобы правки переживали
// передеплои.

const store = createJsonStore("edits.json", "store");
export const getAll = store.getAll;

export function upsert(id, patch) {
  return store.enqueue((c) => {
    const now = new Date().toISOString();
    const prev = c[id];
    // Любая новая правка сбрасывает статус переноса: разработчику снова видно «новая».
    const rec = {
      id,
      page: patch.page ?? prev?.page ?? null,
      anchor: patch.anchor ?? prev?.anchor ?? null,
      file: patch.file ?? prev?.file ?? null,
      blockType: patch.blockType ?? prev?.blockType ?? null,
      kind: patch.kind,
      variantKey: patch.variantKey ?? null,
      text: patch.text,
      original: patch.original ?? prev?.original ?? null,
      status: "new",
      editedAt: now,
      appliedAt: null,
      verifiedAt: null,
      rollbackAt: null,
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
    const now = new Date().toISOString();
    rec.status = status;
    if (status === "applied") {
      rec.appliedAt = now;
      rec.verifiedAt = null;
      rec.rollbackAt = null;
    } else if (status === "verified") {
      rec.appliedAt = rec.appliedAt || now;
      rec.verifiedAt = now;
      rec.rollbackAt = null;
    } else if (status === "rollback") {
      // запрошен откат уже внесённой правки — даты переноса сохраняем
      rec.rollbackAt = now;
    } else {
      rec.appliedAt = null;
      rec.verifiedAt = null;
      rec.rollbackAt = null;
    }
    return rec;
  });
}
