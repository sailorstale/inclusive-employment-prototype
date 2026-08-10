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
import { scrollToBlock } from "@/lib/scroll";

/*
  АДРЕС ВНУТРЕННЕЙ ССЫЛКИ В ПРОТОТИПЕ. В данных внутренние ссылки лежат обычным
  путём от корня («/general/legal») — именно такой адрес нужен разработчику на
  боевом сайте. Сам прототип живёт на адресах с решёткой (HashRouter), поэтому
  решётку приписываем ЗДЕСЬ, при показе, и только к путям от корня. Якорь на
  этой же странице («#glossary») уже с решёткой — его не трогаем.
*/
export const previewHref = (href: string) =>
  href.startsWith("/") ? `#${href}` : href;

/*
  Тултип — пояснение термина прямо в абзаце: {{термин|описание}} либо
  {{термин|Заголовок|описание}}. Три поля по договорённости с разработчиком:
  видимый текст, необязательный заголовок пузыря и само описание.
  Альтернатива стоит ПОСЛЕДНЕЙ намеренно: номера прежних групп не должны
  съехать — на них завязаны и этот файл, и сборка выгрузки.
*/
const RE =
  /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_|\{\{([^{}|]+)\|([^{}|]+)(?:\|([^{}|]+))?\}\}/g;

/*
  Метки раскурсовки (сорт D): заменённый кусок → <mark> с подсказкой «было: …».
  Символы приватные (Private Use Area), в контенте не встречаются. Ветка ниже
  включается ТОЛЬКО когда метки есть (их ставит decourse) — обычный текст не
  затрагивается вовсе.
*/
export const MARK_A = String.fromCodePoint(0xe000);
export const MARK_B = String.fromCodePoint(0xe001);
export const MARK_C = String.fromCodePoint(0xe002);
export const markRe = () =>
  new RegExp(`${MARK_A}([^${MARK_B}]*)${MARK_B}([^${MARK_C}]*)${MARK_C}`, "g");

/*
  Текст БЕЗ меток — для мест, где строку показывают как есть, без разметки:
  подпись комментария, снимок блока в списке, заголовок в панели. Оставляем
  нынешний вариант и выбрасываем прежний: метки — служебные символы из
  приватной зоны Юникода, у шрифта для них нет начертания, и вместо них
  рисуется квадратик-заглушка.

  ОБРУБКИ. В уже сохранённых снимках метка бывает разрублена пополам: снимок
  режется до шестидесяти знаков, и закрывающий символ в него не влез. Такой
  обрубок целым правилом не ловится, поэтому разбираем его отдельно — иначе
  квадратик остаётся на экране навсегда.
*/
export function stripMarks(text: string): string {
  if (!text.includes(MARK_A) && !text.includes(MARK_B) && !text.includes(MARK_C))
    return text;
  // Целые метки: оставляем нынешний вариант, прежний выбрасываем.
  let out = text.replace(markRe(), "$1");
  /*
    Уцелевший средний символ означает «дальше идёт ПРЕЖНИЙ вариант, и он
    оборван». Показывать его незачем — обрезаем строку по этому месту.
  */
  const mid = out.indexOf(MARK_B);
  if (mid >= 0) out = out.slice(0, mid);
  // Всё, что осталось от меток, — просто убираем.
  return out.split(MARK_A).join("").split(MARK_C).join("").trimEnd();
}

export function renderInline(text: string): React.ReactNode {
  if (!text.includes(MARK_A)) return renderPlain(text);
  const out: React.ReactNode[] = [];
  const re = markRe();
  let last = 0;
  let k = 0;
  let mk: RegExpExecArray | null;
  while ((mk = re.exec(text))) {
    if (mk.index > last) out.push(renderPlain(text.slice(last, mk.index)));
    const was = mk[2];
    out.push(
      // Свой тултип на CSS-hover — мгновенный, в отличие от нативного title.
      <span key={`mk${k++}`} className="group relative inline">
        <mark className="rounded-[3px] bg-[hsl(45_93%_85%)] px-0.5 underline decoration-amber-600 decoration-dotted underline-offset-2">
          {renderPlain(mk[1])}
        </mark>
        <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs font-normal text-background shadow-md group-hover:block">
          было: {was}
        </span>
      </span>,
    );
    last = re.lastIndex;
  }
  if (last < text.length) out.push(renderPlain(text.slice(last)));
  return out;
}

function renderPlain(text: string): React.ReactNode {
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
          // brand-цвет явно: вне .figma-scope (панель «Источник») переменная
          // --link-default не определена и ссылка иначе стала бы чёрной.
          <ExternalLink key={key} href={href} className="text-brand">
            {m[1]}
          </ExternalLink>
        ) : href.startsWith("#") ? (
          /*
            ЯКОРЬ НА ЭТОЙ ЖЕ СТРАНИЦЕ. В данных он остаётся обычным «#anchor» —
            именно такой адрес нужен разработчику. Но прототип живёт на
            HashRouter, и обычный клик браузер принимает за смену маршрута:
            адрес становится «#anchor», а на экране — «Страница не найдена».
            Поэтому переход делаем сами, прокруткой — тем же приёмом, что в
            оглавлении.
          */
          <a
            key={key}
            href={href}
            onClick={(e) => {
              e.preventDefault();
              scrollToBlock(href);
            }}
            className="text-brand underline underline-offset-2"
          >
            {m[1]}
          </a>
        ) : (
          <a
            key={key}
            href={previewHref(href)}
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
