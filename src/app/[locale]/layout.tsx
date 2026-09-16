import { Suspense } from "react";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { localeDirection, routing, type Locale } from "@/i18n/routing";
import { fontVariables } from "@/styles/fonts";
import "@/styles/globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale: candidate } = await params;

  if (!hasLocale(routing.locales, candidate)) {
    notFound();
  }

  const locale = candidate as Locale;
  const messages = await getMessages();

  return (
    <html lang={locale} dir={localeDirection[locale]} className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background font-sans text-text">
        <NextIntlClientProvider messages={messages}>
          <Suspense fallback={null}>
            <AppShell>{children}</AppShell>
          </Suspense>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
