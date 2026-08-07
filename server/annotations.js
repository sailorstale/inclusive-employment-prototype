import { createJsonStore } from "./jsonStore.js";

/*
  АННОТАЦИИ БЛОКОВ — комментарий, привязанный к блоку его же адресом.

  Отличие от пинов (comments.js): у пина id выдаёт сервер, а у аннотации id —
  это адрес блока, который клиент уже знает. Поэтому запись не «создаётся», а
  апсертится по id: второй комментарий к тому же блоку заменяет первый, а не
  плодит дубль. Клиент так и обращается — PUT на /comments/<id блока>.

  Форма записи совпадает с типом Comment в editor-source/comments.ts. Поля,
  которых в запросе нет, берутся из прошлой записи: клиент шлёт только то, что
  меняет (например, одну галочку «решено»).
*/
/** Запись аннотации: чего нет в запросе — берём из прошлой версии. */
export function annotationRecord(id, patch, prev) {
  const now = new Date().toISOString();
  return {
    id,
    page: patch.page ?? prev?.page ?? null,
    blockType: patch.blockType ?? prev?.blockType ?? null,
    original: patch.original ?? prev?.original ?? null,
    author: patch.author ?? prev?.author ?? null,
    anchorText: patch.anchorText ?? prev?.anchorText ?? null,
    text: typeof patch.text === "string" ? patch.text : prev?.text ?? "",
    deleted: typeof patch.deleted === "boolean" ? patch.deleted : prev?.deleted ?? false,
    resolved:
      typeof patch.resolved === "boolean" ? patch.resolved : prev?.resolved ?? false,
    /*
      «Не применять» — замечание, которое дизайнер разбирает сам, а мы к нему не
      прикасаемся: обычно его ещё надо обсудить с клиентом. Отдельно от resolved
      («применено») намеренно: это разные исходы, и путать их нельзя.
    */
    skipped:
      typeof patch.skipped === "boolean" ? patch.skipped : prev?.skipped ?? false,
    createdAt: prev?.createdAt ?? now,
    updatedAt: now,
  };
}

/*
  Апсерт поверх ЧУЖОГО хранилища: комментарии-пины и аннотации живут в одном
  файле, и второй экземпляр createJsonStore на тот же файл держал бы свой кэш —
  две копии затирали бы записи друг друга. Поэтому сюда передают уже готовое
  хранилище, а не имя файла.
*/
export function upsertInto(store) {
  return (id, patch) =>
    store.enqueue((c) => {
      const rec = annotationRecord(id, patch, c[id]);
      c[id] = rec;
      return rec;
    });
}

/** Отдельное хранилище аннотаций (свой файл) — для потока review. */
export function createAnnotations(fileName, logTag) {
  const store = createJsonStore(fileName, logTag);
  return {
    getAll: store.getAll,
    upsert: upsertInto(store),
    remove: (id) =>
      store.enqueue((c) => {
        delete c[id];
        return true;
      }),
  };
}
