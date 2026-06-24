// SkipLink (00 — Доступность, WCAG 2.4.1 Bypass Blocks) — «К содержимому»:
// первый элемент по Tab, скрыт визуально, проявляется при фокусе. Ведёт к
// основному содержимому (<main id="main-content">), минуя шапку и навигацию.
// Маршрутизация хеш-адресами → переход делаем программным фокусом, а не
// href="#main-content" (иначе HashRouter примет это за смену маршрута).

export function SkipLink() {
  const goToContent = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const main = document.getElementById("main-content");
    if (main) {
      main.focus();
      main.scrollIntoView({ block: "start" });
    }
  };

  return (
    <a
      href="#main-content"
      onClick={goToContent}
      className="sr-only z-50 rounded-md bg-background px-4 py-2 text-sm font-medium text-foreground shadow-md ring-2 ring-ring focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      К содержимому
    </a>
  );
}
