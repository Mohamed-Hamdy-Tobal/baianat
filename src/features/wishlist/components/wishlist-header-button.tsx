"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";

import { useWishlistStore } from "@/features/wishlist/store/wishlist.store";
import { Link } from "@/i18n/navigation";
import { useStoreHydrated } from "@/lib/store/use-store-hydrated";
import { cn } from "@/lib/utils";

type WishlistHeaderButtonProps = {
  className?: string;
};

export function WishlistHeaderButton({ className }: WishlistHeaderButtonProps) {
  const t = useTranslations("wishlist");
  const hydrated = useStoreHydrated();
  const items = useWishlistStore((state) => state.items);
  const count = hydrated ? items.length : 0;

  return (
    <Link
      href="/wishlist"
      aria-label={t("headerCount", { count })}
      className={cn(
        "relative inline-flex size-10 items-center justify-center rounded-md text-text",
        "transition-transform duration-200 hover:scale-105 hover:bg-background",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        "motion-reduce:hover:scale-100 motion-reduce:transition-none hidden sm:block ",
        className,
      )}
    >
      <Heart aria-hidden className="size-4" />
      {count > 0 ? (
        <span
          aria-hidden
          className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-surface"
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
