import * as React from "react";
import { cn } from "@/lib/utils";

/*
  Figma: «Footer» (655:22793) и «Footer Item» (6243:2055).

  Подвал сайта: тёмная плашка в самом низу каждой страницы — логотип, карта
  разделов ссылками и копирайт. Один раз на страницу, последним блоком,
  на всю ширину 1440. Это навигационная страховка «куда пойти дальше»,
  а не рекламный блок: ни формы, ни кнопок, ни соцсетей в нём нет.
  Для призывов к действию перед ним стоят Feedback и Read More.

  Чем управляется: свойств нет (кроме Platform, который мы не реализуем).
  Настраивается наполнением — сколько колонок и сколько ссылок в каждой.
  В живом инстансе (6257:43505) колонок ровно четыре, по разделам сайта.

  Про отступы: собственного верхнего отступа у футера НЕТ — единственное
  исключение в этой группе. Расстояние до него задаёт страница.
  Верхние углы скруглены на 48 — под футером предполагается другой фон,
  который в уголках просвечивает.

  РАСХОЖДЕНИЯ С FIGMA (честно):
  1. Логотип — инстанс из библиотеки (красное «Я» Яндекса + иконка доступности).
     Картинки из Figma не тянем, поэтому здесь простая плашка-плейсхолдер
     на brand/yandex. Иконку доступности не рисуем: из макета не видно, куда
     она ведёт и что делает — вопрос дизайнеру.
  2. В макете колонка «Для соискателей» держит ДВЕ ссылки в одном Footer Item
     через перенос строки — это ломает правило «один Footer Item = одна ссылка»
     и делает их одной некликабельной строкой. Не тиражируем: здесь каждая
     ссылка — свой Footer Item.
  3. Состояний ссылок (наведение, фокус) в наборе нет, хотя у Footer Item есть
     скругление 12 под подложку — явная заготовка под подсветку. Добавили
     сдержанный hover (текст светлеет) и видимый фокус. Ждём решения.
  4. Год в копирайте зашит в макете как 2026 — оставили как есть, вопрос:
     обновляется ли он автоматически.
*/

type FooterLink = {
  label: string;
  href: string;
};

type FooterColumn = {
  title: string;
  links: readonly FooterLink[];
};

// Колонки живого инстанса. Колонки в макете не сбалансированы (в одной шесть
// ссылок, в другой одна) — похоже, футер просто не дозаполнен. Вопрос дизайнеру.
const DEFAULT_COLUMNS: readonly FooterColumn[] = [
  {
    title: "Основы",
    links: [
      { label: "Реалии и мифы", href: "#" },
      { label: "Законы и квоты", href: "#" },
      { label: "Доступная среда", href: "#" },
      { label: "Этика общения", href: "#" },
    ],
  },
  {
    title: "Для компаний",
    links: [{ label: "Наём по шагам", href: "#" }],
  },
  {
    title: "Для НКО",
    links: [
      { label: "Запустить программу", href: "#" },
      { label: "Сопровождение", href: "#" },
      { label: "Работа с компаниями", href: "#" },
      { label: "Обучение сотрудников", href: "#" },
      { label: "Истории и практики", href: "#" },
      { label: "Полезные материалы", href: "#" },
    ],
  },
  {
    title: "Для соискателей",
    links: [
      { label: "Как начать работать из дома", href: "#" },
      { label: "Гид по профессиям", href: "#" },
    ],
  },
];

type FooterProps = {
  columns?: readonly FooterColumn[];
  copyright?: string;
  className?: string;
};

export function Footer({
  columns = DEFAULT_COLUMNS,
  copyright = "© 1997 — 2026 ООО «Яндекс»",
  className,
}: FooterProps) {
  return (
    <div data-component="Footer" className={cn("w-full", className)}>
      {/* Section — тёмная плашка со скруглёнными верхними углами */}
      <div
        className={cn(
          "w-full overflow-hidden rounded-t-[var(--radius-3xl)] bg-[color:var(--surface-footer)]",
          "px-[var(--space-3xl)] pt-[var(--space-3xl)] pb-[var(--space-xl)]",
        )}
      >
        {/* Container: логотип + колонки ссылок, выравнивание по верху */}
        <div className="flex w-full items-start gap-[var(--space-l)]">
          <LogoContainer />

          {columns.map((column) => (
            // Links Container — равная доля ряда
            <nav
              key={column.title}
              aria-label={column.title}
              className="flex flex-1 flex-col"
            >
              <FooterItem title="Primary">{column.title}</FooterItem>
              {column.links.map((link) => (
                <FooterItem key={link.label} title="Secondary" href={link.href}>
                  {link.label}
                </FooterItem>
              ))}
            </nav>
          ))}
        </div>

        {/* Copyright Container */}
        <div className="pt-[var(--space-2xl)]">
          <p className="ds-body-m text-[color:var(--text-inverse-secondary)] opacity-50">
            {copyright}
          </p>
        </div>
      </div>
    </div>
  );
}

/* Logo Container — колонка ровно 264 (жёсткое значение из Figma, токена нет).
   Сам логотип 100×48: здесь плашка-плейсхолдер, см. расхождение 1. */
function LogoContainer() {
  return (
    <div className="flex w-[264px] shrink-0 items-center gap-[var(--space-l)]">
      <div
        aria-label="Логотип Яндекса"
        role="img"
        className={cn(
          "flex h-[48px] w-[100px] items-center justify-center",
          "rounded-[var(--radius-sm)] bg-[color:var(--brand-yandex)]",
          "ds-h4 text-[color:var(--text-inverse-primary)]",
        )}
      >
        Я
      </div>
    </div>
  );
}

/*
  Footer Item — одна строка подвала: либо заголовок колонки, либо ссылка под ним.
  Кирпичик, из которого набираются колонки. Отдельно на странице не применяется:
  цвета «вывернутые» (белый и светло-серый), читается только на тёмной плашке.

  Отступы асимметричные и работают только в порядке «сначала Primary, потом
  Secondary»: у заголовка отступ НИЖНИЙ (8), у ссылок ВЕРХНИЙ (16). Это
  единственное место в системе с нижним отступом — так задано в Figma, чтобы
  заголовок отбивался от списка под собой.

  Имя свойства Title вводит в заблуждение: Secondary — это не «второй
  заголовок», а обычная ссылка. Стоит переименовать (Type = Heading | Link) —
  вопрос дизайнеру.
*/

export type FooterItemTitle = "Primary" | "Secondary";

type FooterItemProps = {
  title?: FooterItemTitle;
  /** Только для Secondary: адрес ссылки. */
  href?: string;
  children?: React.ReactNode;
  className?: string;
};

export function FooterItem({
  title = "Secondary",
  href,
  children,
  className,
}: FooterItemProps) {
  if (title === "Primary") {
    return (
      <div
        data-component="Footer Item · Primary"
        className={cn(
          "w-full rounded-[var(--radius-sm)] pb-[var(--space-xs)]",
          className,
        )}
      >
        <span className="ds-h4 text-[color:var(--text-inverse-primary)]">
          {children}
        </span>
      </div>
    );
  }

  return (
    <div
      data-component="Footer Item · Secondary"
      className={cn("w-full pt-[var(--space-m)]", className)}
    >
      <a
        href={href}
        className={cn(
          "ds-body-l rounded-[var(--radius-sm)] text-[color:var(--text-inverse-secondary)] transition-colors",
          "hover:text-[color:var(--text-inverse-primary)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--text-inverse-primary)]",
        )}
      >
        {children}
      </a>
    </div>
  );
}
