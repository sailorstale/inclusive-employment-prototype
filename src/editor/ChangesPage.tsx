import * as React from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Copy,
  Download,
  Eye,
  MessageSquare,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditor } from "./EditorProvider";
import { useComments } from "./CommentsProvider";
import { apiFetch } from "./auth";
import { stripMarkdown } from "./richText";
import type { EditRecord } from "./types";
import type { Comment } from "./comments";

// Страница «Изменения» — рабочий экран для разработчика и клиента. Список всех
// правок по страницам: было → стало, дата, тип; статусы новая → внесена →
// проверена (+ запрошен откат). Копирование нового текста для переноса в
// конструктор, бэкап всех данных. НЕ использует Prose/ContentSection, чтобы сам
// дашборд не стал редактируемым.

const fmt = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString("ru-RU") : "";

const STATUS_META: Record<
  EditRecord["status"],
  { label: string; cls: string }
> = {
  new: {
    label: "🟡 новая",
    cls: "bg-[hsl(var(--warn)/0.12)] text-[hsl(var(--warn))]",
  },
  applied: {
    label: "✅ внесена",
    cls: "bg-[hsl(var(--ok)/0.12)] text-[hsl(var(--ok))]",
  },
  verified: {
    label: "👁 проверена",
    cls: "bg-[hsl(var(--brand)/0.1)] text-brand",
  },
  rollback: {
    label: "↩ запрошен откат",
    cls: "bg-[hsl(var(--bad)/0.12)] text-[hsl(var(--bad))]",
  },
};

type Filter = "all" | "new" | "rollback" | "orphan";

