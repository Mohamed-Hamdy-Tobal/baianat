export type BannerContentPosition = "start" | "center" | "end";

export type HomeBannerSlide = {
  id: string;
  imageSrc: string;
  imageAltKey: string;
  titleKey: string;
  descriptionKey: string;
  ctaLabelKey: string;
  ctaHref: "/products" | "/categories";
  contentPosition: BannerContentPosition;
};
