import * as React from "react";
import { toExportWithPaths, type Doc, type ExportPath } from "./contentTree";

/*
  ВИД JSON — общий для страниц модулей и эталонной страницы.

  Вынесен из SourcePage: тот разросся, а подсветка и скачивание нужны обеим
  страницам. Показываем ровно то, что уедет разработчику: та же функция
  выгрузки, что и у кнопки «Скачать».
*/

/*
  ПОДСВЕТКА JSON. Простыню в 85 тысяч знаков одним цветом читать невозможно,
  поэтому раскрашиваем. Свой мини-разборщик вместо библиотеки: формат тут
  заведомо валидный — его сделал JSON.stringify, — и хватает одного шаблона на
  четыре вида токенов.

  Тема в приложении одна, светлая, поэтому и цвета одни — без парных
  вариантов под тёмную.
*/
const JSON_TOKEN =
  /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;

const TOKEN_CLASS = {
  key: "text-sky-700",
  string: "text-emerald-700",
  literal: "text-purple-700",
  number: "text-amber-700",
};

function highlightJson(src: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  JSON_TOKEN.lastIndex = 0;
  while ((m = JSON_TOKEN.exec(src))) {
    if (m.index > last) out.push(src.slice(last, m.index));
    const [full, str, colon, literal, num] = m;
    const cls = str
      ? colon
        ? TOKEN_CLASS.key
        : TOKEN_CLASS.string
      : literal
        ? TOKEN_CLASS.literal
        : num
          ? TOKEN_CLASS.number
          : "";
    out.push(
      <span key={key++} className={cls}>
        {full}
      </span>,
    );
    last = m.index + full.length;
  }
  if (last < src.length) out.push(src.slice(last));
  return out;
}

/*
  JSON ровно того вида, что уедет разработчику: та же функция выгрузки, что и у
  кнопки «Скачать». Смотреть можно рядом с текстом, не скачивая файл.

  Печатаем не одной простынёй, а посекционно: каждая секция получает свой
  data-sec — тот же якорь, что у текста и у раскладки. Без него синхронный
  скролл мог быть только пропорциональным, а высоты JSON и страницы не совпадают
  (у секции с таблицей текста на экран, а JSON на сотню строк), и колонки
  разъезжались.

  ПЕЧАТЬ ПО УЗЛАМ. Внутри секции каждый узел — свой <span> с адресом (путь
  индексов «1.2.0»): по этому же адресу подписан компонент в правой колонке,
  поэтому клик по компоненту подсвечивает ровно его кусок JSON, а клик по
  JSON — компонент. Вёрстка текста при этом совпадает с
  JSON.stringify(…, null, 2) до символа — то есть с тем, что скачивается файлом.
*/
const IND = (d: number) => "  ".repeat(d);

/** Значение-не-узел: обычный JSON, только со сдвигом всех строк, кроме первой. */
const jsonValue = (v: unknown, d: number) =>
  (JSON.stringify(v, null, 2) ?? "null").replace(/\n/g, "\n" + IND(d));

type NodeLike = Record<string, unknown> & { component?: string };

const isNodeList = (v: unknown): v is NodeLike[] =>
  Array.isArray(v) && v.every((x) => x && typeof x === "object" && "component" in x);

