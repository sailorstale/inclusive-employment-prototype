import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToBlock, anchorId } from "@/lib/scroll";

/*
  При переходе на новый маршрут — прокрутка наверх. Исключение: переход с
  `state.anchor` (глоссарий по термину, инвентарь контента, карта блоков) —
  тогда прокручиваем к нужной секции.

  ЖДЁМ ПОЯВЛЕНИЯ ЭЛЕМЕНТА, а не пары кадров. Страницы «Основ» и треков
  собираются из источника: модуль подгружается запросом, и к моменту второго
  кадра нужной секции в разметке ещё нет. Раньше прокрутка тихо не срабатывала —
  элемент появлялся примерно через полсекунды, уже после попытки.

  Поэтому опрашиваем раз в 100 мс, пока элемент не найдётся, но не дольше трёх
  секунд: если за это время его нет, значит якорь не с этой страницы, и
  дёргать читателя не за чем.
*/
const RETRY_MS = 100;
const GIVE_UP_MS = 3000;

export function ScrollToTop() {
  const { pathname, state } = useLocation();
  useEffect(() => {
    const anchor = (state as { anchor?: string } | null)?.anchor;
    if (!anchor) {
      window.scrollTo({ top: 0 });
      return;
    }
    const id = anchorId(anchor);
    let timer = 0;
    const started = Date.now();
    /*
      Прокручиваем не один раз, а ещё полсекунды после первого попадания:
      страница дособирается (подтягиваются логотипы и аватарки цитат), высота
      растёт, и разовая прокрутка уезжала бы вместе с ней.
    */
    let hitAt = 0;
    const tick = () => {
      const ok = scrollToBlock(id);
      if (ok && !hitAt) hitAt = Date.now();
      const done = hitAt && Date.now() - hitAt > 500;
      if (!done && Date.now() - started < GIVE_UP_MS)
        timer = window.setTimeout(tick, RETRY_MS);
    };
    tick();
    return () => window.clearTimeout(timer);
  }, [pathname, state]);
  return null;
}
