import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/*
  Figma: «Read More» (6507:3510) и «Read More Item» (6507:3535).

  «Читайте также» — витрина из карточек-ссылок на соседние материалы в самом
  низу страницы, чтобы дочитавший ушёл не в никуда. Один раз на страницу.
  Не брать посреди текста для перекрёстных ссылок и не брать как каталог:
  ни фильтров, ни пагинации здесь нет — это просто три рекомендации.

  Важно про ширину: в отличие от Feedback (колонка 768) блок идёт на полную
  ширину страницы 1440 — он уже «вне текста». Ширину задаёт родитель, здесь
  w-full. Свои поля по бокам 40 и верхний отступ 40 — внешний не нужен.
  Нижнего отступа нет: расстояние до футера задаёт страница.

  Чем управляется: свойств у компонента нет (кроме Platform, который мы
  не реализуем). Наполняется тем, сколько Read More Item лежит в ряду —
  в обоих примерах Figma их ровно три.
*/

type ReadMoreProps = {
  /** В Figma всегда «Читайте также». Можно ли менять — вопрос дизайнеру. */
  title?: string;
  /** Слот article-grid: сюда кладут только Read More Item. */
  children?: React.ReactNode;
  className?: string;
};

export function ReadMore({
  title = "Читайте также",
  children,
  className,
}: ReadMoreProps) {
  return (
    <div
      data-component="Read More"
      className={cn(
        "w-full pt-[var(--space-2xl)] px-[var(--space-2xl)]",
        className,
      )}
    >
      <h2 className="ds-h2 text-[color:var(--text-primary)]">{title}</h2>

      {/* article-grid: карточки равной доли ряда.
          Промежуток 8 — так в Figma. Он заметно тесный при полях 40 по бокам;
          зафиксировано как вопрос дизайнеру, но не «поправлено» самовольно. */}
      <div className="mt-[var(--space-xl)] flex w-full items-stretch gap-[var(--space-xs)]">
        {children}
      </div>
    </div>
  );
}

/*
  Read More Item — одна карточка-ссылка: название материала, короткое описание
  и стрелка. Кликабельна вся карточка целиком (в макете это не показано явно,
  но у стрелки нет своей подписи — приняли так, вопрос дизайнеру).
  Берётся только внутри Read More: высота здесь жёсткая, а стрелка обязательна.

  ДОПОЛНЕНИЕ К FIGMA: состояний в наборе нет вообще — ни наведения, ни фокуса,
  хотя карточка кликабельна. Добавили сдержанный hover (рамка + стрелка
  подъезжает вправо) и видимый фокус с клавиатуры. Ждём решения дизайнера.
*/

type ReadMoreItemProps = {
  title: string;
  /** 1–2 строки, о чём материал. В примерах Figma 47–86 знаков. */
  description: string;
  href: string;
  className?: string;
};

export function ReadMoreItem({
  title,
  description,
  href,
  className,
}: ReadMoreItemProps) {
  return (
    <a
      data-component="Read More Item"
      href={href}
      className={cn(
        "group flex flex-1 flex-col justify-between",
        // высота 288 — жёсткое значение из Figma, токена под неё нет.
        // Длинное описание в неё может не поместиться — правило по длине
        // текста в макете не задано, вопрос дизайнеру.
        "h-[288px] rounded-[var(--radius-l)] bg-[color:var(--card-bg-gray)] p-[var(--space-l)]",
        "ring-1 ring-transparent transition-[box-shadow] hover:ring-[color:var(--border-default)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--text-primary)]",
        className,
      )}
    >
      {/* Card Content */}
      <div className="flex flex-col gap-[var(--space-m)] overflow-hidden">
        <span className="ds-h3 text-[color:var(--text-primary)]">{title}</span>
        <span className="ds-body-l text-[color:var(--text-primary)]">
          {description}
        </span>
      </div>

      {/* Action Container: стрелка 32, прижата вправо */}
      <div className="flex justify-end pt-[var(--space-xs)]">
        <ArrowRight
          aria-hidden="true"
          className="size-8 text-[color:var(--text-primary)] transition-transform group-hover:translate-x-[var(--space-2xs)]"
        />
      </div>
    </a>
  );
}
