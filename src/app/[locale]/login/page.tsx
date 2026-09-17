import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Suspense } from "react";

import { MainContainer } from "@/components/layout/main-container";
import { Skeleton } from "@/components/ui/skeleton";
import { GuestOnly } from "@/features/auth/components/guest-only";
import { LoginForm } from "@/features/auth/components/login-form";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: LoginPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });

  return {
    title: t("login.title"),
    description: t("login.subtitle"),
    robots: { index: false, follow: false },
  };
}

export default async function LoginPage() {
  const t = await getTranslations("auth");

  return (
    <div>
      <MainContainer>
        <div className="mx-auto flex w-full max-w-md flex-col gap-6 py-2">
          <header className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight text-text">{t("login.title")}</h1>
            <p className="text-sm text-text-secondary">{t("login.subtitle")}</p>
          </header>

          <div className="rounded-lg border border-border bg-surface p-5 sm:p-6">
            <Suspense
              fallback={
                <div className="flex flex-col gap-3" aria-busy="true">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              }
            >
              <GuestOnly>
                <LoginForm />
              </GuestOnly>
            </Suspense>
          </div>
        </div>
      </MainContainer>
    </div>
  );
}
