import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

type SkipLinkProps = {
  className?: string;
};

export function SkipLink({ className }: SkipLinkProps) {
  const t = useTranslations("common");

  return (
    <a
      href="#main-content"
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-surface focus:shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      {t("a11y.skipToMain")}
    </a>
  );
}
