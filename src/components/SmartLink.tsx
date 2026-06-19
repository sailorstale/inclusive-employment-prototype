import * as React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type SmartLinkProps = {
  to: string;
  children: React.ReactNode;
  className?: string;
  /** Подавить значок ↗ у внешних ссылок (например, в карточках с собственным значком). */
  hideExternalIcon?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

const linkStyle =
  "text-brand underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm";

/**
 * Внутренняя ссылка (путь начинается с «/») рендерится через react-router Link
 * (в HashRouter превращается в #/path). Внешняя (http…) — обычный <a> в новой
 * вкладке со значком ↗.
 */
export function SmartLink({
  to,
  children,
  className,
  hideExternalIcon,
  ...rest
}: SmartLinkProps) {
  const isExternal = /^https?:\/\//.test(to) || to.startsWith("mailto:");

  if (isExternal) {
    const isMail = to.startsWith("mailto:");
    return (
      <a
        href={to}
        className={cn(linkStyle, className)}
        target={isMail ? undefined : "_blank"}
        rel={isMail ? undefined : "noopener noreferrer"}
        {...rest}
      >
        {children}
        {!isMail && !hideExternalIcon && (
          <ArrowUpRight className="ml-0.5 inline-block h-3.5 w-3.5 align-text-top" />
        )}
      </a>
    );
  }

  return (
    <Link to={to} className={cn(linkStyle, className)} {...rest}>
      {children}
    </Link>
  );
}
