import * as React from "react";
import { resolveAnchor } from "./commentAnchor";

/*
  РАМКИ КОММЕНТАРИЕВ ПОВЕРХ СТРАНИЦЫ.

  Комментарий часто относится не к одному блоку, а к нескольким подряд («вот эти
  три карточки надо объединить»). Рисовать рамку каждому блоку отдельно неверно:
  читается как три разных замечания вместо одного. Поэтому рамка ОДНА на
  комментарий — по общему прямоугольнику всех его блоков.

  Собрать такую рамку из рамок самих блоков нельзя: между блоками есть отступы,
  и боковые линии рвались бы в промежутках. Поэтому отдельный слой поверх.

  Слой лежит ВНУТРИ прокручиваемой колонки, поэтому при прокрутке пересчитывать
  ничего не нужно: координаты считаются относительно контейнера, а не окна.
  Пересчёт нужен только когда меняется раскладка — догрузились картинки,
  раскрылся аккордеон, изменилась ширина окна. За этим следит ResizeObserver.
*/

/*
  СОСТОЯНИЕ ЗАМЕЧАНИЯ — три исхода, и у каждого свой цвет рамки:

  open     — синяя пунктирная: замечание ждёт работы;
  applied  — зелёная сплошная: сделано (запись в журнале разбора, appliedComments);
  skipped  — серая сплошная: «не применять», дизайнер разбирает сам.
*/
export type CommentState = "open" | "applied" | "skipped";

export type CommentFrame = {
  /** Ключ комментария: его id. */
  id: string;
  /** Адреса блоков, к которым относится комментарий. */
  paths: string[];
  state: CommentState;
  /** Снимок текста блока — по нему чиним привязку, если адрес съехал. */
  snapshot?: string | null;
  /** Подпись у верхнего края: автор комментария. */
  label?: string;
};

/** Цвет, заливка и подпись-хвост для каждого исхода. */
export const FRAME_LOOK: Record<
  CommentState,
  { color: string; tint: string; dashed: boolean; tail: string }
> = {
  open: {
    color: "var(--comment-line)",
    tint: "var(--comment-tint)",
    dashed: true,
    tail: "",
  },
  applied: {
    color: "var(--comment-applied)",
    tint: "var(--comment-applied-tint)",
    dashed: false,
    tail: " · сделано",
  },
  skipped: {
    color: "var(--comment-skipped)",
    tint: "var(--comment-skipped-tint)",
    dashed: false,
    tail: " · не применяем",
  },
};

type Box = { top: number; left: number; width: number; height: number; key: string };

/*
  Насколько далеко блоки считаются соседними. Промежуток между абзацами внутри
  раздела — десятки пикселей; полсотни хватает, чтобы склеить их и не склеить
  блоки из разных концов страницы.
*/
const GAP = 56;

/*
  Настоящий прямоугольник компонента. Обёртка выбора у страниц из источника —
  display:contents: своей коробки у неё нет, мерить надо единственного ребёнка.
  У хабов треков адрес висит прямо на компоненте, и мерить нужно его самого.
*/
function boxOf(el: Element): DOMRect | null {
  const style = window.getComputedStyle(el);
  const target =
    style.display === "contents" ? (el.firstElementChild as HTMLElement | null) : el;
  return target ? target.getBoundingClientRect() : null;
}

