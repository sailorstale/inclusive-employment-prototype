// Метрики и пословный диф для инспектора — считаются на лету из
// оригинала и варианта, чтобы аудит не хранил их руками.

export type DiffSeg = { type: "eq" | "del" | "ins"; text: string };

function tokenize(text: string): string[] {
  const t = text.trim();
  return t ? t.split(/\s+/) : [];
}

/** Пословный diff на основе наибольшей общей подпоследовательности. */
export function wordDiff(original: string, revised: string): DiffSeg[] {
  const a = tokenize(original);
  const b = tokenize(revised);
  const n = a.length;
  const m = b.length;

  // lcs[i][j] — длина НОП суффиксов a[i..] и b[j..]
  const lcs: number[][] = Array.from({ length: n + 1 }, () =>
    new Array<number>(m + 1).fill(0)
  );
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] =
        a[i] === b[j]
          ? lcs[i + 1][j + 1] + 1
          : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const segs: DiffSeg[] = [];
  const push = (type: DiffSeg["type"], word: string) => {
    const last = segs[segs.length - 1];
    if (last && last.type === type) last.text += " " + word;
    else segs.push({ type, text: word });
  };

  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      push("eq", a[i]);
      i++;
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      push("del", a[i]);
      i++;
    } else {
      push("ins", b[j]);
      j++;
    }
  }
  while (i < n) push("del", a[i++]);
  while (j < m) push("ins", b[j++]);
  return segs;
}

export function countWords(text: string): number {
  return tokenize(text).length;
}

export function countSentences(text: string): number {
  const m = text.match(/[.!?…]+(\s|$)/g);
  if (m) return m.length;
  return text.trim() ? 1 : 0;
}

/** Время чтения в секундах (≈180 слов/мин). */
export function readSeconds(text: string): number {
  return Math.max(1, Math.round((countWords(text) / 180) * 60));
}

/** Насколько короче вариант по числу символов без пробелов, в процентах. */
export function lengthDeltaPct(original: string, revised: string): number {
  const o = original.replace(/\s+/g, "").length;
  const r = revised.replace(/\s+/g, "").length;
  if (!o) return 0;
  return Math.round((1 - r / o) * 100);
}
