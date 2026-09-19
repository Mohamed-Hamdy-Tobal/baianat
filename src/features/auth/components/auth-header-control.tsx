"use client";

import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { AuthSession } from "@/features/auth/types/auth";
import { getAuthUiState } from "@/features/auth/utils/auth-ui-state";
import { Link, useRouter } from "@/i18n/navigation";
import { useStoreHydrated } from "@/lib/store/use-store-hydrated";
import { cn } from "@/lib/utils";

type AuthHeaderControlProps = {
  className?: string;
};

function displayName(session: AuthSession): string {
  return session.user.firstName?.trim() || session.user.username;
}

function avatarInitial(session: AuthSession): string {
  const name = displayName(session);
  const letter = name.charAt(0);
  return letter ? letter.toLocaleUpperCase() : "?";
}

function AccountAvatar({
  image,
  initial,
  className,
  fallbackClassName,
}: {
  image?: string;
  initial: string;
  className?: string;
  fallbackClassName?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(image) && !imageFailed;

  return (
    <Avatar className={className}>
      <AvatarFallback className={fallbackClassName} aria-hidden>
        {initial}
      </AvatarFallback>
      {showImage ? (
        <AvatarImage src={image} alt="" onError={() => setImageFailed(true)} />
      ) : null}
    </Avatar>
  );
}

export function AuthHeaderControl({ className }: AuthHeaderControlProps) {
  const t = useTranslations("auth");
  const tNav = useTranslations("navigation");
  const tCommon = useTranslations("common");
  const hydrated = useStoreHydrated();
  const session = useAuthStore((state) => state.session);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const uiState = getAuthUiState(hydrated, session);

  if (uiState === "unknown") {
    return <div className={cn("hidden size-9 md:block", className)} aria-hidden />;
  }

  if (uiState === "authenticated" && session) {
    const name = displayName(session);
    const email = session.user.email?.trim();
    const image = session.user.image?.trim();
    const initial = avatarInitial(session);

    return (
      <div className={cn("hidden md:block", className)}>
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "group rounded-full outline-none",
              "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
            )}
            aria-label={tCommon("a11y.openAccountMenu", { name })}
          >
            <AccountAvatar
              image={image}
              initial={initial}
              className="size-9 ring-2 ring-border ring-offset-2 ring-offset-surface transition-shadow group-hover:ring-primary/35"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-72 overflow-hidden rounded-xl border-border p-0 shadow-md"
          >
            <div className="border-b border-border bg-background px-4 py-4">
              <div className="flex items-center gap-3">
                <AccountAvatar
                  image={image}
                  initial={initial}
                  className="size-11 ring-1 ring-border"
                  fallbackClassName="text-base"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold tracking-tight text-text">{name}</p>
                  {email ? (
                    <p className="mt-0.5 truncate text-xs leading-relaxed text-text-secondary" title={email}>
                      {email}
                    </p>
                  ) : (
                    <p className="mt-0.5 truncate text-xs text-text-muted">@{session.user.username}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="p-1.5">
              <DropdownMenuItem
                className="gap-2.5 rounded-lg px-3 py-2.5 font-medium text-text-secondary hover:bg-error/10 hover:text-error focus-visible:bg-error/10 focus-visible:text-error"
                onClick={() => {
                  logout();
                  router.replace("/");
                }}
              >
                <LogOut className="size-4 shrink-0" aria-hidden />
                {t("logout")}
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
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
