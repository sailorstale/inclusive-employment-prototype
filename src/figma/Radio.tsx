import * as React from "react";
import { cn } from "@/lib/utils";
import type { ControlSize } from "./Checkbox";

/*
  Figma: component «Radio Atom» (6526:1838), Size (L | S) × State
  (Default | Checked | Disabled). Только сам кружок-атом, без подписи.

  Настоящий <input type="radio"> — выбор одного из группы (общий name).
  Отмеченный — рамка control/active + точка того же цвета внутри.
*/

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> & {
  size?: ControlSize;
};

export function Radio({ size = "L", className, disabled, ...rest }: Props) {
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
        type="radio"
        data-component={`Radio · ${size}`}
        disabled={disabled}
        className={cn(
          "peer size-full appearance-none rounded-full border",
          "border-[color:var(--control-border)] bg-[color:var(--control-bg)]",
          "checked:border-[color:var(--control-active)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--text-primary)] focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:border-[color:var(--control-border-disabled)] disabled:bg-[color:var(--control-bg-disabled)]",
        )}
        {...rest}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 m-auto hidden size-[42%] rounded-full bg-[color:var(--control-active)] peer-checked:block"
      />
    </label>
  );
}
