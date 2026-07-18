import * as React from "react";
import {
  TARGET_GROUPS,
  findTarget,
  defaultModifiers,
} from "./componentTargets";

/*
  Карточка-директива: для выделенных блоков задаёт «во что превратить +
  модификаторы + комментарий». Текст блоков не трогает — только разметку.
  Сохранение (сборку блоков, id, отправку на сервер) делает SourcePage; карточка
  лишь собирает черновик и отдаёт его наверх.
*/

export type DirectiveDraft = {
  target: string | null;
  targetLabel: string | null;
  modifiers: Record<string, string | boolean>;
  comment: string;
};

export function DirectiveCard({
  count,
  onSave,
}: {
  count: number;
  onSave: (draft: DirectiveDraft) => void;
}) {
  const [target, setTarget] = React.useState("");
  const [modifiers, setModifiers] = React.useState<
    Record<string, string | boolean>
  >({});
  const [comment, setComment] = React.useState("");

  const t = findTarget(target || null);
  const canSave = Boolean(target) || comment.trim().length > 0;

  const pickTarget = (v: string) => {
    setTarget(v);
    setModifiers(v ? defaultModifiers(v) : {});
  };

  const save = () => {
    onSave({
      target: target || null,
      targetLabel: t?.label ?? null,
      modifiers,
      comment: comment.trim(),
    });
    setTarget("");
    setModifiers({});
    setComment("");
  };

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="text-sm font-medium text-foreground">
        Новая директива · {count} блок(ов)
      </div>

      <label className="mt-3 block text-xs font-medium text-muted-foreground">
        Во что превратить
      </label>
      <select
        value={target}
        onChange={(e) => pickTarget(e.target.value)}
        className="mt-1 w-full rounded-md border bg-background px-2 py-1.5 text-sm"
      >
        <option value="">— не менять (только комментарий) —</option>
        {TARGET_GROUPS.map((g) => (
          <optgroup key={g.group} label={g.group}>
            {g.items.map((it) => (
              <option key={it.value} value={it.value}>
                {it.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {t?.modifiers?.length ? (
        <div className="mt-3 space-y-2 rounded-md bg-muted/40 p-2">
          {t.modifiers.map((m) => (
            <div key={m.key} className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">{m.label}</span>
              {m.type === "select" ? (
                <select
                  value={String(modifiers[m.key] ?? m.default)}
                  onChange={(e) =>
                    setModifiers((p) => ({ ...p, [m.key]: e.target.value }))
                  }
                  className="rounded-md border bg-background px-2 py-1 text-sm"
                >
                  {m.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="checkbox"
                  checked={Boolean(modifiers[m.key])}
                  onChange={(e) =>
                    setModifiers((p) => ({ ...p, [m.key]: e.target.checked }))
                  }
                  className="size-4"
                />
              )}
            </div>
          ))}
        </div>
      ) : null}

      <label className="mt-3 block text-xs font-medium text-muted-foreground">
        Комментарий
      </label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="Например: раскидай по карточкам, заголовки убери"
        className="mt-1 w-full resize-y rounded-md border bg-background px-2 py-1.5 text-sm"
      />

      <button
        type="button"
        disabled={!canSave}
        onClick={save}
        className="mt-3 w-full rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-brand-foreground transition-opacity disabled:opacity-50"
      >
        Сохранить директиву
      </button>
    </div>
  );
}
