import * as React from "react";
import { cn } from "@/lib/utils";

/*
  Таблица — компонент-сборка из трёх готовых ячеек Figma. Компонента «Таблица»
  в Figma нет (в шаблоне её собирали руками из безымянного фрейма), поэтому
  сборку `Table` завели у себя: она берёт наши ячейки и складывает их в
  настоящую <table>, чтобы раскладчик контента не плодил свои фреймы.

  Ячейки, из которых собрано (один в один с Figma):
  - «Table cell» (6138:9727) — ячейка тела. Свойства Alignment (Left|Center|Right)
    × Weight (Regular|Medium). Внутри один текст, без фона и рамок.
  - «Table header cell» (6010:77729) — ячейка шапки. Свойство Alignment. Текст
    всегда полужирный и приглушённый (text/secondary). Свойства Weight нет.
  - «Table Row» (6392:3174) — строка. Всю разлиновку даёт она: одна серая линия
    (border/divider), вертикальных линий между колонками нет.

  Как собирать: шапку — строкой `<TableRow header>` из `TableHeaderCell`, тело —
  строками `<TableRow>` из `TableCell`. Table сам разложит их в <thead>/<tbody>.
  Для короткой записи шапку можно задать пропом `headers`.

  Заказчик: внешний вид таблицы не критичен — главное, чтобы читалось как таблица
  и использовались её ячейки. Поэтому мелочи оформления не докручиваем:
  - число колонок любое (ширины раскидывает браузер), не только две из Figma;
  - линия под шапкой появляется сама — её рисует border-top первой строки тела
    (у строки-шапки верхней линии нет); под последней строкой линии нет.
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
  /** Строка-шапка (ячейки TableHeaderCell). У неё нет верхней линии. */
  header?: boolean;
  children?: React.ReactNode;
  className?: string;
};

export function TableRow({ header = false, children, className }: TableRowProps) {
  return (
    <tr
      data-component="Table Row"
      className={cn(
        // Вся разлиновка таблицы — эта одна линия. Вертикальных нет.
        // Ни зебры, ни подсветки при наведении в системе тоже нет.
        // У строки-шапки линии нет: её роль играет border-top первой строки тела.
        !header && "border-t border-[color:var(--border-divider)]",
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
  /** Короткая запись шапки. Иначе шапку задают строкой <TableRow header>. */
  headers?: readonly TableHeader[];
  children?: React.ReactNode;
  className?: string;
};

// Строка-шапка? — та, у которой проп header (TableRow header).
function isHeaderRow(node: React.ReactNode): boolean {
  return (
    React.isValidElement(node) && Boolean((node.props as TableRowProps).header)
  );
}

export function Table({ headers, children, className }: TableProps) {
  const rows = React.Children.toArray(children);
  const headerRows = rows.filter(isHeaderRow);
  const bodyRows = rows.filter((r) => !isHeaderRow(r));
  const hasHead = Boolean(headers?.length) || headerRows.length > 0;

  return (
    <table
      data-component="Table"
      className={cn("w-full border-collapse", className)}
    >
      {hasHead && (
        <thead>
          {headers?.length ? (
            <TableRow header>
              {headers.map((header, index) => (
                <TableHeaderCell key={index} align={header.align}>
                  {header.text}
                </TableHeaderCell>
              ))}
            </TableRow>
          ) : (
            headerRows
          )}
        </thead>
      )}
      <tbody>{bodyRows}</tbody>
    </table>
  );
}
