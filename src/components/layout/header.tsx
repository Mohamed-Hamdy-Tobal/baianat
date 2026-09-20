import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { DesktopNav } from "@/components/layout/desktop-nav";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { MobileNav } from "@/components/layout/mobile-nav";
import { AuthHeaderControl } from "@/features/auth/components/auth-header-control";
import { CartHeaderButton } from "@/features/cart/components/cart-header-button";
import { WishlistHeaderButton } from "@/features/wishlist/components/wishlist-header-button";
import { Link } from "@/i18n/navigation";
import { MainContainer } from "./main-container";

export async function Header() {
  const tCommon = await getTranslations("common");

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/90 shadow-[0_1px_0_0_rgba(15,23,42,0.03)] backdrop-blur-md supports-backdrop-filter:bg-surface/80">
      <MainContainer className="flex h-17 items-center gap-4">
        <Link
          href="/"
          className="group shrink-0 text-base md:text-xl font-semibold tracking-[0.04em] text-text transition-all duration-300 hover:tracking-[0.08em] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface motion-reduce:transition-none motion-reduce:hover:tracking-[0.04em]"
        >
          <span className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:group-hover:translate-y-0">
            {tCommon("brand.name")}
          </span>
        </Link>

        <DesktopNav className="ms-3" />

        <div className="ms-auto flex items-center gap-1">
          <WishlistHeaderButton />
          <CartHeaderButton />
          <AuthHeaderControl className="ms-0.5" />

          <Suspense fallback={null}>
            <LanguageSwitcher className="ms-0.5" />
          </Suspense>

          <MobileNav />
        </div>
      </MainContainer>
    </header>
  );
}
