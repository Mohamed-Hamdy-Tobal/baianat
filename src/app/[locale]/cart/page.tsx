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

export default function CartPage() {
  return (
    <div>
      <MainContainer>
        <div className="py-2">
          <CartView />
        </div>
      </MainContainer>
    </div>
  );
}
