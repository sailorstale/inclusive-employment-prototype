// Классы прозы вынесены отдельно, чтобы их использовали и Prose-компоненты,
// и редакторская обёртка (Editable) без циклического импорта.

export const PROSE_CLASSES = {
  paragraph: "leading-relaxed text-foreground",
  lead: "max-w-prose text-lg leading-relaxed text-foreground",
  footnote: "max-w-prose text-[0.8125rem] leading-relaxed text-muted-foreground",
} as const;

export type ProseKind = keyof typeof PROSE_CLASSES;
