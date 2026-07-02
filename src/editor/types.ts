// Редакторский слой — типы «склада правок».
// Каждый блок текста на сайте может иметь запись с вариантами сокращения
// и разбором («что убрали и почему»). Оригинал не дублируется здесь —
// он живёт в самой странице как children компонента <Editable> и берётся оттуда.

/** Тип замечания в разборе правки (определяет ярлык и цвет). */
export type RationaleKind =
  | "canc" // канцеляризм
  | "rep" // повтор
  | "long" // длинное предложение
  | "live" // живой язык
  | "cut" // сжатие / удаление лишнего
  | "tone" // замечание про тон
  | "course"; // убрать «курсовость» (модуль/урок/задание → как на сайте)

export type Rationale = {
  kind: RationaleKind;
  /** Короткое пояснение: что именно сделали в этом месте. */
  note: string;
};

export type VariantKey = "a" | "b";

export type Variant = {
  key: VariantKey;
  /** Подпись в переключателе, напр. «Вариант А · рекомендуем». */
  label: string;
  recommended?: boolean;
  /** Сокращённый текст блока (простой текст, без разметки). */
  text: string;
  /** Разбор: чем этот вариант лучше оригинала. */
  rationale: Rationale[];
};

/** Запись аудита: наш разбор оригинального текста + сокращённые варианты.
 *  Сопоставляется с блоком по тексту оригинала (не по id). */
export type AuditEntry = {
  /** Подсказка, на какой странице встречается (для справки). */
  page?: string;
  /** Точный оригинальный текст блока (нормализуется при сопоставлении). */
  original: string;
  variants: Variant[];
};

// --- Сохранённая правка (на сервере или в localStorage) ---

export type EditKind = "variant" | "custom";

/** Статус переноса правки разработчиком в реальный сайт.
 *  new → applied (внесена) → verified (проверена). rollback — запрошен откат
 *  уже внесённой правки (вернуть оригинал в боевом сайте). */
export type EditStatus = "new" | "applied" | "verified" | "rollback";

export type EditRecord = {
  id: string;
  /** Маршрут страницы, напр. /companies/legal/benefits. */
  page?: string | null;
  /** Якорь ближайшей секции (если есть) — для адреса в коде. */
  anchor?: string | null;
  /** Файл-исходник (для подсказки разработчику). */
  file?: string | null;
  /** Тип блока: paragraph | lead | heading | li … */
  blockType?: string | null;
  kind: EditKind;
  variantKey?: VariantKey | null;
  /** Итоговый показываемый текст блока. */
  text: string;
  /** Снимок оригинала на момент правки (для «было→стало» и проверки устаревания). */
  original?: string | null;
  status: EditStatus;
  editedAt: string;
  appliedAt?: string | null;
  verifiedAt?: string | null;
  rollbackAt?: string | null;
};

/** Человекочитаемые ярлыки для типов замечаний. */
export const RATIONALE_LABELS: Record<RationaleKind, string> = {
  canc: "Канцеляризм",
  rep: "Повтор",
  long: "Длинное предложение",
  live: "Живой язык",
  cut: "Сжатие",
  tone: "Тон",
  course: "Курс → сайт",
};
