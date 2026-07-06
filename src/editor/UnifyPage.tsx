import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Callout } from "@/components/Callout";
import { Blockquote } from "@/components/Blockquote";
import { CompareColumns } from "@/components/CompareColumns";
import { StatBlock } from "@/components/StatBlock";
import { Disclosure } from "@/components/Disclosure";
import { CodeSnippet } from "@/components/CodeSnippet";
import { GlossaryTerm } from "@/components/GlossaryTerm";
import { Paragraph, OrderedList } from "@/components/Prose";
import { Badge } from "@/components/ui/badge";
import { CANON, type Approach, type CanonProposal } from "./unify";
import { formatLabel } from "./inventory";
import { inventoryGenerated } from "./content/inventory.generated";
import {
  loadDecisions,
  saveDecision,
  getUnifyMode,
  type UnifyDecision,
} from "./unifyStore";

// Страница «Унификация» (/unify) — предложение по канону для каждого типа:
// живое превью + «сейчас так» → «канон так» + два способа авторинга. Решение
// («принять» с выбором подхода) сохраняется на сервере (unifyStore) — потом я
// читаю решения и мигрирую блоки. НЕ Prose/ContentSection (дашборд не редактируем).

/** Живое превью канонического формата для типа. */
function renderPreview(type: CanonProposal["type"]): React.ReactNode {
  switch (type) {
    case "пример":
      return (
        <Callout variant="highlight" title="Пример">
          Слабослышащий сотрудник пользуется слуховым аппаратом и эффективно
          выполняет свои задачи.
        </Callout>
      );
    case "совет":
      return (
        <Callout variant="highlight" title="Совет">
          Начните с одной пилотной вакансии, а не с массового найма.
        </Callout>
      );
    case "предупреждение":
      return (
        <Callout variant="warning" title="Важно">
          Сверхурочная работа — только с письменного согласия и при отсутствии
          противопоказаний в ИПРА.
        </Callout>
      );
    case "задание":
      return (
        <Callout variant="briefing" title="Практическое задание">
          Составьте карту каналов привлечения аудитории для вашей программы.
        </Callout>
      );
    case "кейс":
      return (
        <Blockquote attribution="Денис, оператор колл-центра">
          В «Уфанете» я проработал 9 лет: CRM доработали под слабовидящих — и
          всё заработало.
        </Blockquote>
      );
    case "цитата":
      return (
        <Blockquote attribution="Гульнара Горишняя, Яндекс">
          Инклюзия — это не про жалость, а про равные возможности.
        </Blockquote>
      );
    case "определение":
      return (
        <div className="space-y-3">
          <Paragraph>
            В основе — <GlossaryTerm term="ИПРА">ИПРА</GlossaryTerm>: убрать
            барьер — человек работает наравне.
          </Paragraph>
          <Callout variant="info" title="ИПРА">
            Индивидуальная программа реабилитации и абилитации — документ с
            рекомендациями по условиям труда.
          </Callout>
        </div>
      );
    case "миф-факт":
      return (
        <Disclosure
          entries={[
            {
              trigger: "Сотрудники с инвалидностью берут больше больничных",
              badge: <Badge tone="bad">Миф</Badge>,
              content: "Разница с другими сотрудниками — 1–2 дня в год.",
            },
          ]}
        />
      );
    case "промпт-шаблон":
      return (
        <CodeSnippet
          tag="ИИ-промпт"
          text={
            "Ты — HR-специалист. Составь текст инклюзивной вакансии для позиции оператора колл-центра. Укажи, какие условия труда компания готова адаптировать."
          }
        />
      );
    case "шаги":
      return (
        <OrderedList>
          <li>Определить аудиторию</li>
          <li>Выбрать формат работы</li>
          <li>Найти партнёров-работодателей</li>
        </OrderedList>
      );
    case "сравнение":
      return (
        <CompareColumns
          left={{
            title: "Разумная адаптация",
            tone: "good",
            items: [
              "Гибкий график по договорённости",
              "Наставник на первый месяц",
            ],
          }}
          right={{
            title: "Гиперопека",
            tone: "bad",
            items: [
              "Решать всё за сотрудника",
              "Освобождать от задач «на всякий случай»",
            ],
          }}
        />
      );
    case "факт-цифра":
      return (
        <StatBlock
          stats={[
            {
              value: "4,3 млн",
              label:
                "человек трудоспособного возраста с инвалидностью в России",
            },
            { value: "~30%", label: "из них работают" },
          ]}
        />
      );
    case "faq":
      return (
        <Disclosure
          entries={[
            {
              trigger: "Можно ли уволить сотрудника с инвалидностью?",
              content:
                "Да — по всем общим основаниям ТК; есть нюансы по медпоказаниям.",
            },
          ]}
        />
      );
    default:
      return null;
  }
}

