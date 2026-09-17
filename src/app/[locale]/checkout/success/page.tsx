import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import { MainContainer } from "@/components/layout/main-container";
import { AuthGuard } from "@/features/auth/components/auth-guard";
import { CheckoutSuccessView } from "@/features/checkout/components/checkout-success-view";

type CheckoutSuccessPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: CheckoutSuccessPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "checkout" });

  return {
    title: t("success.title"),
    description: t("success.thankYou"),
    robots: { index: false, follow: false },
  };
}

export default async function CheckoutSuccessPage() {
  return (
    <div>
      <MainContainer>
        <AuthGuard>
          <CheckoutSuccessView />
        </AuthGuard>
      </MainContainer>
    </div>
  );
}
