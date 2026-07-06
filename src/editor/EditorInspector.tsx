import * as React from "react";
import {
  Bold,
  Check,
  Cloud,
  HardDrive,
  Italic,
  Link as LinkIcon,
  Pencil,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getVariantsFor } from "./registry";
import { RATIONALE_LABELS, type RationaleKind, type Variant } from "./types";
import { useEditor } from "./EditorProvider";
import { countSentences, lengthDeltaPct, readSeconds, wordDiff } from "./diff";
import { renderInline, stripMarkdown } from "./richText";

// Панель-инспектор: открывается справа по клику на блок в режиме редактора.
// Наши готовые варианты (если есть) + поле «Свой текст». Применённое сохраняется
// в общий стор (сервер/локально). Статус переноса показан read-only — им
// управляют на странице «Изменения».

const KIND_CLASSES: Record<RationaleKind, string> = {
  canc: "bg-[hsl(var(--warn)/0.15)] text-[hsl(var(--warn))]",
  rep: "bg-[hsl(var(--bad)/0.12)] text-[hsl(var(--bad))]",
  long: "bg-[hsl(var(--brand)/0.1)] text-brand",
  live: "bg-[hsl(var(--ok)/0.15)] text-[hsl(var(--ok))]",
  cut: "bg-[hsl(var(--brand)/0.1)] text-brand",
  tone: "bg-muted text-muted-foreground",
  course: "bg-[hsl(var(--warn)/0.15)] text-[hsl(var(--warn))]",
};

type Tab = "orig" | "a" | "b" | "custom";

