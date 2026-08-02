import * as React from "react";
import { TARGET_GROUPS, findTarget, defaultModifiers } from "./componentTargets";
import { iconForText } from "./iconForText";

/*
  Поля директивы: «во что превратить» + модификаторы + комментарий. Один и тот
  же набор нужен дважды — при создании (DirectiveCard) и при правке уже
  сохранённой директивы (DirectiveList). Компонент управляемый: своего состояния
  не держит, всё поднято наверх, чтобы обе поверхности работали одинаково.
*/

export type DirectiveDraft = {
  target: string | null;
  targetLabel: string | null;
  modifiers: Record<string, string | boolean>;
  comment: string;
};

/** Черновик под выбранную цель: метка и дефолтные модификаторы — из конфига. */
export function draftWithTarget(draft: DirectiveDraft, value: string): DirectiveDraft {
  return {
    ...draft,
    target: value || null,
    targetLabel: findTarget(value || null)?.label ?? null,
    modifiers: value ? defaultModifiers(value) : {},
  };
}

export function TargetFields({
  draft,
  onChange,
  blockTexts = [],
}: {
  draft: DirectiveDraft;
  onChange: (next: DirectiveDraft) => void;
  /** Тексты блоков директивы — для превью подобранных иконок. */
  blockTexts?: string[];
}) {
  const t = findTarget(draft.target);

  return (
    <>
      <label className="mt-3 block text-xs font-medium text-muted-foreground">
        Во что превратить
      </label>
      <select
        value={draft.target ?? ""}
        onChange={(e) => onChange(draftWithTarget(draft, e.target.value))}
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
                  value={String(draft.modifiers[m.key] ?? m.default)}
                  onChange={(e) =>
                    onChange({
                      ...draft,
                      modifiers: { ...draft.modifiers, [m.key]: e.target.value },
                    })
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
                  checked={Boolean(draft.modifiers[m.key])}
                  onChange={(e) =>
                    onChange({
                      ...draft,
                      modifiers: { ...draft.modifiers, [m.key]: e.target.checked },
                    })
                  }
                  className="size-4"
                />
              )}
            </div>
          ))}
        </div>
      ) : null}

      {draft.target === "GeneralCard" && draft.modifiers.icon && blockTexts.length ? (
        <div className="mt-3 rounded-md border bg-muted/30 p-2">
          <div className="text-xs font-medium text-muted-foreground">
            Иконки по тексту (Lucide)
          </div>
          <ul className="mt-1.5 space-y-1">
            {blockTexts.map((txt, i) => {
              const { Icon } = iconForText(txt);
              return (
                <li
                  key={i}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <Icon className="size-4 shrink-0 text-foreground" />
                  <span className="truncate">{txt}</span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <label className="mt-3 block text-xs font-medium text-muted-foreground">
        Комментарий
      </label>
      <textarea
        value={draft.comment}
        onChange={(e) => onChange({ ...draft, comment: e.target.value })}
        rows={3}
        placeholder="Например: раскидай по карточкам, заголовки убери"
        className="mt-1 w-full resize-y rounded-md border bg-background px-2 py-1.5 text-sm"
      />
    </>
  );
}
