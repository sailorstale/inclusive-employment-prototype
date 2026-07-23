/*
  Белый список протоколов для ссылок — защита от javascript: и подобного.

  Вынесено отдельным модулем, потому что нужно ДВУМ мирам: рендеру (richText.tsx,
  React) и сборке выгрузки (contentTree.ts, чистые данные без React). Дублировать
  проверку безопасности в двух местах нельзя: разъедутся при первой же правке.
*/

const SAFE_URL = /^(https?:\/\/|mailto:|\/|#)/i;

export function safeHref(url: string): string | null {
  const u = url.trim();
  return SAFE_URL.test(u) ? u : null;
}
