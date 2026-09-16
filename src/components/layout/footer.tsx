import { getTranslations } from "next-intl/server";

import { PRIMARY_NAV } from "@/components/layout/primary-nav";
import { Link } from "@/i18n/navigation";

export async function Footer() {
  const tCommon = await getTranslations("common");
  const tNav = await getTranslations("navigation");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <Link
            href="/"
            className="text-base font-semibold tracking-tight text-text transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface motion-reduce:transition-none"
          >
            {tCommon("brand.name")}
          </Link>

          <nav aria-label={tCommon("a11y.footerNav")} className="flex flex-wrap gap-x-6 gap-y-2">
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-text-secondary transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface motion-reduce:transition-none"
              >
                {tNav(item.key)}
              </Link>
            ))}
          </nav>
        </div>

        <p className="text-sm text-text-muted">{tCommon("footer.copyright", { year })}</p>
      </div>
    </footer>
  );
}
