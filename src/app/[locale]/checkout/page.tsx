import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import { MainContainer } from "@/components/layout/main-container";
import { AuthGuard } from "@/features/auth/components/auth-guard";

type CheckoutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: CheckoutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });

  return {
    title: t("checkout.title"),
    description: t("checkout.subtitle"),
    robots: { index: false, follow: false },
  };
}

/**
 * Temporary auth-test placeholder for Phase 08.
 * Not Checkout — only verifies AuthGuard + login redirect.
 */
export default async function CheckoutPage() {
  const t = await getTranslations("auth");

  return (
    <div>
      <MainContainer>
        <AuthGuard>
          <div className="mx-auto flex w-full max-w-lg flex-col gap-3 py-2">
            <header className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold tracking-tight text-text">{t("checkout.title")}</h1>
              <p className="text-sm text-text-secondary">{t("checkout.subtitle")}</p>
            </header>
            <p className="rounded-lg border border-border bg-surface p-5 text-sm text-text-secondary">
              {t("checkout.placeholder")}
            </p>
          </div>
        </AuthGuard>
      </MainContainer>
    </div>
  );
}
