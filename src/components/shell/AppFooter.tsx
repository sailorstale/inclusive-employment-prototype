import { Link } from "react-router-dom";
import { Separator } from "../ui/separator";

// AppFooter (00 — Карта сайта) — три колонки ссылок по трекам + нижняя строка
// (копирайт + мета-ссылки). Подписи — дословно из спеки подвала.

const columns: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Для компаний",
    links: [
      { label: "Стоит ли начинать", to: "/companies/start" },
      { label: "Правила оформления", to: "/companies/legal" },
      { label: "Найм по шагам", to: "/companies/hire" },
      { label: "Команда", to: "/companies/team" },
    ],
  },
  {
    title: "Для НКО",
    links: [
      { label: "Запустить программу", to: "/ngo/start" },
      { label: "Соискатель", to: "/ngo/candidates" },
      { label: "Работодатели", to: "/ngo/employers" },
      { label: "Сопровождение", to: "/ngo/support" },
      { label: "Развитие", to: "/ngo/scale" },
      { label: "Финансы", to: "/ngo/funding" },
    ],
  },
  {
    title: "Для соискателей",
    links: [
      { label: "Гид по профессиям", to: "/jobseekers/guide" },
      { label: "Инструменты", to: "/jobseekers/tools" },
      { label: "Куда устроиться", to: "/jobseekers/employers" },
      { label: "Истории", to: "/jobseekers/stories" },
      { label: "Материалы", to: "/jobseekers/resources" },
    ],
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
              <h2 className="mb-3 text-sm font-semibold text-foreground">
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
