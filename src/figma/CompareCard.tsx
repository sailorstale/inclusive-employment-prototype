import * as React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

/*
  Figma: component «Compare Card» (6390:4695), свойство только Platform.

  Половинка пары «за/против»: карточка, которая говорит «так правильно» или
  «так неправильно». Сверху Feature Item — иконка-маркер 32 и под ней короткая
  формулировка (H4). Ниже слот под пояснение: туда кладут Text и ListContainer
  (в живом узле 0:358 слот высотой 432 — это полноценный контейнер,
  а не подпись).

  Как ставить в пару: две Compare Card внутри компонента «Compare» — он держит
  половины В РЯД, бок о бок (см. Compare.tsx). Собирать пару руками через
  Card Container · Horizontal больше не нужно.

  ЧЕМ МЫ РАСХОДИМСЯ С FIGMA (честно):
  1) Смысл «хорошо/плохо» в Figma свойством НЕ оформлен: в наборе только
     Platform, а зелёный/красный красят руками поверх компонента. Больше того,
     обе иконки во всех четырёх живых узлах (0:355, 0:377, 0:392, 0:414)
     называются одинаково «Icon / check», хотя правая — крестик. Ориентир
     только цвет. Мы завели проп tone: positive | negative, чтобы раскладчик
     контента не мог перепутать. Вопрос дизайнеру: не завести ли в Figma
     свойство Type = Do | Dont?
  2) Оформление: разбор видел рамку 1 px (green/200 / red/200) без заливки,
     задание требует заливку card/bg-green / card/bg-pink и иконку
     green/700 / red/600. Сделано по заданию — оно новее. Расхождение
     зафиксировано, подтвердить у дизайнера.
  3) Высоту Feature Item (70 в Figma) не фиксируем — формулировка в две строки
     должна помещаться. Своего верхнего отступа у карточки нет: воздух
     и промежуток 8 между половинами даёт Card Container.
*/

export type CompareCardTone = "positive" | "negative";

const TONE: Record<
  CompareCardTone,
  { bg: string; icon: string; Icon: typeof Check; label: string }
> = {
  positive: {
    bg: "bg-[color:var(--card-bg-green)]",
    icon: "text-[color:var(--green-700)]",
    Icon: Check,
    label: "Так правильно",
  },
  negative: {
    bg: "bg-[color:var(--card-bg-pink)]",
    icon: "text-[color:var(--red-600)]",
    Icon: X,
    label: "Так неправильно",
  },
};

type Props = {
  tone?: CompareCardTone;
  /** Короткая формулировка примера, стиль Desktop/H4 (в Figma слой «txt»). */
  txt: React.ReactNode;
  /** Slot: Text, ListContainer. */
  children?: React.ReactNode;
  className?: string;
};

export function CompareCard({
  tone = "positive",
  txt,
  children,
  className,
}: Props) {
  const { bg, icon, Icon, label } = TONE[tone];

  return (
    <div
      data-component={`Compare Card · ${tone === "positive" ? "Do" : "Dont"}`}
      className={cn(
        "flex w-full flex-col",
        "rounded-[var(--radius-l)] p-[var(--space-l)]",
        bg,
        className,
      )}
    >
      {/* Feature Item: иконка 32, под ней формулировка. Промежуток 16. */}
      <div className="flex flex-col gap-[var(--space-m)]">
        {/* Иконка несёт смысл «хорошо/плохо», поэтому у неё есть подпись
            для читалки — цветом одним этот смысл не передашь. */}
        <Icon role="img" aria-label={label} className={cn("size-8 shrink-0", icon)} />
        <div className="ds-h4 text-[color:var(--text-primary)]">{txt}</div>
      </div>

      {/* Slot */}
      {children}
    </div>
  );
}
