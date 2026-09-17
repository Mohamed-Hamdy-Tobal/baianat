import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import { MainContainer } from "@/components/layout/main-container";
import { CartView } from "@/features/cart/components/cart-view";
import { privatePageMetadata } from "@/lib/seo";

type CartPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: CartPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cart" });

  return privatePageMetadata({
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function CartPage() {
  const t = await getTranslations("cart");

  return (
    <div>
      <MainContainer>
        <div className="flex flex-col gap-6 py-2">
          <header className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight text-text">{t("title")}</h1>
            <p className="text-sm text-text-secondary">{t("subtitle")}</p>
          </header>
          <CartView />
        </div>
      </MainContainer>
    </div>
  );
}
