import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { MainContainer } from "@/components/layout/main-container";

export default function NotFound() {
  const t = useTranslations("errors");
  const tCommon = useTranslations("common");

  return (
    <main className="flex flex-1 flex-col">
      <MainContainer>
        <section className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-text">{t("notFound.title")}</h1>
          <p className="max-w-md text-sm text-text-secondary">{t("notFound.description")}</p>
          <Button asChild>
            <Link href="/">{tCommon("actions.backHome")}</Link>
          </Button>
        </section>
      </MainContainer>
    </main>
  );
}
