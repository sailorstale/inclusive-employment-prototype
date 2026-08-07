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
        /*
          Вся внутренняя разлиновка — эта одна линия. Вертикальных нет, зебры и
          подсветки при наведении в системе тоже. У строки-шапки линии нет: её
          роль играет верхняя граница первой строки тела.

          Линия висит на ЯЧЕЙКАХ, а не на самой строке: у таблицы раздельные
          границы (нужны ради внешней рамки), а в этой модели браузер границы
          <tr> не рисует вообще.
        */
        !header &&
          "[&>td]:border-t [&>th]:border-t [&>*]:border-[color:var(--border-divider)]",
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
  /*
    Подпись таблицы — ТОЛЬКО для скринридера, визуально скрыта (решение
    разработчика). Читается перед содержимым и объясняет, что в таблице;
    на вид страницы не влияет.
  */
  caption?: string;
  children?: React.ReactNode;
  className?: string;
};

// Строка-шапка? — та, у которой проп header (TableRow header).
function isHeaderRow(node: React.ReactNode): boolean {
  return (
    React.isValidElement(node) && Boolean((node.props as TableRowProps).header)
  );
}

/** Сколько ячеек в строке таблицы (0, если это не строка). */
function columnsOf(row: React.ReactNode): number {
  if (!React.isValidElement(row)) return 0;
  return React.Children.count((row.props as TableRowProps).children);
}

export function Table({ headers, caption, children, className }: TableProps) {
  const rows = React.Children.toArray(children);
  const headerRows = rows.filter(isHeaderRow);
  const bodyRows = rows.filter((r) => !isHeaderRow(r));
  const hasHead = Boolean(headers?.length) || headerRows.length > 0;

  /*
    ДВЕ КОЛОНКИ — пополам. Замечание клиента 7 августа 2026 к таблицам
    «Возможности | Вызовы»: браузер раздавал им ширину по длине текста, и в
    шести таблицах подряд граница стояла каждый раз в новом месте (226 против
    384 в одной, 332 против 278 в другой). Читатель сравнивает две колонки
    между собой, и прыгающая граница этому мешает.

    Только для двух колонок: там они по смыслу равноправны. Таблицы с тремя и
    более столбцами по-прежнему подстраиваются под содержимое — среди них
    попадаются узкие столбцы-ярлыки, которым половина ширины не нужна.

    Долю задаём через colgroup, а НЕ через table-layout: fixed. С фиксированной
    раскладкой браузер отводил место под три колонки вместо двух, и слева
    оставалась пустая треть таблицы.
  */
  const columns = headers?.length || columnsOf(rows[0]);

  return (
    <table
      data-component="Table"
      className={cn(
        /*
          Внешняя рамка — решение дизайнера: без неё таблица растворялась в
          тексте, особенно когда колонок две и они читаются как две колонки
          вёрстки. Внутренняя разлиновка прежняя: горизонтальные линии между
          строками, вертикальных нет.

          ВАЖНО, border-separate. При border-collapse рамка самой таблицы
          браузером не рисуется вовсе (её «схлопывает» с нулевыми границами
          ячеек), и скругление тоже не работает. Поэтому границы раздельные, а
          линии между строками живут на ЯЧЕЙКАХ (см. TableRow) — на <tr> в этой
          модели границы не рисуются.
        */
        "w-full border-separate border-spacing-0 overflow-hidden",
        "rounded-[var(--radius-m)] border border-[color:var(--border-divider)]",
        className,
      )}
    >
      {caption && <caption className="sr-only">{caption}</caption>}
      {columns === 2 && (
        <colgroup>
          <col style={{ width: "50%" }} />
          <col style={{ width: "50%" }} />
        </colgroup>
      )}
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
