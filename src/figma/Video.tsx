import * as React from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

/*
  Figma: component «Video» (6958:5065), свойство Platform (Desktop | Mobile).

  Видео в теле страницы — например, интервью героя. Раньше в системе не было ни
  компонента, ни плейсхолдера; теперь есть. Соотношение ~16:9, живёт в слоте
  Card Container.

  Поверх постера — кнопка play по центру. Прототип реального ролика не показывает
  (нейтральный стиль): по умолчанию пастельный бокс card/bg-green с кнопкой play.
  Если передать poster — покажем кадр. Титры автора в компонент не выносим: в
  Figma они часть самого кадра, а не отдельный слой.
*/

type Props = {
  /** Кадр-постер. Без него — пастельный зелёный фон. */
  poster?: string;
  className?: string;
};

export function Video({ poster, className }: Props) {
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
