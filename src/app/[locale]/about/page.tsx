import { MainContainer } from "@/components/layout/main-container";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("pages.about");

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
