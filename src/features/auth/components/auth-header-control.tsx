"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getAuthUiState } from "@/features/auth/utils/auth-ui-state";
import { Link, useRouter } from "@/i18n/navigation";
import { useStoreHydrated } from "@/lib/store/use-store-hydrated";
import { cn } from "@/lib/utils";

type AuthHeaderControlProps = {
  className?: string;
};

function displayName(session: { user: { firstName?: string; username: string } }): string {
  return session.user.firstName?.trim() || session.user.username;
}

export function AuthHeaderControl({ className }: AuthHeaderControlProps) {
  const t = useTranslations("auth");
  const tNav = useTranslations("navigation");
  const hydrated = useStoreHydrated();
  const session = useAuthStore((state) => state.session);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const uiState = getAuthUiState(hydrated, session);

  if (uiState === "unknown") {
    return <div className={cn("hidden h-10 w-24 md:block", className)} aria-hidden />;
  }

  if (uiState === "authenticated" && session) {
    return (
      <div className={cn("hidden items-center gap-2 md:flex", className)}>
        <span className="max-w-28 truncate text-sm font-medium text-text" title={displayName(session)}>
          {displayName(session)}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            logout();
            router.replace("/");
          }}
        >
          {t("logout")}
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("hidden items-center gap-1 md:flex", className)}>
      <Link
        href="/login"
        className={cn(
          "inline-flex h-10 items-center rounded-md px-3 text-sm font-medium text-text-secondary",
          "transition-colors hover:bg-background hover:text-text",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        )}
      >
        {tNav("login")}
      </Link>
      <Link
        href="/register"
        className={cn(
          "inline-flex h-10 items-center rounded-md px-3 text-sm font-medium text-primary",
          "transition-colors hover:bg-primary-soft",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        )}
      >
        {tNav("register")}
      </Link>
    </div>
  );
}
