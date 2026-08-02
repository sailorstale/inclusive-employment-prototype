import * as React from "react";
import { TargetFields, type DirectiveDraft } from "./TargetFields";

/*
  Карточка-директива: для выделенных блоков задаёт «во что превратить +
  модификаторы + комментарий». Текст блоков не трогает — только разметку.
  Сохранение (сборку блоков, id, отправку на сервер) делает SourcePage; карточка
  лишь собирает черновик и отдаёт его наверх. Сами поля — общие с правкой уже
  сохранённой директивы (TargetFields).
*/

export type { DirectiveDraft } from "./TargetFields";

const EMPTY: DirectiveDraft = {
  target: null,
  targetLabel: null,
  modifiers: {},
  comment: "",
};

export function DirectiveCard({
  count,
  blockTexts = [],
  onSave,
}: {
  count: number;
  /** Тексты выделенных блоков — для превью подобранных иконок. */
  blockTexts?: string[];
  onSave: (draft: DirectiveDraft) => void;
}) {
  const [draft, setDraft] = React.useState<DirectiveDraft>(EMPTY);

  const canSave = Boolean(draft.target) || draft.comment.trim().length > 0;

  const save = () => {
    onSave({ ...draft, comment: draft.comment.trim() });
    setDraft(EMPTY);
  };

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="text-sm font-medium text-foreground">
        Новая директива · {count} блок(ов)
      </div>

      <TargetFields draft={draft} onChange={setDraft} blockTexts={blockTexts} />

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
