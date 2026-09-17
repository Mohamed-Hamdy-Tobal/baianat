"use client";

import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getAuthUiState } from "@/features/auth/utils/auth-ui-state";
import { getSafeRedirect, toLocaleHref } from "@/features/auth/utils/safe-redirect";
import { useRouter } from "@/i18n/navigation";
import { useStoreHydrated } from "@/lib/store/use-store-hydrated";

type GuestOnlyProps = {
  children: ReactNode;
  /**
   * When true (default on login), honor a valid `?redirect=` query after auth.
   * Set false on register so authenticated visitors always go home.
   */
  allowRedirectParam?: boolean;
};

/**
 * Redirects already-authenticated users away from login/register.
 * Waits for hydration to avoid false guest flashes.
 */
export function GuestOnly({ children, allowRedirectParam = true }: GuestOnlyProps) {
  const hydrated = useStoreHydrated();
  const session = useAuthStore((state) => state.session);
  const uiState = getAuthUiState(hydrated, session);
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (uiState !== "authenticated") return;

    if (allowRedirectParam) {
      const redirectParam = searchParams.get("redirect");
      const safe = getSafeRedirect(redirectParam, locale);
      router.replace(toLocaleHref(safe, locale));
      return;
    }

    router.replace("/");
  }, [uiState, locale, router, searchParams, allowRedirectParam]);

  if (uiState === "unknown" || uiState === "authenticated") {
    return (
      <div className="flex flex-col gap-3" aria-busy="true">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-40 w-full max-w-md" />
      </div>
    );
  }

  return <>{children}</>;
}
