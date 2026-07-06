// Авторизация по общему паролю. Пароль (токен) хранится в localStorage и
// шлётся в заголовке X-Auth на все запросы к API. Экран входа (AuthGate)
// валидирует его через /api/auth.

const TOKEN_KEY = "inclusion-auth";

export function getToken(): string {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function setToken(t: string) {
  try {
    localStorage.setItem(TOKEN_KEY, t);
  } catch {
    /* ignore */
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export function authHeaders(token = getToken()): Record<string, string> {
  return token ? { "X-Auth": token } : {};
}

export type AuthState = {
  /** Сервер доступен? */
  reachable: boolean;
  /** Сервер требует пароль? */
  required: boolean;
  /** Текущий токен подходит? */
  ok: boolean;
};

/** Проверить статус авторизации (с заданным или сохранённым токеном). */
export async function checkAuth(token = getToken()): Promise<AuthState> {
  try {
    const r = await fetch("/api/auth", { headers: authHeaders(token) });
    if (!r.ok) return { reachable: true, required: true, ok: false };
    const data = (await r.json()) as { required: boolean; ok: boolean };
    return { reachable: true, required: data.required, ok: data.ok };
  } catch {
    // сервера нет — работаем локально, без замка
    return { reachable: false, required: false, ok: true };
  }
}

/** Fetch с паролем; при 401 сбрасывает токен и перезагружает (вернёт экран входа). */
export async function apiFetch(
  input: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = { ...(init.headers || {}), ...authHeaders() };
  const r = await fetch(input, { ...init, headers });
  if (r.status === 401) {
    clearToken();
    if (typeof window !== "undefined") window.location.reload();
  }
  return r;
}
