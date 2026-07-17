import * as React from "react";
import { cn } from "@/lib/utils";

/*
  Таблица. Собрана из трёх компонентов Figma + одной нашей надстройки.

  Из Figma один в один:
  - «Table cell» (6138:9727) — ячейка тела. Свойства Alignment (Left|Center|Right)
    × Weight (Regular|Medium). Внутри один текст, отступы 24 по бокам (space/l)
    и 16 сверху-снизу (space/m). Ни фона, ни рамок у ячейки нет.
  - «Table header cell» (6010:77729) — ячейка шапки. Свойство Alignment.
    Отступы те же, текст всегда полужирный и приглушённый (text/secondary).
    Свойства Weight у неё НЕТ — заголовок всегда Medium.
  - «Table Row» (6392:3174) — строка. Всю разлиновку таблицы даёт она:
    одна серая линия (border/divider), вертикальных линий между колонками нет.

  НАШИ ДОПОЛНЕНИЯ — честно перечисляю, чтобы дизайнер их видел:

  1) Компонента «Таблица» в Figma НЕТ. В шаблоне таблица собрана руками из
     безымянного фрейма «Table · Instances» (0:1839). Мы завели компонент-сборку
     `Table`, иначе каждый, кто раскладывает контент, будет плодить свои фреймы.
     Это ПРЕДЛОЖЕНИЕ дизайнеру, а не факт из библиотеки. Шильдик у него — просто
     "Table", без node id, потому что подтверждать нечем.

  2) Число колонок. В Figma Table Row приколочена к двум колонкам (первая 300 px,
     вторая — остаток). Наш Table умеет любое число колонок: ширины не задаём,
     их раскидывает браузер. Вопрос дизайнеру: нужен ли вариант строки на 3+
     колонки, или все таблицы на сайте двухколоночные?

  3) Линия под шапкой. У «Table header cell» своей нижней линии нет, и у шапки
     в шаблоне — тоже. ОТКРЫТЫЙ ВОПРОС: мы вешаем линию на ВЕРХНЮЮ границу каждой
     строки (border-top). Тогда линия под шапкой появляется сама собой — её рисует
     первая строка тела. Побочный эффект: под последней строкой линии нет.
     Если дизайнер хотел замыкающую линию снизу — это надо переносить на border-bottom
     и отдельно рисовать линию под шапкой.
*/

export type TableAlignment = "Left" | "Center" | "Right";
export type TableCellWeight = "Regular" | "Medium";

// Выравнивание текста внутри ячейки — одинаково для тела и шапки.
const ALIGN: Record<TableAlignment, string> = {
  Left: "text-left",
  Center: "text-center",
  Right: "text-right",
};

// Отступы ячейки: 24 по бокам (space/l), 16 сверху-снизу (space/m).
const CELL_PADDING =
  "px-[var(--space-l)] py-[var(--space-m)] align-top break-words";

type TableCellProps = {
  align?: TableAlignment;
  weight?: TableCellWeight;
  children?: React.ReactNode;
  className?: string;
};

export function TableCell({
  align = "Left",
  weight = "Regular",
  children,
  className,
}: TableCellProps) {
  return (
    <td
      data-component={`Table cell · ${align} · ${weight}`}
      className={cn(
        CELL_PADDING,
        ALIGN[align],
        // Weight=Medium в Figma называется стилем «Body M Bold», хотя реально
        // применяется начертание Medium (500). Имя стиля в Figma спорное —
        // вопрос дизайнеру; берём то, что нарисовано: ds-body-m-bold = 500.
        weight === "Medium" ? "ds-body-m-bold" : "ds-body-m",
        "text-[color:var(--text-primary)]",
        className,
      )}
    >
      {children}
    </td>
  );
}

type TableHeaderCellProps = {
  align?: TableAlignment;
  children?: React.ReactNode;
  className?: string;
};

export function TableHeaderCell({
  align = "Left",
  children,
  className,
}: TableHeaderCellProps) {
  return (
    <th
      scope="col"
      data-component={`Table header cell · ${align}`}
      className={cn(
        CELL_PADDING,
        ALIGN[align],
        // Шапка всегда полужирная и приглушённая — это её единственное
        // визуальное отличие от ячейки тела. Свойства Weight у неё нет.
        "ds-body-m-bold text-[color:var(--text-secondary)]",
        className,
      )}
    >
      {children}
    </th>
  );
}

type TableRowProps = {
  children?: React.ReactNode;
  className?: string;
};

export function TableRow({ children, className }: TableRowProps) {
  return (
    <tr
      data-component="Table Row"
      className={cn(
        // Вся разлиновка таблицы — эта одна линия. Вертикальных нет.
        // Ни зебры, ни подсветки при наведении в системе тоже нет.
        "border-t border-[color:var(--border-divider)]",
        className,
      )}
    >
      {children}
    </tr>
  );
}

export type TableHeader = {
  text: React.ReactNode;
  align?: TableAlignment;
};

type TableProps = {
  headers?: readonly TableHeader[];
  children?: React.ReactNode;
  className?: string;
};

export function Table({ headers, children, className }: TableProps) {
  return (
    <table
      data-component="Table"
      className={cn("w-full border-collapse", className)}
    >
      {headers && headers.length > 0 && (
        <thead>
          <tr>
            {headers.map((header, index) => (
              <TableHeaderCell key={index} align={header.align}>
                {header.text}
              </TableHeaderCell>
            ))}
          </tr>
        </thead>
      )}
      <tbody>{children}</tbody>
    </table>
  );
}
