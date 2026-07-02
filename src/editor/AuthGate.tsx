import * as React from "react";
import { Lock } from "lucide-react";
import { checkAuth, setToken } from "./auth";

// Экран входа. Показывается, только когда сервер ТРЕБУЕТ пароль и текущий токен
// не подходит. Если пароль на сервере не задан или сервера нет (локальный режим)
// — пускаем без замка. Провайдеры данных монтируются внутри, поэтому грузят
// данные уже с валидным токеном.

type Status = "checking" | "locked" | "unlocked";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = React.useState<Status>("checking");
  const [pwd, setPwd] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    checkAuth().then((a) => {
      if (!alive) return;
      setStatus(a.required && !a.ok ? "locked" : "unlocked");
    });
    return () => {
      alive = false;
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const a = await checkAuth(pwd);
    setSubmitting(false);
    if (a.ok) {
      setToken(pwd);
      setStatus("unlocked");
    } else {
      setError("Неверный пароль");
    }
  };

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Загрузка…
      </div>
    );
  }

  if (status === "unlocked") return <>{children}</>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
      >
        <div className="mb-5 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground">
            Я
          </span>
          <div>
            <div className="text-sm font-semibold leading-tight">
              Инклюзия в Яндексе
            </div>
            <div className="text-xs text-muted-foreground">
              Редакторский доступ
            </div>
          </div>
        </div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="auth-pwd">
          Пароль
        </label>
        <input
          id="auth-pwd"
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          autoFocus
          placeholder="Введите пароль"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {error ? (
          <p className="mt-2 text-xs text-[hsl(var(--bad))]">{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={submitting || !pwd}
          className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-brand px-3 py-2 text-sm font-medium text-brand-foreground transition-colors hover:bg-[hsl(var(--brand)/0.9)] disabled:opacity-50"
        >
          <Lock className="h-4 w-4" />
          {submitting ? "Проверка…" : "Войти"}
        </button>
      </form>
    </div>
  );
}
