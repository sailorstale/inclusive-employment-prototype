import * as React from "react";

// Шапка страницы (баннер с фото). Заголовок H1 живёт НАД контентом — во всю
// ширину экрана, поверх изображения, вместе с главным меню. Страница объявляет
// заголовок как раньше, через <PageHero>; контекст переносит его в баннер,
// который рисует оболочка (Layout → PageHeroBand). Механика та же, что у
// оглавления (lib/toc.tsx): страница не знает про раскладку, заголовок один.

/*
  Обложка баннера — картинка декоративная, подписи (alt) у неё нет. Поверх неё
  лежит заголовок страницы, он и несёт смысл; подпись повторяла бы его вторым
  голосом для скринридера.
*/
export type HeroCover = { src: string };

export type PageHeroData = {
  title: React.ReactNode;
  eyebrow?: React.ReactNode;
  /** Фото-подложка баннера. Пустой src — баннер рисует заглушку. */
  cover?: HeroCover;
  /** Лендинг — баннер выше остальных. */
  size?: "default" | "landing";
};

type PageHeroCtx = {
  data: PageHeroData | null;
  setData: (data: PageHeroData | null) => void;
};

const PageHeroContext = React.createContext<PageHeroCtx>({
  data: null,
  setData: () => {},
});

export function PageHeroProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<PageHeroData | null>(null);
  return (
    <PageHeroContext.Provider value={{ data, setData }}>
      {children}
    </PageHeroContext.Provider>
  );
}

export function usePageHeroSlot() {
  return React.useContext(PageHeroContext);
}

/** Текст узла — ключ зависимостей эффекта (заголовок обычно строка, но бывает и разметка). */
export function heroTextOf(node: React.ReactNode): string {
  if (node == null || node === false || node === true) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(heroTextOf).join("");
  if (React.isValidElement(node)) {
    return heroTextOf((node.props as { children?: React.ReactNode }).children);
  }
  return "";
}
