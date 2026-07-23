import * as React from "react";

/*
  СИНХРОННЫЙ СКРОЛЛ ДВУХ КОЛОНОК — по секциям, а не по проценту высоты.

  Пропорция работает, только пока высоты колонок сопоставимы. С JSON она
  разъезжается: секция, которая на странице занимает экран, в JSON тянется на
  полторы сотни строк — и к середине документа колонки смотрят в разные места.

  Поэтому держим общую систему координат: у начала каждой секции во всех
  представлениях (текст, JSON, раскладка, результат) стоит свой якорь. Берём
  верхнюю видимую секцию и долю прокрутки ВНУТРИ неё — и ставим другую колонку
  на ту же секцию с той же долей.

  Общий модуль: механика нужна и страницам модулей, и эталонной странице.
*/

/*
  Начала секций; индекс массива = номер секции, массив разрежённый.

  Явный data-sec ставим сами (текст, JSON, режим «Блоки»). В режиме «Результат»
  секцию рисует компонент дизайн-системы: служебного атрибута у него нет и
  заводить не станем — берём Section Container по порядку следования, он на
  каждую секцию ровно один.
*/
export function secEls(box: HTMLElement): HTMLElement[] {
  const out: HTMLElement[] = [];
  box.querySelectorAll<HTMLElement>("[data-sec]").forEach((el) => {
    out[Number(el.dataset.sec)] = el;
  });
  if (out.length) return out;
  box
    .querySelectorAll<HTMLElement>('[data-component="Section Container"]')
    .forEach((el, i) => {
      out[i] = el;
    });
  return out;
}

/** Границы секции i в координатах содержимого контейнера. */
export function secSpan(els: HTMLElement[], i: number, box: HTMLElement) {
  const boxTop = box.getBoundingClientRect().top - box.scrollTop;
  const top = els[i].getBoundingClientRect().top - boxTop;
  const next = els.slice(i + 1).find(Boolean);
  // У последней секции конца нет — тянем до конца содержимого. Брать
  // offsetHeight нельзя: в режиме «Блоки» якорь — лишь ПЕРВЫЙ блок секции.
  const height = next
    ? next.getBoundingClientRect().top - boxTop - top
    : box.scrollHeight - top;
  return { top, height };
}

/**
 * Куда прокрутить `to`, чтобы он показывал то же место документа, что и `from`:
 * та же секция и та же доля прокрутки ВНУТРИ неё. null — двигать не нужно.
 */
export function syncTarget(from: HTMLElement, to: HTMLElement): number | null {
  const fe = secEls(from);
  const te = secEls(to);
  let target: number;
  if (fe.length && te.length) {
    // Верхняя секция, начало которой уже ушло за верхний край окна.
    let i = 0;
    for (let k = 0; k < fe.length; k++)
      if (fe[k] && secSpan(fe, k, from).top <= from.scrollTop + 1) i = k;
    while (i >= 0 && !te[i]) i -= 1; // в другой колонке секции может не быть
    if (i < 0) return null;
    const f = secSpan(fe, i, from);
    const frac =
      f.height > 0
        ? Math.min(1, Math.max(0, (from.scrollTop - f.top) / f.height))
        : 0;
    const t = secSpan(te, i, to);
    target = t.top + frac * t.height;
  } else {
    // Якорей ещё нет (контент грузится) — пропорциональное поведение.
    const max = from.scrollHeight - from.clientHeight;
    target =
      (max > 0 ? from.scrollTop / max : 0) * (to.scrollHeight - to.clientHeight);
  }
  return Math.max(0, Math.min(target, to.scrollHeight - to.clientHeight));
}

/*
  Связать две колонки: ведёт та, которую крутят.

  Контейнеры принимаем СОСТОЯНИЕМ, а не ref: колонка может пересоздаться при
  переключении режима, и слушатель, повешенный один раз, остался бы на
  отсоединённом узле — синхрон молча переставал бы работать.

  Отражённое событие гасим флагом «следующий скролл у этой колонки — наш,
  программный»: ставим его, только когда реально двигаем, поэтому ровно одно
  событие и гасится (без таймеров и rAF).
*/
export function useScrollSync(
  a: HTMLElement | null,
  b: HTMLElement | null,
): void {
  React.useEffect(() => {
    if (!a || !b) return;

    const skip = { a: false, b: false };
    const align = (from: HTMLElement, to: HTMLElement, lock: "a" | "b") => {
      const target = syncTarget(from, to);
      if (target === null) return;
      if (Math.abs(to.scrollTop - target) > 1) {
        skip[lock] = true;
        to.scrollTop = target;
      }
    };

    const onA = () => {
      if (skip.a) return void (skip.a = false);
      align(a, b, "b");
    };
    const onB = () => {
      if (skip.b) return void (skip.b = false);
      align(b, a, "a");
    };
    a.addEventListener("scroll", onA, { passive: true });
    b.addEventListener("scroll", onB, { passive: true });
    return () => {
      a.removeEventListener("scroll", onA);
      b.removeEventListener("scroll", onB);
    };
  }, [a, b]);
}
