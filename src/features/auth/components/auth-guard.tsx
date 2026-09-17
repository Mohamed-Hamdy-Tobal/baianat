"use client";

import { useLocale } from "next-intl";
import { useEffect, useRef, type ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getAuthUiState } from "@/features/auth/utils/auth-ui-state";
import { buildLoginRedirectHref } from "@/features/auth/utils/safe-redirect";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useStoreHydrated } from "@/lib/store/use-store-hydrated";

type AuthGuardProps = {
  children: ReactNode;
};

/**
 * Client-side auth gate for protected routes (e.g. future Checkout).
 * Waits for Zustand hydration before redirecting — session cannot be
 * verified securely on the server with the current demo architecture.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const hydrated = useStoreHydrated();
  const session = useAuthStore((state) => state.session);
  const uiState = getAuthUiState(hydrated, session);
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const wasAuthenticatedRef = useRef(false);

  useEffect(() => {
    if (uiState === "authenticated") {
      wasAuthenticatedRef.current = true;
    }
  }, [uiState]);

  useEffect(() => {
    if (uiState !== "guest") return;

    // Logout while on a protected page → home (not login loop).
    if (wasAuthenticatedRef.current) {
      wasAuthenticatedRef.current = false;
      router.replace("/");
      return;
    }

    const intended = `/${locale}${pathname === "/" ? "" : pathname}`;
    const loginHref = buildLoginRedirectHref(intended, locale);
    const [path, queryString] = loginHref.split("?");
    const query = queryString ? Object.fromEntries(new URLSearchParams(queryString)) : undefined;

    router.replace({ pathname: (path || "/login") as "/login", query });
  }, [uiState, locale, pathname, router]);

  if (uiState === "unknown" || uiState === "guest") {
    return (
      <div className="flex flex-col gap-3" aria-busy="true">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-24 w-full max-w-md" />
      </div>
    );
  }

  return <>{children}</>;
}
