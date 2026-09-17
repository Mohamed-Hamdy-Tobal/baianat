import type { HomeBannerSlide } from "../types/banner";

/**
 * Home banner slide config. Swap this module (or getHomeBanners) for a CMS/API later.
 * Imagery mirrors DummyJSON catalogue breadth: beauty, tech, fashion, home.
 */
export const HOME_BANNER_SLIDES: HomeBannerSlide[] = [
  {
    id: "beauty",
    imageSrc: "/banners/beauty.jpg",
    imageAltKey: "banner.slides.beauty.alt",
    titleKey: "banner.slides.beauty.title",
    descriptionKey: "banner.slides.beauty.description",
    ctaLabelKey: "banner.slides.beauty.cta",
    ctaHref: "/categories",
    contentPosition: "start",
  },
  {
    id: "tech",
    imageSrc: "/banners/tech.jpg",
    imageAltKey: "banner.slides.tech.alt",
    titleKey: "banner.slides.tech.title",
    descriptionKey: "banner.slides.tech.description",
    ctaLabelKey: "banner.slides.tech.cta",
    ctaHref: "/products",
    contentPosition: "center",
  },
  {
    id: "fashion",
    imageSrc: "/banners/fashion.jpg",
    imageAltKey: "banner.slides.fashion.alt",
    titleKey: "banner.slides.fashion.title",
    descriptionKey: "banner.slides.fashion.description",
    ctaLabelKey: "banner.slides.fashion.cta",
    ctaHref: "/products",
    contentPosition: "start",
  },
  {
    id: "home",
    imageSrc: "/banners/home.jpg",
    imageAltKey: "banner.slides.home.alt",
    titleKey: "banner.slides.home.title",
    descriptionKey: "banner.slides.home.description",
    ctaLabelKey: "banner.slides.home.cta",
    ctaHref: "/categories",
    contentPosition: "center",
  },
];
