import * as React from "react";

// Лёгкая инлайн-разметка для правок редактора: **жирный**, *курсив* / _курсив_,
// [текст](ссылка). Храним как markdown-строку (читаемо для разработчика при
// копипасте, остаётся обычным текстом). Рендерим в React-узлы. Ссылки
// санитизируем — пускаем только безопасные протоколы (защита от javascript:).

// Проверка ссылок живёт отдельно — её же использует сборка выгрузки.
// Реэкспорт, чтобы существующие импорты из richText продолжали работать.
import { safeHref } from "./safeUrl";
export { safeHref };

const RE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_/g;

export function renderInline(text: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  // Локальный экземпляр регэкспа — рекурсия (ссылка внутри жира/курсива) не
  // должна портить lastIndex внешнего вызова.
  const re = new RegExp(RE.source, "g");
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const key = `i${i++}`;
    if (m[1] !== undefined) {
      const href = safeHref(m[2]);
      nodes.push(
        href ? (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand underline underline-offset-2"
          >
            {m[1]}
          </a>
        ) : (
          m[1]
        )
      );
    } else if (m[3] !== undefined) {
      // рекурсивно — чтобы ссылка внутри **жира**/*курсива* тоже рендерилась
      nodes.push(<strong key={key}>{renderInline(m[3])}</strong>);
    } else {
      nodes.push(<em key={key}>{renderInline(m[4] ?? m[5])}</em>);
    }
    last = re.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/** Текст без разметки — для метрик длины и дифа. */
export function stripMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1");
}

/** Есть ли в тексте наша разметка. */
export function hasMarkdown(text: string): boolean {
  RE.lastIndex = 0;
  return RE.test(text);
}
