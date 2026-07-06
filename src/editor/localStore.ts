// Общий localStorage-фоллбэк для стора: карта {ключ → T} под одним ключом +
// режим (сервер/локально). Защита от битого JSON и недоступного хранилища
// (quota / private mode). Один приём у правок, комментариев и решений унификации.

export type StoreMode = "server" | "local";

export function createLocalMapStore<T>(storageKey: string) {
  let mode: StoreMode = "local";
  return {
    read(): Record<string, T> {
      try {
        const raw = localStorage.getItem(storageKey);
        const parsed = raw ? (JSON.parse(raw) as Record<string, T>) : {};
        return parsed && typeof parsed === "object" ? parsed : {};
      } catch {
        return {};
      }
    },
    write(map: Record<string, T>): void {
      try {
        localStorage.setItem(storageKey, JSON.stringify(map));
      } catch {
        /* хранилище недоступно (quota / private mode) — некритично */
      }
    },
    getMode: (): StoreMode => mode,
    setMode(m: StoreMode): void {
      mode = m;
    },
  };
}
