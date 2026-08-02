import * as React from "react";
import {
  Trash2,
  Check,
  Eye,
  Undo2,
  Pencil,
  Ban,
  Play,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  X,
} from "lucide-react";
import { TargetFields, type DirectiveDraft } from "./TargetFields";
import { iconByName } from "./iconForText";
import { KIND_LABEL } from "./blockResolve";
import type { Directive } from "@/editor-source/directives";

/*
  Список сохранённых директив в панели «Разметка» — и единственное место, где
  директиву можно ПОЛНОСТЬЮ править: цель, модификаторы, комментарий, состав
  блоков. Раньше правился только комментарий, всё остальное требовало удалить и
  завести заново — а вместе с директивой терялась и её история.

  Вторая роль списка — приёмка ПРЕДЛОЖЕНИЙ Claude. Предложение живёт в раскладке
  сразу (иначе его нечем проверить: судить можно только по «Результату»), но
  помечено и ждёт решения: принять или отклонить. Отклонённые не пропадают —
  лежат отдельным свёрнутым списком, чтобы решение можно было отыграть назад.
*/

export type DirectiveActions = {
  /** Перейти к блокам директивы в плейграунде. */
  onGoTo: (id: string) => void;
  onDelete: (id: string) => void;
  onSetStatus: (id: string, status: Directive["status"]) => void;
  /** Правка разметки: цель, модификаторы, комментарий. */
  onUpdate: (id: string, draft: DirectiveDraft) => void;
  /** Заменить блоки директивы текущим выделением в плейграунде. */
  onReplaceBlocks: (id: string) => void;
  onReview: (id: string, review: NonNullable<Directive["review"]>) => void;
  onToggleOff: (id: string, off: boolean) => void;
};

const STATUS_LABEL: Record<Directive["status"], string> = {
  new: "новая",
  applied: "применена",
  verified: "проверена",
};

// Шаг статуса назад — на случай ошибочного клика (панель — единственная поверхность).
const PREV_STATUS: Record<Directive["status"], Directive["status"] | null> = {
  new: null,
  applied: "new",
  verified: "applied",
};

const isProposal = (d: Directive) => d.review === "proposed";

