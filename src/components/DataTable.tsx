import * as React from "react";
import { cn } from "@/lib/utils";
import { Editable } from "@/editor/Editable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

// DataTable (00b §2.5) — все таблицы 2–4 колонки в обёртке rounded-lg border.
// ok/bad-маркер в ячейках — текстом + значком (§3.5), не только цветом.

type DataTableProps = {
  headers: React.ReactNode[];
  rows: React.ReactNode[][];
  caption?: React.ReactNode;
  /** Подпись только для скринридеров (видимо скрыта). */
  captionHidden?: boolean;
  className?: string;
};

export function DataTable({
  headers,
  rows,
  caption,
  captionHidden,
  className,
}: DataTableProps) {
  return (
    <figure data-component="DataTable" className={cn("max-w-full", className)}>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {headers.map((h, i) => (
                <TableHead key={i}>
                  <Editable as="inline">{h}</Editable>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, r) => (
              <TableRow key={r}>
                {row.map((cell, c) => (
                  <TableCell key={c}>
                    <Editable as="inline">{cell}</Editable>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {caption ? (
        <figcaption
          className={cn(
            "mt-3 text-[0.8125rem] text-muted-foreground",
            captionHidden && "sr-only",
          )}
        >
          <Editable as="inline">{caption}</Editable>
        </figcaption>
      ) : null}
    </figure>
  );
}
