import * as React from "react";
import { Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/*
  Figma: component «Image» (6958:5097), свойство Platform (Desktop | Mobile).

  Картинка в теле страницы — иллюстрация, схема, скриншот. До этого в системе
  её не было (фото жило только в Hero, Small Image — стикер-декор). Теперь есть.

  В Figma это готовый бокс с соотношением ~16:9 (848×474), скруглением 24 и
  верхним отступом 40. Живёт в слоте Card Container, как и прочие не-абзацы.

  Прототип реальных фотографий не показывает (нейтральный стиль), поэтому по
  умолчанию рисуем рамку-заглушку: серый бокс card/bg-gray с иконкой «картинка»
  по центру — «здесь будет изображение». Если передать src, покажем настоящее.
*/

type Props = {
  /** Настоящее изображение. Без него — серая рамка-заглушка. */
  src?: string;
  /** Альтернативный текст для настоящего изображения. */
  alt?: string;
  className?: string;
};

export function Image({ src, alt = "", className }: Props) {
  return (
    <div
      data-component="Image"
      className={cn("w-full pt-[var(--space-2xl)]", className)}
    >
      <div className="flex aspect-[848/474] w-full items-center justify-center overflow-hidden rounded-[var(--radius-l)] bg-[color:var(--card-bg-gray)]">
        {src ? (
          /*
            Картинку ВПИСЫВАЕМ в бокс, а не кадрируем им. Бокс из Figma — 16:9,
            а в источнике всё подряд: портреты 954×1354, широкие баннеры
            2048×372, мелкие иконки 160×144. При object-cover 16 картинок из 20
            резались (у людей на иллюстрациях отрезало головы).

            Серая подложка работает как паспарту. Крупные — ужимаются до бокса,
            мелкие остаются в своём размере: апскейл только мылит.
          */
          <img
            src={src}
            alt={alt}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <ImageIcon
              className="size-16 text-[color:var(--text-secondary)]"
              aria-hidden
            />
          </div>
        )}
      </div>
    </div>
  );
}
