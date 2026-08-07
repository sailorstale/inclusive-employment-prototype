import * as React from "react";
import { onVariantsLoaded } from "./variantsLoad";

/*
  ПЕРЕРИСОВКА, КОГДА ПРИЕХАЛИ РАЗБОРЫ.

  Реестры вариантов грузятся отдельным куском по требованию (variantsLoad.ts).
  Первый раз компонент рисуется без вариантов — данных ещё нет. Этот хук
  подписывает компонент на событие «кусок приехал» и просит перерисоваться:
  иначе варианты появились бы только после следующего клика.

  Хук ничего не возвращает: за сами варианты отвечают getVariantsFor и
  getSourceVariantsFor, а здесь только повод нарисовать заново.
*/
export function useVariantsTick(): void {
  const [, force] = React.useReducer((n: number) => n + 1, 0);
  React.useEffect(() => onVariantsLoaded(force), []);
}
