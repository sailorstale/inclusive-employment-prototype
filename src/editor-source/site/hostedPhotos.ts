/*
  ПОРТРЕТЫ И ЛОГОТИПЫ ПЕРЕЕХАЛИ НА ХОСТИНГ ЯНДЕКСА.

  В дереве страницы у цитаты и у человека стоит короткое имя файла
  («master-ok», «alina-yuhnevich»): по нему прототип берёт картинку из своей
  папки. Разработчик залил те же файлы к себе и в журнале изменений данных
  (data-changelog.md, разделы 1 и 4) прислал пары «имя → адрес». По договору в
  поле приезжает готовый адрес https://…, а не имя, и 9 сентября 2026 это
  подтвердилось на деле: Евгения загрузила нашу выгрузку с именами, и на сайте
  пропали все фото.

  ПОДМЕНА ТОЛЬКО В ВЫГРУЗКЕ, не в дереве: прототип продолжает показывать свои
  файлы. Две оговорки:
  — «yandex» остаётся именем: восемь логотипов Яндекса разработчик так и
    держит у себя, это его окончательное решение (журнал, таблица «Ожидают
    внесения»);
  — портрет, которого в таблице нет, едет именем, и сторож выгрузки это
    показывает: значит, файл разработчику ещё не отдан. Так сейчас с портретом
    Ольги Крыловой, добавленным после 30 августа.

  Логотипы частных компаний (lemana-pro, sberbank, mondelis-v-rossii,
  melon-fashion-group и другие) в таблице есть, но в выгрузке их больше нет:
  дизайнер снял их у цитат частных компаний 8 сентября 2026 (см. noLogo).
*/
const LOGOS: Record<string, string> = {
  "ashan":
    "https://avatars.mds.yandex.net/get-lpc/16405748/ae20e143-122f-42cc-a92a-2e836f945226/orig?width=160&height=80",
  "burger-king":
    "https://avatars.mds.yandex.net/get-lpc/16405748/d113aa65-ce00-45df-99a7-c8f4f98f00b9/orig?width=160&height=80",
  "deystvuy":
    "https://avatars.mds.yandex.net/get-lpc/17495851/c0eeccbd-f2fc-4346-98a5-bbbbe5a639f4/orig?width=160&height=80",
  "fond-borby-s-leykemiey":
    "https://avatars.mds.yandex.net/get-lpc/17495851/f0fb2c64-3015-4a31-9cec-701a67cb1389/orig?width=160&height=80",
  "fond-imeni-ani-chizhovoy":
    "https://avatars.mds.yandex.net/get-lpc/17800094/53342094-beee-4ebf-a3a3-66683cd0c2ca/orig?width=160&height=80",
  "iskra-nadezhdy":
    "https://avatars.mds.yandex.net/get-lpc/17800094/bfc9c61f-c4d4-4930-95ba-e766e4118e4a/orig?width=160&height=80",
  "laboratoriya-kasperskogo":
    "https://avatars.mds.yandex.net/get-lpc/17800094/f776ff13-a539-471a-bccd-e55ed55fd071/orig?width=160&height=80",
  "lemana-pro":
    "https://avatars.mds.yandex.net/get-lpc/17495851/76b8f1c5-c1c4-4b07-944e-17c83ef0ac88/orig?width=160&height=80",
  "luchshie-druzya":
    "https://avatars.mds.yandex.net/get-lpc/16405748/abc656bc-0bc9-4115-8079-11e34238ec6d/orig?width=160&height=80",
  "master-ok":
    "https://avatars.mds.yandex.net/get-lpc/17800094/f9f8ac42-f15f-4b2b-bdc5-a8de3aa40215/orig?width=160&height=80",
  "melon-fashion-group":
    "https://avatars.mds.yandex.net/get-lpc/17495851/76b8f1c5-c1c4-4b07-944e-17c83ef0ac88/orig?width=160&height=80",
  "mondelis-v-rossii":
    "https://avatars.mds.yandex.net/get-lpc/17495851/76b8f1c5-c1c4-4b07-944e-17c83ef0ac88/orig?width=160&height=80",
  "orbi":
    "https://avatars.mds.yandex.net/get-lpc/14837328/cd469397-b7aa-49d1-8ade-92bbb6c229c4/orig?width=160&height=80",
  "otkrytaya-sreda":
    "https://avatars.mds.yandex.net/get-lpc/17800094/bce3be2e-cf92-4ff3-b623-235e862d83c6/orig?width=160&height=80",
  "perspektiva-rooi":
    "https://avatars.mds.yandex.net/get-lpc/17495851/b356fdb7-6d52-4f08-a365-0a8f621c281e/orig?width=160&height=80",
  "pyaterochka":
    "https://avatars.mds.yandex.net/get-lpc/16405748/836c7ad6-74e3-4976-bddd-634da333ce55/orig?width=160&height=80",
  "sberbank":
    "https://avatars.mds.yandex.net/get-lpc/17495851/76b8f1c5-c1c4-4b07-944e-17c83ef0ac88/orig?width=160&height=80",
  "sozvezdie-oordi":
    "https://avatars.mds.yandex.net/get-lpc/17495851/14e8ba94-52f1-4674-8c16-3926ff484918/orig?width=160&height=80",
  "spina-bifida":
    "https://avatars.mds.yandex.net/get-lpc/17800094/c83a2bfb-d630-40dc-bab3-d5da33a35fe9/orig?width=160&height=80",
};

