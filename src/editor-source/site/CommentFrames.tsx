import * as React from "react";

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

export type CommentFrame = {
  /** Ключ комментария: его id. */
  id: string;
  /** Адреса блоков, к которым относится комментарий. */
  paths: string[];
  /** Применён — рамка зелёная и сплошная вместо синей пунктирной. */
  applied: boolean;
  /** Подпись у верхнего края: автор комментария. */
  label?: string;
};

type Box = { top: number; left: number; width: number; height: number };

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
}: {
  /** Контейнер с позиционированием, внутри которого лежат блоки страницы. */
  host: HTMLElement | null;
  frames: CommentFrame[];
  /** Выбранный в панели комментарий — его рамка толще остальных. */
  activeId?: string | null;
  onPick?: (id: string) => void;
}) {
  const [boxes, setBoxes] = React.useState<(CommentFrame & Box)[]>([]);
  /*
    Ключ пересчёта строкой, а не самим массивом: frames собирается заново на
    каждый показ, и по ссылке эффект крутился бы вечно.
  */
  const key = frames
    .map((f) => `${f.id}:${f.applied ? 1 : 0}:${f.paths.join("+")}`)
    .join("|");

  React.useEffect(() => {
    if (!host) return;
    const measure = () => {
      const hostRect = host.getBoundingClientRect();
      const out: (CommentFrame & Box)[] = [];
      for (const f of frames) {
        let top = Infinity;
        let left = Infinity;
        let right = -Infinity;
        let bottom = -Infinity;
        for (const p of f.paths) {
          const el = host.querySelector(`[data-json-path="${CSS.escape(p)}"]`);
          const r = el && boxOf(el);
          if (!r) continue;
          top = Math.min(top, r.top);
          left = Math.min(left, r.left);
          right = Math.max(right, r.right);
          bottom = Math.max(bottom, r.bottom);
        }
        // Ни один блок не нашёлся — комментарий с другой страницы или блок исчез.
        if (!Number.isFinite(top)) continue;
        out.push({
          ...f,
          top: top - hostRect.top,
          left: left - hostRect.left,
          width: right - left,
          height: bottom - top,
        });
      }
      setBoxes(out);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    host.querySelectorAll("img").forEach((img) => img.addEventListener("load", measure));
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [host, key]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {boxes.map((b) => {
        const color = b.applied ? "var(--comment-applied)" : "var(--comment-line)";
        const tint = b.applied
          ? "var(--comment-applied-tint)"
          : "var(--comment-tint)";
        /*
          Выбранный комментарий видно издалека: рамка толще и внутри лёгкая
          заливка. Когда на странице два десятка рамок, одной только линии мало,
          чтобы понять, о котором идёт речь.
        */
        const active = b.id === activeId;
        return (
          <div
            key={b.id}
            style={{
              position: "absolute",
              top: b.top - 8,
              left: b.left - 8,
              width: b.width + 16,
              height: b.height + 16,
              border: `${active ? 3 : 2}px ${b.applied ? "solid" : "dashed"} ${color}`,
              borderRadius: 10,
              background: active ? tint : undefined,
            }}
          >
            {b.label ? (
              <button
                type="button"
                onClick={() => onPick?.(b.id)}
                style={{ background: color }}
                className="pointer-events-auto absolute -top-2.5 left-3 rounded px-1.5 py-0.5 text-[10px] font-medium leading-none text-white"
              >
                {b.applied ? `${b.label} · применён` : b.label}
              </button>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
