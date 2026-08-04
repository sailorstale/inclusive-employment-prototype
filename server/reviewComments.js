import { createAnnotations } from "./annotations.js";

/*
  КОММЕНТАРИИ К СТРАНИЦАМ САЙТА (скоуп review) — поток клиента и разработчика.

  До этого у потока не было серверного адреса вовсе: клиент пробовал
  /api/review/comments, получал 404 и молча переходил на localStorage. Комментарий
  сохранялся в браузере того, кто его написал, и больше никто его не видел —
  ровно то, ради чего комментарии и заводят.

  Свой файл, отдельный от правок источника и от пинов: это разговор о СТРАНИЦЕ
  («здесь непонятно», «переименуйте блок»), а не разметка текста.
*/
const store = createAnnotations("review-comments.json", "review-comments");

export const getAll = store.getAll;
export const upsert = store.upsert;
export const remove = store.remove;
