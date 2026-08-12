/*
  Подбор логотипа организации для строки авторства Quote.

  Зачем: в источнике организация упомянута словами — ссылкой
  «[Фонд борьбы с инсультом ОРБИ](https://orbifond.ru/)» или названием в
  кавычках «Действуй!». А компоненту Quote нужен слаг файла
  public/figma/logos/<слаг>.png. Здесь мост между одним и другим.

  Каталог соответствий «название → слаг» лежит рядом с картинками
  (_index.json, 588 записей). Грузим его один раз и держим промис: логотипы
  появятся сразу после загрузки, повторных запросов не будет.

  ОСТОРОЖНО с ложными срабатываниями. Среди названий фондов много обычных слов
  («Вера», «Жизнь», «Свет», «Контакт»), поэтому искать организацию во всём
  тексте цитаты нельзя — на первом же «жизнь» прилетит чужой логотип. Ищем
  только там, где организация названа ЯВНО: текст markdown-ссылки либо название
  в кавычках. Это и есть весь допуск на угадывание.
*/

import * as React from "react";

/*
  ЗАГЛУШКА ВМЕСТО ЛОГОТИПА (stub) — то же самое, что и у фото автора ниже.
  Набор логотипов выгружен из реестра НКО, а в цитатах на «Шаге 3» говорят люди
  из коммерческих компаний: знаков Сбербанка и «Леманы ПРО» в наборе нет и
  взяться им неоткуда. Чтобы у цитаты уже сейчас было имя файла, по слагу лежит
  серый прямоугольник — ровно такой, какой рисуется на месте отсутствующего
  логотипа. Придёт настоящий знак — файл перезаписывается по тому же имени, и
  ни код, ни выгрузка не меняются.
*/
export type LogoEntry = {
  slug: string;
  name: string;
  ogrn?: string;
  stub?: boolean;
};

/** Организационно-правовые формы — они не различают фонды, при сверке снимаем. */
const LEGAL_FORM =
  /^(благотворительн\p{L}*|автономн\p{L}*|некоммерческ\p{L}*|общественн\p{L}*|региональн\p{L}*|межрегиональн\p{L}*|всероссийск\p{L}*|организац\p{L}*|учрежден\p{L}*|фонд\p{L}*|бф|ано|нко|роо|мроо|ооо|оо)$/iu;

/** Приводим к сравнимому виду: без кавычек, регистра, ё и служебных форм. */
function normalize(raw: string): string {
  const words = raw
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[«»""''""„“”‘’]/g, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  // Форму снимаем только с начала: «Фонд борьбы с инсультом ОРБИ» → «борьбы с
  // инсультом ОРБИ». Внутри названия слово «фонд» может быть значащим.
  let i = 0;
  while (i < words.length && LEGAL_FORM.test(words[i])) i++;
  return words.slice(i).join(" ");
}

let cache: Promise<LogoEntry[]> | null = null;

