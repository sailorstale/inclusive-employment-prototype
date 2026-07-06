import { promises as fs } from "node:fs";
import path from "node:path";

// Фабрика файлового JSON-хранилища: один файл на диске, сериализованная запись
// (очередь), атомарная запись (tmp + rename), защита от битого файла (копия
// .corrupt + громкий лог, не обнуляем молча). Общая машинерия для правок,
// комментариев и решений унификации. На Railway DATA_DIR — примонтированный том.

export function createJsonStore(fileName, logTag) {
  const DATA_DIR = process.env.DATA_DIR || path.resolve(process.cwd(), "data");
  const FILE = path.join(DATA_DIR, fileName);

  let cache = null;
  let writeChain = Promise.resolve();

  async function ensure() {
    if (cache) return cache;
    let raw;
    try {
      raw = await fs.readFile(FILE, "utf8");
    } catch {
      cache = {}; // файла нет — норма (первый запуск)
      return cache;
    }
    try {
      cache = JSON.parse(raw);
    } catch {
      // Файл есть, но битый — НЕ обнуляем молча: сохраняем копию и громко логируем.
      const bad = `${FILE}.corrupt.${Date.now()}`;
      try {
        await fs.rename(FILE, bad);
      } catch {
        /* ignore */
      }
      console.error(
        `[${logTag}] Битый ${FILE} → сохранён как ${bad}. Стартую с пустого.`
      );
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

  async function getAll() {
    const c = await ensure();
    return Object.values(c);
  }

  return { getAll, enqueue };
}
