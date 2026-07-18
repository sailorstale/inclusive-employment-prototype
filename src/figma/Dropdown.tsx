import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { fieldClasses, type ControlState } from "./controlField";

/*
  Figma: component «Dropdown» (6408:1116) из раздела Controls, Platform × State
  (Default | Disabled | Error). Выбор одного варианта — «Выберите вариант».

  Настоящий <select> (доступен с клавиатуры и читалкой), стилизованный под поле;
  стрелка chevron-down справа. placeholder — первый неактивный пункт.
*/

type Props = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> & {
  state?: ControlState;
  /** Подпись-заглушка, пока ничего не выбрано. */
  placeholder?: string;
};

export function Dropdown({
  state = "Default",
  className,
  disabled,
  placeholder = "Выберите вариант",
  children,
  defaultValue,
  value,
  ...rest
}: Props) {
  const isDisabled = disabled ?? state === "Disabled";
  // Пустое значение по умолчанию — чтобы показался placeholder.
  const uncontrolled = value === undefined ? { defaultValue: defaultValue ?? "" } : { value };

  return (
    <div className={cn("relative w-full", className)}>
      <select
        data-component="Dropdown"
        disabled={isDisabled}
        className={fieldClasses(
          state,
          "h-12 appearance-none px-4 pr-11 disabled:cursor-not-allowed",
        )}
        {...uncontrolled}
        {...rest}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-[color:var(--text-secondary)]"
      />
    </div>
  );
}
