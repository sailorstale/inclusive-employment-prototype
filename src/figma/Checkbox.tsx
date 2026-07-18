import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/*
  Figma: component «Checkbox Atom» (6526:1837), Size (L | S) × State
  (Default | Checked | Disabled). Только сам квадрат-атом, без подписи —
  подпись ставит тот, кто собирает форму.

  Настоящий <input type="checkbox"> (доступен с клавиатуры, читалка объявит
  состояние). Отмеченный — заливка control/active #1b1f2d с белой галкой.
*/

export type ControlSize = "L" | "S";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> & {
  size?: ControlSize;
};

export function Checkbox({
  size = "L",
  className,
  disabled,
  ...rest
}: Props) {
  const box = size === "L" ? "size-6" : "size-5";

  return (
    <label
      className={cn(
        "relative inline-grid shrink-0 place-content-center",
        box,
        disabled && "cursor-not-allowed",
        className,
      )}
    >
      <input
        type="checkbox"
        data-component={`Checkbox · ${size}`}
        disabled={disabled}
        className={cn(
          "peer size-full appearance-none rounded-[var(--radius-2xs)] border",
          "border-[color:var(--control-border)] bg-[color:var(--control-bg)]",
          "checked:border-transparent checked:bg-[color:var(--control-active)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--text-primary)] focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:border-[color:var(--control-border-disabled)] disabled:bg-[color:var(--control-bg-disabled)]",
        )}
        {...rest}
      />
      <Check
        aria-hidden
        strokeWidth={3}
        className="pointer-events-none absolute inset-0 m-auto hidden size-[68%] text-[color:var(--control-active-fg)] peer-checked:block"
      />
    </label>
  );
}
