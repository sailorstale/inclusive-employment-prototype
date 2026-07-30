import * as React from "react";
import { docToExport } from "@/editor-source/source/contentTree";
import { JsonView, downloadJson } from "@/editor-source/source/JsonView";
import { ResultView } from "@/editor-source/source/ResultView";
import { buildSampleDoc } from "@/editor-source/source/sampleDoc";
import { useScrollSync, scrollToEl } from "@/editor-source/source/scrollSync";

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
  // Пока наводим обе колонки на выбранный узел, синхрон по секциям молчит.
  const paused = React.useRef(false);
  useScrollSync(jsonBox, viewBox, paused);

  /*
    Выбранный узел — общий для колонок: клик по компоненту подсвечивает его
    кусок JSON, клик по JSON — сам компонент. Повторный клик снимает выбор.
  */
  const [picked, setPicked] = React.useState<string | null>(null);
  const pick = React.useMemo(
    () => ({
      selected: picked,
      onSelect: (path: string) => setPicked((p) => (p === path ? null : path)),
    }),
    [picked],
  );

  /*
    Наводка живёт здесь, а не в колонках: двигать нужно ОБЕ и подряд, иначе
    скролл одной поднимет синхрон, и он собьёт наводку другой.
  */
  React.useEffect(() => {
    if (!picked || !jsonBox || !viewBox) return;
    paused.current = true;
    scrollToEl(jsonBox, jsonBox.querySelector(`[data-json-path="${picked}"]`));
    scrollToEl(
      viewBox,
      viewBox.querySelector(`[data-json-path="${picked}"]`)?.firstElementChild,
    );
    // Событий скролла к этому моменту уже не будет — отпускаем синхрон.
    const t = window.setTimeout(() => (paused.current = false), 200);
    return () => window.clearTimeout(t);
  }, [picked, jsonBox, viewBox]);

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
          <JsonView doc={doc} selected={picked} onSelect={pick.onSelect} />
        </div>
      </div>

      {/* Правая колонка — как это должно выглядеть */}
      <div className="flex min-h-0 flex-col overflow-hidden">
        <div className="flex shrink-0 items-center justify-between gap-2 border-b bg-muted/40 px-4 py-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Как это должно выглядеть
          </span>
          <span className="hidden text-xs text-muted-foreground sm:block">
            кликните по блоку — слева подсветится его JSON
          </span>
        </div>
        <div ref={setViewBox} className="min-h-0 flex-1 overflow-y-auto">
          <ResultView doc={doc} pick={pick} />
        </div>
      </div>
    </div>
  );
}
