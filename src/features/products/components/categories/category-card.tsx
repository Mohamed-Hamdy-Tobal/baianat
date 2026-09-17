import Image from "next/image";
import { ArrowRight } from "lucide-react";

import type { CategoryPreview } from "@/features/products/types/category-preview";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type CategoryCardProps = {
  category: CategoryPreview;
  name: string;
  countLabel: string;
  className?: string;
};

export function CategoryCard({ category, name, countLabel, className }: CategoryCardProps) {
  return (
    <Link
      href={{ pathname: "/products", query: { category: category.apiValue } }}
      aria-label={`${name}. ${countLabel}`}
      className={cn(
        "group relative flex aspect-[4/3] overflow-hidden rounded-xl border border-border bg-surface shadow-sm",
        "transition-[border-color,box-shadow,transform] duration-200 ease-out",
        "hover:border-border-strong hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "motion-reduce:transition-none",
        className,
      )}
    >
      {category.image ? (
        <Image
          src={category.image}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      ) : (
        <div className="absolute inset-0 bg-slate-200" aria-hidden />
      )}

      <div
        className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/25 to-transparent"
        aria-hidden
      />

      <div className="relative z-10 mt-auto flex w-full items-end justify-between gap-3 p-4">
        <div className="min-w-0 flex flex-col gap-0.5">
          <span className="truncate text-base font-semibold text-white">{name}</span>
          <span className="text-sm text-white/80">{countLabel}</span>
        </div>
        <ArrowRight
          aria-hidden
          className="size-5 shrink-0 text-white/90 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
        />
      </div>
    </Link>
  );
}
