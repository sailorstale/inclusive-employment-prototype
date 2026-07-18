import * as React from "react";
import { cn } from "@/lib/utils";
import { SmallImage, type SmallImageName } from "./SmallImage";

/*
  Figma: component set «General Card» (6390:5691), свойства Platform × Orient
  (плюс вкл/выкл Image, Step, Icon).

  Универсальная карточка на цветном фоне: способ вынуть кусок смысла из сплошного
  текста и подать отдельно — шаг инструкции, важное замечание, пример, мини-итог.
  Не для цитат (есть Quote) и не для «хорошо/плохо» (есть Compare Card).

  Сама по себе не стоит: живёт в слоте Card Container
  (Section Container → Card Container → General Card → Body → Slot).
  Поэтому своего верхнего отступа у неё нет — воздух даёт Card Container.

  В слот (children) кладут Text, ListContainer, Button.

  ЦВЕТ ФОНА — СВОЙСТВО (проп bgColor). В Figma-наборе его не видно (красят руками),
  но по решению заказчика он должен быть свойством компонента, с семантикой:
    • blue (по умолчанию) — обычная карточка;
    • yellow — важный контент;
    • pink — очень важное / опасное / предупреждающее;
    • green — радостное, позитивное.
  Остальные токены (white, beige, gray) — нейтральные, без закреплённого смысла.

  ЧЕМ МЫ РАСХОДИМСЯ С FIGMA (честно):
  2) Высота НЕ фиксируется ни в одном варианте. В мастере у Orient=Horizontal
     стоит 118, но живой узел 0:904 — горизонтальная карточка высотой 420
     с абзацем и списком внутри. Поэтому здесь высоты нет вообще, карточка
     растёт под содержимое (см. сверку критика, п. 4).
  3) Иконка внутри белого круга и сюжет иллюстрации в Figma не свойства,
     а подмена инстанса — у нас это пропы iconNode и image.
*/

export type GeneralCardOrient = "Vertical" | "Horizontal";

/** Фоновые токены card/bg-* из tokens.css. */
export type GeneralCardBg = "white" | "blue" | "green" | "yellow" | "pink" | "beige" | "gray";

const BG_CLASS: Record<GeneralCardBg, string> = {
  white: "bg-[color:var(--card-bg-white)]",
  blue: "bg-[color:var(--card-bg-blue)]",
  green: "bg-[color:var(--card-bg-green)]",
  yellow: "bg-[color:var(--card-bg-yellow)]",
  pink: "bg-[color:var(--card-bg-pink)]",
  beige: "bg-[color:var(--card-bg-beige)]",
  gray: "bg-[color:var(--card-bg-gray)]",
};

type Props = {
  orient?: GeneralCardOrient;
  /** Цвет фона. По умолчанию blue. yellow — важное, pink — опасное/предупреждающее, green — позитивное. */
  bgColor?: GeneralCardBg;
  /** Заголовок карточки, стиль Desktop/H4. Обязателен. */
  title: React.ReactNode;
  /** Сюжет иллюстрации-стикера 64×64 в углу. Не задан — картинки нет. */
  image?: SmallImageName;
  /** Метка шага, например «1 шаг». Рисуется ЗАГЛАВНЫМИ. Не задана — метки нет. */
  step?: string;
  /** Иконка 32 из lucide-react в белом круге 64. Не задана — круга нет. */
  iconNode?: React.ReactNode;
  /** Slot: Text, ListContainer, Button. */
  children?: React.ReactNode;
  className?: string;
};

export function GeneralCard({
  orient = "Vertical",
  bgColor = "blue",
  title,
  image,
  step,
  iconNode,
  children,
  className,
}: Props) {
  return (
    <div
      data-component={`General Card · ${orient}`}
      className={cn(
        "flex w-full gap-[var(--space-l)] overflow-clip",
        "rounded-[var(--radius-l)] p-[var(--space-l)]",
        BG_CLASS[bgColor],
        orient === "Vertical" ? "flex-col" : "flex-row items-start",
        className,
      )}
    >
      {image ? <SmallImage name={image} size={64} /> : null}

      {/*
        Метка шага и круг с иконкой — ЧАСТИ карточки, а не отдельные компоненты
        и не её варианты. Шильдик им не ставим: имя вроде «General Card · Step»
        читалось бы как вариант компонента и вводило бы разработчика в
        заблуждение — такого варианта в Figma нет.
      */}
      {step ? (
        <div
          className={cn(
            "ds-caps-m shrink-0 text-[color:var(--text-secondary)]",
          )}
        >
          {step}
        </div>
      ) : null}

      {iconNode ? (
        // Icon: белый круг 64×64, внутри отступ 16, иконка 32.
        <div
          className={cn(
            "flex size-16 shrink-0 items-center justify-center",
            "rounded-[var(--radius-56)] bg-[color:var(--card-bg-white)] p-[var(--space-m)]",
          )}
        >
          <span aria-hidden className="flex size-8 items-center justify-center">
            {iconNode}
          </span>
        </div>
      ) : null}

      {/* Body: Title + Slot. Тело тянется на остаток ширины в Horizontal. */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className={cn("ds-h4 text-[color:var(--text-primary)]")}>
          {title}
        </div>
        {children}
      </div>
    </div>
  );
}
