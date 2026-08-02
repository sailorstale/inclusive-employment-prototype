import * as React from "react";
import { MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";

/*
  ПИНЫ — закладки «сюда вернуться».

  Это НЕ комментарии: у пина нет текста, автора и обсуждения. Он отвечает на
  один вопрос — «куда я хотел вернуться». Поэтому и хранилище своё: смешивать
  закладку с обсуждением значит через месяц не понимать, что означает запись.

  Живут в памяти браузера (localStorage): это рабочие метки одного человека на
  время разбора, а не общий артефакт вроде правок и директив. Уехать на сервер
  они смогут, когда понадобится общий список на всех.

  Адрес пина — «страница + путь компонента» («1.2.0»), тот же путь, что стоит
  в data-json-path у компонента. Значит пин ставится и в режиме «Сайт», и в
  «Модулях» — механика одна.
*/

const KEY = "inclusion-pins-v1";

type Pin = { label: string; at: string };
type Store = Record<string, Record<string, Pin>>;

let store: Store = read();
const subs = new Set<() => void>();

function read(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    return {};
  }
}

function write(next: Store) {
  store = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* приватный режим — пины поживут до перезагрузки */
  }
  subs.forEach((f) => f());
}

function subscribe(f: () => void) {
  subs.add(f);
  return () => subs.delete(f);
}

/** Пины одной страницы, по порядку следования на ней. */
export function usePins(page: string) {
  const snap = React.useSyncExternalStore(
    subscribe,
    () => store[page],
    () => undefined,
  );

  const list = React.useMemo(() => {
    const byPath = snap ?? {};
    return Object.entries(byPath)
      .map(([path, pin]) => ({ path, ...pin }))
      /*
        Порядок — как на странице: путь сравниваем по числам, иначе десятый
        компонент встал бы перед вторым.
      */
      .sort((a, b) => {
        const x = a.path.split(".").map(Number);
        const y = b.path.split(".").map(Number);
        for (let i = 0; i < Math.max(x.length, y.length); i++) {
          const d = (x[i] ?? -1) - (y[i] ?? -1);
          if (d) return d;
        }
        return 0;
      });
  }, [snap]);

  const has = React.useCallback((path: string) => Boolean(snap?.[path]), [snap]);

  const toggle = React.useCallback(
    (path: string, label: string) => {
      const cur = store[page] ?? {};
      const next = { ...cur };
      if (next[path]) delete next[path];
      else next[path] = { label: label.slice(0, 120), at: new Date().toISOString() };
      write({ ...store, [page]: next });
    },
    [page],
  );

  const remove = React.useCallback(
    (path: string) => {
      const next = { ...(store[page] ?? {}) };
      delete next[path];
      write({ ...store, [page]: next });
    },
    [page],
  );

  return { pins: list, has, toggle, remove };
}

/** Позиция выделенного компонента — чтобы поставить иконку в его угол. */
function useSelectedRect(pane: HTMLElement | null, selected: string | null) {
  const [pos, setPos] = React.useState<{ top: number; right: number } | null>(null);
  React.useEffect(() => {
    if (!selected) {
      setPos(null);
      return;
    }
    /*
      Контейнер прокрутки знаем не всегда (в разных режимах он свой), поэтому
      без него ищем компонент по всей странице и не проверяем границы панели.
      Иначе иконка молча не появлялась бы — а понять почему, глядя на экран,
      невозможно.
    */
    const root: ParentNode = pane ?? document;
    const update = () => {
      const el = root.querySelector(`[data-json-path="${selected}"]`);
      const box = (el?.firstElementChild ?? el) as HTMLElement | null;
      if (!box) return setPos(null);
      const r = box.getBoundingClientRect();
      const p = pane?.getBoundingClientRect();
      // Ушёл за пределы панели — иконку не рисуем, она бы висела в воздухе.
      if (p && (r.bottom < p.top || r.top > p.bottom)) return setPos(null);
      setPos({ top: Math.max(r.top, (p?.top ?? 0) + 4), right: r.right });
    };
    update();
    pane?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      pane?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pane, selected]);
  return pos;
}

export function PinLayer({
  page,
  pane,
  selected,
  onSelect,
  labelOf,
  /** Сдвиг иконки влево — когда рядом уже висит другая (комментарии). */
  offset = 0,
}: {
  page: string;
  pane: HTMLDivElement | null;
  selected: string | null;
  onSelect: (path: string) => void;
  labelOf: (path: string) => string;
  offset?: number;
}) {
  const { pins, has, toggle, remove } = usePins(page);
  const [open, setOpen] = React.useState(false);
  const pos = useSelectedRect(pane, selected);

  const go = (path: string) => {
    onSelect(path);
    const root: ParentNode = pane ?? document;
    const el = root.querySelector(`[data-json-path="${path}"]`);
    const target = (el?.firstElementChild ?? el) as HTMLElement | null;
    if (!target) return;
    // Контейнер известен — двигаем его точно; нет — обычный подскок к элементу.
    if (pane)
      pane.scrollTop +=
        target.getBoundingClientRect().top - pane.getBoundingClientRect().top - 80;
    else target.scrollIntoView({ block: "center" });
  };

  return (
    <>
      {/* Иконка у выделенного компонента: поставить или снять пин. */}
      {selected && pos && (
        <button
          type="button"
          style={{
            position: "fixed",
            top: pos.top + 6,
            left: pos.right - 40 - offset,
            zIndex: 60,
          }}
          onClick={() => toggle(selected, labelOf(selected))}
          aria-label={has(selected) ? "Снять пин" : "Поставить пин"}
          title={has(selected) ? "Снять пин" : "Поставить пин"}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg border bg-card transition-colors hover:bg-accent",
            has(selected)
              ? "border-amber-400 text-amber-500"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <MapPin className="h-5 w-5" />
        </button>
      )}

      {/* Кнопка со счётчиком — вызывает список. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-5 right-5 z-[60] flex items-center gap-1.5 rounded-full border bg-card/95 px-3 py-2 text-xs font-medium shadow-md backdrop-blur transition-colors",
          open ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        <MapPin className="h-4 w-4" />
        Пины
        {pins.length ? (
          <span className="rounded-full bg-amber-400/20 px-1.5 text-amber-600">
            {pins.length}
          </span>
        ) : null}
      </button>

      {open && (
        <div className="fixed bottom-16 right-5 z-[60] max-h-[60vh] w-80 overflow-y-auto rounded-xl border bg-card p-2 shadow-lg">
          {pins.length === 0 ? (
            <p className="p-3 text-xs leading-snug text-muted-foreground">
              Пинов нет. Выделите компонент на странице и нажмите иконку пина —
              он появится здесь, чтобы к нему можно было вернуться.
            </p>
          ) : (
            <ul className="space-y-0.5">
              {pins.map((p) => (
                <li key={p.path} className="flex items-start gap-1">
                  <button
                    type="button"
                    onClick={() => go(p.path)}
                    className={cn(
                      "flex-1 rounded-md px-2 py-1.5 text-left text-xs leading-snug transition-colors hover:bg-accent",
                      selected === p.path ? "bg-accent font-medium" : "text-foreground/80",
                    )}
                  >
                    <span className="line-clamp-2">{p.label || "Компонент"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(p.path)}
                    aria-label="Снять пин"
                    title="Снять пин"
                    className="mt-1 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}
