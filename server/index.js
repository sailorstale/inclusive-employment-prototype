import express from "express";
import path from "node:path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import * as store from "./store.js";
import * as comments from "./comments.js";
import * as unify from "./unify.js";
import * as sourceStore from "./sourceStore.js";
import * as sourceComments from "./sourceComments.js";
import * as sourceDirectives from "./sourceDirectives.js";

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

/*
  ДОСТУП. Чтение свободное — прототип смотрят по ссылке. Запись (создать,
  изменить, удалить правку, комментарий, директиву) требует общий пароль
  APP_PASSWORD: он приходит в заголовке X-Auth, клиент кладёт его туда сам
  (см. src/editor-source/auth.ts).

  Раньше пароль проверялся ТОЛЬКО в браузере, а сервер его не читал вовсе —
  то есть замок висел на двери, которой нет: любой запрос мимо интерфейса
  проходил. Для локальной работы ничего не меняется: если APP_PASSWORD не
  задан, защиты нет и всё работает как раньше.

  Удаление здесь необратимое, бэкапа кроме ежедневного нет, поэтому закрываем
  именно запись.
*/
const PASSWORD = process.env.APP_PASSWORD || "";
const WRITE = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const passwordOk = (req) => !PASSWORD || req.get("X-Auth") === PASSWORD;

const api = express.Router();

/*
  Статус замка. Всегда 200, даже без пароля: этот же адрес Railway дёргает как
  healthcheck (railway.json → healthcheckPath), и 401 уронил бы деплой.
*/
api.get("/auth", (req, res) => {
  res.json({ required: Boolean(PASSWORD), ok: passwordOk(req) });
});

api.use((req, res, next) => {
  if (WRITE.has(req.method) && !passwordOk(req)) {
    console.warn(`[auth] отказ: ${req.method} ${req.originalUrl}`);
    return res.status(401).json({ error: "Нужен пароль" });
  }
  next();
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

// Решения по унификации типов контента.
api.get("/unify", async (_req, res) => {
  res.json(await unify.getAll());
});
api.put("/unify/:type", async (req, res) => {
  const approach = req.body?.approach ?? null;
  if (approach && !["convention", "component"].includes(approach)) {
    return res.status(400).json({ error: "approach: convention|component" });
  }
  res.json(await unify.setDecision(req.params.type, approach));
});
api.delete("/unify/:type", async (req, res) => {
  await unify.clearDecision(req.params.type);
  res.json({ ok: true });
});

// Инструмент «Редактура источника» — скоуп /api/source (свои файлы
// source-edits.json / source-comments.json, не пересекается с сайтовыми).
// Роуты те же, что у сайтовых правок и комментариев.
const sourceApi = express.Router();
sourceApi.get("/edits", async (_req, res) => {
  res.json(await sourceStore.getAll());
});
sourceApi.put("/edits/:id", async (req, res) => {
  const body = req.body || {};
  if (typeof body.text !== "string" || !body.kind) {
    return res.status(400).json({ error: "kind и text обязательны" });
  }
  res.json(await sourceStore.upsert(req.params.id, body));
});
sourceApi.delete("/edits/:id", async (req, res) => {
  await sourceStore.remove(req.params.id);
  res.json({ ok: true });
});
sourceApi.patch("/edits/:id/status", async (req, res) => {
  const status = req.body?.status;
  if (!["new", "applied", "verified", "rollback"].includes(status)) {
    return res.status(400).json({ error: "status: new|applied|verified|rollback" });
  }
  const rec = await sourceStore.setStatus(req.params.id, status);
  if (!rec) return res.status(404).json({ error: "не найдено" });
  res.json(rec);
});
sourceApi.get("/comments", async (_req, res) => {
  res.json(await sourceComments.getAll());
});
sourceApi.post("/comments", async (req, res) => {
  const body = req.body || {};
  if (typeof body.text !== "string") {
    return res.status(400).json({ error: "text обязателен" });
  }
  res.json(await sourceComments.create(body));
});
sourceApi.patch("/comments/:id", async (req, res) => {
  const rec = await sourceComments.update(req.params.id, req.body || {});
  if (!rec) return res.status(404).json({ error: "не найдено" });
  res.json(rec);
});
sourceApi.delete("/comments/:id", async (req, res) => {
  await sourceComments.remove(req.params.id);
  res.json({ ok: true });
});

// Директивы раскладки на компоненты (плейграунд → «Разметка»).
sourceApi.get("/directives", async (_req, res) => {
  res.json(await sourceDirectives.getAll());
});
sourceApi.put("/directives/:id", async (req, res) => {
  const body = req.body || {};
  if (!Array.isArray(body.blocks) || body.blocks.length === 0) {
    return res.status(400).json({ error: "blocks обязательны" });
  }
  res.json(await sourceDirectives.upsert(req.params.id, body));
});
sourceApi.delete("/directives/:id", async (req, res) => {
  await sourceDirectives.remove(req.params.id);
  res.json({ ok: true });
});
sourceApi.patch("/directives/:id/status", async (req, res) => {
  const status = req.body?.status;
  if (!["new", "applied", "verified"].includes(status)) {
    return res.status(400).json({ error: "status: new|applied|verified" });
  }
  const rec = await sourceDirectives.setStatus(req.params.id, status);
  if (!rec) return res.status(404).json({ error: "не найдено" });
  res.json(rec);
});

api.use("/source", sourceApi);

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
