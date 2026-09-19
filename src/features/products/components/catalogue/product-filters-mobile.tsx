"use client";

import { SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { ProductFilterPanel } from "@/features/products/components/catalogue/product-filter-panel";
import type { Category } from "@/features/products/types/category";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type ProductFiltersMobileProps = {
  categories: Category[];
  lockedCategory?: string;
};

export function ProductFiltersMobile({ categories, lockedCategory }: ProductFiltersMobileProps) {
  const t = useTranslations("catalogue");
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-center"
            aria-label={t("productsPage.openFilters")}
          >
            <SlidersHorizontal aria-hidden />
            {t("productsPage.filters")}
          </Button>
        </SheetTrigger>
        <SheetContent className="overflow-y-auto" aria-describedby={undefined}>
          <SheetHeader>
            <SheetTitle>{t("productsPage.filters")}</SheetTitle>
          </SheetHeader>
          <ProductFilterPanel
            categories={categories}
            lockedCategory={lockedCategory}
            className="pt-2"
            onApplied={() => setOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
