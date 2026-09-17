"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { DEMO_LOGIN_PASSWORD, DEMO_LOGIN_USERNAME } from "@/features/auth/utils/demo-credentials";

type DemoCredentialsHintProps = {
  onUseDemo?: () => void;
  disabled?: boolean;
};

/**
 * Shows the public DummyJSON demo account for reviewers.
 * Credentials are intentionally visible — this is a take-home mock API.
 */
export function DemoCredentialsHint({ onUseDemo, disabled }: DemoCredentialsHintProps) {
  const t = useTranslations("auth");

  return (
    <div className="rounded-md border border-border bg-background px-3 py-3 text-sm text-text-secondary">
      <p className="font-medium text-text">{t("demo.title")}</p>
      <p className="mt-1 text-text-muted">{t("demo.description")}</p>
      <dl className="mt-3 grid gap-1.5 font-mono text-xs text-text sm:grid-cols-2 sm:gap-x-4">
        <div className="flex items-baseline gap-2">
          <dt className="shrink-0 font-sans text-text-muted">{t("fields.username")}</dt>
          <dd className="truncate font-medium">{DEMO_LOGIN_USERNAME}</dd>
        </div>
        <div className="flex items-baseline gap-2">
          <dt className="shrink-0 font-sans text-text-muted">{t("fields.password")}</dt>
          <dd className="truncate font-medium">{DEMO_LOGIN_PASSWORD}</dd>
        </div>
      </dl>
      {onUseDemo ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3 w-full sm:w-auto"
          disabled={disabled}
          onClick={onUseDemo}
        >
          {t("demo.fill")}
        </Button>
      ) : null}
    </div>
  );
}
