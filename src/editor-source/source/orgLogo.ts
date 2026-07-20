/*
  Подбор логотипа организации для строки авторства Quote.

  Зачем: в источнике организация упомянута словами — ссылкой
  «[Фонд борьбы с инсультом ОРБИ](https://orbifond.ru/)» или названием в
  кавычках «Действуй!». А компоненту Quote нужен слаг файла
  public/figma/logos/<слаг>.png. Здесь мост между одним и другим.

  Каталог соответствий «название → слаг» лежит рядом с картинками
  (_index.json, 577 записей). Грузим его один раз и держим промис: логотипы
  появятся сразу после загрузки, повторных запросов не будет.

  ОСТОРОЖНО с ложными срабатываниями. Среди названий фондов много обычных слов
  («Вера», «Жизнь», «Свет», «Контакт»), поэтому искать организацию во всём
  тексте цитаты нельзя — на первом же «жизнь» прилетит чужой логотип. Ищем
  только там, где организация названа ЯВНО: текст markdown-ссылки либо название
  в кавычках. Это и есть весь допуск на угадывание.
*/

import * as React from "react";

type LogoEntry = { slug: string; name: string; ogrn?: string };

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
export function findSlug(orgName: string, index: LogoEntry[]): string | undefined {
  const hay = normalize(orgName);
  if (!hay) return undefined;
  let best: { slug: string; len: number } | undefined;
  for (const e of index) {
    const n = normalize(e.name);
    if (n.length < 3) continue;
    const hit = hay === n || new RegExp(`(^| )${escapeRe(n)}( |$)`).test(hay);
    if (hit && (!best || n.length > best.len)) best = { slug: e.slug, len: n.length };
  }
  return best?.slug;
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Организация, названная в блоках цитаты ЯВНО. Два признака, оба однозначные:
 * текст markdown-ссылки и название в кавычках. Свободный текст не разбираем.
 */
export function orgFromText(texts: string[]): string | undefined {
  for (const t of texts) {
    const link = t.match(/\[([^\]]+)\]\((?:https?:)?\/\/[^)]+\)/);
    if (link) return link[1].trim();
  }
  for (const t of texts) {
    const quoted = t.match(/[«"„“]([^»"“”]{2,60})[»"“”]/);
    if (quoted) return quoted[1].trim();
  }
  return undefined;
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
