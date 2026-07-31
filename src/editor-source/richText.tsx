import * as React from "react";

// Лёгкая инлайн-разметка для правок редактора: **жирный**, *курсив* / _курсив_,
// [текст](ссылка). Храним как markdown-строку (читаемо для разработчика при
// копипасте, остаётся обычным текстом). Рендерим в React-узлы. Ссылки
// санитизируем — пускаем только безопасные протоколы (защита от javascript:).

// Проверка ссылок живёт отдельно — её же использует сборка выгрузки.
// Реэкспорт, чтобы существующие импорты из richText продолжали работать.
import { safeHref } from "./safeUrl";
export { safeHref };

import { Tooltip } from "@/figma/Tooltip";
import { ExternalLink } from "@/figma/ExternalLink";
import { isExternalHref } from "./safeUrl";

/*
  Тултип — пояснение термина прямо в абзаце: {{термин|описание}} либо
  {{термин|Заголовок|описание}}. Три поля по договорённости с разработчиком:
  видимый текст, необязательный заголовок пузыря и само описание.
  Альтернатива стоит ПОСЛЕДНЕЙ намеренно: номера прежних групп не должны
  съехать — на них завязаны и этот файл, и сборка выгрузки.
*/
const RE =
  /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_|\{\{([^{}|]+)\|([^{}|]+)(?:\|([^{}|]+))?\}\}/g;

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
      /*
        Внешняя ссылка — компонент со стрелкой ↗ (она и предупреждает, что клик
        уводит с сайта). Внутренняя — обычная подчёркнутая ссылка. Различаем по
        адресу: с протоколом — наружу, от корня («/…») — внутрь.
      */
      nodes.push(
        !href ? (
          m[1]
        ) : isExternalHref(href) ? (
          <ExternalLink key={key} href={href}>
            {m[1]}
          </ExternalLink>
        ) : (
          <a
            key={key}
            href={href}
            className="text-brand underline underline-offset-2"
          >
            {m[1]}
          </a>
        ),
      );
    } else if (m[3] !== undefined) {
      // рекурсивно — чтобы ссылка внутри **жира**/*курсива* тоже рендерилась
      nodes.push(<strong key={key}>{renderInline(m[3])}</strong>);
    } else if (m[6] !== undefined) {
      // Третьей части нет — значит заголовка у пузыря нет, есть только описание.
      const title = m[8] !== undefined ? m[7] : undefined;
      nodes.push(
        <Tooltip key={key} title={title} content={m[8] ?? m[7]}>
          {m[6]}
        </Tooltip>,
      );
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
    .replace(/\{\{([^{}|]+)\|[^{}]*\}\}/g, "$1")
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
