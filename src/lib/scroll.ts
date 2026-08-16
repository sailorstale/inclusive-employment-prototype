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

function scrollElement(el: HTMLElement): boolean {
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

export function scrollToBlock(rawId: string): boolean {
  const el = document.getElementById(anchorId(rawId));
  return el ? scrollElement(el) : false;
}

/*
  ПРОКРУТКА К САМОМУ БЛОКУ, а не к заголовку над ним.

  У карточки, цитаты или таблицы своего якоря на странице нет, и карта блоков
  раньше вела к ближайшему заголовку сверху. Под одним заголовком лежит до
  одиннадцати карточек, так что найти нужную всё равно приходилось глазами.

  Опора — адрес узла в дереве страницы (data-json-path), тот же, по которому к
  блоку привязаны замечания клиента. Он есть у каждого узла и на обычной
  странице, и в инструменте сверки.
*/
function blockElement(path: string): HTMLElement | null {
  const found = document.querySelectorAll<HTMLElement>(
    `[data-json-path="${CSS.escape(path)}"]`,
  );
  for (const wrap of Array.from(found)) {
    // В инструменте сверки тот же адрес стоит и у строки JSON в соседней
    // колонке. Она лежит внутри <pre> — её пропускаем.
    if (wrap.closest("pre")) continue;
    /*
      Сама обёртка узла коробки не имеет (display: contents), её
      getBoundingClientRect — нули. Меряем и подсвечиваем первого ребёнка: это
      и есть видимый блок.
    */
    const el = (wrap.firstElementChild as HTMLElement | null) ?? wrap;
    return el;
  }
  return null;
}

export function scrollToBlockPath(path: string): boolean {
  const el = blockElement(path);
  return el ? scrollElement(el) : false;
}

/*
  Вспышка вокруг блока, к которому подвели страницу. Без неё читатель видит
  нужное место, но не понимает, о каком из соседних блоков шла речь. Класс
  снимаем сами: анимация одноразовая, и следующий переход к тому же блоку
  должен её запустить заново.
*/
const FLASH_CLASS = "ds-jump";
const FLASH_MS = 1600;

export function flashBlockPath(path: string) {
  const el = blockElement(path);
  if (!el) return;
  el.classList.remove(FLASH_CLASS);
  // Чтение раскладки перезапускает анимацию: без него браузер склеит снятие
  // класса и его возврат в один кадр, и вспышки не будет.
  void el.offsetWidth;
  el.classList.add(FLASH_CLASS);
  window.setTimeout(() => el.classList.remove(FLASH_CLASS), FLASH_MS);
}