export function EditorInspector() {
  const {
    editorMode,
    storeMode,
    active,
    edits,
    applyVariant,
    applyCustom,
    revert,
    closeInspector,
  } = useEditor();

  const variants = active ? getVariantsFor(active.original) : undefined;
  const record = active ? edits[active.id] : undefined;

  const [tab, setTab] = React.useState<Tab>("custom");
  const [draft, setDraft] = React.useState("");
  const [showDiff, setShowDiff] = React.useState(true);

  const taRef = React.useRef<HTMLTextAreaElement>(null);
  const pendingSel = React.useRef<[number, number] | null>(null);

  // После программной вставки разметки вернуть нужное выделение в поле.
  React.useEffect(() => {
    if (pendingSel.current && taRef.current) {
      const [s, e] = pendingSel.current;
      taRef.current.focus();
      taRef.current.setSelectionRange(s, e);
      pendingSel.current = null;
    }
  }, [draft]);

  const wrapSel = React.useCallback(
    (before: string, after: string, placeholder: string) => {
      const ta = taRef.current;
      if (!ta) return;
      const s = ta.selectionStart;
      const e = ta.selectionEnd;
      setDraft((d) => {
        const sel = d.slice(s, e) || placeholder;
        pendingSel.current = [s + before.length, s + before.length + sel.length];
        return d.slice(0, s) + before + sel + after + d.slice(e);
      });
    },
    []
  );

  const insertLink = React.useCallback(() => {
    const ta = taRef.current;
    if (!ta) return;
    const s = ta.selectionStart;
    const e = ta.selectionEnd;
    const url = "https://";
    setDraft((d) => {
      const sel = d.slice(s, e) || "ссылка";
      const urlStart = s + 1 + sel.length + 2;
      pendingSel.current = [urlStart, urlStart + url.length];
      return d.slice(0, s) + "[" + sel + "](" + url + ")" + d.slice(e);
    });
  }, []);

  // При открытии блока — выбрать стартовую вкладку и наполнить черновик.
  React.useEffect(() => {
    if (!active) return;
    const rec = edits[active.id];
    const recommended =
      variants?.find((v) => v.recommended) ?? variants?.[0];
    if (rec?.kind === "custom") setTab("custom");
    else if (rec?.kind === "variant") setTab(rec.variantKey ?? "a");
    else if (recommended) setTab(recommended.key);
    else setTab("custom");
    setDraft(rec ? rec.text : active.original);
    setShowDiff(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.id]);

  React.useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeInspector();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, closeInspector]);

  if (!editorMode || !active) return null;

  const original = active.original;
  const variant: Variant | undefined =
    tab === "a" || tab === "b"
      ? variants?.find((v) => v.key === tab)
      : undefined;
  const shownText =
    tab === "orig" ? original : tab === "custom" ? draft : variant?.text ?? original;
  const plainShown = stripMarkdown(shownText);
  const showsMetrics = tab !== "orig" && shownText.trim().length > 0;

  const customChanged = draft.trim().length > 0 && draft.trim() !== original.trim();
  const appliedNow =
    record &&
    ((record.kind === "custom" && tab === "custom" && record.text === draft) ||
      (record.kind === "variant" && record.variantKey === tab));

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-foreground/40 lg:hidden"
        onClick={closeInspector}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-label="Редактор блока"
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col border-l bg-card text-card-foreground shadow-xl"
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-brand" />
            Редактор блока
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground"
              title={
                storeMode === "server"
                  ? "Правки сохраняются на сервере и видны всем"
                  : "Сервер недоступен — правки сохраняются в этом браузере"
              }
            >
              {storeMode === "server" ? (
                <Cloud className="h-3.5 w-3.5" />
              ) : (
                <HardDrive className="h-3.5 w-3.5" />
              )}
              {storeMode === "server" ? "сервер" : "локально"}
            </span>
            <button
              type="button"
              onClick={closeInspector}
              aria-label="Закрыть"
              className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="mb-4 flex flex-wrap gap-1.5">
            <SegBtn active={tab === "orig"} onClick={() => setTab("orig")}>
              Оригинал
            </SegBtn>
            {variants?.map((v) => (
              <SegBtn key={v.key} active={tab === v.key} onClick={() => setTab(v.key)}>
                {v.label}
              </SegBtn>
            ))}
            <SegBtn active={tab === "custom"} onClick={() => setTab("custom")}>
              <Pencil className="mr-1 inline h-3 w-3" />
              Свой текст
            </SegBtn>
          </div>

          {tab === "custom" ? (
            <div className="mb-3">
              <div className="mb-1.5 flex items-center gap-1">
                <FmtBtn label="Жирный" onClick={() => wrapSel("**", "**", "текст")}>
                  <Bold className="h-3.5 w-3.5" />
                </FmtBtn>
                <FmtBtn label="Курсив" onClick={() => wrapSel("*", "*", "текст")}>
                  <Italic className="h-3.5 w-3.5" />
                </FmtBtn>
                <FmtBtn label="Ссылка" onClick={insertLink}>
                  <LinkIcon className="h-3.5 w-3.5" />
                </FmtBtn>
              </div>
              <textarea
                ref={taRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={5}
                placeholder="Впишите свой вариант текста…"
                className="w-full resize-y rounded-md border bg-background px-3 py-2 text-[15px] leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {draft.trim() ? (
                <div className="mt-2 rounded-md bg-muted/60 px-3 py-2 text-[13px] leading-relaxed">
                  <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Предпросмотр
                  </span>
                  {renderInline(draft)}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mb-3 rounded-md bg-muted/60 px-3 py-3 text-[15px] leading-relaxed">
              {renderInline(shownText)}
            </div>
          )}

          {variant ? (
            <div className="mb-3">
              <button
                type="button"
                onClick={() => {
                  setDraft(variant.text);
                  setTab("custom");
                }}
                className="text-xs text-brand underline underline-offset-2 hover:opacity-80"
              >
                Взять этот вариант в поле и доработать
              </button>
            </div>
          ) : null}

          {showsMetrics ? (
            <>
              <div className="mb-4 grid grid-cols-3 gap-2">
                <Metric
                  value={`−${Math.max(0, lengthDeltaPct(original, plainShown))}%`}
                  label="длина"
                />
                <Metric
                  value={`${countSentences(original)} → ${countSentences(plainShown)}`}
                  label="предложения"
                />
                <Metric value={`≈${readSeconds(plainShown)} сек`} label="чтение" />
              </div>

              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Что изменили
                </span>
                <button
                  type="button"
                  className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                  onClick={() => setShowDiff((s) => !s)}
                >
                  {showDiff ? "скрыть разбор" : "показать разбор"}
                </button>
              </div>

              {showDiff ? (
                <div className="mb-3 rounded-md bg-muted/60 px-3 py-3 text-sm leading-7">
                  {wordDiff(original, plainShown).map((seg, i) => (
                    <span
                      key={i}
                      className={cn(
                        seg.type === "del" &&
                          "text-[hsl(var(--bad))] line-through decoration-1",
                        seg.type === "ins" && "font-medium text-[hsl(var(--ok))]"
                      )}
                    >
                      {seg.text}{" "}
                    </span>
                  ))}
                </div>
              ) : null}

              {variant ? (
                <div className="space-y-2">
                  {variant.rationale.map((r, i) => (
                    <div key={i} className="flex gap-2 text-[13px] leading-snug">
                      <span
                        className={cn(
                          "h-fit shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium",
                          KIND_CLASSES[r.kind]
                        )}
                      >
                        {RATIONALE_LABELS[r.kind]}
                      </span>
                      <span className="text-foreground/90">{r.note}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-2 border-t px-4 py-3">
          {tab === "custom" ? (
            <button
              type="button"
              disabled={!customChanged || Boolean(appliedNow)}
              onClick={() => applyCustom(active, draft.trim())}
              className={cn(
                "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium",
                "bg-brand text-brand-foreground transition-colors hover:bg-[hsl(var(--brand)/0.9)]",
                "disabled:cursor-not-allowed disabled:opacity-40"
              )}
            >
              <Check className="h-4 w-4" />
              {appliedNow ? "Сохранено" : "Применить свой текст"}
            </button>
          ) : variant ? (
            <button
              type="button"
              disabled={Boolean(appliedNow)}
              onClick={() => applyVariant(active, variant)}
              className={cn(
                "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium",
                "bg-brand text-brand-foreground transition-colors hover:bg-[hsl(var(--brand)/0.9)]",
                "disabled:cursor-not-allowed disabled:opacity-40"
              )}
            >
              <Check className="h-4 w-4" />
              {appliedNow ? "Применено" : "Применить вариант"}
            </button>
          ) : (
            <div className="flex-1 text-center text-xs text-muted-foreground">
              Это исходный текст со страницы
            </div>
          )}
          <button
            type="button"
            disabled={!record}
            onClick={() => revert(active.id)}
            className={cn(
              "inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
              "disabled:cursor-not-allowed disabled:opacity-40"
            )}
          >
            <RotateCcw className="h-4 w-4" />
            Оригинал
          </button>
        </div>

        {record ? (
          <div className="border-t bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
            {record.status === "new"
              ? "🟡 новая правка · ждёт переноса разработчиком"
              : record.status === "applied"
                ? "✅ внесена в сайт · ждёт проверки"
                : "👁 проверена клиентом"}
          </div>
        ) : null}
      </aside>
    </>
  );
}

function SegBtn({
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
        "rounded-md border px-3 py-1.5 text-[12.5px] transition-colors",
        active
          ? "border-[hsl(var(--brand)/0.5)] bg-[hsl(var(--brand)/0.1)] font-medium text-brand"
          : "border-border text-muted-foreground hover:bg-accent"
      )}
    >
      {children}
    </button>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-md bg-muted/60 px-3 py-2">
      <div className="text-base font-medium leading-tight">{value}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}

function FmtBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {children}
    </button>
  );
}
