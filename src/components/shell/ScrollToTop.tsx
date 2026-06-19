import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// При переходе на новый маршрут — прокрутка наверх. Исключение: переход
// на глоссарий с якорем (state.anchor) — там прокрутку делает сама страница.
export function ScrollToTop() {
  const { pathname, state } = useLocation();
  useEffect(() => {
    if (state && (state as { anchor?: string }).anchor) return;
    window.scrollTo({ top: 0 });
  }, [pathname, state]);
  return null;
}
