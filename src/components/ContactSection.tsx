import * as React from "react";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// ContactSection (00b §2.8) — блок «Остались вопросы?»: заголовок + контакт-карточки
// (иконка + лейбл + email/текст). Часть кликабельны (mailto / внутренняя ссылка),
// часть — просто текст.

export type Contact = {
  label: React.ReactNode;
  value: React.ReactNode;
  /** email для mailto; если нет — карточка не кликабельна (или ведёт по `to`). */
  email?: string;
  /** Внутренний маршрут (react-router), напр. форма обратной связи `/feedback`. */
  to?: string;
  icon?: React.ReactNode;
};

export function ContactSection({
  title,
  intro,
  contacts,
  className,
}: {
  title?: React.ReactNode;
  intro?: React.ReactNode;
  contacts: Contact[];
  className?: string;
}) {
  return (
    <section data-component="ContactSection" className={cn("space-y-4", className)}>
      {title ? (
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
      ) : null}
      {intro ? (
        <p className="max-w-prose leading-relaxed text-muted-foreground">
          {intro}
        </p>
      ) : null}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {contacts.map((c, i) => {
          const inner = (
            <>
              <span className="text-muted-foreground [&_svg]:h-5 [&_svg]:w-5">
                {c.icon ?? <Mail />}
              </span>
              <span>
                <span className="block text-sm font-medium text-foreground">
                  {c.label}
                </span>
                <span className="block text-sm text-muted-foreground">
                  {c.value}
                </span>
              </span>
            </>
          );
          const base = "flex items-start gap-3 rounded-lg border bg-card p-4";
          const interactive =
            "transition-colors hover:border-ring hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
          if (c.email) {
            return (
              <a
                key={i}
                href={`mailto:${c.email}`}
                className={cn(base, interactive)}
              >
                {inner}
              </a>
            );
          }
          if (c.to) {
            return (
              <Link key={i} to={c.to} className={cn(base, interactive)}>
                {inner}
              </Link>
            );
          }
          return (
            <div key={i} className={base}>
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}
