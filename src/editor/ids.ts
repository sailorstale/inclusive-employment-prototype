// Адрес блока вычисляется из его текста: страница + тип + хэш оригинала.
// Так любой текст на сайте получает стабильный id без ручной разметки. Адрес
// держится за блок, пока оригинал в коде не изменили (тогда правка помечается
// «устарела»). Точный «файл:строка» не нужен — разработчик переносит правки
// копипастом, ему важны страница и «было → стало».

export function normalizeText(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

// FNV-1a 32-бит → base36. Короткий детерминированный хэш.
function hashStr(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

export function autoId(
  page: string,
  type: string,
  text: string,
  anchor = ""
): string {
  return `${page}::${anchor || "-"}::${type}::${hashStr(normalizeText(text))}`;
}

// Адрес заголовка страницы (h1) — по маршруту, а не по хэшу текста. Навигация
// (крошки, боковое меню) знает путь, но не текст h1, поэтому ищет правку по
// этому адресу: правка h1 прорастает в подпись раздела во всех местах меню.
export function routeId(path: string): string {
  return `route:${path}`;
}
