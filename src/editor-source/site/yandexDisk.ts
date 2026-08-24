/*
  ДОПОЛНИТЕЛЬНЫЕ МАТЕРИАЛЫ ПЕРЕЕХАЛИ С ГУГЛ-ДОКОВ НА ЯНДЕКС ДИСК.

  Заказчик перевёз все файлы раздатки к себе и прислал таблицу пар: в первой
  колонке старый адрес гугл-дока, в третьей — новый адрес на Диске. Сверка,
  какие из старых ссылок реально стоят на сайте, лежит в корне репозитория
  («Сверка ссылок на доп материалы.md», 23 августа 2026).

  ПОЧЕМУ ПОДМЕНА, А НЕ ПРАВКА ТЕКСТА. Двадцать один адрес из двадцати семи
  приходит из источника (content/source/*.generated.ts), а источник править
  нельзя: от текста блока считается его адрес (blockRefId), и правка молча
  оторвала бы от блока разметку и замечания. То же рассуждение записано в шапке
  clientEdits/index.ts.

  Здесь текст не трогается вовсе. Меняется только то, что стоит в круглых
  скобках markdown-ссылки, — сам адрес. Отпечаток блока считается по ЧИСТОМУ
  тексту, поэтому разметка, замечания и правки редактора остаются на месте.

  ГДЕ ЭТО ВКЛЮЧЕНО: рядом с dropClientLinks, то есть сразу после резолвера
  правок, — в useModuleDoc (сайт) и siteExport (выгрузка). Ровно там же, где
  живут остальные правки по замечаниям, и по той же причине: адрес мог приехать
  из правки редактора, а она у каждого стенда своя.

  ИНСТРУМЕНТ СВЕРКИ ИСТОЧНИКА ЭТОТ СЛОЙ НЕ ПРОХОДИТ — и это нарочно. Левая
  колонка сверки показывает гугл-док дословно: подмени мы адрес и там, клиент
  открыл бы сверку и увидел, будто в доке уже стоит ссылка на Диск.
*/

export type MovedDoc = {
  /** Название документа так, как оно записано в таблице заказчика. */
  name: string;
  /*
    Опознаватель документа внутри СТАРОГО адреса. Ключом взят именно он, а не
    адрес целиком: один и тот же док стоит на страницах с разными хвостами —
    «?tab=t.0», «?usp=sharing&ouid=…&rtpof=true&sd=true», «#heading=h.4lfv…».
  */
  docId: string;
  /** Новый адрес на Яндекс Диске. */
  href: string;
};

