import * as React from "react";

// Лёгкая инлайн-разметка для правок редактора: **жирный**, *курсив* / _курсив_,
// [текст](ссылка). Храним как markdown-строку (читаемо для разработчика при
// копипасте, остаётся обычным текстом). Рендерим в React-узлы. Ссылки
// санитизируем — пускаем только безопасные протоколы (защита от javascript:).

const SAFE_URL = /^(https?:\/\/|mailto:|\/|#)/i;

export function safeHref(url: string): string | null {
  const u = url.trim();
  return SAFE_URL.test(u) ? u : null;
}

const RE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_/g;

export function renderInline(text: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  RE.lastIndex = 0;
  while ((m = RE.exec(text))) {
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
        ),
      );
    } else if (m[3] !== undefined) {
      nodes.push(<strong key={key}>{m[3]}</strong>);
    } else {
      nodes.push(<em key={key}>{m[4] ?? m[5]}</em>);
    }
    last = RE.lastIndex;
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
