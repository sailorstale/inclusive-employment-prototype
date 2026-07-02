import * as React from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// ImagePlaceholder (00b §2.8) — слот-заглушка под изображение (обычно 16:9)
// с подписью смысла картинки. Честно про пробелы — не выдаём за готовое.

export function ImagePlaceholder({
  caption,
  ratio = "16/9",
  className,
}: {
  caption?: React.ReactNode;
  ratio?: "16/9" | "4/3" | "1/1";
  className?: string;
}) {
  const aspect =
    ratio === "4/3" ? "aspect-[4/3]" : ratio === "1/1" ? "aspect-square" : "aspect-video";
  return (
    <figure data-component="ImagePlaceholder" className={cn("max-w-prose", className)}>
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/30 p-6 text-muted-foreground",
          aspect
        )}
      >
        <ImageIcon className="h-6 w-6" />
        {caption ? (
          <figcaption className="px-4 text-center text-sm">{caption}</figcaption>
        ) : null}
      </div>
    </figure>
  );
}