/*
  ДВА ДОКУМЕНТА ВЕДУТ НА ОДИН НОВЫЙ АДРЕС. В строке «Профориентационный маршрут
  соискателя» заказчик указал два старых гугл-дока и один новый файл: на Диске
  они слились в один документ. Поэтому здесь две записи с одним href.
*/
export const MOVED_DOCS: MovedDoc[] = [
  {
    name: "Промпт: разделение зон ответственности",
    docId: "1ttTLWZMtUAPMVfG8awoYKjYGi2OxnNnMWd1kCM1kZJQ",
    href: "https://disk.360.yandex.ru/i/v0ZYRvV2bWnDyA",
  },
  {
    name: "Практическое задание и шаблон 1",
    docId: "15HhLyoDXVQ1zvBQwc4WyiEu1qB2vElwS",
    href: "https://disk.360.yandex.ru/i/lF666oBAdmkguw",
  },
  {
    name: "Техническое задание на аудит",
    docId: "1nhCOUrMh0Aas4fRpLtEAeJiGXAZpw7XsXCPrIgJ56y4",
    href: "https://disk.360.yandex.ru/i/bvBgAcr-g5e-og",
  },
  {
    name: "Задание: адаптация чек-листа аудита",
    docId: "1YGWdNW69LrVQ7FyBJ4Z7eAZBOTH3vEaD",
    href: "https://disk.360.yandex.ru/i/rM9kOQ4D369bPQ",
  },
  {
    name: "Промпт: адаптация материалов под формы инвалидности",
    docId: "1xKZakYtejMemAFSeAdFc9yRlGkUpwoqlYPb_FqG7XR4",
    href: "https://disk.360.yandex.ru/i/bqW-C-blVonFJA",
  },
  {
    name: "Задание: план адаптации инклюзивной среды",
    docId: "1XTyeBkIDUwHvSyIyvy8YBGhpL5Mh_hya",
    href: "https://disk.360.yandex.ru/i/hTUxpyQRakXSZw",
  },
  {
    name: "Задание: составление описания вакансии",
    docId: "1_TphXHYo7l4AfAZ9MGunoUhXXnM4yp1O",
    href: "https://disk.360.yandex.ru/i/WeMI9g8yf4QTSQ",
  },
  {
    name: "Промпты: разбор сложных рабочих ситуаций",
    docId: "1vBrqGMG1BFGYl9mybmYHrDJl1pNkroSx4UVHF2bGHn8",
    href: "https://disk.360.yandex.ru/i/fdEEii7Fje3SIw",
  },
  {
    name: "Задание: готовность процессов к инклюзивному найму",
    docId: "10ZeX2LBaKPW3mBZIKDkXVc3hywb7BKho",
    href: "https://disk.360.yandex.ru/i/BzciSYILkv6ulg",
  },
  {
    name: "Задание: затраты на инклюзивный найм",
    docId: "1yCMAZCVx2ttbaJnsJVM8U7ao7RdJ0Sut",
    href: "https://disk.360.yandex.ru/i/SmqZxKnOPK63LQ",
  },
  /*
    АНКЕТА ПЕРЕЕХАЛА НЕ НА ДИСК, А В ЯНДЕКС ФОРМЫ. Это не опечатка: заказчик
    указал в таблице именно адрес формы — документ был опросом, а не файлом.
  */
  {
    name: "Анкета для заключения",
    docId: "12TnFzOucAOW2dxlno-C_Xvb3qqVDovfEdOtsV7WpfIs",
    href: "https://forms.yandex.ru/surveys/13884717.9e0e80aae3564619ade0b46fa9248972123df8a1",
  },
  {
    name: "Быстрый опрос",
    docId: "1AFyjQrFiVJIIEVlu9JidU2LuR29RpoZj",
    href: "https://disk.360.yandex.ru/i/RcOOxZlFr9FGKQ",
  },
  {
    name: "Анкета участника",
    docId: "15_63Xw6bI0wPx5K-Mdhbksu3zSdweVls",
    href: "https://disk.360.yandex.ru/i/173Da6B-pzgMsg",
  },
  {
    name: "Анализ анкеты соискателя",
    docId: "1csidFQgkiPj5ad27jmwkBe5nIS-QaoJ8",
    href: "https://disk.360.yandex.ru/i/bwS6al8yK_srpA",
  },
  {
    name: "Чек-лист: первичная встреча",
    docId: "1bhzP49u6EJdfkcljlIcqUFy_Foiuuy6G",
    href: "https://disk.360.yandex.ru/i/GMTDBeAoixDXqA",
  },
  {
    name: "Инструкция: транскрибация",
    docId: "1PObmW1ACd7pvRPPX5N5ndPH6C_3OO2PA",
    href: "https://disk.360.yandex.ru/i/x9wAmc5Air4bdA",
  },
  {
    name: "Профориентационный маршрут соискателя (документ 1)",
    docId: "1n4pQ-BQurvB35GZ__rpCxhUfJe2YcJhV9_14RJ7fark",
    href: "https://disk.360.yandex.ru/i/xpnp8zehCQnuFQ",
  },
  {
    name: "Профориентационный маршрут соискателя (документ 2)",
    docId: "1HAIOTWIQIc4oGG0LI-ETKoF6vh1bQ8rk",
    href: "https://disk.360.yandex.ru/i/xpnp8zehCQnuFQ",
  },
  {
    name: "Анализ резюме под вакансию",
    docId: "1i_FFK9pLPdeGAuf50acYW3C0ugmsOqlH",
    href: "https://disk.360.yandex.ru/i/VSLbGpIxgrSq6Q",
  },
  {
    name: "Промпт: составление резюме",
    docId: "1Yi6QtHVaeOzx_WbgOhDEI92BfcxilEUb",
    href: "https://disk.360.yandex.ru/i/yvI1063o_AwEWA",
  },
  {
    name: "Симулятор собеседования",
    docId: "1dto7Tr1mo-_V5SdEfW5OpcYtH14BgArR",
    href: "https://disk.360.yandex.ru/i/QQCasr9yhf3hTw",
  },
  {
    name: "Чек-лист: как понять, что работодатель потенциально подходит",
    docId: "1ta12r0SXoFjBy-XkQJIGqKJ-3cFhnzW1WST6lBnXayU",
    href: "https://disk.360.yandex.ru/i/Lirbw_H5T3ITpg",
  },
  {
    name: "Задание: список работодателей",
    docId: "1ysiOSzjubQBvjNlBQ39rWGcfIl25KWkH",
    href: "https://disk.360.yandex.ru/i/hzydL21OYLV6Wg",
  },
  {
    name: "Пример дорожной карты",
    docId: "1czSXmb_J8SMZUPzcEL6NW_upGomvV-0YA3kH1pwbWdo",
    href: "https://disk.360.yandex.ru/i/3UuyREVL9Hs8wA",
  },
  {
    name: "Пример таймлайна № 1",
    docId: "1Gj7n89Od56yva_dcvkN099Xue6lBlyzDuIy9yfzddA4",
    href: "https://disk.360.yandex.ru/i/SePaH56cICf3ug",
  },
  {
    name: "Пример таймлайна",
    docId: "1hfsOshL8emDuH_2mQw6w30Pf-OKSikWgnx_f_nzjpGY",
    href: "https://disk.360.yandex.ru/i/46G2vq8X2SLT-w",
  },
  {
    name: "Дорожная карта: промпт",
    docId: "1_tK2ZlAxIQYzHfRmr3moir7gvUlG0GL7",
    href: "https://disk.360.yandex.ru/i/C5opu-Ajf9cVkQ",
  },
  {
    name: "Задание: проверка заявки на грант",
    docId: "1IX4lmkTijtHUYjG3AJ2-Cyiyv1iJVHXp",
    href: "https://disk.360.yandex.ru/i/zVHbEfBARgsB2Q",
  },
  /*
    ЧЕТЫРЕ РОЛИКА ПЕРЕЕХАЛИ С ОБЫЧНОГО ДИСКА НА ДИСК 360. Старый адрес тоже
    яндексовый, поэтому опознаватель здесь короче — это код файла после «/i/».
  */
  {
    name: "Заключительное видео",
    docId: "3T-N5N01pOtCgg",
    href: "https://disk.360.yandex.ru/i/AltWq0P9eT4ZSA",
  },
  {
    name: "Видео «Для НКО»",
    docId: "zwrVDlQlxy_ECA",
    href: "https://disk.360.yandex.ru/i/FTZPpqrVs3lL7A",
  },
  {
    name: "Видео «Для работодателей»",
    docId: "Bv7n_bOBZJJLmg",
    href: "https://disk.360.yandex.ru/i/WCceJ8cORaHMeQ",
  },
  {
    name: "Вводное видео",
    docId: "Zux_cqxP1sRgKQ",
    href: "https://disk.360.yandex.ru/i/L56GM-pgrYK6tQ",
  },
];

/*
  Адрес внутри строки. Скобка и кавычка в набор не входят: на них кончается
  markdown-ссылка «[слова](адрес)» и атрибут href.
*/
const URL_IN_TEXT = /https?:\/\/[^\s)\]"'<>]+/g;

/*
  Знаки препинания на конце адреса принадлежат предложению, а не ссылке. В
  источнике адрес местами стоит голым текстом и кончается точкой; без этой
  оговорки точка уехала бы вместе со старым адресом и фраза осталась бы без неё.
*/
const TAIL = /[.,;:!?»]+$/;

/**
 * Старый адрес документа → новый. Текст не трогаем: меняется только сам адрес.
 */
export function toYandexDisk(md: string): string {
  if (!md.includes("http")) return md;
  return md.replace(URL_IN_TEXT, (url) => {
    const tail = url.match(TAIL)?.[0] ?? "";
    const clean = tail ? url.slice(0, -tail.length) : url;
    const moved = MOVED_DOCS.find((d) => clean.includes(d.docId));
    return moved ? moved.href + tail : url;
  });
}
