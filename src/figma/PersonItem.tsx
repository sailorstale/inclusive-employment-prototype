import * as React from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

/*
  «Person Item» — человек с фотографией: круглый портрет, под ним имя и
  должность. НАШЕ ДОПОЛНЕНИЕ к системе: в Figma такого компонента пока нет
  (см. КОМПОНЕНТЫ.md, раздел «Люди»), его нужно нарисовать — иначе имя в
  прототипе не найдёт пары в макете.

  Зачем понадобился. Клиент прислала портреты трёх экспертов, которые ведут
  сайт. Показать их было нечем: `Image` — широкий бокс 16:9 под иллюстрацию,
  портрет в нём лежит на паспарту и остаётся безымянным, а круглый аватар из
  `Quote` — мелкий значок 32 внутри цитаты. Имя и должность рядом с лицом не
  умел никто.

  Портрет круглый — той же формы, что аватар автора цитаты: снимки для сайта
  кадрируются квадратом по лицу (800×800) и рассчитаны именно на круг.

  ДОСТУПНОСТЬ. У самой фотографии подписи нет (alt пустой, aria-hidden): имя
  и должность стоят рядом обычным текстом, и скринридер прочитал бы их дважды.
  Фотография тут — оформление имени, а не отдельное сообщение.
*/

type Props = {
  /** Фото человека, например /figma/avatars/gulnara-gorishnyaya.jpg. */
  photo?: string;
  /** Имя и фамилия. Показываются всегда. */
  name: string;
  /** Должность. Без неё карточка — только портрет и имя. */
  role?: string;
  className?: string;
};

export function PersonItem({ photo, name, role, className }: Props) {
  return (
    <div
      data-component="Person Item"
      className={cn(
        "flex w-full flex-col items-center gap-[var(--space-sm)] text-center",
        className,
      )}
    >
      {photo ? (
        <img
          src={photo}
          alt=""
          aria-hidden
          className="aspect-square w-full max-w-[180px] rounded-[var(--radius-100)] object-cover"
          loading="lazy"
        />
      ) : (
        // Фото ещё не прислали — кружок с силуэтом, той же формы и размера.
        <span
          aria-hidden
          className="flex aspect-square w-full max-w-[180px] items-center justify-center rounded-[var(--radius-100)] bg-[color:var(--card-bg-gray)]"
        >
          <User className="size-10 text-[color:var(--text-secondary)]" aria-hidden />
        </span>
      )}

      <span className="flex flex-col gap-[var(--space-3xs)]">
        <span className="ds-body-m-bold text-[color:var(--text-primary)]">{name}</span>
        {role ? (
          <span className="ds-body-s text-[color:var(--text-secondary)]">{role}</span>
        ) : null}
      </span>
    </div>
  );
}
