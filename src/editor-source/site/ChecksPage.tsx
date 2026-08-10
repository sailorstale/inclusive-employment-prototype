import * as React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Stat, FilterBtn } from "@/editor/adminUi";
import { buildOsnovyExport } from "./siteExport";
import { checkExport, groupProblems, type Problem, type Severity } from "./exportChecks";

/*
  ПРОВЕРКА ВЫГРУЗКИ (/checks) — что увидит разработчик, если возьмёт JSON прямо
  сейчас.

  Зачем страница, а не скрипт: выгрузка собирается из боевых данных (правки,
  директивы, логотипы приезжают с сервера), и честно проверить её можно только
  там же, где она собирается. Плюс дизайнер работает глазами, а не в терминале.

  Страница служебная, поэтому собрана из простых элементов админ-экранов — те же
  плашки и фильтры, что в «Карте блоков» и «Инвентаре».
*/

const SEVERITY_LABEL: Record<Severity, string> = {
  high: "Сломает вёрстку",
  medium: "Заметный мусор",
  low: "Мелочи",
};

const SEVERITY_CLASS: Record<Severity, string> = {
  high: "text-[hsl(var(--bad))]",
  medium: "text-[hsl(var(--warn))]",
  low: "text-muted-foreground",
};

export function ChecksPage() {
  const [problems, setProblems] = React.useState<Problem[] | null>(null);
  const [err, setErr] = React.useState<string | null>(null);
  const [severity, setSeverity] = React.useState<Severity | "Все">("Все");

  React.useEffect(() => {
    let alive = true;
    buildOsnovyExport()
      .then((site) => alive && setProblems(checkExport(site)))
      .catch((e) => alive && setErr(String(e)));
    return () => {
      alive = false;
    };
  }, []);

  const counts = React.useMemo(() => {
    const c: Record<Severity, number> = { high: 0, medium: 0, low: 0 };
    for (const p of problems ?? []) c[p.severity] += 1;
    return c;
  }, [problems]);

  const groups = React.useMemo(
    () => groupProblems((problems ?? []).filter((p) => severity === "Все" || p.severity === severity)),
    [problems, severity],
  );

  if (err)
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-[hsl(var(--bad))]">
        Не удалось собрать выгрузку: {err}
      </div>
    );

  if (!problems)
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-muted-foreground">
        Собираем выгрузку и проверяем её…
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Проверка выгрузки
        </h1>
        <p className="max-w-prose text-muted-foreground">
          Сайт собирают руками в конструкторе, и всё, что туда едет, — это JSON.
          Ошибку в нём глазами не увидеть: на прототипе страница выглядит
          нормально, а разработчик получает пустой контейнер, рваную таблицу или
          ссылку в никуда. Здесь машина сверяет выгрузку с тем, о чём мы
          договорились письменно.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <Stat label="замечаний всего" value={problems.length} />
        <Stat label="сломает вёрстку" value={counts.high} bad />
        <Stat label="заметный мусор" value={counts.medium} warn />
        <Stat label="мелочи" value={counts.low} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterBtn active={severity === "Все"} onClick={() => setSeverity("Все")}>
          Все
        </FilterBtn>
        {(["high", "medium", "low"] as Severity[]).map((s) => (
          <FilterBtn key={s} active={severity === s} onClick={() => setSeverity(s)}>
            {SEVERITY_LABEL[s]}
          </FilterBtn>
        ))}
      </div>

      {groups.length === 0 ? (
        <p className="text-muted-foreground">
          Чисто: ни одно правило не сработало.
        </p>
      ) : (
        groups.map(({ rule, severity: sev, items }) => (
          <section key={rule} className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">
              {rule}{" "}
              <span className={`text-sm font-normal ${SEVERITY_CLASS[sev]}`}>
                · {SEVERITY_LABEL[sev].toLowerCase()} · {items.length}
              </span>
            </h2>
            <ul className="divide-y rounded-md border">
              {items.map((p, i) => (
                <li key={`${p.page}-${p.where}-${i}`}>
                  <Link
                    to={p.page}
                    className="group flex items-start gap-3 px-3 py-2.5 hover:bg-muted/50"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-foreground">{p.message}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {p.page} · {p.where}
                      </span>
                    </span>
                    <ArrowRight className="mt-0.5 size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
