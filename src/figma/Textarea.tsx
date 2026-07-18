import * as React from "react";
import { cn } from "@/lib/utils";
import { fieldClasses, type ControlState } from "./controlField";

/*
  Figma: component «Textarea» (6408:1149) из раздела Controls, Platform × State
  (Default | Disabled | Error). Многострочное поле — «Расскажите о вашем опыте».

  Как Input, но выше и с выравниванием текста по верху; тянется по вертикали.
*/

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  state?: ControlState;
};

export function Textarea({
  state = "Default",
  className,
  disabled,
  rows = 4,
  ...rest
}: Props) {
  return (
    <textarea
      data-component="Textarea"
      rows={rows}
      disabled={disabled ?? state === "Disabled"}
      className={fieldClasses(state, cn("min-h-32 resize-y px-4 py-3", className))}
      {...rest}
    />
  );
}
