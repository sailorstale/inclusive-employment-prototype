import * as React from "react";
import { cn } from "@/lib/utils";
import { fieldClasses, type ControlState } from "./controlField";

/*
  Figma: component «Input» (6408:1055) из раздела Controls, Platform × State
  (Default | Disabled | Error). Однострочное текстовое поле формы.

  Настоящий <input>: state Disabled выключает поле, Error красит рамку в
  control/border-error. Живёт в формах (Feedback и т.п.).
*/

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  state?: ControlState;
};

export function Input({ state = "Default", className, disabled, ...rest }: Props) {
  return (
    <input
      data-component="Input"
      disabled={disabled ?? state === "Disabled"}
      className={fieldClasses(state, cn("h-12 px-4", className))}
      {...rest}
    />
  );
}