function JsonNode({
  node,
  at,
  depth,
  selected,
  onSelect,
}: {
  node: NodeLike;
  /* Адрес узла в ИСХОДНОМ дереве (вместе с адресами детей). Считать его по
     месту в выгрузке нельзя: пометки инструмента в неё не попадают, и номера
     разъезжаются с теми, по которым страница выбирает компонент. */
  at: ExportPath;
  depth: number;
  selected?: string | null;
  onSelect?: (path: string) => void;
}) {
  const entries = Object.entries(node);
  const path = at.path;
  return (
    <span
      data-json-path={path}
      className={
        // Только фон: рамка на многострочном инлайне рвётся по строкам и рябит.
        selected === path ? "rounded-sm bg-[color:var(--pick-bg)]" : undefined
      }
      onClick={
        onSelect
          ? (e) => {
              // Внутренний узел важнее внешнего: клик выбирает самый глубокий.
              e.stopPropagation();
              onSelect(path);
            }
          : undefined
      }
    >
      {highlightJson(IND(depth) + "{\n")}
      {entries.map(([k, v], i) => {
        const comma = i < entries.length - 1 ? "," : "";
        if (k === "children" && isNodeList(v))
          return (
            <React.Fragment key={k}>
              {highlightJson(`${IND(depth + 1)}"children": [\n`)}
              {v.map((c, j) => (
                <React.Fragment key={j}>
                  <JsonNode
                    node={c}
                    at={at.children[j] ?? { path: `${path}.${j}`, children: [] }}
                    depth={depth + 2}
                    selected={selected}
                    onSelect={onSelect}
                  />
                  {j < v.length - 1 ? ",\n" : "\n"}
                </React.Fragment>
              ))}
              {highlightJson(`${IND(depth + 1)}]${comma}\n`)}
            </React.Fragment>
          );
        return (
          <React.Fragment key={k}>
            {highlightJson(
              `${IND(depth + 1)}${JSON.stringify(k)}: ${jsonValue(v, depth + 1)}${comma}\n`,
            )}
          </React.Fragment>
        );
      })}
      {highlightJson(IND(depth) + "}")}
    </span>
  );
}

export function JsonView({
  doc,
  selected,
  onSelect,
  heading,
  listKey = "children",
}: {
  doc: Doc;
  /** Путь выбранного узла — тот же, что у компонента в правой колонке. */
  selected?: string | null;
  onSelect?: (path: string) => void;
  /**
   * Верхние поля вместо «module». На сайте — мета страницы и h1: это страница
   * сайта, а не модуль курса. Если не задано — старое поведение (module).
   */
  heading?: Record<string, unknown>;
  /**
   * Имя массива с содержимым. На сайте это «article» (см. siteExport): у узлов
   * внутри тоже есть children, и на верхнем уровне имя читалось двусмысленно.
   */
  listKey?: string;
}) {
  // Разбор тяжёлый (десятки тысяч знаков) — считаем только при смене дерева.
  const { head, secs, tail } = React.useMemo(() => {
    const ex = toExportWithPaths(doc.children);
    const children = (ex.nodes ?? []) as NodeLike[];
    // Верхние поля: заданные снаружи (slug/h1) или, по умолчанию, module.
    const fields = heading ?? { module: doc.module };
    const headLines = Object.entries(fields)
      .map(([k, v]) => `  ${JSON.stringify(k)}: ${jsonValue(v, 1)},\n`)
      .join("");
    /*
      Нумеруем ТОЛЬКО Section Container: перед секциями в дереве может лежать
      Page Summary, и если считать якорь по индексу в children, все секции
      уедут на одну позицию относительно текста и раскладки.
    */
    let n = -1;
    return {
      head: `{\n${headLines}  ${JSON.stringify(listKey)}: [\n`,
      secs: children.map((c, i) => {
        const isSection = c?.component === "Section Container";
        if (isSection) n += 1;
        return {
          node: c,
          sec: isSection ? n : undefined,
          at: ex.paths[i] ?? { path: String(i), children: [] },
        };
      }),
      tail: children.length ? "\n  ]\n}" : "  ]\n}",
    };
  }, [doc, heading, listKey]);

  return (
    <pre className="whitespace-pre-wrap break-words font-mono text-[13px] leading-[1.65] text-muted-foreground">
      {highlightJson(head)}
      {secs.map((s, i) => (
        <span key={i} data-sec={s.sec}>
          <JsonNode
            node={s.node}
            at={s.at}
            depth={2}
            selected={selected}
            onSelect={onSelect}
          />
          {i < secs.length - 1 ? ",\n" : ""}
        </span>
      ))}
      {highlightJson(tail)}
    </pre>
  );
}

/** Скачивание JSON файлом — выгрузка для разработчика. */
export function downloadJson(name: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