export function ChangesPage() {
  const { edits, setStatus, revert, orphanStatus } = useEditor();
  const { comments, toggleResolved } = useComments();
  const [filter, setFilter] = React.useState<Filter>("all");
  const [copied, setCopied] = React.useState<string | null>(null);
  const [backupNote, setBackupNote] = React.useState<string | null>(null);

  const list = React.useMemo(
    () =>
      Object.values(edits).sort(
        (a, b) => (b.editedAt || "").localeCompare(a.editedAt || "")
      ),
    [edits]
  );

  const counts = React.useMemo(() => {
    const c = { new: 0, applied: 0, verified: 0, rollback: 0 };
    for (const e of list) c[e.status]++;
    return c;
  }, [list]);

  const orphanCount = list.filter(
    (e) => orphanStatus(e.id, e.page ?? "") === "orphan"
  ).length;
  const uncheckedCount = list.filter(
    (e) => orphanStatus(e.id, e.page ?? "") === "unchecked"
  ).length;

  const shown = list.filter((e) =>
    filter === "all"
      ? true
      : filter === "orphan"
        ? orphanStatus(e.id, e.page ?? "") === "orphan"
        : e.status === filter
  );

  // Группировка по странице (с сохранением сортировки по дате).
  const byPage = React.useMemo(() => {
    const m = new Map<string, EditRecord[]>();
    for (const e of shown) {
      const key = e.page || "—";
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(e);
    }
    return [...m.entries()];
  }, [shown]);

  const openComments = comments.filter((c) => !c.resolved).length;
  const commentsByPage = React.useMemo(() => {
    const sorted = [...comments].sort((a, b) =>
      (b.createdAt || "").localeCompare(a.createdAt || "")
    );
    const m = new Map<string, Comment[]>();
    for (const c of sorted) {
      const key = c.page || "—";
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(c);
    }
    return [...m.entries()];
  }, [comments]);

  const copy = (id: string, text: string) => {
    navigator.clipboard
      ?.writeText(text)
      .then(() => {
        setCopied(id);
        setTimeout(() => setCopied((c) => (c === id ? null : c)), 1500);
      })
      .catch(() => setCopied(null));
  };

  const saveBackup = (data: unknown) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadBackup = async () => {
    setBackupNote(null);
    try {
      const [e, c] = await Promise.all([
        apiFetch("/api/edits"),
        apiFetch("/api/comments"),
      ]);
      saveBackup({
        exportedAt: new Date().toISOString(),
        edits: e.ok ? await e.json() : Object.values(edits),
        comments: c.ok ? await c.json() : comments,
      });
    } catch {
      // Сервер недоступен — не молчим: сохраняем локальную копию из состояния
      // и честно предупреждаем, что она может быть неполной.
      saveBackup({
        exportedAt: new Date().toISOString(),
        edits: Object.values(edits),
        comments,
        note: "Локальная копия: сервер был недоступен, данные могут быть неполными.",
      });
      setBackupNote(
        "Сервер недоступен — сохранена локальная копия (может быть неполной)."
      );
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Изменения
        </h1>
        <p className="max-w-prose text-muted-foreground">
          Правки текста, ожидающие переноса в реальный сайт. Разработчик копирует
          новый текст, вносит и отмечает «внесено»; затем заказчик проверяет.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <Stat label="не внесено" value={counts.new} />
        <Stat label="внесено" value={counts.applied} />
        <Stat label="проверено" value={counts.verified} />
        {counts.rollback > 0 ? (
          <Stat label="откаты" value={counts.rollback} bad />
        ) : null}
        {comments.length > 0 ? (
          <Stat label="комментарии" value={openComments} />
        ) : null}
        <button
          type="button"
          onClick={downloadBackup}
          className="ml-auto inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <Download className="h-4 w-4" />
          Скачать бэкап
        </button>
      </div>

      {backupNote ? (
        <p className="text-xs text-[hsl(var(--warn))]">{backupNote}</p>
      ) : null}

      <div className="flex flex-wrap gap-1.5">
        <FilterBtn active={filter === "all"} onClick={() => setFilter("all")}>
          Все ({list.length})
        </FilterBtn>
        <FilterBtn active={filter === "new"} onClick={() => setFilter("new")}>
          Не внесённые ({counts.new})
        </FilterBtn>
        {counts.rollback > 0 ? (
          <FilterBtn
            active={filter === "rollback"}
            onClick={() => setFilter("rollback")}
          >
            Откаты ({counts.rollback})
          </FilterBtn>
        ) : null}
        {orphanCount > 0 ? (
          <FilterBtn
            active={filter === "orphan"}
            onClick={() => setFilter("orphan")}
          >
            Осиротевшие ({orphanCount})
          </FilterBtn>
        ) : null}
      </div>

      {uncheckedCount > 0 ? (
        <p className="rounded-md bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          {uncheckedCount}{" "}
          {uncheckedCount === 1 ? "правка" : "правок"} на ещё не открытых
          страницах. Откройте их страницы, чтобы проверить, что блоки на месте
          (иначе «осиротевшие» не вычислить).
        </p>
      ) : null}

      {shown.length === 0 ? (
        <p className="rounded-lg border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
          {list.length === 0
            ? "Пока нет правок. Включите «Редактор» и поправьте текст на любой странице."
            : "В этом фильтре пусто."}
        </p>
      ) : (
        byPage.map(([page, items]) => (
          <section key={page} className="space-y-3">
            <div className="flex items-center gap-2 border-b pb-1.5">
              <h2 className="text-sm font-semibold text-foreground">{page}</h2>
              <Link
                to={page}
                className="inline-flex items-center gap-1 text-xs text-brand hover:underline"
              >
                открыть <ArrowRight className="h-3 w-3" />
              </Link>
              <span className="ml-auto text-xs text-muted-foreground">
                {items.length}
              </span>
            </div>
            {items.map((e) => (
              <EditCard
                key={e.id}
                edit={e}
                orphan={orphanStatus(e.id, e.page ?? "") === "orphan"}
                copied={copied === e.id}
                onCopy={() =>
                  copy(
                    e.id,
                    e.status === "rollback" ? e.original || "" : e.text
                  )
                }
                onApply={() => setStatus(e.id, "applied")}
                onVerify={() => setStatus(e.id, "verified")}
                onRevert={() => revert(e.id)}
              />
            ))}
          </section>
        ))
      )}

      {commentsByPage.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b pb-1.5">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">
              Комментарии
            </h2>
            <span className="ml-auto text-xs text-muted-foreground">
              {openComments} открытых · {comments.length} всего
            </span>
          </div>
          {commentsByPage.map(([page, items]) => (
            <div key={page} className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-semibold text-muted-foreground">
                  {page}
                </h3>
                <Link
                  to={page}
                  className="inline-flex items-center gap-1 text-xs text-brand hover:underline"
                >
                  открыть <ArrowRight className="h-3 w-3" />
                </Link>
                <span className="ml-auto text-xs text-muted-foreground">
                  {items.length}
                </span>
              </div>
              {items.map((c) => (
                <CommentCard
                  key={c.id}
                  comment={c}
                  onToggle={() => toggleResolved(c.id, !c.resolved)}
                />
              ))}
            </div>
          ))}
        </section>
      ) : null}
    </div>
  );
}

