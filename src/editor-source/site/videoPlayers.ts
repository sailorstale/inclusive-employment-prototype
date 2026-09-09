/*
  РОЛИКИ ПЕРЕЕХАЛИ С ЯНДЕКС ДИСКА В ПЛЕЕР ЯНДЕКСА.

  Разработчик 30 августа 2026 заменил в своих данных все семь адресов видео:
  ссылка на файл Диска стала адресом встраиваемого плеера
  (frontend.vh.yandex.ru/player/…) с размерами ролика в хвосте. Заодно у двух
  портретных роликов на «Шаге 1» появилось поле aspectRatio — пропорции
  ролика, чтобы вертикальное видео не растягивалось под 16/9.

  Пары «старый адрес → плеер» взяты из журнала изменений разработчика
  (data-changelog.md, раздел 5) и его файла данных от 30 августа. Здесь
  вместо старого адреса стоит его опознаватель — код файла после «/i/»:
  у четырёх роликов адрес менялся дважды (обычный Диск → Диск 360, см.
  yandexDisk.ts), и в источнике встречается любой из двух.

  ФОРМАТ ПРОПОРЦИЙ — со слэшем, как в CSS: «16/9», «2/3.5». Ответ Евгении от
  9 сентября 2026: «как в данных указано, так и нужно делать». Вариант через
  букву x из первой версии её журнала отменён. Без поля у разработчика
  работает умолчание 16/9, поэтому у ландшафтных роликов поля нет.
*/
export type VideoPlayer = {
  /** Название ролика — для человека, в выгрузку не едет. */
  name: string;
  /** Опознаватели файла на Диске — по любому из них узнаём ролик. */
  diskIds: string[];
  /** Адрес встраиваемого плеера. */
  href: string;
  /** Пропорции ролика со слэшем. Нет — умолчание 16/9 на стороне разработчика. */
  aspectRatio?: string;
};

const PLAYERS: VideoPlayer[] = [
  {
    name: "Вводное видео («О проекте»)",
    diskIds: ["Zux_cqxP1sRgKQ", "L56GM-pgrYK6tQ"],
    href: "https://frontend.vh.yandex.ru/player/vplvqwmu3umzsj7aosws?width=1920&height=1080",
  },
  {
    name: "Заключительное видео («О проекте»)",
    diskIds: ["3T-N5N01pOtCgg", "AltWq0P9eT4ZSA"],
    href: "https://frontend.vh.yandex.ru/player/vplv3xnqk6iekkk6jvcs?width=1920&height=1080",
  },
  {
    name: "Видео команды («Команда»)",
    diskIds: ["7B_K9DYLFT2HIg"],
    href: "https://frontend.vh.yandex.ru/player/vplve4vokyde22aquqcq?width=1920&height=1080",
  },
  {
    name: "Видео «Для работодателей» («Шаг 1»)",
    diskIds: ["Bv7n_bOBZJJLmg", "WCceJ8cORaHMeQ"],
    href: "https://frontend.vh.yandex.ru/player/vplvky2nhff4jwgz4w4d?width=1920&height=1080",
  },
  {
    name: "Портретный ролик 720×1280 («Шаг 1»)",
    diskIds: ["RroghACLnww_3A"],
    href: "https://frontend.vh.yandex.ru/player/vplvyifupiipo2ofssit?width=720&height=1280",
    aspectRatio: "2/3.5",
  },
  {
    name: "Портретный ролик 1080×1920 («Шаг 1»)",
    diskIds: ["yuagzrGjLpgm5g"],
    href: "https://frontend.vh.yandex.ru/player/vplvq3ik6nyy5elqgb7s?width=1080&height=1920",
    aspectRatio: "2/3.5",
  },
  {
    name: "Видео «Для НКО» («С чего начать»)",
    diskIds: ["zwrVDlQlxy_ECA", "FTZPpqrVs3lL7A"],
    href: "https://frontend.vh.yandex.ru/player/vplvou4g3vl4u3vt3vjk?width=1920&height=1080",
  },
];

/**
 * Адрес плеера и пропорции для ролика по его старому адресу на Диске.
 * Ролик не из таблицы — undefined: адрес остаётся как в источнике, чтобы новый
 * ролик не пропал молча, а сторож выгрузки увидел, что плеера у него ещё нет.
 */
export function videoPlayer(url: string): Pick<VideoPlayer, "href" | "aspectRatio"> | undefined {
  const p = PLAYERS.find((v) => v.diskIds.some((id) => url.includes(id)));
  if (!p) return undefined;
  return { href: p.href, ...(p.aspectRatio ? { aspectRatio: p.aspectRatio } : {}) };
}

/** Признак адреса плеера — по нему сторож отличает переехавший ролик. */
export const isPlayerHref = (href: string): boolean =>
  href.startsWith("https://frontend.vh.yandex.ru/player/");
