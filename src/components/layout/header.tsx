import { Heart, ShoppingCart } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { DesktopNav } from "@/components/layout/desktop-nav";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export async function Header() {
  const tCommon = await getTranslations("common");
  const tNav = await getTranslations("navigation");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-text transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface motion-reduce:transition-none"
        >
          {tCommon("brand.name")}
        </Link>

        <DesktopNav className="ms-6" />

        <div className="ms-auto flex items-center gap-1">
          <Button type="button" variant="ghost" size="icon" disabled aria-label={tNav("wishlist")} className="hidden sm:inline-flex">
            <Heart aria-hidden />
          </Button>
          <Button type="button" variant="ghost" size="icon" disabled aria-label={tNav("cart")} className="hidden sm:inline-flex">
            <ShoppingCart aria-hidden />
          </Button>

          <div className="hidden md:block">
            <Suspense fallback={null}>
              <LanguageSwitcher />
            </Suspense>
          </div>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}