export function CommentFrames({
  host,
  frames,
  activeId,
  onPick,
  onPlaced,
}: {
  /** Контейнер с позиционированием, внутри которого лежат блоки страницы. */
  host: HTMLElement | null;
  frames: CommentFrame[];
  /** Выбранный в панели комментарий — его рамка толще остальных. */
  activeId?: string | null;
  onPick?: (id: string) => void;
  /*
    Какие замечания удалось поставить на страницу. Панель по этому списку
    помечает те, чей блок не нашёлся: молчать нельзя, иначе комментарий висит
    без рамки и непонятно, к чему он относился.
  */
  onPlaced?: (ids: string[]) => void;
}) {
  const [boxes, setBoxes] = React.useState<(CommentFrame & Box)[]>([]);
  /* Колбэк держим в ref: он меняется на каждый показ, а пересчёт от этого
     запускаться не должен. */
  const onPlacedRef = React.useRef(onPlaced);
  onPlacedRef.current = onPlaced;
  /*
    Ключ пересчёта строкой, а не самим массивом: frames собирается заново на
    каждый показ, и по ссылке эффект крутился бы вечно.
  */
  const key = frames
    .map((f) => `${f.id}:${f.state}:${f.paths.join("+")}`)
    .join("|");

  React.useEffect(() => {
    if (!host) return;
    const measure = () => {
      const hostRect = host.getBoundingClientRect();
      const out: (CommentFrame & Box)[] = [];
      for (const f of frames) {
        // Адрес мог съехать после перестройки — чиним по снимку текста.
        const rects: DOMRect[] = [];
        for (const p of resolveAnchor(host, f.paths, f.snapshot)) {
          const el = host.querySelector(`[data-json-path="${CSS.escape(p)}"]`);
          const r = el && boxOf(el);
          if (r) rects.push(r);
        }
        // Ни один блок не нашёлся — комментарий с другой страницы или блок исчез.
        if (!rects.length) continue;

        /*
          ОДНА РАМКА НА СОСЕДНИЕ БЛОКИ, НО НЕ НА ДАЛЁКИЕ. Если замечание держит
          два блока подряд, общий прямоугольник читается как «вот про это».
          А если блоки в разных концах раздела, тот же прямоугольник накрывает
          всё, что между ними, — и замечание выглядит относящимся к целой
          странице. Поэтому склеиваем только те, что стоят вплотную, а
          разнесённые обводим по отдельности.
        */
        rects.sort((a, b) => a.top - b.top);
        const runs: DOMRect[][] = [[rects[0]]];
        for (const r of rects.slice(1)) {
          const prev = runs[runs.length - 1];
          const gap = r.top - prev[prev.length - 1].bottom;
          if (gap <= GAP) prev.push(r);
          else runs.push([r]);
        }

        runs.forEach((run, i) => {
          const top = Math.min(...run.map((r) => r.top));
          const left = Math.min(...run.map((r) => r.left));
          const right = Math.max(...run.map((r) => r.right));
          const bottom = Math.max(...run.map((r) => r.bottom));
          out.push({
            ...f,
            // Подпись только у первой рамки: у остальных она бы дублировалась.
            label: i === 0 ? f.label : undefined,
            key: `${f.id}#${i}`,
            top: top - hostRect.top,
            left: left - hostRect.left,
            width: right - left,
            height: bottom - top,
          });
        });
      }
      setBoxes(out);
      onPlacedRef.current?.([...new Set(out.map((b) => b.id))]);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    /*
      Следим и за появлением узлов, а не только за высотой. Аккордеон, пока он
      свёрнут, не рисует своё содержимое вовсе: блок физически отсутствует, и
      рамке не за что зацепиться. Раскрылся — узлы появились, а высота могла
      измениться так, что наблюдатель размера промолчал.
    */
    const mo = new MutationObserver(() => measure());
    mo.observe(host, { childList: true, subtree: true });
    host.querySelectorAll("img").forEach((img) => img.addEventListener("load", measure));
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [host, key]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {boxes.map((b) => {
        const look = FRAME_LOOK[b.state];
        /*
          Выбранный комментарий видно издалека: рамка толще и внутри лёгкая
          заливка. Когда на странице два десятка рамок, одной только линии мало,
          чтобы понять, о котором идёт речь.
        */
        const active = b.id === activeId;
        /*
          Когда одно замечание выбрано, остальные приглушаем. Блоки бывают
          огромными — целая история героя на два экрана, — и рамки соседних
          замечаний накрывают выбранное так, что непонятно, к чему оно
          относится. Приглушённые рамки остаются видны, но спорить за внимание
          перестают.
        */
        const dim = Boolean(activeId) && !active;
        return (
          <div
            key={b.key}
            style={{
              position: "absolute",
              top: b.top - 8,
              left: b.left - 8,
              width: b.width + 16,
              height: b.height + 16,
              border: `${active ? 3 : 2}px ${look.dashed ? "dashed" : "solid"} ${look.color}`,
              borderRadius: 10,
              background: active ? look.tint : undefined,
              opacity: dim ? 0.18 : 1,
              transition: "opacity .15s",
            }}
          >
            {b.label ? (
              <button
                type="button"
                onClick={() => onPick?.(b.id)}
                style={{ background: look.color }}
                className="pointer-events-auto absolute -top-2.5 left-3 rounded px-1.5 py-0.5 text-[10px] font-medium leading-none text-white"
              >
                {b.label}
                {look.tail}
              </button>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