// Текущие форматы типа (из инвентаря) — «сейчас так».
function currentFormats(type: string): [string, number][] {
  const m = new Map<string, number>();
  for (const b of inventoryGenerated)
    if (b.semanticType === type)
      m.set(formatLabel(b), (m.get(formatLabel(b)) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

export function UnifyPage() {
  const [decisions, setDecisions] = React.useState<
    Record<string, UnifyDecision>
  >({});
  const [picks, setPicks] = React.useState<Record<string, Approach>>({});
  const [notice, setNotice] = React.useState<string | null>(null);
  const [storeMode, setStoreMode] = React.useState<"server" | "local">("local");

  React.useEffect(() => {
    loadDecisions().then((d) => {
      setDecisions(d);
      setStoreMode(getUnifyMode());
    });
  }, []);

  const decidedCount = Object.values(decisions).filter(
    (d) => d.approach,
  ).length;

  const approachOf = (type: string): Approach =>
    picks[type] ?? decisions[type]?.approach ?? "convention";

  const accept = (type: string) => {
    const approach = approachOf(type);
    saveDecision(type, approach)
      .then((rec) => setDecisions((prev) => ({ ...prev, [type]: rec })))
      .catch(() =>
        setNotice("Не удалось сохранить решение — проверьте соединение."),
      );
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Унификация контента
        </h1>
        <p className="max-w-prose text-muted-foreground">
          По каждому смысловому типу — предлагаемый канон: как он должен
          выглядеть и как его писать. Визуал один; выберите способ авторинга
          («соглашение о вариантах» на существующих компонентах или
          семантический компонент вроде <code>&lt;Tip&gt;</code>) и нажмите
          «Принять». Решения сохраняются — по ним я потом мигрирую блоки.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="rounded-md bg-muted/60 px-3 py-1.5">
          <span className="font-semibold">{decidedCount}</span>
          <span className="ml-1.5 text-muted-foreground">
            из {CANON.length} типов решено
          </span>
        </span>
        {storeMode === "local" ? (
          <span className="rounded-md bg-[hsl(var(--warn)/0.12)] px-3 py-1.5 text-xs text-[hsl(var(--warn))]">
            Локальный режим: решения сохраняются только в этом браузере.
          </span>
        ) : null}
      </div>

      {notice ? (
        <p className="rounded-md border border-[hsl(var(--bad)/0.4)] bg-card px-3 py-2 text-sm text-[hsl(var(--bad))]">
          {notice}
        </p>
      ) : null}

      {CANON.map((c) => {
        const decided = decisions[c.type]?.approach ?? null;
        const approach = approachOf(c.type);
        const formats = currentFormats(c.type);
        const total = formats.reduce((s, [, n]) => s + n, 0);
        return (
          <section
            key={c.type}
            className={cn(
              "space-y-4 rounded-lg border p-4",
              decided && "border-[hsl(var(--ok)/0.4)] bg-[hsl(var(--ok)/0.04)]",
            )}
          >
            <div className="flex flex-wrap items-baseline gap-2">
              <h2 className="text-lg font-semibold text-foreground">
                {c.label}
              </h2>
              <span className="text-sm text-muted-foreground">
                {total} блоков · {formats.length} форматов
              </span>
              {decided ? (
                <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-[hsl(var(--ok)/0.15)] px-2 py-0.5 text-xs font-medium text-[hsl(var(--ok))]">
                  <Check className="h-3 w-3" />
                  принято:{" "}
                  {decided === "component" ? "компонент" : "соглашение"}
                </span>
              ) : null}
            </div>

            <p className="max-w-prose text-sm text-muted-foreground">{c.why}</p>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* Сейчас так */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Сейчас так
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {formats.map(([f, n]) => (
                    <span
                      key={f}
                      className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground"
                    >
                      {f} · {n}
                    </span>
                  ))}
                </div>
              </div>

              {/* Канон так — живое превью */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                  Канон так: {c.canonical}
                </p>
                <div className="rounded-md border bg-background p-3">
                  {renderPreview(c.type)}
                </div>
              </div>
            </div>

            {c.subgroups ? (
              <div className="space-y-1 rounded-md bg-muted/40 p-3 text-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Подгруппы по контексту
                </p>
                {c.subgroups.map((s) => (
                  <p key={s.label} className="text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {s.label}
                    </span>{" "}
                    → {s.canonical}. {s.note}
                  </p>
                ))}
              </div>
            ) : null}

            {/* Два способа авторинга + выбор */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <AuthoringOption
                title="Соглашение о вариантах"
                code={c.conventionCode}
                active={approach === "convention"}
                onPick={() =>
                  setPicks((p) => ({ ...p, [c.type]: "convention" }))
                }
              />
              <AuthoringOption
                title="Семантический компонент"
                code={c.componentCode}
                active={approach === "component"}
                onPick={() =>
                  setPicks((p) => ({ ...p, [c.type]: "component" }))
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => accept(c.type)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium",
                  decided === approach
                    ? "border bg-muted text-muted-foreground"
                    : "bg-brand text-brand-foreground hover:bg-[hsl(var(--brand)/0.9)]",
                )}
              >
                <Check className="h-4 w-4" />
                {decided === approach
                  ? "Принято"
                  : decided
                    ? "Изменить решение"
                    : "Принять"}
              </button>
            </div>
          </section>
        );
      })}
    </div>
  );
}

function AuthoringOption({
  title,
  code,
  active,
  onPick,
}: {
  title: string;
  code: string;
  active: boolean;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      className={cn(
        "flex flex-col gap-2 rounded-md border p-3 text-left transition-colors",
        active
          ? "border-[hsl(var(--brand)/0.5)] bg-[hsl(var(--brand)/0.06)]"
          : "hover:bg-accent",
      )}
    >
      <span className="flex items-center gap-2 text-sm font-medium text-foreground">
        <span
          className={cn(
            "flex h-3.5 w-3.5 items-center justify-center rounded-full border",
            active ? "border-brand bg-brand" : "border-muted-foreground",
          )}
        >
          {active ? (
            <span className="h-1.5 w-1.5 rounded-full bg-brand-foreground" />
          ) : null}
        </span>
        {title}
      </span>
      <pre className="overflow-x-auto whitespace-pre-wrap rounded bg-muted/60 px-2.5 py-2 font-mono text-xs leading-relaxed text-foreground">
        {code}
      </pre>
    </button>
  );
}