export function DirectiveList({
  directives,
  selectedCount,
  actions,
}: {
  directives: Directive[];
  /** Сколько блоков выделено сейчас — столько уедет в «заменить блоки». */
  selectedCount: number;
  actions: DirectiveActions;
}) {
  const proposals = directives.filter(isProposal);
  const rejected = directives.filter((d) => d.review === "rejected");
  const mine = directives.filter(
    (d) => !isProposal(d) && d.review !== "rejected",
  );
  const [showRejected, setShowRejected] = React.useState(false);

  return (
    <div className="space-y-4">
      {proposals.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[hsl(var(--warn))]">
            <Sparkles className="size-3.5" /> Предложения · {proposals.length}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Уже видны в «Результате» — посмотрите и решите.
          </p>
          <ul className="mt-2 space-y-2">
            {proposals.map((d) => (
              <DirectiveRow
                key={d.id}
                d={d}
                selectedCount={selectedCount}
                actions={actions}
              />
            ))}
          </ul>
        </div>
      )}

      {mine.length > 0 && (
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Директивы · {mine.length}
          </div>
          <ul className="mt-2 space-y-2">
            {mine.map((d) => (
              <DirectiveRow
                key={d.id}
                d={d}
                selectedCount={selectedCount}
                actions={actions}
              />
            ))}
          </ul>
        </div>
      )}

      {rejected.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowRejected((v) => !v)}
            className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground"
          >
            {showRejected ? (
              <ChevronDown className="size-3.5" />
            ) : (
              <ChevronRight className="size-3.5" />
            )}
            Отклонённые · {rejected.length}
          </button>
          {showRejected && (
            <ul className="mt-2 space-y-2">
              {rejected.map((d) => (
                <DirectiveRow
                  key={d.id}
                  d={d}
                  selectedCount={selectedCount}
                  actions={actions}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function DirectiveRow({
  d,
  selectedCount,
  actions,
}: {
  d: Directive;
  selectedCount: number;
  actions: DirectiveActions;
}) {
  const [editing, setEditing] = React.useState(false);
  const [showBlocks, setShowBlocks] = React.useState(false);
  const proposal = isProposal(d);
  const rejected = d.review === "rejected";

  const mods = Object.entries(d.modifiers)
    .filter(([, v]) => v !== false && v !== "" && v != null)
    .map(([k, v]) => (v === true ? k : `${k}: ${v}`))
    .join(" · ");

  // Слева цветом — состояние: предложение ждёт решения, выключенная молчит.
  const accent = proposal
    ? "border-l-2 border-l-[hsl(var(--warn))]"
    : rejected || d.off
      ? "border-l-2 border-l-border"
      : "";

  return (
    <li className={`rounded-md border bg-card p-2.5 text-sm ${accent}`}>
      <div className="flex items-start justify-between gap-2">
        {/* Шапка — кнопка перехода: клик прокручивает плейграунд к блокам этой
            директивы. Так список перестал быть просто перечнем. */}
        <button
          type="button"
          onClick={() => actions.onGoTo(d.id)}
          title="Показать блоки в плейграунде"
          className="group min-w-0 flex-1 rounded px-1 py-0.5 text-left hover:bg-muted/60"
        >
          <span className="font-medium text-foreground">
            {d.targetLabel ?? "Комментарий"}
          </span>
          <ArrowRight className="ml-1 inline size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          <span className="ml-1 text-xs text-muted-foreground">
            {d.blocks.length} блок(ов) ·{" "}
            {proposal
              ? "предложение"
              : rejected
                ? "отклонено"
                : d.off
                  ? "выключена"
                  : STATUS_LABEL[d.status]}
          </span>
        </button>
        <button
          type="button"
          onClick={() => actions.onDelete(d.id)}
          aria-label="Удалить директиву"
          className="shrink-0 text-muted-foreground hover:text-[hsl(var(--bad))]"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      {mods && <div className="mt-0.5 text-xs text-muted-foreground">{mods}</div>}

      {d.blocks.some((b) => b.icon) && (
        <div className="mt-1 flex flex-wrap gap-1.5">
          {d.blocks
            .filter((b) => b.icon)
            .map((b, i) => {
              const Icon = iconByName(b.icon);
              return (
                <Icon
                  key={i}
                  className="size-4 text-muted-foreground"
                  aria-label={b.snippet}
                />
              );
            })}
        </div>
      )}

      {editing ? (
        <EditForm
          d={d}
          selectedCount={selectedCount}
          actions={actions}
          onClose={() => setEditing(false)}
        />
      ) : (
        <>
          {/* Комментарий — главный текст директивы и единственное место, где
              живёт замысел. У предложения его пишет Claude, дизайнер правит
              прямо здесь: клик открывает ту же форму, что кнопка «Изменить». */}
          <button
            type="button"
            onClick={() => setEditing(true)}
            title="Изменить комментарий"
            className="mt-1 block w-full rounded px-1 py-0.5 text-left hover:bg-muted/60"
          >
            {d.comment ? (
              <span className="whitespace-pre-line text-sm text-foreground/80">
                {d.comment}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">
                + комментарий
              </span>
            )}
          </button>

          {/* Состав директивы — какие именно блоки она забрала. Свёрнут: у
              больших директив это десятки строк. */}
          <button
            type="button"
            onClick={() => setShowBlocks((v) => !v)}
            className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            {showBlocks ? (
              <ChevronDown className="size-3.5" />
            ) : (
              <ChevronRight className="size-3.5" />
            )}
            Блоки · {d.blocks.length}
          </button>
          {showBlocks && (
            <ul className="mt-1 space-y-1 rounded-md bg-muted/40 p-2">
              {d.blocks.map((b, i) => (
                <li
                  key={`${b.id}-${i}`}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide">
                    {KIND_LABEL[b.kind as keyof typeof KIND_LABEL] ?? b.kind}
                  </span>
                  <span className="min-w-0 break-words">{b.snippet}</span>
                </li>
              ))}
            </ul>
          )}

          <RowActions d={d} actions={actions} onEdit={() => setEditing(true)} />
        </>
      )}
    </li>
  );
}

/** Кнопки под директивой: приёмка предложения либо обычная работа со статусом. */
function RowActions({
  d,
  actions,
  onEdit,
}: {
  d: Directive;
  actions: DirectiveActions;
  onEdit: () => void;
}) {
  const prev = PREV_STATUS[d.status];

  if (d.review === "rejected")
    return (
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => actions.onReview(d.id, "proposed")}
          className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <Undo2 className="size-3.5" /> Вернуть на проверку
        </button>
      </div>
    );

  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      {isProposal(d) ? (
        <>
          <button
            type="button"
            onClick={() => actions.onReview(d.id, "accepted")}
            className="inline-flex items-center gap-1 rounded-md bg-brand px-2 py-1 text-xs font-medium text-brand-foreground hover:bg-brand/90"
          >
            <Check className="size-3.5" /> Принять
          </button>
          <button
            type="button"
            onClick={() => actions.onReview(d.id, "rejected")}
            className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-muted-foreground hover:text-[hsl(var(--bad))]"
          >
            <X className="size-3.5" /> Отклонить
          </button>
        </>
      ) : (
        <>
          {d.status === "new" && (
            <button
              type="button"
              onClick={() => actions.onSetStatus(d.id, "applied")}
              className="inline-flex items-center gap-1 rounded-md bg-brand px-2 py-1 text-xs font-medium text-brand-foreground hover:bg-brand/90"
            >
              <Check className="size-3.5" /> Применена
            </button>
          )}
          {d.status === "applied" && (
            <button
              type="button"
              onClick={() => actions.onSetStatus(d.id, "verified")}
              className="inline-flex items-center gap-1 rounded-md border border-brand/40 px-2 py-1 text-xs font-medium text-brand hover:bg-brand/10"
            >
              <Eye className="size-3.5" /> Проверена
            </button>
          )}
          {prev && (
            <button
              type="button"
              onClick={() => actions.onSetStatus(d.id, prev)}
              aria-label="Вернуть статус на шаг назад"
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <Undo2 className="size-3.5" /> вернуть
            </button>
          )}
        </>
      )}

      <button
        type="button"
        onClick={onEdit}
        className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <Pencil className="size-3.5" /> Изменить
      </button>
      {/* Выключение — мягкая отмена: директива остаётся, но раскладку не меняет. */}
      <button
        type="button"
        onClick={() => actions.onToggleOff(d.id, !d.off)}
        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
      >
        {d.off ? (
          <>
            <Play className="size-3.5" /> Включить
          </>
        ) : (
          <>
            <Ban className="size-3.5" /> Выключить
          </>
        )}
      </button>
    </div>
  );
}

/** Правка сохранённой директивы: те же поля, что и при создании, плюс блоки. */
function EditForm({
  d,
  selectedCount,
  actions,
  onClose,
}: {
  d: Directive;
  selectedCount: number;
  actions: DirectiveActions;
  onClose: () => void;
}) {
  const [draft, setDraft] = React.useState<DirectiveDraft>({
    target: d.target,
    targetLabel: d.targetLabel,
    modifiers: d.modifiers,
    comment: d.comment ?? "",
  });

  return (
    <div className="mt-1">
      <TargetFields
        draft={draft}
        onChange={setDraft}
        blockTexts={d.blocks.map((b) => b.snippet)}
      />

      {/* Состав блоков правится выделением в плейграунде: выделить нужные и
          нажать «Заменить». Так не нужно ни заводить директиву заново, ни
          придумывать отдельный способ выбирать блоки в узкой панели. */}
      <div className="mt-3 rounded-md border border-dashed p-2">
        <div className="text-xs text-muted-foreground">
          Блоки директивы: {d.blocks.length}
        </div>
        <button
          type="button"
          disabled={selectedCount === 0}
          onClick={() => actions.onReplaceBlocks(d.id)}
          className="mt-1.5 w-full rounded-md border px-2 py-1 text-xs font-medium text-foreground transition-opacity hover:bg-muted disabled:opacity-50"
        >
          {selectedCount > 0
            ? `Заменить выделенными (${selectedCount})`
            : "Выделите блоки в плейграунде"}
        </button>
      </div>

      <div className="mt-2 flex gap-1.5">
        <button
          type="button"
          onClick={() => {
            actions.onUpdate(d.id, { ...draft, comment: draft.comment.trim() });
            onClose();
          }}
          className="rounded-md bg-brand px-2 py-1 text-xs font-medium text-brand-foreground hover:bg-brand/90"
        >
          Сохранить
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}
