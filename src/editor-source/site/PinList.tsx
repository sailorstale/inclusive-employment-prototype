import * as React from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Comment } from "@/editor-source/comments";

/*
  СПИСОК ПИНОВ СТРАНИЦЫ — «куда вернуться».

  Комментарий к компоненту уже виден на самом компоненте, но чтобы обойти все
  проблемные места, приходилось листать страницу глазами. Здесь они собраны
  списком: клик — и правая панель встаёт на нужный компонент.

  Адрес комментария — «slug::путь::uid», где путь это адрес компонента в дереве
  («1.2.0»), тот же, что стоит в data-json-path у самого компонента. По нему и
  прокручиваем.
*/

export type PinItem = {
  /** Путь компонента в дереве — он же адрес в data-json-path. */
  path: string;
  /** Подпись: имя компонента и начало текста. */
  label: string;
  count: number;
  resolved: boolean;
};

/** Собрать пины страницы из общего списка комментариев. */
export function pinsOfPage(comments: Comment[], slug: string): PinItem[] {
  const byPath = new Map<string, PinItem>();
  for (const c of comments) {
    if (c.page !== slug || !c.text?.trim()) continue;
    const path = c.id.split("::")[1];
    if (!path) continue;
    const prev = byPath.get(path);
    if (prev) {
      prev.count += 1;
      prev.resolved = prev.resolved && Boolean(c.resolved);
      continue;
    }
    byPath.set(path, {
      path,
      label: (c.original || c.text || "").trim(),
      count: 1,
      resolved: Boolean(c.resolved),
    });
  }
  /*
    Порядок — как на странице: путь «1.10.2» сравниваем по числам, иначе строкой
    десятый компонент встал бы перед вторым.
  */
  return [...byPath.values()].sort((a, b) => {
    const x = a.path.split(".").map(Number);
    const y = b.path.split(".").map(Number);
    for (let i = 0; i < Math.max(x.length, y.length); i++) {
      const d = (x[i] ?? -1) - (y[i] ?? -1);
      if (d) return d;
    }
    return 0;
  });
}

export function PinList({
  pins,
  pane,
  selected,
  onSelect,
}: {
  pins: PinItem[];
  /** Контейнер прокрутки страницы — в нём ищем компонент и к нему ведём. */
  pane: HTMLDivElement | null;
  selected: string | null;
  onSelect: (path: string) => void;
}) {
  if (!pins.length) return null;

  const go = (path: string) => {
    onSelect(path);
    const el = pane?.querySelector(`[data-json-path="${path}"]`);
    const target = el?.firstElementChild ?? el;
    if (!pane || !target) return;
    pane.scrollTop +=
      target.getBoundingClientRect().top - pane.getBoundingClientRect().top - 80;
  };

  const open = pins.filter((p) => !p.resolved).length;

  return (
    <nav aria-label="Пины страницы" className="mt-8 border-t pt-4">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <MessageCircle className="h-3.5 w-3.5" />
        Пины {open ? `· ${open}` : null}
      </p>
      <ul className="space-y-1">
        {pins.map((p) => (
          <li key={p.path}>
            <button
              type="button"
              onClick={() => go(p.path)}
              className={cn(
                "-ml-px block w-full border-l py-1 pl-3 text-left text-xs leading-snug transition-colors",
                selected === p.path
                  ? "border-brand font-medium text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
                p.resolved && "line-through opacity-60",
              )}
              title={p.label}
            >
              <span className="line-clamp-2">{p.label || "Компонент"}</span>
              {p.count > 1 ? (
                <span className="ml-1 text-[10px] text-muted-foreground">
                  · {p.count}
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
