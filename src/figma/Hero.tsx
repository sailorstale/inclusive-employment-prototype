import * as React from "react";
import { Accessibility, Search } from "lucide-react";
import { cn } from "@/lib/utils";

/*
  Figma: component set «Hero» (6342:4287), живой инстанс — 6180:8120.
  Свойство Type = Default (десктоп 1440×344) | Alt (414×216, по факту мобильный).
  Реализуем только Default.

  Шапка страницы: фотоподложка во всю ширину, поверх неё — логотип, меню сайта,
  кнопка поиска, и внизу слева — заголовок страницы H1.

  H1 ЖИВЁТ ТОЛЬКО ЗДЕСЬ. Отдельного компонента H1 в системе нет: набор Heading
  начинается с H2. То есть заголовок страницы неотделим от шапки — на странице
  ровно один Hero, и он же даёт единственный h1.

  ПРО НАЕЗД КОНТЕНТА (открытый вопрос дизайнеру): в живом шаблоне 6101:6294
  контент-фрейм начинается на y=264 при высоте Hero 344 — то есть контент
  НАЕЗЖАЕТ на Hero снизу на 80 px. Правило это или случайность — не зафиксировано.
  Сам Hero наезд НЕ реализует: он ничего не знает о контенте под собой.
  Наезжать должна страница — отрицательным верхним отступом 80 у контент-слоя:
      <Hero … />
      <div className="-mt-[80px]"> …три колонки… </div>
  Нижний паддинг заголовка (112) как раз оставляет 32 px воздуха над зоной наезда.

  РАСХОЖДЕНИЕ С ЗАДАНИЕМ, разрешено по скриншоту живого инстанса 6180:8120:
  в задании было «справа фото». По факту фото — подложка во всю ширину Hero
  (1440×560, обрезана до 344), а заголовок белый поверх неё. Сделано как в Figma.

  ПРО ПЛЕЙСХОЛДЕР И ЦВЕТ ЗАГОЛОВКА: картинку из Figma не тянем (ссылки живут
  7 дней), вместо фото — нейтральная плашка card/bg-gray. Но на светлой плашке
  белый заголовок был бы не виден, поэтому здесь H1 покрашен в text/primary.
  В Figma заголовок белый (text/inverse-primary) поверх затемняющего слоя
  neutral/1000 (чёрный 10%). Когда на место плейсхолдера встанет настоящее фото,
  заголовок надо вернуть на text/inverse-primary и добавить затемнение.

  Чего здесь нет: в Figma справа от поиска стоит ещё Toggle 84×48 (солнце/луна,
  светлая/тёмная тема). В прототипе переключателя темы нет — Toggle не делаем.

  Опечатки живого макета («ДЛЯ СОСИКАТЕЛЕЙ», «Иклюзивное трудоустройство») сюда
  не переносим — подписи приходят пропами.
*/

export type HeroMenuItem = {
  label: string;
  href?: string;
  /** Текущий раздел сайта — белая плашка вместо тёмной. */
  active?: boolean;
};

type Props = {
  /** Заголовок страницы. Это единственный h1 на странице. */
  title: React.ReactNode;
  /** Пункты главного меню сайта. Минимум один — так в Figma. */
  menuItems?: readonly HeroMenuItem[];
  /**
   * Надзаголовок над H1. НАШЕ ДОПОЛНЕНИЕ — в Figma такого элемента нет.
   * Если дизайнер его не подтвердит, проп можно просто не использовать.
   */
  eyebrow?: React.ReactNode;
  className?: string;
};

export function Hero({ title, menuItems = [], eyebrow, className }: Props) {
  return (
    <header
      data-component="Hero"
      className={cn(
        // Высота 344 — из живого шаблона. В Figma она НЕ зафиксирована вариантом:
        // на «Для соискателей Desktop» (6702:8553) тот же Hero растянут до 392.
        // Тянут руками — вопрос дизайнеру. Поэтому min-h, а не жёсткая высота.
        "relative flex min-h-[344px] w-full flex-col",
        className,
      )}
    >
      <HeroImagePlaceholder />

      <div className="relative flex flex-1 flex-col">
        <HeroNav items={menuItems} />

        {/*
          Низ Hero: сверху space/4xl 64, по бокам space/2xl 40, промежуток space/m 16.
          Снизу в Figma padding/112 — токена на 112 нет, поэтому значение прямое.
        */}
        <div className="mt-auto flex flex-col gap-[var(--space-m)] px-[var(--space-2xl)] pb-[112px] pt-[var(--space-4xl)]">
          {eyebrow ? (
            <p className="ds-caps-m text-[color:var(--text-secondary)]">
              {eyebrow}
            </p>
          ) : null}

          {/* Ширина текста заголовка в Figma — 960. */}
          <h1 className="ds-h1 max-w-[960px] text-[color:var(--text-primary)]">
            {title}
          </h1>
        </div>
      </div>
    </header>
  );
}

