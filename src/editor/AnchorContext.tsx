import * as React from "react";

// Контекст якоря ближайшей секции. Нужен, чтобы адрес блока (autoId) учитывал
// раздел: одинаковый текст в разных секциях получает разные id и правится
// независимо (риск H2 — коллизии одинаковых текстов).

const AnchorContext = React.createContext<string>("");

export function AnchorScope({
  anchor,
  children,
}: {
  anchor?: string;
  children: React.ReactNode;
}) {
  const parent = React.useContext(AnchorContext);
  // Вложенная секция без своего якоря наследует родительский.
  const value = anchor || parent;
  return (
    <AnchorContext.Provider value={value}>{children}</AnchorContext.Provider>
  );
}

export function useAnchor(): string {
  return React.useContext(AnchorContext);
}
