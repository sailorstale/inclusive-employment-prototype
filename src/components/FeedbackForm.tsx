import * as React from "react";
import { Send, Check, MessageSquareText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// FeedbackForm — блок обратной связи в конце страниц разделов «Компании»/«НКО»
// (перед «Читайте также»). Роль (компания/НКО), необязательный email, текст.
// Пока UI-заглушка: бекенда для приёма нет — после отправки показывает
// благодарность, копию кладёт в localStorage. Когда появится /api/feedback —
// заменить submit на реальный запрос.

type Role = "company" | "ngo";

export function FeedbackForm({
  defaultRole = "company",
  className,
}: {
  /** Роль по умолчанию — под раздел страницы (компании → company, НКО → ngo). */
  defaultRole?: Role;
  className?: string;
}) {
  const [role, setRole] = React.useState<Role>(defaultRole);
  const [showEmail, setShowEmail] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [text, setText] = React.useState("");
  const [sent, setSent] = React.useState(false);

  const canSend = text.trim().length > 0;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend) return;
    // UI-заглушка: сохраняем копию локально, бекенда пока нет.
    try {
      const key = "inclusion-feedback";
      const prev = JSON.parse(localStorage.getItem(key) || "[]");
      prev.push({ role, email: email.trim() || null, text: text.trim() });
      localStorage.setItem(key, JSON.stringify(prev));
    } catch {
      // localStorage недоступен — для заглушки не критично.
    }
    setSent(true);
  }

  const roles: [Role, string][] = [
    ["company", "Сотрудник компании"],
    ["ngo", "Сотрудник НКО"],
  ];

  return (
    <section
      data-component="FeedbackForm"
      className={cn("rounded-xl border bg-muted/40 p-6 sm:p-8", className)}
    >
      {sent ? (
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--ok)/0.15)] text-[hsl(var(--ok))]">
            <Check className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Спасибо за отзыв!
            </h2>
            <p className="mt-1 max-w-prose text-sm leading-relaxed text-muted-foreground">
              Мы прочитаем ваше сообщение — это помогает нам стать лучше.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5">
          <div className="flex items-start gap-3">
            <MessageSquareText className="mt-0.5 hidden h-6 w-6 shrink-0 text-brand sm:block" />
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Нам правда важно ваше мнение
              </h2>
              <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-muted-foreground">
                Если у вас есть предложения по поводу нашего контента или работы
                платформы — напишите нам, пожалуйста. Это поможет нам стать
                лучше.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              role="radiogroup"
              aria-label="Кто вы"
              className="inline-flex rounded-lg border bg-background p-1"
            >
              {roles.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={role === value}
                  onClick={() => setRole(value)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    role === value
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {!showEmail ? (
              <button
                type="button"
                onClick={() => setShowEmail(true)}
                className="text-sm font-medium text-brand hover:underline"
              >
                + Email (необязательно)
              </button>
            ) : null}
          </div>

          {showEmail ? (
            <div>
              <label htmlFor="feedback-email" className="sr-only">
                Email
              </label>
              <input
                id="feedback-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ваш email"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Чтобы мы могли вам ответить.
              </p>
            </div>
          ) : null}

          <div>
            <label htmlFor="feedback-text" className="sr-only">
              Ваш отзыв
            </label>
            <textarea
              id="feedback-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Расскажите о вашем опыте"
              rows={4}
              className="min-h-[120px] w-full rounded-lg border bg-background p-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <Button type="submit" disabled={!canSend}>
            Отправить
            <Send />
          </Button>
        </form>
      )}
    </section>
  );
}
