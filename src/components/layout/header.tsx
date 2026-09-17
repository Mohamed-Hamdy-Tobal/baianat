import { Heart, ShoppingCart } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { DesktopNav } from "@/components/layout/desktop-nav";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { MainContainer } from "./main-container";

export async function Header() {
  const tCommon = await getTranslations("common");
  const tNav = await getTranslations("navigation");

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/90 shadow-[0_1px_0_0_rgba(15,23,42,0.03)] backdrop-blur-md supports-backdrop-filter:bg-surface/80">
      <MainContainer className="flex h-17 items-center gap-4">
        <Link
          href="/"
          className="group shrink-0 text-xl font-semibold tracking-[0.04em] text-text transition-all duration-300 hover:tracking-[0.08em] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface motion-reduce:transition-none motion-reduce:hover:tracking-[0.04em]"
        >
          <span className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:group-hover:translate-y-0">
            {tCommon("brand.name")}
          </span>
        </Link>

        <DesktopNav className="ms-3" />

        <div className="ms-auto flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled
            aria-label={tNav("wishlist")}
            className="hidden transition-transform duration-200 hover:scale-105 sm:inline-flex motion-reduce:hover:scale-100"
          >
            <Heart aria-hidden />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled
            aria-label={tNav("cart")}
            className="hidden transition-transform duration-200 hover:scale-105 sm:inline-flex motion-reduce:hover:scale-100"
          >
            <ShoppingCart aria-hidden />
          </Button>

          <Suspense fallback={null}>
            <LanguageSwitcher className="ms-0.5" />
          </Suspense>

          <MobileNav />
        </div>
      </MainContainer>
    </header>
  );
}
