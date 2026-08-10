// Аннотации блока: КОММЕНТАРИЙ и пометка УДАЛЕНИЯ. Одна запись на блок (id =
// адрес блока, как у правки). Живёт рядом с правками, но отдельным хранилищем
// (свой файл/ключ), чтобы не смешивать «что написать» и «что сказать/убрать».
// Слой доступа: сервер, иначе localStorage. Скоуп делит сайт и «Редактуру
// источника». Запись апсертится по id (как правки) — надёжно, без потерь.
import { apiFetch } from "./auth";
import type { Scope } from "./store";

/*
  ОТВЕТ НА ЗАМЕЧАНИЕ — реплика второго раунда. Замечание разобрали, клиент
  прочитал, что мы сделали, и отвечает: «всё равно не то» или «а теперь вот это».
  Ответы копятся веткой под замечанием, и разговор не рассыпается на отдельные
  несвязанные записи.
*/
export type CommentReply = {
  author: string;
  text: string;
  /** Когда написан, ISO-строка. */
  at: string;
};

export type Comment = {
  /** Адрес блока (autoId) — одна аннотация на блок. */
  id: string;
  page: string | null;
  blockType?: string | null;
  /** Снимок текста блока — чтобы в сводке было видно, о чём речь. */
  original?: string | null;
  /** Текст комментария («» если блок только помечен на удаление). */
  text: string;
  /*
    РЕШЕНИЕ ДИЗАЙНЕРА — приписка поверх замечания клиента. Клиент говорит, что
    его смущает, а дизайнер тут же пишет, что с этим делать: «сделать карточкой
    «Пример» с картинкой, как остальные». Правку вносим по этой приписке, а не
    по догадке о том, чего клиент хотел.

    Отдельно от text намеренно: замечание клиента остаётся ровно таким, каким он
    его написал, и в панели видно, где чьи слова.
  */
  note?: string | null;
  /** Мягкое удаление: блок остаётся, но помечен убранным (можно вернуть). */
  deleted: boolean;
  resolved: boolean;
  /*
    «Не применять» — замечание разбирает дизайнер сам, мы к нему не прикасаемся:
    обычно его ещё надо обсудить с клиентом. Отдельно от resolved
    («применено») намеренно: это разные исходы, и путать их нельзя.
  */
  skipped?: boolean;
  /*
    Ветка ответов под замечанием. Дописывается с конца: клиент шлёт одну реплику,
    сервер кладёт её в хвост. Старые записи поля не имеют — читать через `?? []`.
  */
  replies?: CommentReply[];
  createdAt: string;
  updatedAt: string;
  /** Автор комментария (поток «review»: клиент/разработчик представляется). */
  author?: string | null;
  /** Легаси-поле старых комментариев-пинов: текст блока-якоря. Новые записи его
   *  не пишут (привязка по id блока), но старые уже сохранённые — сохраняем и
   *  показываем как ссылку на блок, чтобы не потерять смысл правки. */
  anchorText?: string | null;
};

export type CommentInput = {
  id: string;
  page?: string | null;
  blockType?: string | null;
  original?: string | null;
  text?: string;
  note?: string;
  deleted?: boolean;
  resolved?: boolean;
  skipped?: boolean;
  author?: string | null;
  /*
    Одна новая реплика в ветку. Именно одна, а не весь список: сервер дописывает
    её в конец, поэтому две открытые вкладки не затирают ответы друг друга.
  */
  reply?: { author: string; text: string };
};

const API = { site: "/api", source: "/api/source", review: "/api/review" } as const;
const LOCAL_KEY = {
  site: "inclusion-comments-v2",
  source: "inclusion-source-comments-v2",
  review: "inclusion-site-review-v1",
} as const;

// review-поток — свой ключ в localStorage; серверного эндпоинта нет, поэтому
// остаётся локальным (как и остальные комментарии в деве).
const modes: Record<Scope, "server" | "local"> = {
  site: "local",
  source: "local",
  review: "local",
};
export const getCommentsMode = (scope: Scope = "site") => modes[scope];

function readLocal(scope: Scope): Record<string, Comment> {
  try {
    const raw = localStorage.getItem(LOCAL_KEY[scope]);
    const parsed = raw ? (JSON.parse(raw) as Record<string, Comment>) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeLocal(scope: Scope, map: Record<string, Comment>) {
  localStorage.setItem(LOCAL_KEY[scope], JSON.stringify(map));
}

export async function loadComments(scope: Scope = "site"): Promise<Comment[]> {
  try {
    const r = await apiFetch(`${API[scope]}/comments`);
    if (r.ok) {
      modes[scope] = "server";
      return (await r.json()) as Comment[];
    }
  } catch {
    /* нет сервера — локально */
  }
  modes[scope] = "local";
  return Object.values(readLocal(scope));
}

/** Дописать реплику в ветку ответов — как это делает сервер (annotations.js). */
function appendReply(
  prev: CommentReply[] | undefined,
  add: CommentInput["reply"],
  now: string
): CommentReply[] {
  const list = prev ?? [];
  if (!add || !add.text.trim()) return list;
  return [...list, { author: add.author.trim(), text: add.text.trim(), at: now }];
}

/** Создать/обновить аннотацию блока (апсерт по id). */
export async function saveComment(
  input: CommentInput,
  scope: Scope = "site"
): Promise<Comment> {
  if (modes[scope] === "server") {
    const r = await apiFetch(`${API[scope]}/comments/${encodeURIComponent(input.id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!r.ok) throw new Error(`Комментарий не сохранён: ${r.status}`);
    return (await r.json()) as Comment;
  }
  const map = readLocal(scope);
  const now = new Date().toISOString();
  const prev = map[input.id];
  const rec: Comment = {
    id: input.id,
    page: input.page ?? prev?.page ?? null,
    blockType: input.blockType ?? prev?.blockType ?? null,
    original: input.original ?? prev?.original ?? null,
    author: input.author ?? prev?.author ?? null,
    text: typeof input.text === "string" ? input.text : prev?.text ?? "",
    note: typeof input.note === "string" ? input.note : prev?.note ?? "",
    deleted: typeof input.deleted === "boolean" ? input.deleted : prev?.deleted ?? false,
    resolved: typeof input.resolved === "boolean" ? input.resolved : prev?.resolved ?? false,
    /*
      Локальная копия повторяет то же, что делает сервер (annotations.js), иначе
      без сети пометки и ветка ответов пропадали бы при каждом сохранении.
    */
    skipped: typeof input.skipped === "boolean" ? input.skipped : prev?.skipped ?? false,
    anchorText: prev?.anchorText ?? null,
    replies: appendReply(prev?.replies, input.reply, now),
    createdAt: prev?.createdAt ?? now,
    updatedAt: now,
  };
  map[rec.id] = rec;
  writeLocal(scope, map);
  return rec;
}

export async function deleteComment(id: string, scope: Scope = "site"): Promise<void> {
  if (modes[scope] === "server") {
    const r = await apiFetch(`${API[scope]}/comments/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!r.ok) throw new Error(`Удаление аннотации не удалось: ${r.status}`);
    return;
  }
  const map = readLocal(scope);
  delete map[id];
  writeLocal(scope, map);
}
