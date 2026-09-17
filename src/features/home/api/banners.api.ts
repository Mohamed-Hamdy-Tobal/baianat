import "server-only";

import { HOME_BANNER_SLIDES } from "../data/banners";
import type { HomeBannerSlide } from "../types/banner";

/** Returns home banner slides. Thin wrapper so this can become a remote fetch later. */
export async function getHomeBanners(): Promise<HomeBannerSlide[]> {
  return HOME_BANNER_SLIDES;
}
