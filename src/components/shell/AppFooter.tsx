import { Link } from "react-router-dom";
import { Separator } from "../ui/separator";

// AppFooter (00 — Карта сайта) — три колонки ссылок по трекам + нижняя строка
// (копирайт + мета-ссылки). Подписи — дословно из спеки подвала.

const columns: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Для компаний",
    links: [
      { label: "Инклюзивное трудоустройство", to: "/general/start" },
      { label: "Договор и оформление", to: "/general/legal/contract" },
      { label: "Наём по шагам", to: "/companies" },
      { label: "Этика и коммуникация", to: "/general/team" },
    ],
  },
  {
    /*
      Подписи повторяют ЧЕТЫРЕ ГРУППЫ бокового меню раздела (новая структура от
      клиента, 10 августа 2026), а ссылка ведёт на первую страницу группы. Все
      четырнадцать страниц в подвале не поместятся, а группы дают ту же карту
      раздела в четыре строки.
    */
    title: "Для НКО",
    links: [
      { label: "Запуск программы", to: "/ngo/start" },
      { label: "Соискатели", to: "/ngo/candidates" },
      { label: "Работодатели", to: "/ngo/employers" },
      { label: "Развитие и масштабирование", to: "/ngo/roadmap" },
    ],
  },
  {
    title: "Для соискателей",
    // Раздел-заглушка — без подразделов, одна ссылка на раздел.
    links: [{ label: "Обзор раздела", to: "/jobseekers" }],
  },
];

const footerLink =
  "text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm";

export function AppFooter() {
  return (
    <footer className="mt-16 border-t bg-muted/20">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {col.title}
              </h2>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={footerLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">© Яндекс, 2026</p>
          <div className="flex items-center gap-6">
            <Link to="/a11y" className={footerLink}>
              Доступность
            </Link>
            <Link to="/feedback" className={footerLink}>
              Обратная связь
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
