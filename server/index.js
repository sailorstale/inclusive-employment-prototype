import express from "express";
import path from "node:path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import * as store from "./store.js";
import * as comments from "./comments.js";

// Локально читаем prototype/.env (пароль и т.п.). На хостинге переменные задаёт
// сам хостинг — там .env нет, и это нормально. Реальные env-переменные имеют
// приоритет над .env.
try {
  const env = readFileSync(new URL("../.env", import.meta.url), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
} catch {
  /* нет .env — используем переменные окружения хостинга */
}

// Маленький сервер: отдаёт собранный сайт (dist/) и хранит правки редактора в
// общем JSON-файле. Без авторизации — доступ по ссылке (узкий доверенный круг).
// В dev фронт работает на vite (порт 5173/5174), а сюда ходит только за /api
// через прокси; в проде один процесс отдаёт и сайт, и API.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: "64kb" }));

// Общий пароль (доступ по ссылке + пароль). Если APP_PASSWORD не задан —
// доступ открыт (удобно для локальной разработки). На Railway задаётся в env.
const PASSWORD = process.env.APP_PASSWORD || "";

const api = express.Router();

// Проверка пароля (публичный эндпоинт — нужен экрану входа).
api.get("/auth", (req, res) => {
  const token = req.get("X-Auth") || "";
  res.json({ required: Boolean(PASSWORD), ok: !PASSWORD || token === PASSWORD });
});

// Дальше всё под паролем (если он задан).
api.use((req, res, next) => {
  if (!PASSWORD) return next();
  if ((req.get("X-Auth") || "") === PASSWORD) return next();
  res.status(401).json({ error: "Требуется пароль" });
});

api.get("/edits", async (_req, res) => {
  res.json(await store.getAll());
});

api.put("/edits/:id", async (req, res) => {
  const body = req.body || {};
  if (typeof body.text !== "string" || !body.kind) {
    return res.status(400).json({ error: "kind и text обязательны" });
  }
  res.json(await store.upsert(req.params.id, body));
});

api.delete("/edits/:id", async (req, res) => {
  await store.remove(req.params.id);
  res.json({ ok: true });
});

api.patch("/edits/:id/status", async (req, res) => {
  const status = req.body?.status;
  if (!["new", "applied", "verified", "rollback"].includes(status)) {
    return res.status(400).json({ error: "status: new|applied|verified|rollback" });
  }
  const rec = await store.setStatus(req.params.id, status);
  if (!rec) return res.status(404).json({ error: "не найдено" });
  res.json(rec);
});

// Комментарии-пины.
api.get("/comments", async (_req, res) => {
  res.json(await comments.getAll());
});
api.post("/comments", async (req, res) => {
  const body = req.body || {};
  if (typeof body.text !== "string") {
    return res.status(400).json({ error: "text обязателен" });
  }
  res.json(await comments.create(body));
});
api.patch("/comments/:id", async (req, res) => {
  const rec = await comments.update(req.params.id, req.body || {});
  if (!rec) return res.status(404).json({ error: "не найдено" });
  res.json(rec);
});
api.delete("/comments/:id", async (req, res) => {
  await comments.remove(req.params.id);
  res.json({ ok: true });
});

// Честный 404 на неизвестные /api/* (иначе SPA-фоллбэк отдаёт HTML со статусом
// 200, и клиент принимает опечатку за «сервер есть»).
api.use((_req, res) => res.status(404).json({ error: "Нет такого метода API" }));

app.use("/api", api);

// Прод: отдаём собранный фронт и SPA-фоллбэк на index.html.
const dist = path.resolve(__dirname, "..", "dist");
app.use(express.static(dist));
app.get("*", (_req, res) => {
  res.sendFile(path.join(dist, "index.html"), (err) => {
    if (err) res.status(404).send("Сборка не найдена. Выполните npm run build.");
  });
});

const port = process.env.PORT || 8787;
app.listen(port, () => {
  const dir = process.env.DATA_DIR || "data/ (по умолчанию)";
  console.log(`Сервер правок на :${port} · данные в ${dir}`);
  if (!process.env.DATA_DIR) {
    console.warn(
      "[!] DATA_DIR не задан — данные пишутся в папку контейнера и МОГУТ ПРОПАСТЬ при передеплое. На Railway смонтируйте том и задайте DATA_DIR."
    );
  }
});
