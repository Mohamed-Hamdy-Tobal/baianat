"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  title: string;
  className?: string;
};

export function ProductGallery({ images, title, className }: ProductGalleryProps) {
  const t = useTranslations("catalogue");
  const labelId = useId();
  const sources = images.length > 0 ? images : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const active = sources[activeIndex] ?? sources[0];
  const showThumbs = sources.length > 1;

  if (!active) {
    return (
      <div
        className={cn(
          "flex aspect-square items-center justify-center rounded-lg border border-border bg-surface text-sm text-text-muted",
          className,
        )}
      >
        {title}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3", className)} role="group" aria-labelledby={labelId}>
      <p id={labelId} className="sr-only">
        {t("product.gallery")}
      </p>

      <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-surface p-6 sm:p-8">
        <Image
          src={active}
          alt={title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain"
        />
      </div>

      {showThumbs ? (
        <ul className="flex flex-wrap gap-2" role="list">
          {sources.map((src, index) => {
            const selected = index === activeIndex;
            return (
              <li key={`${src}-${index}`}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                      event.preventDefault();
                      const delta = event.key === "ArrowRight" ? 1 : -1;
                      setActiveIndex((current) => (current + delta + sources.length) % sources.length);
                    }
                  }}
                  aria-label={`${title} ${index + 1}`}
                  aria-current={selected ? "true" : undefined}
                  className={cn(
                    "relative size-16 overflow-hidden rounded-md border bg-surface p-1 transition-colors sm:size-20",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    selected ? "border-primary" : "border-border hover:border-border-strong",
                  )}
                >
                  <Image src={src} alt="" fill sizes="80px" className="object-contain" />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