function CommentCard({
  comment,
  onToggle,
}: {
  comment: Comment;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-lg border bg-card p-3 text-card-foreground">
      <div className="mb-1.5 flex flex-wrap items-center gap-2 text-xs">
        <span
          className={cn(
            "rounded-full px-2 py-0.5 font-medium",
            comment.resolved
              ? "bg-[hsl(var(--ok)/0.12)] text-[hsl(var(--ok))]"
              : "bg-[hsl(var(--warn)/0.12)] text-[hsl(var(--warn))]"
          )}
        >
          {comment.resolved ? "решён" : "открыт"}
        </span>
        {comment.author ? (
          <span className="text-muted-foreground">{comment.author}</span>
        ) : null}
        <span className="ml-auto text-muted-foreground">
          {fmt(comment.createdAt)}
        </span>
      </div>

      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
        {comment.text}
      </p>

      {comment.anchorText ? (
        <p className="mt-1.5 truncate text-xs text-muted-foreground">
          у блока: «{comment.anchorText.slice(0, 90)}»
        </p>
      ) : null}

      <div className="mt-3">
        <button
          type="button"
          onClick={onToggle}
          className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          {comment.resolved ? (
            <>
              <RotateCcw className="h-3.5 w-3.5" /> Открыть заново
            </>
          ) : (
            <>
              <Check className="h-3.5 w-3.5" /> Отметить решённым
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function EditCard({
  edit,
  orphan,
  copied,
  onCopy,
  onApply,
  onVerify,
  onRevert,
}: {
  edit: EditRecord;
  orphan?: boolean;
  copied: boolean;
  onCopy: () => void;
  onApply: () => void;
  onVerify: () => void;
  onRevert: () => void;
}) {
  const meta = STATUS_META[edit.status];
  const isRollback = edit.status === "rollback";
  const typeLabel =
    edit.kind === "variant"
      ? `вариант ${edit.variantKey === "a" ? "А" : "Б"}`
      : "своя правка";

  return (
    <div className="rounded-lg border bg-card p-3.5 text-card-foreground">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
        <span
          className={cn("rounded-full px-2 py-0.5 font-medium", meta.cls)}
        >
          {meta.label}
        </span>
        <span className="text-muted-foreground">{typeLabel}</span>
        {edit.blockType ? (
          <span className="text-muted-foreground">· {edit.blockType}</span>
        ) : null}
        <span className="ml-auto text-muted-foreground">{fmt(edit.editedAt)}</span>
      </div>

      <div className="space-y-1.5 text-sm leading-relaxed">
        <p className="text-muted-foreground line-through decoration-1">
          {edit.original}
        </p>
        <p className="text-foreground">{stripMarkdown(edit.text)}</p>
      </div>

      {orphan ? (
        <p className="mt-2 flex gap-1.5 rounded-md bg-[hsl(var(--warn)/0.1)] px-2.5 py-1.5 text-xs text-[hsl(var(--warn))]">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Блок не найден на странице — возможно, исходный текст изменили в коде.
          Сверьте вручную или верните оригинал.
        </p>
      ) : null}

      {isRollback ? (
        <p className="mt-2 rounded-md bg-[hsl(var(--bad)/0.08)] px-2.5 py-1.5 text-xs text-[hsl(var(--bad))]">
          Эта правка уже была внесена в сайт. Верните оригинал и в боевом сайте,
          затем нажмите «Готово».
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs hover:bg-accent"
        >
          <Copy className="h-3.5 w-3.5" />
          {copied
            ? "Скопировано"
            : isRollback
              ? "Копировать оригинал"
              : "Копировать текст"}
        </button>

        {edit.status === "new" ? (
          <button
            type="button"
            onClick={onApply}
            className="inline-flex items-center gap-1.5 rounded-md bg-brand px-2.5 py-1.5 text-xs font-medium text-brand-foreground hover:bg-[hsl(var(--brand)/0.9)]"
          >
            <Check className="h-3.5 w-3.5" />
            Внести в сайт
          </button>
        ) : null}

        {edit.status === "applied" ? (
          <button
            type="button"
            onClick={onVerify}
            className="inline-flex items-center gap-1.5 rounded-md border border-[hsl(var(--brand)/0.4)] px-2.5 py-1.5 text-xs font-medium text-brand hover:bg-[hsl(var(--brand)/0.08)]"
          >
            <Eye className="h-3.5 w-3.5" />
            Проверено
          </button>
        ) : null}

        <button
          type="button"
          onClick={onRevert}
          className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          {isRollback ? (
            <>
              <Trash2 className="h-3.5 w-3.5" /> Готово
            </>
          ) : (
            <>
              <RotateCcw className="h-3.5 w-3.5" /> Вернуть оригинал
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  bad,
}: {
  label: string;
  value: number;
  bad?: boolean;
}) {
  return (
    <div className="rounded-md bg-muted/60 px-3 py-1.5">
      <span
        className={cn(
          "text-base font-semibold",
          bad && value > 0 && "text-[hsl(var(--bad))]"
        )}
      >
        {value}
      </span>
      <span className="ml-1.5 text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function FilterBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md border px-3 py-1.5 text-sm transition-colors",
        active
          ? "border-[hsl(var(--brand)/0.5)] bg-[hsl(var(--brand)/0.1)] font-medium text-brand"
          : "text-muted-foreground hover:bg-accent"
      )}
    >
      {children}
    </button>
  );
}
