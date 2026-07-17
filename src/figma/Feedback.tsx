import * as React from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

/*
  Figma: component set «Feedback» (6442:7149), свойство State = Default | Send.

  Форма обратной связи в самом низу содержательной страницы — перед блоком
  «Читайте также» и футером. Приглашение написать, что не так или чего
  не хватает. Это НЕ форма заявки и не подписка: полей имени и телефона нет,
  только роль, необязательный email и свободный текст.

  Чем управляется: свойством State. Default — карточка с формой,
  Send — благодарность вместо формы (не «форма с галочкой», а другая карточка).
  Переключение живёт в локальном useState, никаких запросов — это прототип.

  Верхний отступ 40 (space/2xl) — свой, внешний добавлять не нужно.

  РАСХОЖДЕНИЯ С FIGMA (честно):
  1. Ролей в макете ровно две — «Сотрудник компании» и «Сотрудник НКО», хотя
     у сайта три аудитории: не хватает соискателя. Пробел не закрываем молча:
     оставили проп `roles` со значением по умолчанию из Figma. Вопрос дизайнеру.
  2. Опечатки макета не тиражируем: «ответиь» → «ответить», «Написать еше» →
     «Написать ещё».
  3. Декоративную картинку-конверт (Small Image 120×120 поверх правого верхнего
     угла) не рисуем — картинки из Figma не тянем. Вместе с ней ушёл и правый
     паддинг 152, который её обходил.
  4. Кнопка «Отправить» в макете показана ТОЛЬКО выключенной, включённого
     состояния в наборе нет. Здесь она включается, когда сообщение не пустое, —
     это наша догадка, вопрос дизайнеру.
  5. «Email (Необязательно)» в макете нарисован синей ссылкой, а не полем ввода.
     Что это — раскрывающееся поле или mailto — из макета не следует. Оставили
     как в Figma: подпись-ссылка, поля нет.
  6. Состояний ошибки и валидации в наборе нет — здесь их тоже нет.
*/

export type FeedbackState = "Default" | "Send";

const DEFAULT_ROLES = ["Сотрудник компании", "Сотрудник НКО"] as const;

type Props = {
  /** Если задан — состояние фиксируется снаружи (для витрины компонентов). */
  state?: FeedbackState;
  /**
   * Подписи чипов роли. По умолчанию — две роли из Figma.
   * Третьей аудитории («Соискатель») в макете нет — см. расхождение 1.
   */
  roles?: readonly string[];
  className?: string;
};

export function Feedback({
  state,
  roles = DEFAULT_ROLES,
  className,
}: Props) {
  const [sent, setSent] = React.useState(false);
  const [role, setRole] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState("");

  const current: FeedbackState = state ?? (sent ? "Send" : "Default");

  const reset = () => {
    setSent(false);
    setMessage("");
  };

  return (
    <div
      data-component={`Feedback · ${current}`}
      className={cn("w-full pt-[var(--space-2xl)]", className)}
    >
      {/* Card-Body */}
      <div
        className={cn(
          "flex w-full flex-col gap-[var(--space-m)]",
          "rounded-[var(--radius-l)] bg-[color:var(--card-bg-beige)] p-[var(--space-l)]",
        )}
      >
        {current === "Send" ? (
          <SendState onRestart={state ? undefined : reset} />
        ) : (
          <DefaultState
            roles={roles}
            role={role}
            onRoleChange={setRole}
            message={message}
            onMessageChange={setMessage}
            onSubmit={state ? undefined : () => setSent(true)}
          />
        )}
      </div>
    </div>
  );
}

/* --- State = Default: заголовок, пояснение, роль, email, сообщение, кнопка --- */

type DefaultProps = {
  roles: readonly string[];
  role: string | null;
  onRoleChange: (role: string) => void;
  message: string;
  onMessageChange: (message: string) => void;
  onSubmit?: () => void;
};

function DefaultState({
  roles,
  role,
  onRoleChange,
  message,
  onMessageChange,
  onSubmit,
}: DefaultProps) {
  return (
    <>
      {/* Header-Section. Внутри карточки берём классы типографики напрямую:
          у компонентов Heading и Text свои верхние отступы, они бы разъехались
          с шагом карточки (gap 16). */}
      <div className="flex w-full flex-col gap-[var(--space-xs)]">
        <h3 className="ds-h3 text-[color:var(--text-primary)]">
          Нам правда важно ваше мнение
        </h3>
        <p className="ds-body-l text-[color:var(--text-primary)]">
          Расскажите, что осталось непонятным или чего вам не хватило на этой
          странице.
        </p>
      </div>

      {/* Chips-Container: слева выбор роли, справа подпись про email */}
      <div className="flex w-full flex-wrap items-center justify-between gap-[var(--space-m)]">
        {/* Role-Selector. В Figma это два обычных Button на белой подложке,
            а не настоящий переключатель-сегмент. Роль по умолчанию не выбрана —
            в макете это не задано, вопрос дизайнеру. */}
        <div
          role="group"
          aria-label="Ваша роль"
          className="inline-flex gap-[var(--space-2xs)] rounded-[var(--radius-sm)] bg-[color:var(--card-bg-white)] p-[var(--space-2xs)]"
        >
          {roles.map((item) => (
            <Button
              key={item}
              type={role === item ? "Primary" : "Secondary"}
              size="S"
              onClick={() => onRoleChange(item)}
              aria-pressed={role === item}
            >
              {item}
            </Button>
          ))}
        </div>

        {/* Email-Text-Group */}
        <div className="flex flex-col gap-[var(--space-3xs)]">
          <span className="ds-body-l text-[color:var(--link-default)]">
            Email (Необязательно)
          </span>
          <span className="ds-body-s text-[color:var(--text-secondary)]">
            Чтобы мы могли вам ответить
          </span>
        </div>
      </div>

      {/* Message-Field: вложенный компонент Textarea (6408:1117) */}
      <textarea
        data-component="Textarea"
        value={message}
        onChange={(event) => onMessageChange(event.target.value)}
        placeholder="Расскажите о вашем опыте"
        aria-label="Ваше сообщение"
        className={cn(
          "ds-body-l w-full resize-none",
          // высота 120 — жёсткое значение из Figma, токена под неё нет
          "h-[120px] px-[var(--space-l)] py-[var(--space-ml)]",
          "rounded-[var(--radius-m)] border border-[color:var(--control-border)] bg-[color:var(--control-bg)]",
          "text-[color:var(--text-primary)] placeholder:text-[color:var(--control-fg-placeholder)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--control-active)]",
        )}
      />

      {/* Action-Row */}
      <div className="flex w-full">
        <Button
          type="Primary"
          size="L"
          icon="Right"
          iconNode={<Send aria-hidden="true" className="size-full" />}
          disabled={message.trim().length === 0}
          onClick={onSubmit}
        >
          Отправить
        </Button>
      </div>
    </>
  );
}

/* --- State = Send: благодарность вместо формы --- */

function SendState({ onRestart }: { onRestart?: () => void }) {
  return (
    <>
      <div className="flex w-full flex-col gap-[var(--space-xs)]">
        <h3 className="ds-h3 text-[color:var(--text-primary)]">
          Спасибо за отзыв!
        </h3>
        <p className="ds-body-l text-[color:var(--text-primary)]">
          Мы прочитаем ваше сообщение — это помогает нам стать лучше
        </p>
      </div>

      <div className="flex w-full">
        <Button
          type="Primary"
          size="S"
          icon="Left"
          iconNode={<Send aria-hidden="true" className="size-full" />}
          onClick={onRestart}
        >
          Написать ещё
        </Button>
      </div>
    </>
  );
}
