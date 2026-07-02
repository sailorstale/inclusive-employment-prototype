import { promises as fs } from "node:fs";
import path from "node:path";

// Хранилище правок редактора — один JSON-файл на диске сервиса.
// Для нескольких человек и пары сотен правок этого с запасом. Запись
// сериализована (очередь), пишем атомарно (tmp + rename), чтобы не побить файл.
// На Railway DATA_DIR указывает на примонтированный том, чтобы правки переживали
// передеплои.

const DATA_DIR = process.env.DATA_DIR || path.resolve(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "edits.json");

let cache = null;
let writeChain = Promise.resolve();

async function ensure() {
  if (cache) return cache;
  let raw;
  try {
    raw = await fs.readFile(FILE, "utf8");
  } catch {
    cache = {}; // файла нет — это норма (первый запуск)
    return cache;
  }
  try {
    cache = JSON.parse(raw);
  } catch {
    // Файл есть, но битый — НЕ обнуляем молча: сохраняем копию и громко логируем,
    // иначе первая же запись затрёт повреждённые данные пустотой.
    const bad = `${FILE}.corrupt.${Date.now()}`;
    try {
      await fs.rename(FILE, bad);
    } catch {
      /* ignore */
    }
    console.error(`[store] Битый ${FILE} → сохранён как ${bad}. Стартую с пустого.`);
    cache = {};
  }
  return cache;
}

async function flush() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = FILE + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(cache, null, 2), "utf8");
  await fs.rename(tmp, FILE);
}

function enqueue(mutator) {
  writeChain = writeChain.then(async () => {
    await ensure();
    const result = mutator(cache);
    await flush();
    return result;
  });
  return writeChain;
}

export async function getAll() {
  const c = await ensure();
  return Object.values(c);
}

export function upsert(id, patch) {
  return enqueue((c) => {
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
  return enqueue((c) => {
    delete c[id];
    return true;
  });
}

export function setStatus(id, status) {
  return enqueue((c) => {
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
