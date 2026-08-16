import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToBlock, scrollToBlockPath, flashBlockPath, anchorId } from "@/lib/scroll";

/*
  При переходе на новый маршрут — прокрутка наверх. Исключений два.

  `state.block` — адрес блока в дереве страницы: так ведёт карта блоков, и
  посадка получается точной, вплоть до нужной карточки. Долетев, подсвечиваем
  блок вспышкой.

  `state.anchor` — якорь секции: так ведут глоссарий по термину и инвентарь
  контента. Им хватает заголовка.

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
    const want = (state as { anchor?: string; block?: string } | null) ?? {};
    if (!want.anchor && !want.block) {
      window.scrollTo({ top: 0 });
      return;
    }
    const id = want.anchor ? anchorId(want.anchor) : "";
    /*
      Сначала пробуем сам блок, и только если его на странице нет — заголовок
      над ним. Порядок важен: заголовок находится почти всегда, и попробуй мы
      его первым, до блока дело не дошло бы никогда.
    */
    const land = () =>
      (want.block && scrollToBlockPath(want.block)) || (id ? scrollToBlock(id) : false);
    let timer = 0;
    const started = Date.now();
    /*
      Прокручиваем не один раз, а ещё полсекунды после первого попадания:
      страница дособирается (подтягиваются логотипы и аватарки цитат), высота
      растёт, и разовая прокрутка уезжала бы вместе с ней.
    */
    let hitAt = 0;
    const tick = () => {
      const ok = land();
      if (ok && !hitAt) hitAt = Date.now();
      const done = hitAt && Date.now() - hitAt > 500;
      if (!done && Date.now() - started < GIVE_UP_MS)
        timer = window.setTimeout(tick, RETRY_MS);
      // Вспышка одна и в самом конце: запусти её на каждой попытке — анимация
      // перезапускалась бы пять раз подряд и мигала.
      else if (done && want.block) flashBlockPath(want.block);
    };
    tick();
    return () => window.clearTimeout(timer);
  }, [pathname, state]);
  return null;
}