export function loadLogoIndex(): Promise<LogoEntry[]> {
  if (!cache)
    cache = fetch(`${import.meta.env.BASE_URL}figma/logos/_index.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`Каталог логотипов не отдался: ${r.status}`);
        return r.json();
      })
      .then((raw: unknown) =>
        Array.isArray(raw)
          ? (raw as LogoEntry[]).filter((e) => e && e.slug && e.name)
          : [],
      )
      .catch((e) => {
        // Не роняем страницу: без каталога просто не будет логотипов.
        console.error("[logos]", e);
        return [];
      });
  return cache;
}

/**
 * Слаг логотипа по названию организации. Совпадение — по нормализованному
 * названию: точное либо как отдельная последовательность слов внутри строки
 * («…с инсультом ОРБИ» → «ОРБИ»). Из нескольких берём самое длинное совпадение
 * — оно конкретнее. Короткие названия (< 3 знаков) не ищем: слишком шумно.
 */
export function findEntry(orgName: string, index: LogoEntry[]): LogoEntry | undefined {
  const hay = normalize(orgName);
  if (!hay) return undefined;
  let best: { e: LogoEntry; len: number } | undefined;
  for (const e of index) {
    const n = normalize(e.name);
    if (n.length < 3) continue;
    const hit = hay === n || new RegExp(`(^| )${escapeRe(n)}( |$)`).test(hay);
    if (hit && (!best || n.length > best.len)) best = { e, len: n.length };
  }
  return best?.e;
}

export function findSlug(orgName: string, index: LogoEntry[]): string | undefined {
  return findEntry(orgName, index)?.slug;
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Слова строки без снятия правовой формы — нужны, чтобы найти ГРАНИЦЫ названия. */
const plainWords = (raw: string) =>
  raw
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[«»""''„“”‘’]/g, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

/*
  ОПИСАНИЕ ВОКРУГ НАЗВАНИЯ. В источнике организация нередко названа целой фразой
  и в падеже: «центра адаптации людей с инвалидностью Мастер ОК», «фонде борьбы
  с инсультом ОРБИ». Поле org — подпись к логотипу, её читает вслух скринридер,
  и там нужно само название, а не кусок предложения.

  Каталог логотипов даёт только ГРАНИЦЫ: где в этой фразе название начинается и
  кончается. Написание берём из исходного текста, а не из каталога, — иначе
  «ОРБИ» стало бы «Орби», «Лучшие друзья» — «ЛУЧШИЕ ДРУЗЬЯ», а «Действуй!»
  потерял бы восклицательный знак: в каталоге лежит и такое.
*/
export function trimToCatalogName(orgName: string, index: LogoEntry[]): string {
  const e = findEntry(orgName, index);
  if (!e) return orgName;
  const want = plainWords(e.name);
  const count = want.split(" ").length;
  const words = orgName.split(/\s+/).filter(Boolean);
  for (let i = 0; i + count <= words.length; i++) {
    const window = words.slice(i, i + count).join(" ");
    if (plainWords(window) === want)
      return window.replace(/^[«„"'(,\s]+|[»“”"'),.;:\s]+$/gu, "");
  }
  return orgName;
}

/*
  Каноническое название там, где каталог хранит и падежную форму: у
  «laboratoriya-kasperskogo» записаны обе — «Лаборатории Касперского» и
  «Лаборатория Касперского», — и по тексту находится падежная. Для подписи к
  логотипу нужен именительный.
*/
export const CANON_ORG: Record<string, string> = {
  "laboratoriya-kasperskogo": "Лаборатория Касперского",
};

/*
  ОРГАНИЗАЦИЯ, НАЗВАННАЯ ПРОСТО СЛОВАМИ В ДОЛЖНОСТИ.

  Обычно её видно по ссылке или по кавычкам, и этого хватает. Но в двух цитатах
  компания названа обычными словами: «директор по персоналу АШАН Ритейл Россия»,
  «директор департамента людей Бургер Кинг Россия». Ни ссылки, ни кавычек нет —
  организация не находилась вовсе, и место под логотип даже не появлялось.

  Ищем ТОЛЬКО в строке должности и ТОЛЬКО названия из двух и более слов. Это и
  есть весь допуск: среди названий фондов много обычных слов («Вера», «Жизнь»,
  «Свет»), и по одному слову подбор притянул бы чужой логотип с первого же
  совпадения. Составное название такой беды не даёт.
*/
export function findOrgInRole(
  role: string,
  index: LogoEntry[],
): { slug: string; name: string } | undefined {
  const hay = normalize(role);
  if (!hay) return undefined;
  let best: { slug: string; name: string; len: number } | undefined;
  for (const e of index) {
    const n = normalize(e.name);
    if (!n.includes(" ")) continue;
    if (!new RegExp(`(^| )${escapeRe(n)}( |$)`).test(hay)) continue;
    if (!best || n.length > best.len) best = { slug: e.slug, name: e.name, len: n.length };
  }
  return best && { slug: best.slug, name: best.name };
}

/** Упомянут ли Яндекс — у него логотип круглый и файлом не задаётся. */
export const mentionsYandex = (texts: string[]) =>
  texts.some((t) => /яндекс/i.test(t));

/**
 * Каталог логотипов для рендера. До загрузки — пустой массив: цитата рисуется
 * сразу, логотип подставляется следующим кадром. Промис общий на все вызовы,
 * поэтому запрос ровно один, сколько бы цитат ни было на странице.
 */
export function useLogoIndex(): LogoEntry[] {
  const [index, setIndex] = React.useState<LogoEntry[]>([]);
  React.useEffect(() => {
    let alive = true;
    loadLogoIndex().then((i) => {
      if (alive) setIndex(i);
    });
    return () => {
      alive = false;
    };
  }, []);
  return index;
}

/*
  ФОТО АВТОРА ЦИТАТЫ — ровно тот же механизм, что и логотипы, только по ИМЕНИ
  человека. Каталог public/figma/avatars/_index.json: слаг → имя. Назначили блоку
  «Цитату» → из строки авторства достаём имя → подставляем аватар. Нет имени в
  каталоге — цитата рисуется без фото и в превью появляется заметка (страж).
*/
/*
  ЗАГЛУШКА ВМЕСТО ФОТО (stub). Семь человек в цитатах пока без снимка: заказчик
  их ещё не прислал. Но разработчику имя файла нужно уже сейчас — в выгрузке
  JSON у цитаты стоит слаг фото, и если его нет, у цитаты нет и поля. Чтобы
  структура выгрузки не менялась задним числом, слаги придуманы заранее, а по
  ним лежат одинаковые серые картинки с силуэтом.

  Придёт настоящий снимок — файл просто перезаписывается по тому же имени, и
  пометка stub снимается. Ни код, ни выгрузка при этом не меняются.

  Пометка нужна только людям: чтобы одной командой увидеть, чьи фото ещё
  ненастоящие. На подбор фото она не влияет.
*/
export type AvatarEntry = { slug: string; name: string; stub?: boolean };

let avatarCache: Promise<AvatarEntry[]> | null = null;

export function loadAvatarIndex(): Promise<AvatarEntry[]> {
  if (!avatarCache)
    avatarCache = fetch(`${import.meta.env.BASE_URL}figma/avatars/_index.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`Каталог аватарок не отдался: ${r.status}`);
        return r.json();
      })
      .then((raw: unknown) =>
        Array.isArray(raw)
          ? (raw as AvatarEntry[]).filter((e) => e && e.slug && e.name)
          : [],
      )
      .catch((e) => {
        console.error("[avatars]", e);
        return [];
      });
  return avatarCache;
}

