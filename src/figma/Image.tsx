import * as React from "react";
import { Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/*
  Figma: component «Image» (6958:5097), свойство Platform (Desktop | Mobile).

  Картинка в теле страницы — иллюстрация, схема, скриншот. До этого в системе
  её не было (фото жило только в Hero, Small Image — стикер-декор). Теперь есть.

  В Figma это готовый бокс с соотношением ~16:9 (848×474), скруглением 24 и
  верхним отступом 40. Живёт в слоте Block, как и прочие не-абзацы.

  Прототип реальных фотографий не показывает (нейтральный стиль), поэтому по
  умолчанию рисуем рамку-заглушку: серый бокс card/bg-gray с иконкой «картинка»
  по центру — «здесь будет изображение». Если передать src, покажем настоящее.

  Настоящая картинка от бокса 16:9 отвязана (решение дизайнера, 8 сентября
  2026): ширина всегда одна — вся колонка, а высота идёт от пропорций самого
  файла. Портрет получается высоким, баннер — низким, кадрирования и серого
  паспарту вокруг нет. Пропорцию 16:9 держит только заглушка: без файла
  высоту взять неоткуда.

  Клик по картинке скачивает файл. Схемы на страницах мелкие и подробные:
  читателю нужно открыть их крупно и сохранить себе, а разработчику — забрать
  исходник, не выковыривая его из вёрстки. В Figma такого поведения нет,
  это добавка прототипа (просьба дизайнера от 3 сентября 2026).
*/

/*
  Имя файла при сохранении. Alt у схем в источнике почти всегда пустой,
  поэтому по умолчанию отдаём имя файла из адреса.
*/
function downloadName(src: string, alt: string): string {
  const file = src.split("?")[0].split("/").pop() || "image.png";
  if (!alt.trim()) return file;
  const ext = file.includes(".") ? file.slice(file.lastIndexOf(".")) : "";
  return `${alt.trim().replace(/[\\/:*?"<>|]/g, " ").slice(0, 80)}${ext}`;
}

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
      {src ? (
        /*
          Ширина одна — вся колонка, высота — от файла: object-fit не нужен,
          картинка просто масштабируется целиком. Мелкие файлы при этом
          растягиваются до ширины колонки — это осознанно: одна ширина у всех.
        */
        <a
          href={src}
          download={downloadName(src, alt)}
          title="Скачать картинку"
          className="block w-full overflow-hidden rounded-[var(--radius-l)] outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--text-primary)]"
        >
          <img src={src} alt={alt} className="block h-auto w-full" />
        </a>
      ) : (
        <div className="flex aspect-[848/474] w-full items-center justify-center overflow-hidden rounded-[var(--radius-l)] bg-[color:var(--card-bg-gray)]">
          <ImageIcon
            className="size-16 text-[color:var(--text-secondary)]"
            aria-hidden
          />
        </div>
      )}
    </div>
  );
}
