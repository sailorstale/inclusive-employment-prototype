import * as React from "react";
import { anchorId } from "./scroll";

// Оглавление страницы «На этой странице» (00 — Карта сайта и навигация).
// Страница объявляет свои пункты через <PageToc>; контекст переносит их в липкий
// рейл оглавления (TocRail) на десктопе. На узком экране пункты рисует сам PageToc
// в теле страницы. Так список один (= заголовкам секций) и не расходится.

export type TocItem = { label: string; anchor: string };
export type TocSubItem = { id: string; label: string };

type TocCtx = {
  items: TocItem[];
  setItems: (items: TocItem[]) => void;
};

const TocContext = React.createContext<TocCtx>({
  items: [],
  setItems: () => {},
});

export function TocProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<TocItem[]>([]);
  return (
    <TocContext.Provider value={{ items, setItems }}>
      {children}
    </TocContext.Provider>
  );
}

export function useToc() {
  return React.useContext(TocContext);
}

/**
 * Подзаголовки активной секции (h3-подсекции с якорями) — читаются из DOM,
 * поэтому страницы не размечают их в оглавлении руками. Возвращает [] когда
 * активной секции нет или в ней нет якорных h3.
 */
export function useSubSections(activeId: string | null): TocSubItem[] {
  const [subs, setSubs] = React.useState<TocSubItem[]>([]);
  React.useEffect(() => {
    if (!activeId) {
      setSubs([]);
      return;
    }
    const root = document.getElementById(activeId);
    if (!root) {
      setSubs([]);
      return;
    }
    const found: TocSubItem[] = [];
    root.querySelectorAll("section[id]").forEach((sec) => {
      const h = sec.querySelector("h3");
      // Берём только собственный заголовок подсекции (не из вложенных).
      if (h && h.closest("section[id]") === sec) {
        const label = (h.textContent || "").trim();
        if (sec.id && label) found.push({ id: sec.id, label });
      }
    });
    setSubs(found);
  }, [activeId]);
  return subs;
}

/**
 * Как useScrollSpy, но null, пока читатель не дошёл до первого из id —
 * чтобы во вступлении секции ни один подзаголовок не подсвечивался.
 */
export function usePassedSpy(ids: string[]): string | null {
  const key = ids.join("|");
  const [active, setActive] = React.useState<string | null>(null);
  React.useEffect(() => {
    const list = key ? key.split("|") : [];
    if (!list.length) {
      setActive(null);
      return;
    }
    let frame = 0;
    const compute = () => {
      frame = 0;
      const line = 96;
      let current: string | null = null;
      for (const id of list) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - line <= 0) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [key]);
  return active;
}

/**
 * Scrollspy: возвращает id секции, в которой читатель сейчас находится.
 * Берём последнюю секцию, чей верх ушёл выше «линии чтения» под шапкой.
 */
export function useScrollSpy(anchors: string[]): string | null {
  const ids = anchors.map(anchorId);
  const key = ids.join("|");
  const [active, setActive] = React.useState<string | null>(ids[0] ?? null);

  React.useEffect(() => {
    if (!ids.length) return;
    let frame = 0;
    const compute = () => {
      frame = 0;
      // Линия чтения — чуть ниже липкой шапки (64px + воздух).
      const line = 96;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - line <= 0) current = id;
      }
      // У самого низа страницы — подсветить последнюю секцию.
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
      ) {
        current = ids[ids.length - 1];
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return active;
}
