// Прокрутка к якорю секции внутри страницы. Маршрут (#/path) не меняется —
// поэтому это не href-навигация, а программный scrollIntoView по id.
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) {
    // Уважаем «уменьшить движение» (WCAG 2.3.3): без плавной анимации прокрутки.
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }
}

/** Нормализует «#anchor» / «anchor» к чистому id. */
export function anchorId(raw: string) {
  return raw.replace(/^#/, "");
}

/*
  Прокрутка к якорю в ЛЮБОЙ раскладке, в том числе внутри инструмента сверки.

  Почему не хватает scrollToId: страница сайта живёт в своей прокручиваемой
  колонке, а не в окне. Браузерный scrollIntoView ищет ближайшего прокручиваемого
  предка сам и в этой раскладке промахивается — та же беда описана в инспекторе,
  где прокрутку тоже пришлось считать руками.

  Поэтому ищем контейнер сами и двигаем его scrollTop. Отступ сверху небольшой:
  над контентом висит шапка, и без него заголовок уезжал бы под неё.
*/
const TOP_GAP = 24;

function scrollParent(el: HTMLElement): HTMLElement | null {
  for (let p = el.parentElement; p; p = p.parentElement) {
    const oy = getComputedStyle(p).overflowY;
    if ((oy === "auto" || oy === "scroll") && p.scrollHeight > p.clientHeight)
      return p;
  }
  return null;
}

export function scrollToBlock(rawId: string): boolean {
  const el = document.getElementById(anchorId(rawId));
  if (!el) return false;
  const box = scrollParent(el);
  if (!box) {
    // Обычная страница: прокручивается само окно.
    const y = el.getBoundingClientRect().top + window.scrollY - TOP_GAP;
    window.scrollTo({ top: y });
    return true;
  }
  box.scrollTop += el.getBoundingClientRect().top - box.getBoundingClientRect().top - TOP_GAP;
  return true;
}
