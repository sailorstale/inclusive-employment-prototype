import * as React from "react";
import { cn } from "@/lib/utils";

/*
  Figma: component set «Small Image» (6257:43392), 18 вариантов по свойству Name.

  Иллюстрация-«стикер»: подсказка глазом, о чём блок. Ставится в угол карточки
  или врезки. Смысла сама по себе не несёт — текст без неё читается полностью.

  Рисунки достаны из Figma как SVG (download_assets, векторный экспорт) и лежат
  в public/figma/illustrations/. Файлы названы латинскими слагами, сюжет →
  файл сопоставляется картой SLUG ниже.

  Расхождения с Figma (честно):
  1) Свойства Size в Figma нет: мастер 88, а в жизни рисунок масштабируют руками
     (78 в Page Summary, 64 в карточке, 56 в узкой). Мы завели проп size,
     по умолчанию 64. Вопрос дизайнеру: не завести ли свойство Size.
  2) Сюжеты «AI» и «Важная информация» в самой Figma отрисованы пустыми серыми
     прямоугольниками (картинка не залита) — их SVG у нас тоже пустые. Перед
     выкладкой в контент дизайнеру надо залить рисунок.
*/

export type SmallImageName =
  | "Подготовка резюме"
  | "Рамка"
  | "Отклик на вакансию"
  | "Собеседование"
  | "Оформление"
  | "Задачи и коммуникация в команде"
  | "Комп"
  | "Поиск"
  | "Чеклист"
  | "Пин"
  | "Скрепка"
  | "Галка"
  | "Окно"
  | "Рабочий стол"
  | "Документы"
  | "Баблы"
  | "AI"
  | "Важная информация";

// Сюжет → имя файла в public/figma/illustrations/.
const SLUG: Record<SmallImageName, string> = {
  "Подготовка резюме": "resume",
  Рамка: "frame",
  "Отклик на вакансию": "apply",
  Собеседование: "interview",
  Оформление: "onboarding",
  "Задачи и коммуникация в команде": "teamwork",
  Комп: "computer",
  Поиск: "search",
  Чеклист: "checklist",
  Пин: "pin",
  Скрепка: "clip",
  Галка: "check",
  Окно: "window",
  "Рабочий стол": "desktop",
  Документы: "documents",
  Баблы: "bubbles",
  AI: "ai",
  "Важная информация": "important",
};

type Props = {
  /** Сюжет — единственное свойство набора в Figma. */
  name: SmallImageName;
  /** Сторона квадрата в пикселях. В Figma размер задают руками: 88 / 78 / 64 / 56. */
  size?: number;
  className?: string;
};

export function SmallImage({ name, size = 64, className }: Props) {
  // BASE_URL — чтобы путь работал и в dev (/), и в прод-сборке (подкаталог).
  const src = `${import.meta.env.BASE_URL}figma/illustrations/${SLUG[name]}.svg`;

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