/*
  Фото Hero. Картинку не тянем — нейтральная плашка с подписью.
  Подпись прижата вправо, чтобы не налезать на заголовок слева.
*/
function HeroImagePlaceholder() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex items-center justify-end bg-[color:var(--card-bg-gray)] px-[var(--space-2xl)]"
    >
      <span className="ds-body-s text-[color:var(--text-secondary)]">
        Фото
      </span>
    </div>
  );
}

function HeroNav({ items }: { items: readonly HeroMenuItem[] }) {
  return (
    // Шапка: сверху space/l 24, по бокам space/2xl 40.
    <div className="flex items-center gap-[var(--space-m)] px-[var(--space-2xl)] pt-[var(--space-l)]">
      <HeroLogo />

      <nav className="ml-auto flex items-center gap-[var(--space-m)]">
        {/* Промежуток между пунктами в Figma — 2 (space/3xs). */}
        <ul className="flex list-none items-center gap-[var(--space-3xs)]">
          {items.map((item) => (
            <li key={item.label}>
              <HeroNavItem item={item} />
            </li>
          ))}
        </ul>

        <HeroSearchButton />
      </nav>
    </div>
  );
}

/*
  Figma: «Nav Menu Item». Высота 48, скругление radius/m 16, текст Caps M
  (YS Geo Medium 17, ЗАГЛАВНЫМИ). Обычный пункт — тёмная плашка с размытием
  фона 4 px, активный — белая плашка.

  Расхождение в Figma: описание Nav Menu Item говорит, что активный пункт
  «жёлтый акцент», а в макете он белый. Сделано по макету.
*/
function HeroNavItem({ item }: { item: HeroMenuItem }) {
  const className = cn(
    // whitespace-nowrap: пункт меню — одна строка. Кегль Caps M с трекингом 3
    // широкий, и без запрета переноса «ДЛЯ КОМПАНИЙ» ломается на две строки.
    "ds-caps-m flex h-12 shrink-0 items-center whitespace-nowrap rounded-[var(--radius-m)] px-[var(--space-m)] transition-colors",
    item.active
      ? "bg-[color:var(--card-bg-white)] text-[color:var(--text-primary)]"
      : "bg-[color:var(--action-primary-bg)] text-[color:var(--text-inverse-primary)] backdrop-blur-[4px]",
  );

  if (!item.href) {
    return (
      <span
        data-component={`Nav Menu Item · ${item.active ? "Current" : "Default"}`}
        className={className}
      >
        {item.label}
      </span>
    );
  }

  return (
    <a
      data-component={`Nav Menu Item · ${item.active ? "Current" : "Default"}`}
      href={item.href}
      aria-current={item.active ? "page" : undefined}
      className={className}
    >
      {item.label}
    </a>
  );
}

/*
  Кнопка поиска 48×48. Намеренно НЕ компонент Button из библиотеки: там размеры
  L 58 / M 45 / S 38, а здесь нужна высота 48 — заподлицо с пунктами меню.
  Расхождение шапки с размерной шкалой кнопок — вопрос дизайнеру.
  Поиск в прототипе не работает: это макет.
*/
function HeroSearchButton() {
  return (
    // Шильдика нет намеренно: в Figma это деталь Hero, а не отдельный компонент.
    <button
      type="button"
      aria-label="Поиск по сайту"
      className={cn(
        "flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-m)]",
        "bg-[color:var(--action-primary-bg)] text-[color:var(--text-inverse-primary)] backdrop-blur-[4px]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--text-primary)] focus-visible:ring-offset-2",
      )}
    >
      <Search aria-hidden className="size-5" />
    </button>
  );
}

/*
  Логотип 100×48: красная плашка «Я» + кружок со знаком доступности,
  рядом подпись в два уровня (20 px и 13 px, второй уровень прозрачностью 70%).
  Токена на 13 px и на прозрачность 70% в системе нет — значения прямые,
  ближайший типографский класс к 13 px это ds-body-s (14).
*/
function HeroLogo() {
  return (
    // Шильдика нет намеренно: «Logo» — деталь Hero, отдельным компонентом
    // в Figma не оформлена.
    <div className="flex items-center gap-[var(--space-sm)]">
      <div className="flex items-center gap-[var(--space-2xs)]">
        <span
          aria-hidden
          className="flex size-12 items-center justify-center rounded-[var(--radius-m)] bg-[color:var(--brand-yandex)] text-[color:var(--text-inverse-primary)] ds-h5"
        >
          Я
        </span>
        <span
          aria-hidden
          className="flex size-12 items-center justify-center rounded-[var(--radius-100)] border border-[color:var(--border-default)] text-[color:var(--text-primary)]"
        >
          <Accessibility className="size-5" />
        </span>
      </div>

      <span className="flex flex-col">
        <span className="ds-h5 text-[color:var(--text-primary)]">
          Инклюзия в Яндексе
        </span>
        <span className="ds-body-s text-[color:var(--text-secondary)]">
          Инклюзивное трудоустройство
        </span>
      </span>
    </div>
  );
}
