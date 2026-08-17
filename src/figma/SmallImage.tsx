import * as React from "react";
import { cn } from "@/lib/utils";
import { SMALL_IMAGE_FILE, type SmallImageName } from "./smallImageFiles";

/*
  Figma: component set «Small Image» (6257:43392), 18 вариантов по свойству Name.

  Иллюстрация-«стикер»: подсказка глазом, о чём блок. Ставится в угол карточки
  или врезки. Смысла сама по себе не несёт — текст без неё читается полностью.

  Рисунки достаны из Figma и лежат в public/figma/illustrations/. Файлы названы
  латинскими слагами, сюжет → файл сопоставляется картой в smallImageFiles.ts.
  Та же карта даёт слаг сюжета для выгрузки разработчику, поэтому она вынесена
  из компонента: имя картинки в прототипе и имя картинки в JSON обязаны совпадать.

  Расхождения с Figma (честно):
  1) Свойства Size в Figma нет: мастер 88, а в жизни рисунок масштабируют руками
     (78 в Page Summary, 64 в карточке, 56 в узкой). Мы завели проп size,
     по умолчанию 64. Вопрос дизайнеру: не завести ли свойство Size.
  2) Сюжеты «Важная информация» и «Пример» дизайнер прислал картинками (png),
     остальные приехали вектором. Сейчас это серые квадраты с подписью —
     заглушки самой Figma; когда рисунки нарисуют, файлы заменяются на месте,
     имена и код не трогаются.
*/

export type { SmallImageName };

type Props = {
  /** Сюжет — единственное свойство набора в Figma. */
  name: SmallImageName;
  /** Сторона квадрата в пикселях. В Figma размер задают руками: 88 / 78 / 64 / 56. */
  size?: number;
  className?: string;
};

export function SmallImage({ name, size = 64, className }: Props) {
  // BASE_URL — чтобы путь работал и в dev (/), и в прод-сборке (подкаталог).
  const src = `${import.meta.env.BASE_URL}figma/illustrations/${SMALL_IMAGE_FILE[name]}`;

  return (
    <img
      data-component={`Small Image · ${name}`}
      src={src}
      // Размер — единственное «магическое» число: в Figma это тоже ручной
      // масштаб, а не токен, поэтому приходит пропом.
      style={{ width: size, height: size }}
      className={cn("shrink-0 select-none", className)}
      // Иллюстрация декоративна — скрыта от читалки; сюжет в alt/title для того,
      // кто собирает страницу.
      alt=""
      aria-hidden
      title={name}
    />
  );
}
