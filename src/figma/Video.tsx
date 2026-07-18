import * as React from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

/*
  Figma: component «Video» (6958:5065), свойство Platform (Desktop | Mobile).

  Видео в теле страницы — например, интервью героя. Раньше в системе не было ни
  компонента, ни плейсхолдера; теперь есть. Соотношение ~16:9 (848×474),
  скругление 24, верхний отступ 40. Живёт в слоте Card Container.

  В Figma поверх постера — кнопка play по центру и титры автора слева вверху.
  Прототип реального ролика не показывает (нейтральный стиль): по умолчанию
  пастельный бокс card/bg-green с кнопкой play. Если передать poster — покажем
  кадр; title/author рисуются поверх как титры.
*/

type Props = {
  /** Кадр-постер. Без него — пастельный зелёный фон. */
  poster?: string;
  /** Имя автора/спикера — титр слева вверху. */
  title?: string;
  /** Роль/организация автора — вторая строка титра. */
  author?: string;
  className?: string;
};

export function Video({ poster, title, author, className }: Props) {
  const hasCaption = Boolean(title || author);

  return (
    <div
      data-component="Video"
      className={cn("w-full pt-[var(--space-2xl)]", className)}
    >
      <div className="relative aspect-[848/474] w-full overflow-hidden rounded-[var(--radius-l)] bg-[color:var(--card-bg-green)]">
        {poster ? (
          <img
            src={poster}
            alt=""
            aria-hidden
            className="absolute inset-0 size-full object-cover"
          />
        ) : null}

        {/* Титры автора — слева вверху, на тёмной подложке, чтобы читались
            и на кадре, и на пастельном фоне. */}
        {hasCaption ? (
          <div className="absolute left-[var(--space-l)] top-[var(--space-l)] max-w-[70%] rounded-[var(--radius-m)] bg-black/40 px-[var(--space-sm)] py-[var(--space-xs)] backdrop-blur-sm">
            {title ? (
              <p className="ds-body-m-bold text-white">{title}</p>
            ) : null}
            {author ? <p className="ds-body-s text-white/85">{author}</p> : null}
          </div>
        ) : null}

        {/* Кнопка play по центру. */}
        <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[var(--radius-100)] bg-white/80 backdrop-blur-sm">
          <Play
            className="size-6 translate-x-[1px] fill-current text-[color:var(--text-primary)]"
            aria-hidden
          />
        </span>
      </div>
    </div>
  );
}
