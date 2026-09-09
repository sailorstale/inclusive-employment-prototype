/*
  КАРТИНКИ СХЕМ ПЕРЕЕХАЛИ НА ХОСТИНГ ЯНДЕКСА.

  Схемы в теле страниц лежат у нас в public/source-media/<модуль>/, и в дереве
  страницы у картинки стоит путь от корня прототипа. Разработчик 9 сентября
  2026 залил эти файлы к себе и прислал адреса (images.md): по договору в поле
  src должен приезжать готовый адрес https://…, а не путь, который существует
  только на прототипе.

  ПОДМЕНА ТОЛЬКО В ВЫГРУЗКЕ, не в дереве. Прототип продолжает показывать свой
  файл: клик по схеме скачивает её, а с чужого домена браузер скачивание не
  даёт, только открывает. Разработчику же нужен именно адрес хостинга.
  Новую схему заводим здесь после того, как разработчик её залил; до этого
  она едет путём прототипа, и сторож выгрузки это показывает.
*/
const HOSTED: Record<string, string> = {
  // «Шаг 2. Аудит рабочей среды»
  "/source-media/m5/img2.png":
    "https://avatars.mds.yandex.net/get-lpc/17800094/d4ad2c13-5fe5-4fe7-9583-9115688fbf74/orig?width=1536&height=1604",
  // «Запустить программу» (/ngo/start), этапы работы НКО
  "/source-media/m6/img1.png":
    "https://avatars.mds.yandex.net/get-lpc/17495851/f2ab63a1-c06c-4683-a599-6a236307e7fd/orig?width=1536&height=914",
  // «Аудитория программы», воронка участника
  "/source-media/m6/voronka-uchastnika.png":
    "https://avatars.mds.yandex.net/get-lpc/17800094/37c1a3b4-56cb-4398-a302-998cff3dda68/orig?width=1536&height=1532",
  // «Профориентация», пошаговый план
  "/source-media/m6/img2.png":
    "https://avatars.mds.yandex.net/get-lpc/17495851/3344a192-b53a-4efb-b46f-6c22ad46b94d/orig?width=1536&height=1016",
  // «Профориентация», портрет соискателя
  "/source-media/m6/img3.png":
    "https://avatars.mds.yandex.net/get-lpc/17495851/5ab3b73b-b19a-49db-9303-d328c7e3a125/orig?width=1536&height=1532",
  // «Поиск работодателей», схема поиска
  "/source-media/m6/img4.png":
    "https://avatars.mds.yandex.net/get-lpc/16904900/bda974c7-826a-45dc-8891-2de730902594/orig?width=1536&height=1088",
};

/** Адрес картинки для выгрузки: хостинг разработчика, а если его ещё нет — путь прототипа. */
export const hostedImage = (src: string): string => HOSTED[src] ?? src;

/** Путь прототипа, который ещё не заведён на хостинге, — по нему сторож выгрузки жалуется. */
export const isPrototypePath = (src: string): boolean => src.startsWith("/source-media/");
