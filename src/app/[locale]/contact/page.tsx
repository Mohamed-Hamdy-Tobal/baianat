import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import { MainContainer } from "@/components/layout/main-container";
import { publicPageMetadata } from "@/lib/seo";

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });

  return publicPageMetadata({
    locale,
    pathname: "/contact",
    title: t("contact.title"),
    description: t("contact.description"),
    siteName: t("siteName"),
  });
}

export default async function ContactPage() {
  const t = await getTranslations("pages.contact");

  return (
    <div>
      <MainContainer>
        <div className="flex flex-col gap-3 py-4">
          <h1 className="text-2xl font-semibold tracking-tight text-text">{t("title")}</h1>
          <p className="max-w-xl text-sm text-text-secondary">{t("description")}</p>
        </div>
      </MainContainer>
    </div>
  );
}
