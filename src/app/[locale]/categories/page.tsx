import { getTranslations } from "next-intl/server";
import { connection } from "next/server";

import { MainContainer } from "@/components/layout/main-container";
import { CategoryGrid } from "@/features/products/components/categories/category-grid";
import { getCategoryPreviews } from "@/features/products";

export default async function CategoriesPage() {
  await connection();

  const t = await getTranslations("catalogue");
  const categories = await getCategoryPreviews();

  return (
    <div>
      <MainContainer>
        <div className="flex flex-col gap-8 py-2">
          <header className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-text">{t("categoriesPage.title")}</h1>
            <p className="max-w-2xl text-sm text-text-secondary">{t("categoriesPage.description")}</p>
          </header>

          {categories.length === 0 ? (
            <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-8">
              <h2 className="text-base font-semibold text-text">{t("categoriesPage.emptyTitle")}</h2>
              <p className="text-sm text-text-secondary">{t("categoriesPage.emptyDescription")}</p>
            </div>
          ) : (
            <CategoryGrid categories={categories} />
          )}
        </div>
      </MainContainer>
    </div>
  );
}
