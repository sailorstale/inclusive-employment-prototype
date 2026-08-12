import * as React from "react";
import { safeHref } from "@/editor-source/safeUrl";

/*
  ИНЛАЙН-РАЗМЕТКА СПРАВОЧНИКА: жирный, код в строке, ссылка.

  Своя, а не общая из richText.tsx, по двум причинам. В справочнике на каждой
  странице встречается код в обратных кавычках (`Section Container`), а общий
  разбор его не знает. И номера групп в общем выражении завязаны на сборку
  выгрузки — трогать их ради страницы документа опаснее, чем написать двадцать
  строк рядом.
*/

// Порядок альтернатив важен: код в кавычках проверяется первым, чтобы
// звёздочки внутри него не считались разметкой.
const INLINE = /`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;

/*
  Ссылки на файлы репозитория (contentTree.ts:96) на странице не кликаются: у
  читателя нашего кода нет, а обещание перехода, которого не будет, хуже, чем
  его отсутствие. Показываем адресом-подсказкой.
*/
const isRepoLink = (href: string) => !/^https?:/.test(href);

export function renderBibleInline(md: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  const re = new RegExp(INLINE.source, "g");

  while ((m = re.exec(md))) {
    if (m.index > last) out.push(md.slice(last, m.index));

    if (m[1] !== undefined) {
      out.push(
        <code
          key={key++}
          className="rounded border bg-muted/60 px-1 py-0.5 font-mono text-[0.85em]"
        >
          {m[1]}
        </code>,
      );
    } else if (m[2] !== undefined) {
      const href = safeHref(m[3]);
      if (!href) out.push(m[2]);
      else if (isRepoLink(m[3]))
        out.push(
          <span
            key={key++}
            title={m[3]}
            className="cursor-help border-b border-dotted border-muted-foreground/50 font-mono text-[0.85em] text-muted-foreground"
          >
            {m[2]}
          </span>,
        );
      else
        out.push(
          <a
            key={key++}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            {m[2]}
          </a>,
        );
    } else if (m[4] !== undefined) {
      out.push(
        <strong key={key++} className="font-semibold text-foreground">
          {renderBibleInline(m[4])}
        </strong>,
      );
    }

    last = re.lastIndex;
  }

  if (last < md.length) out.push(md.slice(last));
  return out;
}
