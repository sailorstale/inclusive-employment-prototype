import { cn } from "@/lib/utils";

/*
  Figma: component set «Quiz Badge» (6517:3770), свойства Type × Platform.

  Маленькая плашка-вердикт («Верно» / «Неверно» / «Верно, но не отмечено») —
  появляется в строке ответа после проверки. Служебный кирпичик: сам по себе на
  страницу не ставится, живёт внутри Quiz Items (и, по нашему решению, в блоке
  разбора).

  Текста-слота у неё нет: подпись жёстко привязана к варианту Type — так в Figma.

  Про цвет: у бейджа фон насыщенный (green/red/orange 500), а у строки-подложки
  бледный (card/bg-* + рамка 300). Разные токены одного семейства, не путать.

  Разбираем только Platform=Desktop (мобильные варианты в прототипе не делаем).
*/

export type QuizBadgeType = "Correct" | "Incorrect" | "Partly";

const BADGE: Record<QuizBadgeType, { bg: string; label: string }> = {
  Correct: { bg: "bg-[color:var(--green-500)]", label: "Верно" },
  Incorrect: { bg: "bg-[color:var(--red-500)]", label: "Неверно" },
  /*
    ВЕРНЫЙ ВАРИАНТ, КОТОРЫЙ ЧИТАТЕЛЬ НЕ ОТМЕТИЛ, ПОДПИСАН «ВЕРНО» — замечание
    Юли от 7 августа 2026 к самопроверке на «Как устроен наём»: «здесь и далее
    „частично“ меняем на „верно“». Плашка судит ВАРИАНТ, а не ответ человека, а
    вариант в этом состоянии просто верный — в вопросе с одним ответом он и есть
    единственный правильный. Слово «частично» читалось как «ответ засчитан
    наполовину». Жёлтый цвет остаётся: он и говорит «верно, но вы это не
    отметили».

    В Figma у варианта Partly подпись прежняя — расхождение сознательное,
    дизайнеру о нём сказано.
  */
  Partly: { bg: "bg-[color:var(--orange-500)]", label: "Верно" },
};

type Props = {
  type: QuizBadgeType;
  className?: string;
};

export function QuizBadge({ type, className }: Props) {
  return (
    <span
      data-component={`Quiz Badge · ${type}`}
      className={cn(
        // Высота 26 набирается сама: текст 14/1.3 + вертикальные поля 4+4.
        "inline-flex shrink-0 items-center whitespace-nowrap",
        "py-[var(--space-2xs)] px-[var(--space-sm)] rounded-[var(--radius-100)]",
        "ds-body-s-bold text-[color:var(--text-inverse-primary)]",
        BADGE[type].bg,
        className,
      )}
    >
      {BADGE[type].label}
    </span>
  );
}