const PHOTOS: Record<string, string> = {
  "alena-merkureva":
    "https://avatars.mds.yandex.net/get-lpc/17495851/b3292b55-4979-4f83-a1ed-2e91e3c06555/orig?width=80&height=80",
  "alina-yuhnevich":
    "https://avatars.mds.yandex.net/get-lpc/17800094/eef64b26-9699-4b9d-969e-b86517a86827/orig?width=80&height=80",
  "alla-sotnikova":
    "https://avatars.mds.yandex.net/get-lpc/16405748/0847274e-0f48-4768-bb90-9b8f345acd69/orig?width=80&height=80",
  "anastasiya-plehanova":
    "https://avatars.mds.yandex.net/get-lpc/17495851/99bee8a0-72a5-41d1-9d32-df05ac890ecc/orig?width=80&height=80",
  "anatoliy-popko":
    "https://avatars.mds.yandex.net/get-lpc/17800094/4d67385d-8b1a-4c74-ba50-0eda0d52f7ab/orig?width=80&height=80",
  "darya-demina":
    "https://avatars.mds.yandex.net/get-lpc/16405748/393ef0bb-c091-4f68-b043-d0ed83c6c423/orig?width=80&height=80",
  "denis-roza":
    "https://avatars.mds.yandex.net/get-lpc/16405748/35173a9e-7f20-40ef-8563-c5b35419617e/orig?width=80&height=80",
  "ekaterina-fokina":
    "https://avatars.mds.yandex.net/get-lpc/17800094/7e92e311-e3b4-4847-a396-a78616342b92/orig?width=80&height=80",
  "ekaterina-siksimova":
    "https://avatars.mds.yandex.net/get-lpc/17800094/046734c3-f678-4f47-b927-7c1dc97123bd/orig?width=80&height=80",
  "elena-chernyh":
    "https://avatars.mds.yandex.net/get-lpc/17495851/0580cf42-cd53-4792-9c3b-9de701829de5/orig?width=80&height=80",
  "gulfiya-konovalova":
    "https://avatars.mds.yandex.net/get-lpc/17495851/ecb80c5f-4c5f-4873-8c46-a4c8abc9ce08/orig?width=80&height=80",
  "gulnara-gorishnyaya":
    "https://avatars.mds.yandex.net/get-lpc/17495851/8f70c8f6-97e8-4f4a-9d9f-9898698ad548/orig?width=164&height=164",
  "gyuzel-kazakova":
    "https://avatars.mds.yandex.net/get-lpc/17495851/80661036-1c3b-4d24-975d-6e8158a98c45/orig?width=80&height=80",
  "irina-osipova":
    "https://avatars.mds.yandex.net/get-lpc/17800094/5ce06339-c045-4c1e-907c-4bac2de743f4/orig?width=80&height=80",
  "kseniya-lomakina":
    "https://avatars.mds.yandex.net/get-lpc/17495851/4a03c494-89cf-459f-b183-1b0963187d37/orig?width=80&height=80",
  "lyudmila-pisarenko":
    "https://avatars.mds.yandex.net/get-lpc/17495851/2ede8e32-0db9-4524-b727-6a237f444fe0/orig?width=80&height=80",
  "mariya-burchakova-1":
    "https://avatars.mds.yandex.net/get-lpc/17495851/5e108b2d-8446-41a5-9579-bb4282face4d/orig?width=80&height=80",
  "mariya-gordanova":
    "https://avatars.mds.yandex.net/get-lpc/17800094/a398814c-0733-4e1c-be7d-410d792ed5d1/orig?width=80&height=80",
  "mariya-losyukova":
    "https://avatars.mds.yandex.net/get-lpc/16405748/b1ecf9f7-ab2a-4cbc-ac90-7c9ffa3fab30/orig?width=80&height=80",
  "olga-povorova":
    "https://avatars.mds.yandex.net/get-lpc/17800094/207f334b-3519-4da4-aa89-c0ad5982ff81/orig?width=80&height=80",
  "regina-utyasheva":
    "https://avatars.mds.yandex.net/get-lpc/16405748/ff035ff6-da30-4129-b560-030ce703b25b/orig?width=80&height=80",
  "sergey-isaev":
    "https://avatars.mds.yandex.net/get-lpc/17495851/0f99f8ea-215b-4c21-b0fc-7ae5f2c862a3/orig?width=80&height=80",
  "tatyana-samburova-1":
    "https://avatars.mds.yandex.net/get-lpc/17800094/09b846dd-55ae-4a46-b63f-0beb527f8bc3/orig?width=80&height=80",
  "tatyana-tiunova":
    "https://avatars.mds.yandex.net/get-lpc/17800094/c8127ef9-b1d8-45d2-ae5b-d57a73162701/orig?width=80&height=80",
  "viktoriya-kravtsova":
    "https://avatars.mds.yandex.net/get-lpc/17800094/b176ffa6-2579-4b0f-b63b-ea255c4d0f5d/orig?width=80&height=80",
  "yuliya-ermilova":
    "https://avatars.mds.yandex.net/get-lpc/17800094/bb6364ef-76b1-4f0a-b9f1-893eb286d4f7/orig?width=164&height=164",
  "yuliya-frolova":
    "https://avatars.mds.yandex.net/get-lpc/17800094/0a2a728c-9c53-46da-8086-921e665f4a06/orig?width=164&height=164",
};

/** Логотипы, которые по решению разработчика остаются именем, а не адресом. */
const FINAL_NAMES = new Set(["yandex"]);

/** Адрес картинки для выгрузки; имя без адреса возвращается как есть. */
export function hostedPhoto(field: "logo" | "photo", name: string): string {
  if (/^https?:\/\//.test(name)) return name;
  return (field === "logo" ? LOGOS : PHOTOS)[name] ?? name;
}

/** Имя, которому положено ехать именем: сторож на него не жалуется. */
export const isFinalName = (name: string): boolean => FINAL_NAMES.has(name);
