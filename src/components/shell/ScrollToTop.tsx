import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToId, anchorId } from "@/lib/scroll";

// При переходе на новый маршрут — прокрутка наверх. Исключение: переход с
// `state.anchor` (глоссарий по термину, ссылки из инвентаря контента) — тогда
// прокручиваем к нужной секции после отрисовки новой страницы.
export function ScrollToTop() {
  const { pathname, state } = useLocation();
  useEffect(() => {
    const anchor = (state as { anchor?: string } | null)?.anchor;
    if (anchor) {
      // Дать новой странице отрисоваться (два кадра — на случай тяжёлой вёрстки).
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => scrollToId(anchorId(anchor)));
      });
      return () => {
        cancelAnimationFrame(raf1);
        if (raf2) cancelAnimationFrame(raf2);
      };
    }
    window.scrollTo({ top: 0 });
  }, [pathname, state]);
  return null;
}
