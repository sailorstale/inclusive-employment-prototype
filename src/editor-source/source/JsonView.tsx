import * as React from "react";
import { docToExport, type Doc } from "./contentTree";

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
  разъезжались. Собранная строка посимвольно равна JSON.stringify(…, null, 2) —
  то есть ровно тому, что скачивается файлом.
*/
export function JsonView({ doc }: { doc: Doc }) {
  // Разбор тяжёлый (десятки тысяч знаков) — считаем только при смене дерева.
  const { head, secs, tail } = React.useMemo(() => {
    const ex = docToExport(doc) as {
      module: string;
      children: { component?: string }[];
    };
    // Секция печатается с отступом 2, внутри "children" — ещё 2: итого 4.
    const indent = (s: string) => s.replace(/^/gm, "    ");
    const children = ex.children ?? [];
    /*
      Нумеруем ТОЛЬКО Section Container: перед секциями в дереве может лежать
      Page Summary, и если считать якорь по индексу в children, все секции
      уедут на одну позицию относительно текста и раскладки.
    */
    let n = -1;
    return {
      head: `{\n  "module": ${JSON.stringify(ex.module)},\n  "children": [\n`,
      secs: children.map((c) => {
        const isSection = c?.component === "Section Container";
        if (isSection) n += 1;
        return { text: indent(JSON.stringify(c, null, 2)), sec: isSection ? n : undefined };
      }),
      tail: children.length ? "\n  ]\n}" : "  ]\n}",
    };
  }, [doc]);

  return (
    <pre className="whitespace-pre-wrap break-words font-mono text-[13px] leading-[1.65] text-muted-foreground">
      {highlightJson(head)}
      {secs.map((s, i) => (
        <span key={i} data-sec={s.sec}>
          {highlightJson(s.text)}
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
