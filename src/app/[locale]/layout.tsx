import { Suspense } from "react";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { localeDirection, routing, type Locale } from "@/i18n/routing";
import {
  JsonLd,
  localizedUrl,
  organizationJsonLd,
  rootMetadataDefaults,
  websiteJsonLd,
} from "@/lib/seo";
import { fontVariables } from "@/styles/fonts";
import "@/styles/globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const t = await getTranslations({ locale, namespace: "seo" });

  return rootMetadataDefaults(locale, t("siteName"), t("defaultDescription"));
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale: candidate } = await params;

  if (!hasLocale(routing.locales, candidate)) {
    notFound();
  }

  const locale = candidate as Locale;
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "seo" });
  const siteUrl = localizedUrl(locale, "/");
  const siteName = t("siteName");

  return (
    <html lang={locale} dir={localeDirection[locale]} className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background font-sans text-text">
        <JsonLd data={organizationJsonLd(siteName, siteUrl)} />
        <JsonLd data={websiteJsonLd(siteName, siteUrl)} />
        <NextIntlClientProvider messages={messages}>
          <Suspense fallback={null}>
            <AppShell>{children}</AppShell>
          </Suspense>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
