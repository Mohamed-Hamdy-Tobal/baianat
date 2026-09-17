import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Suspense } from "react";

import { MainContainer } from "@/components/layout/main-container";
import { Skeleton } from "@/components/ui/skeleton";
import { GuestOnly } from "@/features/auth/components/guest-only";
import { RegisterForm } from "@/features/auth/components/register-form";

type RegisterPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: RegisterPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });

  return {
    title: t("register.title"),
    description: t("register.subtitle"),
    robots: { index: false, follow: false },
  };
}

export default async function RegisterPage() {
  const t = await getTranslations("auth");

  return (
    <div>
      <MainContainer>
        <div className="mx-auto flex w-full max-w-md flex-col gap-6 py-2">
          <header className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight text-text">{t("register.title")}</h1>
            <p className="text-sm text-text-secondary">{t("register.subtitle")}</p>
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
              <GuestOnly allowRedirectParam={false}>
                <RegisterForm />
              </GuestOnly>
            </Suspense>
          </div>
        </div>
      </MainContainer>
    </div>
  );
}
