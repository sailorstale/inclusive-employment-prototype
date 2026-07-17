import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { QuizBadge, type QuizBadgeType } from "./QuizBadge";
import { QuizItems, type QuizItemState } from "./QuizItems";

/*
  Figma: component «Quiz» (6519:2040), Platform=Desktop (6519:1997).

  Блок самопроверки: заголовок темы, поясняющий текст, вопрос, варианты ответа
  с чекбоксами, кнопка «Проверить» и разбор результата. Ставится в слот
  Card Container (в шаблоне Quiz всегда внутри него), в другие компоненты
  не вкладывается. Внутрь принимает только Quiz Items и Button.

  Тексты внутри — НЕ инстансы Heading/Text: в Figma это собственные слои Quiz
  со стилями Desktop/H3, Body L, Body L Bold. Поэтому здесь ds-*-классы напрямую —
  иначе к зазору 16 приклеился бы ещё и верхний отступ Heading/Text.

  Наши расхождения с Figma, честно:
  1) В Figma у Quiz нет свойства «проверено / не проверено», а на макете видны
     сразу и нетронутые варианты, и заполненный разбор. Мы решили: до нажатия
     «Проверить» разбор скрыт. Вопрос дизайнеру открыт.
  2) Кнопки «Проверить» до выбора (disabled) и «Пройти заново» (Ghost) в Figma нет —
     наше добавление, иначе макет некликабельный.
  3) Quiz Badge в блоке разбора — наше добавление: в Figma бейдж живёт только
     внутри строки ответа, а Feedback Container — обычный фрейм с текстом.
  4) Заголовок (title) сделали опциональным: в шаблоне он дословно повторяет вопрос,
     похоже на заглушку. Вопрос дизайнеру: заголовок и вопрос — разные тексты?

  Интерактив на локальном состоянии — это макет, на сервер ничего не уходит.
*/

export type QuizOption = {
  text: string;
  /** Верный ли вариант. Чекбоксы = множественный выбор, верных может быть несколько. */
  correct?: boolean;
};

type Props = {
  /** Заголовок темы, H3. */
  title?: string;
  /** Вводный абзац, Body L. По смыслу опционален. */
  description?: string;
  /** Сам вопрос, Body L Bold. */
  question: string;
  items: QuizOption[];
  /** Текст разбора, Body M — показывается после проверки. */
  explanation?: string;
  className?: string;
};

export function Quiz({
  title,
  description,
  question,
  items,
  explanation,
  className,
}: Props) {
  const questionId = React.useId();
  const [selected, setSelected] = React.useState<boolean[]>(() =>
    items.map(() => false),
  );
  const [checked, setChecked] = React.useState(false);

  const toggle = (index: number, value: boolean) => {
    // Иммутабельно: новый массив, старый не трогаем.
    setSelected((prev) => prev.map((v, i) => (i === index ? value : v)));
  };

  const reset = () => {
    setSelected(items.map(() => false));
    setChecked(false);
  };

  const hasSelection = selected.some(Boolean);

  return (
    <div
      data-component="Quiz"
      className={cn(
        // Серая карточка: поля 24, скругление 24, зазор между частями 16.
        "flex w-full flex-col gap-[var(--space-m)]",
        "bg-[color:var(--card-bg-gray)] p-[var(--space-l)] rounded-[var(--radius-l)]",
        className,
      )}
    >
      {title ? (
        <h3 className="ds-h3 text-[color:var(--text-primary)]">{title}</h3>
      ) : null}
      {description ? (
        <p className="ds-body-l text-[color:var(--text-primary)]">
          {description}
        </p>
      ) : null}

      <p id={questionId} className="ds-body-l-bold text-[color:var(--text-primary)]">
        {question}
      </p>

      {/* Options Container: стопка вариантов с зазором 4 — плотно, как единый список. */}
      <div
        role="group"
        aria-labelledby={questionId}
        className="flex w-full flex-col gap-[var(--space-2xs)]"
      >
        {items.map((item, index) => (
          <QuizItems
            // Список статичен и не переупорядочивается — индекс как ключ безопасен
            // и не ломается, если два варианта совпали текстом.
            key={index}
            state={checked ? itemState(item, selected[index]) : "Default"}
            checked={selected[index]}
            disabled={checked}
            onCheckedChange={(value) => toggle(index, value)}
          >
            {item.text}
          </QuizItems>
        ))}
      </div>

      <div className="flex items-center gap-[var(--space-xs)]">
        {checked ? (
          <Button type="Ghost" size="M" onClick={reset}>
            Пройти заново
          </Button>
        ) : (
          <Button
            type="Primary"
            size="M"
            disabled={!hasSelection}
            onClick={() => setChecked(true)}
          >
            Проверить
          </Button>
        )}
      </div>

      {checked ? (
        <Feedback
          items={items}
          selected={selected}
          explanation={explanation}
        />
      ) : null}
    </div>
  );
}

/*
  Как красим строку после проверки (в Figma это не задано — наше решение):
  отмечен и верный → Correct, отмечен и неверный → Incorrect,
  верный, но пропущен → Partly (жёлтый: «тут тоже надо было»), остальное — Default.
*/
function itemState(item: QuizOption, isSelected: boolean): QuizItemState {
  if (isSelected) return item.correct ? "Correct" : "Incorrect";
  return item.correct ? "Partly" : "Default";
}

/*
  Вердикт целиком: точное совпадение → Верно; ни одного попадания → Неверно;
  что-то угадано, но не всё → Частично.
*/
function verdictOf(items: QuizOption[], selected: boolean[]): QuizBadgeType {
  const totalCorrect = items.filter((i) => i.correct).length;
  const hits = items.filter((i, n) => i.correct && selected[n]).length;
  const wrong = items.filter((i, n) => !i.correct && selected[n]).length;

  if (hits === totalCorrect && wrong === 0) return "Correct";
  if (hits === 0) return "Incorrect";
  return "Partly";
}

/*
  Feedback Container: белая карточка, поля 24, скругление 16, зазор 8.
  В Figma это обычный фрейм внутри Quiz, а не отдельный компонент —
  поэтому data-component здесь не ставим, шильдика в Figma для него нет.
*/
function Feedback({
  items,
  selected,
  explanation,
}: {
  items: QuizOption[];
  selected: boolean[];
  explanation?: string;
}) {
  const totalCorrect = items.filter((i) => i.correct).length;
  const hits = items.filter((i, n) => i.correct && selected[n]).length;

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-[var(--space-xs)]",
        "bg-[color:var(--card-bg-white)] p-[var(--space-l)] rounded-[var(--radius-m)]",
      )}
      aria-live="polite"
    >
      <div className="flex items-center gap-[var(--space-sm)]">
        <p className="ds-h5 text-[color:var(--text-primary)]">
          Верно {hits} из {totalCorrect}
        </p>
        {/* Наше добавление: в Figma бейджа в разборе нет. */}
        <QuizBadge type={verdictOf(items, selected)} />
      </div>
      {explanation ? (
        <p className="ds-body-m text-[color:var(--text-primary)]">
          {explanation}
        </p>
      ) : null}
    </div>
  );
}
