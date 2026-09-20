"use client";

import { Menu, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { Suspense, useState } from "react";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const accountEmail = session?.user.email?.trim();
  const accountInitial = accountLabel.charAt(0)
    ? accountLabel.charAt(0).toLocaleUpperCase()
    : "?";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button type="button" variant="ghost" size="icon" className="md:hidden" aria-label={tCommon("a11y.openMenu")}>
          <Menu aria-hidden />
        </Button>
      </SheetTrigger>
      <SheetContent aria-describedby={undefined} className="overflow-y-auto">
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
          <nav aria-label={tCommon("a11y.accountNav")} className="flex flex-col gap-1">
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
                <div className="mb-2 overflow-hidden rounded-xl border border-border bg-background">
                  <div className="flex items-center gap-3 px-3 py-3">
                    <Avatar className="size-11 ring-1 ring-border">
                      {session.user.image ? <AvatarImage src={session.user.image} alt="" /> : null}
                      <AvatarFallback className="text-base" aria-hidden>
                        {accountInitial}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold tracking-tight text-text">
                        {accountLabel}
                      </p>
                      {accountEmail ? (
                        <p className="mt-0.5 truncate text-xs text-text-secondary">{accountEmail}</p>
                      ) : (
                        <p className="mt-0.5 truncate text-xs text-text-muted">
                          @{session.user.username}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <SheetClose asChild>
                  <button
                    type="button"
                    className={cn(
                      "inline-flex items-center gap-2.5 rounded-lg px-3 py-3 text-start text-base font-medium text-text-secondary transition-colors",
                      "hover:bg-error/10 hover:text-error",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                    )}
                    onClick={() => {
                      logout();
                      router.replace("/");
                    }}
                  >
                    <LogOut className="size-4 shrink-0" aria-hidden />
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