/**
 * Каталожное имя без номера варианта: у одного человека бывает два снимка
 * («Мария Бурчакова 1», «Мария Бурчакова 2»). Номер — служебный, к имени
 * отношения не имеет, и из-за него имя не совпадало с текстом вовсе.
 */
const catalogName = (name: string) => normalize(name).replace(/\s+\d+$/, "");

/**
 * Отличаются ли два слова не больше чем на одну букву (вставка, пропуск или
 * замена). Нужно для расхождений в написании фамилии между текстом и каталогом.
 */
function withinOneEdit(a: string, b: string): boolean {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (a.length < b.length) j++;
    else {
      i++;
      j++;
    }
  }
  return true;
}

/**
 * Слаг аватара по имени автора. Сверяем нормализованные имена: точное
 * совпадение или совпадение по набору слов (порядок «Имя Фамилия» /
 * «Фамилия Имя» не важен, отчество в тексте не мешает). Имена короче 3 знаков
 * не ищем.
 */
export function findPhotoSlug(
  author: string,
  index: AvatarEntry[],
): string | undefined {
  const want = normalize(author);
  if (want.length < 3) return undefined;
  const words = [...new Set(want.split(" ").filter(Boolean))];
  const wordSet = new Set(words);
  for (const e of index) {
    if (catalogName(e.name) === want) return e.slug;
  }
  // Мягкое совпадение: все слова каталожного имени есть в имени автора.
  for (const e of index) {
    const parts = catalogName(e.name).split(" ").filter(Boolean);
    if (parts.length >= 2 && parts.every((p) => wordSet.has(p))) return e.slug;
  }
  /*
    Разное написание фамилии. В тексте «Ольга Алексеевна Поварова», в каталоге
    «Ольга Поворова» — одна буква, и фото не находилось, хотя лежит в папке.
    Допуск узкий, чтобы не подставить чужое лицо: длинные слова сверяем с
    точностью до одной буквы, короткие (имена вроде «Ольга») — буква в букву,
    и берём фото, только если подошла РОВНО одна карточка каталога.
  */
  const near = index.filter((e) => {
    const parts = catalogName(e.name).split(" ").filter(Boolean);
    if (parts.length < 2) return false;
    return parts.every((p) =>
      p.length >= 5
        ? words.some((w) => withinOneEdit(p, w))
        : wordSet.has(p),
    );
  });
  return near.length === 1 ? near[0].slug : undefined;
}

export function useAvatarIndex(): AvatarEntry[] {
  const [index, setIndex] = React.useState<AvatarEntry[]>([]);
  React.useEffect(() => {
    let alive = true;
    loadAvatarIndex().then((i) => {
      if (alive) setIndex(i);
    });
    return () => {
      alive = false;
    };
  }, []);
  return index;
}
