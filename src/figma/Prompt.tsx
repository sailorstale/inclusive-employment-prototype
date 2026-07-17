import * as React from "react";
import { Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

/*
  Figma: component set «Prompt» (6470:8718), свойство Platform (берём Desktop).

  Врезка с готовым текстом-заготовкой, который читатель уносит себе: формулировка
  в договор, шаблон запроса, промпт для ИИ. Суть — пара «предупреждение + кнопка
  Скопировать»: отдаём сырьё и сразу говорим, что вслепую применять нельзя.
  НЕ берут для обычной цитаты или примера — если текст не для копирования,
  это просто абзац.

  Ставится только внутрь Card Container (как любой не-текстовый блок).
  Слотов в Figma нет: три части фиксированы, меняется только текст. Поэтому
  здесь пропсы, а не children-структура; children — сам текст заготовки (строка,
  её же уносит кнопка в буфер).

  Наше дополнение: в Figma состояния «после клика» нет (открытый вопрос
  дизайнеру — тост, смена подписи или ничего). Минимальный ответ: на 2 секунды
  меняем подпись кнопки на «Скопировано». Если браузер копировать не дал —
  честно показываем «Не удалось», а не молчим.

  Расхождение в Figma: слой «Textarea» — не поле ввода, а текст только для
  чтения; собран как <div>, не как <textarea>.
*/

const RESET_MS = 2000;

type CopyState = "idle" | "done" | "error";

const LABEL: Record<CopyState, string> = {
  idle: "Скопировать",
  done: "Скопировано",
  error: "Не удалось",
};

type Props = {
  /** Заголовок врезки — Desktop/H4. В макете «ИИ промпт». */
  title: React.ReactNode;
  /** Строка предупреждения — Desktop/Body L. Обязательна: в этом смысл врезки. */
  warning: React.ReactNode;
  /** Текст-заготовка в белой плашке. Он же уходит в буфер обмена. */
  children: string;
  className?: string;
};

export function Prompt({ title, warning, children, className }: Props) {
  const [state, setState] = React.useState<CopyState>("idle");
  const timer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  const schedule = (next: CopyState) => {
    setState(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), RESET_MS);
  };

  const copy = () => {
    if (!navigator.clipboard) {
      schedule("error");
      return;
    }
    navigator.clipboard.writeText(children).then(
      () => schedule("done"),
      () => schedule("error"),
    );
  };

  return (
    <div
      data-component="Prompt"
      className={cn(
        "flex w-full flex-col gap-[var(--space-m)]",
        "rounded-[var(--radius-l)] bg-[color:var(--card-bg-gray)] p-[var(--space-l)]",
        className,
      )}
    >
      {/* Description */}
      <div className="flex w-full flex-col gap-[var(--space-xs)]">
        <p className="ds-h4 text-[color:var(--text-primary)]">{title}</p>
        <p className="ds-body-l text-[color:var(--text-primary)]">{warning}</p>
      </div>

      {/* Input Container: текст и кнопка — одна группа, кнопка принадлежит тексту. */}
      <div className="flex w-full flex-col items-start gap-[var(--space-xs)]">
        {/* Textarea — белая плашка, только чтение. Белое на сером = «не наш голос». */}
        <div
          className={cn(
            "ds-body-m w-full whitespace-pre-wrap",
            "rounded-[var(--radius-xs)] bg-[color:var(--card-bg-white)] p-[var(--space-m)]",
            "text-[color:var(--text-primary)]",
          )}
        >
          {children}
        </div>
        <Button
          type="Outline"
          size="S"
          icon="Left"
          iconNode={<Copy aria-hidden className="size-4" />}
          onClick={copy}
        >
          {LABEL[state]}
        </Button>
      </div>
    </div>
  );
}
