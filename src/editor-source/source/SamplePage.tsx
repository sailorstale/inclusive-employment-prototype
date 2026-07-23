import * as React from "react";
import { docToExport } from "@/editor-source/source/contentTree";
import { JsonView, downloadJson } from "@/editor-source/source/JsonView";
import { ResultView } from "@/editor-source/source/ResultView";
import { buildSampleDoc } from "@/editor-source/source/sampleDoc";
import { useScrollSync } from "@/editor-source/source/scrollSync";

/*
  ЭТАЛОННАЯ СТРАНИЦА — «Образец».

  Зачем. Разработчик собирает страницы в конструкторе Яндекса по нашему JSON.
  Прежде чем делать это на боевых модулях, ему нужно проверить сам ФОРМАТ: все
  ли компоненты он находит, верно ли понимает поля, как ложатся отступы и
  вложенность. Здесь для этого собрана одна страница со всеми узлами сразу.

  Слева JSON, справа результат — как на страницах модулей. Собрал по JSON,
  сравнил с правой колонкой: сошлось — формат понят верно.

  Документ статичный: он ни от директив, ни от источника не зависит. Это
  намеренно — эталон не должен «плыть» вслед за разметкой модулей, иначе по нему
  нельзя сверяться.
*/
export function SamplePage() {
  // Документ неизменен — считаем один раз, а не на каждую перерисовку.
  const doc = React.useMemo(() => buildSampleDoc(), []);

  /*
    Колонки скроллятся синхронно по секциям — как на страницах модулей. Здесь
    это особенно нужно: сверять JSON с результатом построчно и есть вся работа
    разработчика на этой странице.

    Контейнеры держим состоянием, а не ref: хук должен переподключиться, когда
    элемент появится.
  */
  const [jsonBox, setJsonBox] = React.useState<HTMLDivElement | null>(null);
  const [viewBox, setViewBox] = React.useState<HTMLDivElement | null>(null);
  useScrollSync(jsonBox, viewBox);

  return (
    <div className="grid h-full min-h-0 grid-cols-1 md:grid-cols-2">
      {/* Левая колонка — JSON для разработчика */}
      <div className="flex min-h-0 flex-col overflow-hidden border-r">
        <div className="flex shrink-0 items-center justify-between gap-2 border-b bg-muted/40 px-6 py-1.5">
          <span className="truncate text-xs font-medium text-muted-foreground">
            JSON для разработчика · образец
          </span>
          <button
            type="button"
            onClick={() => downloadJson("content-sample.json", docToExport(doc))}
            className="shrink-0 rounded-md border bg-background px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Скачать
          </button>
        </div>
        <div
          ref={setJsonBox}
          className="mx-auto min-h-0 w-full max-w-prose flex-1 overflow-y-auto px-6 py-8"
        >
          <JsonView doc={doc} />
        </div>
      </div>

      {/* Правая колонка — как это должно выглядеть */}
      <div className="flex min-h-0 flex-col overflow-hidden">
        <div className="flex shrink-0 items-center justify-between gap-2 border-b bg-muted/40 px-4 py-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Как это должно выглядеть
          </span>
          <span className="hidden text-xs text-muted-foreground sm:block">
            соберите по JSON и сравните
          </span>
        </div>
        <div ref={setViewBox} className="min-h-0 flex-1 overflow-y-auto">
          <ResultView doc={doc} />
        </div>
      </div>
    </div>
  );
}
