// Тип ссылки по строке `to`. Единый источник — раньше эти проверки копировались
// в SmartLink/PromoBanner несколькими независимыми регэкспами.

export const isExternalHref = (to: string): boolean => /^https?:\/\//.test(to);

export const isMailHref = (to: string): boolean => to.startsWith("mailto:");

/** Внешняя ссылка: http(s) или mailto — рендерится как <a>, а не router-Link. */
export const isExternalLink = (to: string): boolean =>
  isExternalHref(to) || isMailHref(to);
