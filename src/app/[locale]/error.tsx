"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { MainContainer } from "@/components/layout/main-container";

type LocaleErrorProps = {
  reset: () => void;
};

export default function LocaleError({ reset }: LocaleErrorProps) {
  const t = useTranslations("errors");

  return (
    <MainContainer>
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-text">{t("generic.title")}</h1>
        <p className="max-w-md text-sm text-text-secondary">{t("generic.description")}</p>
        <Button type="button" onClick={reset}>
          {t("generic.retry")}
        </Button>
      </div>
    </MainContainer>
  );
}
