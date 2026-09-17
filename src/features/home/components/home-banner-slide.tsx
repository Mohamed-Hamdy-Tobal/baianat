"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import type { HomeBannerSlide } from "@/features/home/types/banner";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type HomeBannerSlideViewProps = {
  slide: HomeBannerSlide;
  active: boolean;
  priority?: boolean;
};

const POSITION_CLASS: Record<HomeBannerSlide["contentPosition"], string> = {
  start: "items-start text-start",
  center: "items-center text-center",
  end: "items-end text-end",
};

export function HomeBannerSlideView({ slide, active, priority = false }: HomeBannerSlideViewProps) {
  const t = useTranslations("home");

  return (
    <div
      className={cn(
        "absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none",
        active ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!active}
    >
      <Image
        src={slide.imageSrc}
        alt={active ? t(slide.imageAltKey) : ""}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
      />

      <div
        className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/45 to-slate-950/25"
        aria-hidden
      />

      <div className="relative z-10 flex h-full items-end pb-16 pt-20 sm:items-center sm:pb-0 sm:pt-0">
        <div
          className={cn(
            "container mx-auto flex w-full flex-col gap-4 px-4 sm:px-6",
            POSITION_CLASS[slide.contentPosition],
          )}
        >
          <div
            className={cn(
              "flex max-w-xl flex-col gap-3",
              slide.contentPosition === "center" && "items-center",
              slide.contentPosition === "end" && "items-end",
              active
                ? "translate-y-0 opacity-100 transition duration-700 delay-100 motion-reduce:transition-none"
                : "translate-y-3 opacity-0",
            )}
          >
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t(slide.titleKey)}
            </h2>
            <p className="max-w-lg text-base text-white/85 sm:text-lg">{t(slide.descriptionKey)}</p>
            <Button asChild size="lg" className="mt-1 w-fit">
              <Link href={slide.ctaHref}>{t(slide.ctaLabelKey)}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
