"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { Suspense, useState } from "react";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getAuthUiState } from "@/features/auth/utils/auth-ui-state";
import { getCartItemCount } from "@/features/cart/utils/cart-calculations";
import { useCartStore } from "@/features/cart/store/cart.store";
import { useWishlistStore } from "@/features/wishlist/store/wishlist.store";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useStoreHydrated } from "@/lib/store/use-store-hydrated";
import { cn } from "@/lib/utils";

import { isNavActive, PRIMARY_NAV } from "./primary-nav";

const ACCOUNT_NAV = [
  { href: "/wishlist", key: "wishlist" as const },
  { href: "/cart", key: "cart" as const },
] as const;

export function MobileNav() {
  const t = useTranslations("navigation");
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");
  const tCart = useTranslations("cart");
  const tWishlist = useTranslations("wishlist");
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const hydrated = useStoreHydrated();
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);
  const session = useAuthStore((state) => state.session);
  const logout = useAuthStore((state) => state.logout);
  const authState = getAuthUiState(hydrated, session);
  const cartCount = hydrated ? getCartItemCount(cartItems) : 0;
  const wishlistCount = hydrated ? wishlistItems.length : 0;
  const accountLabel =
    session?.user.firstName?.trim() || session?.user.username || tAuth("account");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button type="button" variant="ghost" size="icon" className="md:hidden" aria-label={tCommon("a11y.openMenu")}>
          <Menu aria-hidden />
        </Button>
      </SheetTrigger>
      <SheetContent aria-describedby={undefined}>
        <SheetHeader>
          <SheetTitle>{tCommon("a11y.mainNav")}</SheetTitle>
        </SheetHeader>
        <nav aria-label={tCommon("a11y.mainNav")} className="flex flex-col gap-1">
          {PRIMARY_NAV.map((item) => {
            const active = isNavActive(pathname, item.href);

            return (
              <SheetClose asChild key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-3 text-base font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                    "motion-reduce:transition-none",
                    active ? "bg-primary-soft text-primary" : "text-text-secondary hover:bg-background hover:text-text",
                  )}
                >
                  {t(item.key)}
                </Link>
              </SheetClose>
            );
          })}
        </nav>

        <div className="mt-4 border-t border-border pt-4">
          <nav aria-label={tCart("title")} className="flex flex-col gap-1">
            {ACCOUNT_NAV.map((item) => {
              const active = isNavActive(pathname, item.href);
              const count = item.key === "cart" ? cartCount : wishlistCount;
              const label =
                item.key === "cart"
                  ? tCart("headerCount", { count })
                  : tWishlist("headerCount", { count });

              return (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    aria-label={label}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between rounded-md px-3 py-3 text-base font-medium transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                      "motion-reduce:transition-none",
                      active
                        ? "bg-primary-soft text-primary"
                        : "text-text-secondary hover:bg-background hover:text-text",
                    )}
                  >
                    <span>{t(item.key)}</span>
                    {count > 0 ? (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-surface">
                        {count > 99 ? "99+" : count}
                      </span>
                    ) : null}
                  </Link>
                </SheetClose>
              );
            })}
          </nav>
        </div>

        <div className="mt-4 border-t border-border pt-4">
          <nav aria-label={tAuth("account")} className="flex flex-col gap-1">
            {authState === "authenticated" && session ? (
              <>
                <span className="px-3 py-2 text-sm font-medium text-text">{accountLabel}</span>
                <SheetClose asChild>
                  <button
                    type="button"
                    className={cn(
                      "rounded-md px-3 py-3 text-start text-base font-medium text-text-secondary transition-colors",
                      "hover:bg-background hover:text-text",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                    )}
                    onClick={() => {
                      logout();
                      router.replace("/");
                    }}
                  >
                    {tAuth("logout")}
                  </button>
                </SheetClose>
              </>
            ) : (
              <>
                <SheetClose asChild>
                  <Link
                    href="/login"
                    aria-current={isNavActive(pathname, "/login") ? "page" : undefined}
                    className={cn(
                      "rounded-md px-3 py-3 text-base font-medium transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                      isNavActive(pathname, "/login")
                        ? "bg-primary-soft text-primary"
                        : "text-text-secondary hover:bg-background hover:text-text",
                    )}
                  >
                    {t("login")}
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/register"
                    aria-current={isNavActive(pathname, "/register") ? "page" : undefined}
                    className={cn(
                      "rounded-md px-3 py-3 text-base font-medium transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                      isNavActive(pathname, "/register")
                        ? "bg-primary-soft text-primary"
                        : "text-text-secondary hover:bg-background hover:text-text",
                    )}
                  >
                    {t("register")}
                  </Link>
                </SheetClose>
              </>
            )}
          </nav>
        </div>

        <div className="mt-auto border-t border-border pt-4">
          <Suspense fallback={null}>
            <div className="flex items-center justify-between gap-3 px-1">
              <span className="text-sm text-text-secondary">{tCommon("language.label")}</span>
              <LanguageSwitcher />
            </div>
          </Suspense>
        </div>
      </SheetContent>
    </Sheet>
  );
}
