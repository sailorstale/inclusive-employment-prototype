import * as React from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { fieldClasses, type ControlState } from "./controlField";

/*
  Figma: component «Search» (6010:79212) из раздела Controls, Platform × State
  (Default | Filled | Disabled | Error). Поле поиска.

  Иконка лупы слева, поле, крестик-очистка справа — он показывается, только
  когда в поле что-то есть (состояние Filled в Figma). Работает и управляемо
  (value + onChange), и само по себе.
*/

type Props = {
  state?: ControlState;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  className?: string;
  "aria-label"?: string;
};

export function Search({
  state = "Default",
  placeholder = "Поиск…",
  value,
  defaultValue,
  disabled,
  onChange,
  onClear,
  className,
  ...rest
}: Props) {
  const [inner, setInner] = React.useState(defaultValue ?? "");
  const isControlled = value !== undefined;
  const text = isControlled ? value : inner;
  const isDisabled = disabled ?? state === "Disabled";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInner(e.target.value);
    onChange?.(e);
  };
  const handleClear = () => {
    if (!isControlled) setInner("");
    onClear?.();
  };

  return (
    <div
      data-component="Search"
      className={fieldClasses(
        state,
        cn(
          "flex h-12 items-center gap-3 px-4",
          "focus-within:ring-2 focus-within:ring-[color:var(--text-primary)]",
          className,
        ),
      )}
    >
      <SearchIcon
        aria-hidden
        className="size-5 shrink-0 text-[color:var(--text-secondary)]"
      />
      <input
        type="search"
        value={text}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={isDisabled}
        className="min-w-0 flex-1 bg-transparent text-inherit outline-none placeholder:text-[color:var(--control-fg-placeholder)] [&::-webkit-search-cancel-button]:appearance-none"
        {...rest}
      />
      {text && !isDisabled ? (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Очистить"
          className="shrink-0 text-[color:var(--text-secondary)] transition-colors hover:text-[color:var(--text-primary)]"
        >
          <X className="size-5" />
        </button>
      ) : null}
    </div>
  );
}
