import { useTranslations } from "next-intl";

import type { Category } from "@/features/products/types/category";
import { categoryMessageKey } from "@/features/products/utils/find-category";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type CategoryCardProps = {
  category: Category;
  className?: string;
};

export function CategoryCard({ category, className }: CategoryCardProps) {
  const t = useTranslations("categories");

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={cn(
        "flex min-h-28 flex-col justify-end rounded-lg border border-border bg-surface p-5 transition-colors",
        "hover:border-primary hover:bg-primary-soft/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "motion-reduce:transition-none",
        className,
      )}
    >
      <span className="text-base font-semibold text-text">{t(categoryMessageKey(category.labelKey))}</span>
    </Link>
  );
}
