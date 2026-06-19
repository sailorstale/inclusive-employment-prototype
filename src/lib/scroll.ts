// Прокрутка к якорю секции внутри страницы. Маршрут (#/path) не меняется —
// поэтому это не href-навигация, а программный scrollIntoView по id.
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/** Нормализует «#anchor» / «anchor» к чистому id. */
export function anchorId(raw: string) {
  return raw.replace(/^#/, "");
}
