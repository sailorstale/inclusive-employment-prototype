import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuizBadge } from "./QuizBadge";

/*
  Figma: component set «Quiz Items» (6517:3771), свойства State × Platform.

  Одна строка варианта ответа: чекбокс + текст + (после проверки) плашка-вердикт.
  Кирпичик только для Quiz — вне проверки знаний смысла не имеет.

  Бейдж вручную не включается: он приходит вместе с цветным состоянием строки
  (Correct / Incorrect / Partly). В Default и Hover бейджа нет.

  Отметка чекбокса — ОТДЕЛЬНАЯ ось от State (в Figma это вложенный Checkbox Atom):
  бывает и Correct с пустым чекбоксом. Поэтому checked — самостоятельный проп.

  Наши расхождения с Figma, честно:
  1) Hover в Figma — вариант набора, у нас это ещё и живой CSS-hover (state="Hover"
     оставлен, чтобы можно было показать вид принудительно).
  2) В Figma цветные состояния добавляют рамку 1px и высота прыгает 48 → 50.
     У нас рамка есть всегда, в Default/Hover она прозрачная — строка не дёргается
     в момент нажатия «Проверить».
  3) Focus и Disabled в наборе Figma отсутствуют — кольцо фокуса и вид «уже
     проверено» добавлены нами, иначе с клавиатуры блоком пользоваться нельзя.
  4) Checkbox Atom отдельным файлом не выносим — рисуем здесь по токенам из разбора.

  Разбираем только Platform=Desktop.
*/

export type QuizItemState =
  | "Default"
  | "Hover"
  | "Correct"
  | "Incorrect"
  | "Partly";

// Фон и рамка строки: подложка бледная (card/bg-* + рамка 300).
const STATE_CLASS: Record<QuizItemState, string> = {
  Default: "bg-[color:var(--card-bg-white)] border-transparent",
  // Hover в Figma — action/secondary/bg-hover #e7eaf3. Этого токена нет в
  // tokens.css (в выгрузке ровно то же значение лежит под именем
  // action/primary/bg-disabled). Берём его, чтобы не писать цвет числом;
  // вопрос дизайнеру: до-выгрузить action/secondary/bg-hover.
  Hover: "bg-[color:var(--action-primary-bg-disabled)] border-transparent",
  Correct: "bg-[color:var(--card-bg-green)] border-[color:var(--green-300)]",
  Incorrect: "bg-[color:var(--card-bg-pink)] border-[color:var(--red-300)]",
  Partly: "bg-[color:var(--card-bg-yellow)] border-[color:var(--yellow-300)]",
};

const BADGE_FOR: Partial<Record<QuizItemState, "Correct" | "Incorrect" | "Partly">> =
  {
    Correct: "Correct",
    Incorrect: "Incorrect",
    Partly: "Partly",
  };

type Props = {
  state?: QuizItemState;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** После проверки строка только показывает результат, отметку менять нельзя. */
  disabled?: boolean;
  /** Текст варианта. Длина свободная — строка растёт в высоту. */
  children?: React.ReactNode;
  className?: string;
};

export function QuizItems({
  state = "Default",
  checked = false,
  onCheckedChange,
  disabled = false,
  children,
  className,
}: Props) {
  const badge = BADGE_FOR[state];
  const interactive = !disabled && state === "Default";

  return (
    <label
      data-component={`Quiz Items · ${state}`}
      className={cn(
        // Поля 12, скругление 8, зазор чекбокс↔текст 16. Чекбокс и бейдж
        // прижаты к верху — так строка выглядит одинаково и в одну, и в три строки.
        //
        // relative — обязателен. Настоящий чекбокс спрятан через sr-only, а это
        // position:absolute. Без позиционированного родителя он отсчитывается от
        // ВСЕГО документа и уезжает на тысячи пикселей вниз: страница становится
        // прокручиваемой, а при клике браузер уводит фокус туда — и приложение
        // уезжает за экран.
        "relative flex w-full items-start gap-[var(--space-m)]",
        "p-[var(--space-sm)] rounded-[var(--radius-xs)] border transition-colors",
        // Наше добавление: в Figma состояния Focus нет.
        "focus-within:outline-none focus-within:ring-2 focus-within:ring-[color:var(--text-primary)] focus-within:ring-offset-2",
        STATE_CLASS[state],
        interactive
          ? "cursor-pointer hover:bg-[color:var(--action-primary-bg-disabled)]"
          : "cursor-default",
        className,
      )}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
      />
      <CheckboxAtom checked={checked} />
      <span className="ds-body-m grow text-[color:var(--text-primary)]">
        {children}
      </span>
      {badge ? <QuizBadge type={badge} /> : null}
    </label>
  );
}

/*
  Checkbox Atom (Desktop): квадрат 24, radius/2xs 4.
  Отмеченный — фон control/active, галочка 18 белая.
  Пустой — фон control/bg, рамка 1px control/border.
*/
function CheckboxAtom({ checked }: { checked: boolean }) {
  return (
    <span
      data-component="Checkbox Atom"
      aria-hidden="true"
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-[var(--radius-2xs)] border transition-colors",
        checked
          ? "border-[color:var(--control-active)] bg-[color:var(--control-active)]"
          : "border-[color:var(--control-border)] bg-[color:var(--control-bg)]",
      )}
    >
      {checked ? (
        <Check
          className="size-[18px] text-[color:var(--control-active-fg)]"
          strokeWidth={2.5}
        />
      ) : null}
    </span>
  );
}
