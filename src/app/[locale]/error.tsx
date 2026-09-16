"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

type LocaleErrorProps = {
  reset: () => void;
};

export default function LocaleError({ reset }: LocaleErrorProps) {
  const t = useTranslations("catalogue");

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-text">{t("errors.title")}</h1>
      <p className="max-w-md text-sm text-text-secondary">{t("errors.description")}</p>
      <Button type="button" onClick={reset}>
        {t("errors.retry")}
      </Button>
    </div>
  );
}
