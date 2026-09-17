"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { HomeBannerSlideView } from "@/features/home/components/home-banner-slide";
import type { HomeBannerSlide } from "@/features/home/types/banner";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 5000;

type HomeBannerSliderProps = {
  slides: HomeBannerSlide[];
  className?: string;
};

export function HomeBannerSlider({ slides, className }: HomeBannerSliderProps) {
  const t = useTranslations("home");
  const locale = useLocale();
  const labelId = useId();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);

  const count = slides.length;
  const canSlide = count > 1;

  const goTo = useCallback(
    (next: number) => {
      if (!canSlide) return;
      setIndex(((next % count) + count) % count);
    },
    [canSlide, count],
  );

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (!canSlide || paused) return;

    const reduceMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [canSlide, paused, count, locale]);

  if (count === 0) return null;

  return (
    <section
      ref={regionRef}
      className={cn("relative -mt-8 w-full overflow-hidden bg-slate-900", className)}
      aria-roledescription="carousel"
      aria-labelledby={labelId}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
      onKeyDown={(event) => {
        if (!canSlide) return;
        const isRtl = locale === "ar";
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          if (isRtl) goNext();
          else goPrev();
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          if (isRtl) goPrev();
          else goNext();
        }
      }}
      tabIndex={0}
    >
      <p id={labelId} className="sr-only">
        {t("banner.carouselLabel")}
      </p>

      <div className="relative aspect-[16/10] min-h-[22rem] w-full sm:aspect-[21/9] sm:min-h-[26rem] lg:min-h-[32rem]">
        {slides.map((slide, slideIndex) => (
          <HomeBannerSlideView
            key={slide.id}
            slide={slide}
            active={slideIndex === index}
            priority={slideIndex === 0}
          />
        ))}
      </div>

      {canSlide ? (
        <>
          <div className="pointer-events-none absolute inset-y-0 start-0 end-0 z-20 hidden md:block">
            <CarouselButton
              label={t("banner.previous")}
              onClick={goPrev}
              direction="prev"
              className="pointer-events-auto absolute start-3 top-1/2 -translate-y-1/2 lg:start-6"
            />
            <CarouselButton
              label={t("banner.next")}
              onClick={goNext}
              direction="next"
              className="pointer-events-auto absolute end-3 top-1/2 -translate-y-1/2 lg:end-6"
            />
          </div>

          <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center gap-2">
            {slides.map((slide, slideIndex) => {
              const selected = slideIndex === index;
              return (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={t("banner.goToSlide", { slide: slideIndex + 1 })}
                  aria-current={selected ? "true" : undefined}
                  onClick={() => goTo(slideIndex)}
                  className={cn(
                    "h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
                    selected ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80",
                  )}
                />
              );
            })}
          </div>
        </>
      ) : null}

      <div className="sr-only" aria-live="polite">
        {t(slides[index]?.titleKey ?? "banner.slides.beauty.title")}
      </div>
    </section>
  );
}

function CarouselButton({
  label,
  onClick,
  direction,
  className,
}: {
  label: string;
  onClick: () => void;
  direction: "prev" | "next";
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full border border-white/30 bg-slate-950/40 text-white backdrop-blur-sm transition-colors",
        "hover:bg-slate-950/60",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
        className,
      )}
    >
      {direction === "prev" ? (
        <ChevronLeft aria-hidden className="rtl:rotate-180" />
      ) : (
        <ChevronRight aria-hidden className="rtl:rotate-180" />
      )}
    </button>
  );
}
